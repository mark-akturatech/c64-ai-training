// ============================================================================
// Padding / Fill Detector
// Detects regions filled with a single repeated byte value:
//   - Zero fill: all $00 (common alignment padding)
//   - NOP sled: all $EA (NOP instructions used as padding or anti-debug)
//   - Repeated byte: any single value repeated for >8 bytes
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const MIN_FILL_LENGTH = 8;

/** VIC-II sprite block alignment. Fills ending 1-3 bytes past a 64-byte
 *  boundary are trimmed back so adjacent sprite data gets its own block. */
const BLOCK_ALIGN = 64;
const ALIGN_TOLERANCE = 3;

export class PaddingDetector implements DataDetector {
  name = "padding";
  description = "Detects fill/padding regions (zero fill, NOP sleds, repeated byte patterns)";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    if (regionSize < MIN_FILL_LENGTH) return candidates;

    // Check for proven code — skip entirely if any byte is code
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Check if all bytes are the same value
    const firstByte = memory[region.start];
    let allSame = true;
    for (let i = region.start + 1; i < region.end; i++) {
      if (memory[i] !== firstByte) {
        allSame = false;
        break;
      }
    }

    if (!allSame) {
      // Try to find the longest run of a single byte within the region
      const run = this.findLongestRun(memory, region);
      if (run && run.length >= MIN_FILL_LENGTH) {
        const result = this.classifyFill(run.value, run.start, run.start + run.length);
        candidates.push(result);
      }
      return candidates;
    }

    // Entire region is a single repeated byte
    const result = this.classifyFill(firstByte, region.start, region.end);
    candidates.push(result);

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

  private findLongestRun(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): { start: number; length: number; value: number } | null {
    let bestStart = region.start;
    let bestLength = 1;
    let bestValue = memory[region.start];

    let runStart = region.start;
    let runValue = memory[region.start];
    let runLength = 1;

    for (let i = region.start + 1; i < region.end; i++) {
      if (memory[i] === runValue) {
        runLength++;
      } else {
        if (runLength > bestLength) {
          bestStart = runStart;
          bestLength = runLength;
          bestValue = runValue;
        }
        runStart = i;
        runValue = memory[i];
        runLength = 1;
      }
    }

    // Check the final run
    if (runLength > bestLength) {
      bestStart = runStart;
      bestLength = runLength;
      bestValue = runValue;
    }

    if (bestLength < MIN_FILL_LENGTH) return null;

    // Trim fill to 64-byte boundary when it ends just past one.
    // This prevents fill from swallowing the first byte(s) of sprite data
    // that must be 64-byte aligned for VIC-II addressing.
    const runEnd = bestStart + bestLength;
    const pastBoundary = runEnd % BLOCK_ALIGN;
    if (pastBoundary > 0 && pastBoundary <= ALIGN_TOLERANCE && bestLength - pastBoundary >= MIN_FILL_LENGTH) {
      bestLength -= pastBoundary;
    }

    return { start: bestStart, length: bestLength, value: bestValue };
  }

  private classifyFill(
    value: number,
    start: number,
    end: number
  ): DataCandidate {
    const size = end - start;
    const hexVal = `$${value.toString(16).padStart(2, "0").toUpperCase()}`;

    if (value === 0x00) {
      return {
        start,
        end,
        detector: this.name,
        type: "padding",
        subtype: "zero_fill",
        confidence: 85,
        evidence: [
          `${size} bytes of $00 (zero fill)`,
          "Likely alignment padding or uninitialized data",
        ],
        label: "zero_fill",
        comment: `Zero fill padding, ${size} bytes`,
      };
    }

    if (value === 0xea) {
      return {
        start,
        end,
        detector: this.name,
        type: "padding",
        subtype: "nop_sled",
        confidence: 70,
        evidence: [
          `${size} bytes of $EA (NOP)`,
          "NOP sled: alignment padding, timing delay, or anti-debugging measure",
        ],
        label: "nop_sled",
        comment: `NOP sled, ${size} bytes`,
      };
    }

    // Generic repeated byte
    return {
      start,
      end,
      detector: this.name,
      type: "padding",
      subtype: "fill_byte",
      confidence: 50,
      evidence: [
        `${size} bytes of ${hexVal} (repeated single byte)`,
        "Likely fill/padding or uninitialized region",
      ],
      label: `fill_${hexVal.replace("$", "")}`,
      comment: `Fill pattern: ${hexVal} repeated ${size} times`,
    };
  }
}
