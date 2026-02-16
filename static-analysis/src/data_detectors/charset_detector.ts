// ============================================================================
// Character Set Detector
// Detects 1024-byte (128 chars) or 2048-byte (256 chars) character sets.
// Characters are 8 bytes each (8x8 pixels). VIC-II fetches char data from
// an address configured via $D018 bits 1-3, within the current VIC bank.
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const CHARSET_FULL = 2048;    // 256 characters * 8 bytes
const CHARSET_HALF = 1024;    // 128 characters * 8 bytes
const CHAR_SIZE = 8;          // bytes per character glyph
const VIC_D018 = 0xd018;      // VIC-II memory control register
const CHARSET_ALIGNMENT = 2048; // character sets must be 2KB aligned within VIC bank

export class CharsetDetector implements DataDetector {
  name = "charset";
  description = "Detects 1024/2048-byte character set data via $D018 tracing and alignment";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    // Must be at least half a character set
    if (regionSize < CHARSET_HALF) return candidates;

    // Check for proven code overlap
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Check for $D018 writes in code references
    const d018Traced = this.checkD018Writes(region, context);

    // Check 2KB alignment within VIC bank
    const vicBankBase = context.bankingState.vicBankBase;
    const offsetInBank = region.start - vicBankBase;
    const isAligned = offsetInBank >= 0 && offsetInBank % CHARSET_ALIGNMENT === 0;

    // Determine if region matches charset sizes
    const isFullCharset = regionSize === CHARSET_FULL;
    const isHalfCharset = regionSize === CHARSET_HALF;
    const isMultipleOfChar = regionSize % CHAR_SIZE === 0;

    // Try to detect full charset first, then half
    if (isFullCharset || (regionSize >= CHARSET_FULL && isAligned)) {
      const end = region.start + CHARSET_FULL;
      if (!this.hasCode(region.start, end, context)) {
        const confidence = d018Traced ? 90 : isAligned ? 60 : 35;
        candidates.push({
          start: region.start,
          end,
          detector: this.name,
          type: "charset",
          subtype: "full_charset",
          confidence,
          evidence: this.buildEvidence(d018Traced, isAligned, 256, vicBankBase),
          label: "charset",
          comment: `Full character set (256 chars, ${CHARSET_FULL} bytes)`,
        });
      }
    } else if (isHalfCharset) {
      const confidence = d018Traced ? 90 : isAligned ? 60 : 40;
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "charset",
        subtype: "half_charset",
        confidence,
        evidence: this.buildEvidence(d018Traced, isAligned, 128, vicBankBase),
        label: "charset_half",
        comment: `Half character set (128 chars, ${CHARSET_HALF} bytes)`,
      });
    } else if (isMultipleOfChar && regionSize >= CHARSET_HALF && regionSize <= CHARSET_FULL) {
      // Non-standard count but still plausible char data
      const charCount = regionSize / CHAR_SIZE;
      const confidence = d018Traced ? 85 : isAligned ? 50 : 25;
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "charset",
        subtype: `${charCount}_chars`,
        confidence,
        evidence: this.buildEvidence(d018Traced, isAligned, charCount, vicBankBase),
        label: `charset_${charCount}`,
        comment: `Character data (${charCount} chars, ${regionSize} bytes)`,
      });
    }

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

  private checkD018Writes(
    region: { start: number; end: number },
    context: DetectorContext
  ): boolean {
    const vicBankBase = context.bankingState.vicBankBase;

    for (const edge of context.codeRefs) {
      // Look for writes to $D018 (VIC memory control register)
      if (
        (edge.type === "hardware_write" || edge.type === "data_write") &&
        edge.target === VIC_D018
      ) {
        // $D018 bits 1-3 select character memory:
        //   charBase = (($D018 >> 1) & 0x07) * 2048 + vicBankBase
        // If this resolves to our region's start, it's a strong match.
        // We can't always know the written value, but the presence of a
        // $D018 write combined with correct alignment is strong evidence.
        const offsetInBank = region.start - vicBankBase;
        if (offsetInBank >= 0 && offsetInBank % CHARSET_ALIGNMENT === 0) {
          return true;
        }
      }

      // Also check pointer_ref or data_read edges targeting the region
      if (
        (edge.type === "pointer_ref" || edge.type === "data_read") &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        // If the source instruction also writes to $D018, strong evidence
        // Even without that, a pointer reference to aligned charset data is notable
        const offsetInBank = region.start - vicBankBase;
        if (offsetInBank >= 0 && offsetInBank % CHARSET_ALIGNMENT === 0) {
          return true;
        }
      }
    }

    // Check the current banking state's charsetBase
    if (context.bankingState.charsetBase === region.start) {
      return true;
    }

    return false;
  }

  private buildEvidence(
    d018Traced: boolean,
    aligned: boolean,
    charCount: number,
    vicBankBase: number
  ): string[] {
    const evidence: string[] = [];
    if (d018Traced) {
      evidence.push("Traced via $D018 character memory configuration");
    }
    if (aligned) {
      evidence.push(
        `2KB aligned within VIC bank ${vicBankBase === 0 ? 0 : vicBankBase / 0x4000} (base $${vicBankBase.toString(16).padStart(4, "0")})`
      );
    }
    evidence.push(`Contains ${charCount} character definitions (${charCount * CHAR_SIZE} bytes)`);
    return evidence;
  }
}
