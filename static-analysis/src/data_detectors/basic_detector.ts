// ============================================================================
// BASIC Program Detector
// Detects tokenized Commodore BASIC programs.
// BASIC programs start at $0801 by default and consist of a linked list of
// lines. Each line has:
//   - 2 bytes: next-line pointer (address of the next line, or $0000 for end)
//   - 2 bytes: line number (16-bit, unsigned)
//   - N bytes: tokenized BASIC text
//   - 1 byte:  $00 terminator
// The program ends when the next-line pointer is $0000.
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const BASIC_DEFAULT_START = 0x0801;
const MAX_LINE_LENGTH = 256; // BASIC lines are limited
const MAX_LINE_NUMBER = 63999; // BASIC limit
const MAX_LINES = 5000; // sanity limit

// BASIC token range: $80-$CB for standard BASIC V2 tokens
const TOKEN_RANGE_START = 0x80;
const TOKEN_RANGE_END = 0xcb;

export class BasicDetector implements DataDetector {
  name = "basic";
  description = "Detects tokenized Commodore BASIC V2 programs via line-link chain validation";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    // Minimum BASIC program: next-ptr (2) + line# (2) + terminator (1) + end marker (2) = 7
    if (regionSize < 7) return candidates;

    // Check for proven code overlap
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Try to validate a BASIC line-link chain starting from the region
    const result = this.validateBasicChain(memory, region);
    if (!result) return candidates;

    candidates.push({
      start: region.start,
      end: result.chainEnd,
      detector: this.name,
      type: "basic_program",
      subtype: result.lineCount === 1 ? "basic_stub" : "basic_program",
      confidence: result.confidence,
      evidence: this.buildEvidence(result),
      label: result.lineCount === 1 ? "basic_stub" : "basic_program",
      comment: `BASIC program: ${result.lineCount} line(s), lines ${result.firstLineNum}-${result.lastLineNum}`,
    });

    return candidates;
  }

  private hasCode(start: number, end: number, context: DetectorContext): boolean {
    for (let i = start; i < end; i++) {
      if (context.byteRole[i] === ROLE_OPCODE || context.byteRole[i] === ROLE_OPERAND) {
        return true;
      }
    }
    return false;
  }

  private validateBasicChain(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): {
    chainEnd: number;
    lineCount: number;
    firstLineNum: number;
    lastLineNum: number;
    hasTokens: boolean;
    confidence: number;
  } | null {
    let addr = region.start;
    let lineCount = 0;
    let firstLineNum = -1;
    let lastLineNum = -1;
    let prevLineNum = -1;
    let hasTokens = false;

    while (addr < region.end && lineCount < MAX_LINES) {
      // Read next-line pointer (little-endian)
      if (addr + 2 > region.end) return null;
      const nextPtr = memory[addr] | (memory[addr + 1] << 8);

      // End of program marker
      if (nextPtr === 0x0000) {
        if (lineCount === 0) return null; // empty program, no lines parsed
        return {
          chainEnd: addr + 2,
          lineCount,
          firstLineNum,
          lastLineNum,
          hasTokens,
          confidence: this.calculateConfidence(lineCount, hasTokens, region.start),
        };
      }

      // Validate next-line pointer
      // It must point forward (past the current position), and within a reasonable range
      if (nextPtr <= addr + 4) return null; // must advance past header + at least 1 byte
      if (nextPtr > region.end + MAX_LINE_LENGTH) return null; // too far

      // Read line number (little-endian)
      if (addr + 4 > region.end) return null;
      const lineNum = memory[addr + 2] | (memory[addr + 3] << 8);
      if (lineNum > MAX_LINE_NUMBER) return null;

      // Line numbers must be ascending
      if (prevLineNum >= 0 && lineNum <= prevLineNum) return null;

      if (firstLineNum === -1) firstLineNum = lineNum;
      lastLineNum = lineNum;
      prevLineNum = lineNum;

      // Scan the line body for tokens and the $00 terminator
      let bodyAddr = addr + 4;
      let foundTerminator = false;
      while (bodyAddr < nextPtr && bodyAddr < region.end) {
        const b = memory[bodyAddr];
        if (b === 0x00) {
          foundTerminator = true;
          break;
        }
        // Check for BASIC tokens
        if (b >= TOKEN_RANGE_START && b <= TOKEN_RANGE_END) {
          hasTokens = true;
        }
        bodyAddr++;
      }

      if (!foundTerminator) return null;

      // The terminator should be at nextPtr - 1 (next pointer starts right after)
      // Allow some flexibility but the $00 must appear before or at nextPtr
      if (bodyAddr >= nextPtr) return null;

      lineCount++;
      addr = nextPtr;
    }

    // If we exited the loop without finding the end marker, check for $0000 at current position
    if (addr + 2 <= region.end) {
      const finalPtr = memory[addr] | (memory[addr + 1] << 8);
      if (finalPtr === 0x0000 && lineCount > 0) {
        return {
          chainEnd: addr + 2,
          lineCount,
          firstLineNum,
          lastLineNum,
          hasTokens,
          confidence: this.calculateConfidence(lineCount, hasTokens, region.start),
        };
      }
    }

    return null;
  }

  private calculateConfidence(
    lineCount: number,
    hasTokens: boolean,
    start: number
  ): number {
    let confidence = 80;

    // Valid chain is strong evidence
    if (lineCount >= 2) confidence += 5;
    if (hasTokens) confidence += 5;

    // Standard BASIC start address is very strong
    if (start === BASIC_DEFAULT_START) confidence += 5;

    return Math.min(confidence, 95);
  }

  private buildEvidence(result: {
    chainEnd: number;
    lineCount: number;
    firstLineNum: number;
    lastLineNum: number;
    hasTokens: boolean;
  }): string[] {
    const evidence: string[] = [];
    evidence.push(
      `Valid BASIC line-link chain: ${result.lineCount} line(s)`
    );
    evidence.push(
      `Line numbers: ${result.firstLineNum} to ${result.lastLineNum} (ascending)`
    );
    if (result.hasTokens) {
      evidence.push("Contains BASIC V2 tokens ($80-$CB)");
    }
    evidence.push(
      `Chain terminates with $0000 at $${(result.chainEnd - 2).toString(16).padStart(4, "0")}`
    );
    return evidence;
  }
}
