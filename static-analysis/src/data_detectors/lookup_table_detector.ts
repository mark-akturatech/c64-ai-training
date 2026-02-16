// ============================================================================
// Lookup Table Detector
// Detects various types of byte-level lookup tables:
//   - Screen line offset tables (40-byte stride low/high bytes)
//   - Sine/cosine tables (values follow a sine curve)
//   - Bit mask tables ($01, $02, $04, $08, $10, $20, $40, $80)
//   - Generic byte tables referenced by indexed addressing (LDA table,X)
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

/** Canonical bit mask table: powers of 2 */
const BIT_MASKS = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];

/** Inverse bit masks (AND masks) */
const INV_BIT_MASKS = [0xfe, 0xfd, 0xfb, 0xf7, 0xef, 0xdf, 0xbf, 0x7f];

/** Number of screen rows */
const SCREEN_ROWS = 25;
/** Screen width */
const SCREEN_COLS = 40;

export class LookupTableDetector implements DataDetector {
  name = "lookup_table";
  description = "Detects lookup tables: screen line offsets, sine tables, bit masks, and generic indexed data";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    if (regionSize < 4) return candidates;
    if (this.hasCode(region.start, region.end, context)) return candidates;

    const isReferenced = this.isIndexedRead(region, context);

    // Try each specific pattern
    const bitMaskResult = this.detectBitMaskTable(memory, region);
    if (bitMaskResult) {
      candidates.push({
        start: bitMaskResult.start,
        end: bitMaskResult.end,
        detector: this.name,
        type: "lookup_table",
        subtype: bitMaskResult.subtype,
        confidence: isReferenced ? 85 : 75,
        evidence: [
          bitMaskResult.description,
          isReferenced ? "Referenced by indexed addressing" : "No direct code reference",
        ],
        label: bitMaskResult.subtype === "bit_mask_table" ? "bit_masks" : "inv_bit_masks",
        comment: bitMaskResult.description,
      });
    }

    const screenLineResult = this.detectScreenLineTable(memory, region);
    if (screenLineResult) {
      candidates.push({
        start: screenLineResult.start,
        end: screenLineResult.end,
        detector: this.name,
        type: "lookup_table",
        subtype: screenLineResult.subtype,
        confidence: isReferenced ? 80 : 75,
        evidence: [
          screenLineResult.description,
          `${screenLineResult.entries} entries with 40-byte stride`,
          isReferenced ? "Referenced by indexed addressing" : "No direct code reference",
        ],
        label: screenLineResult.subtype === "screen_line_lo" ? "screen_line_lo" : "screen_line_hi",
        comment: screenLineResult.description,
      });
    }

    const sineResult = this.detectSineTable(memory, region);
    if (sineResult) {
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "lookup_table",
        subtype: "sine_table",
        confidence: isReferenced ? 80 : 75,
        evidence: [
          `Sine/cosine wave pattern detected (${sineResult.period}-entry period)`,
          `Amplitude range: ${sineResult.min}-${sineResult.max}`,
          `Correlation: ${(sineResult.correlation * 100).toFixed(0)}%`,
          isReferenced ? "Referenced by indexed addressing" : "No direct code reference",
        ],
        label: "sine_table",
        comment: `Sine lookup table, ${regionSize} entries, amplitude ${sineResult.min}-${sineResult.max}`,
      });
    }

    // Generic indexed-read data table (fallback)
    if (candidates.length === 0 && isReferenced && regionSize >= 4) {
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "lookup_table",
        subtype: "byte_table",
        confidence: 40,
        evidence: [
          `${regionSize}-byte data region referenced by indexed addressing`,
          "No specific pattern recognized (generic byte table)",
        ],
        label: `table_${regionSize}`,
        comment: `Byte lookup table, ${regionSize} entries`,
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

  private isIndexedRead(
    region: { start: number; end: number },
    context: DetectorContext
  ): boolean {
    for (const edge of context.codeRefs) {
      if (
        (edge.type === "data_read" || edge.type === "pointer_ref") &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        return true;
      }
    }
    return false;
  }

  private detectBitMaskTable(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): { start: number; end: number; subtype: string; description: string } | null {
    const regionSize = region.end - region.start;

    // Check for exact bit mask table (8 bytes)
    if (regionSize >= 8) {
      // Check for forward bit masks: $01, $02, $04, ...
      let forwardMatch = true;
      for (let i = 0; i < 8; i++) {
        if (memory[region.start + i] !== BIT_MASKS[i]) {
          forwardMatch = false;
          break;
        }
      }
      if (forwardMatch) {
        return {
          start: region.start,
          end: region.start + 8,
          subtype: "bit_mask_table",
          description: "Bit mask table ($01, $02, $04, ..., $80)",
        };
      }

      // Check for reverse bit masks: $80, $40, $20, ...
      let reverseMatch = true;
      for (let i = 0; i < 8; i++) {
        if (memory[region.start + i] !== BIT_MASKS[7 - i]) {
          reverseMatch = false;
          break;
        }
      }
      if (reverseMatch) {
        return {
          start: region.start,
          end: region.start + 8,
          subtype: "bit_mask_table",
          description: "Bit mask table (reversed: $80, $40, ..., $01)",
        };
      }

      // Check for inverse bit masks: $FE, $FD, $FB, ...
      let invMatch = true;
      for (let i = 0; i < 8; i++) {
        if (memory[region.start + i] !== INV_BIT_MASKS[i]) {
          invMatch = false;
          break;
        }
      }
      if (invMatch) {
        return {
          start: region.start,
          end: region.start + 8,
          subtype: "inv_bit_mask_table",
          description: "Inverse bit mask table ($FE, $FD, $FB, ..., $7F)",
        };
      }
    }

    return null;
  }

  private detectScreenLineTable(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): {
    start: number;
    end: number;
    subtype: string;
    description: string;
    entries: number;
  } | null {
    const regionSize = region.end - region.start;

    // Screen line offset table has 25 entries (one per row)
    // Lo bytes: $00, $28, $50, $78, ... (increments of 40)
    // Hi bytes depend on screen base address
    if (regionSize < SCREEN_ROWS) return null;

    // Try lo-byte table detection
    // For default screen at $0400: lo bytes of $0400, $0428, $0450, ...
    const expectedLo: number[] = [];
    const expectedHi: number[] = [];
    for (let row = 0; row < SCREEN_ROWS; row++) {
      const offset = row * SCREEN_COLS;
      expectedLo.push(offset & 0xff);
      // Hi bytes vary with screen base, so we check relative pattern
    }

    // Check if first 25 bytes match the lo-byte pattern for any screen base
    let loMatches = 0;
    for (let i = 0; i < SCREEN_ROWS && region.start + i < region.end; i++) {
      // Lo bytes of (base + row*40) will have a specific pattern
      // regardless of base, the lo byte increments by 40 each row (mod 256)
      const expected = (i * SCREEN_COLS) & 0xff;
      // Try various base offsets
      const actual = memory[region.start + i];
      if (((actual - memory[region.start]) & 0xff) === ((i * SCREEN_COLS) & 0xff)) {
        loMatches++;
      }
    }

    if (loMatches >= 20) {
      // Strong lo-byte table match
      return {
        start: region.start,
        end: region.start + SCREEN_ROWS,
        subtype: "screen_line_lo",
        description: "Screen line offset table (lo bytes, 25 rows, 40-byte stride)",
        entries: SCREEN_ROWS,
      };
    }

    // Check for hi-byte table: values should increment slowly
    // For screen at $0400: $04, $04, $04, $05, $05, $05, $05, $06, ...
    // Pattern: stays same or increments by 1, never decrements, never jumps >1
    if (regionSize >= SCREEN_ROWS) {
      let hiMatches = 0;
      let prevHi = memory[region.start];
      let isMonotonic = true;
      for (let i = 1; i < SCREEN_ROWS && region.start + i < region.end; i++) {
        const hi = memory[region.start + i];
        const diff = hi - prevHi;
        if (diff < 0 || diff > 1) {
          isMonotonic = false;
          break;
        }
        hiMatches++;
        prevHi = hi;
      }

      // The hi byte should change roughly every 6-7 rows (256/40 = 6.4)
      if (isMonotonic && hiMatches >= 20) {
        const totalRange = memory[region.start + SCREEN_ROWS - 1] - memory[region.start];
        // For 25 rows of 40 chars = 1000 bytes = ~3.9 pages
        if (totalRange >= 3 && totalRange <= 4) {
          return {
            start: region.start,
            end: region.start + SCREEN_ROWS,
            subtype: "screen_line_hi",
            description: "Screen line offset table (hi bytes, 25 rows, 40-byte stride)",
            entries: SCREEN_ROWS,
          };
        }
      }
    }

    return null;
  }

  private detectSineTable(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): { period: number; min: number; max: number; correlation: number } | null {
    const regionSize = region.end - region.start;

    // Need enough samples to detect a wave pattern
    if (regionSize < 16) return null;

    // Find min/max
    let min = 255;
    let max = 0;
    for (let i = region.start; i < region.end; i++) {
      if (memory[i] < min) min = memory[i];
      if (memory[i] > max) max = memory[i];
    }

    const amplitude = max - min;
    // Sine tables typically have reasonable amplitude
    if (amplitude < 10) return null;

    const center = (min + max) / 2;

    // Try various periods (common: 256, 128, 64, 32)
    const periodsToTry = [256, 128, 64, 32, regionSize];
    let bestCorrelation = 0;
    let bestPeriod = 0;

    for (const period of periodsToTry) {
      if (period > regionSize) continue;
      if (period < 8) continue;

      // Generate ideal sine wave and correlate
      const correlation = this.correlateWithSine(
        memory,
        region.start,
        Math.min(region.end, region.start + period),
        period,
        center,
        amplitude / 2
      );

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    // Require decent correlation
    if (bestCorrelation < 0.75) return null;

    return {
      period: bestPeriod,
      min,
      max,
      correlation: bestCorrelation,
    };
  }

  private correlateWithSine(
    memory: Uint8Array,
    start: number,
    end: number,
    period: number,
    center: number,
    halfAmplitude: number
  ): number {
    const len = end - start;
    if (len === 0) return 0;

    let sumSqDiff = 0;
    let sumSqTotal = 0;

    for (let i = 0; i < len; i++) {
      const actual = memory[start + i];
      const expected =
        center + halfAmplitude * Math.sin((2 * Math.PI * i) / period);
      const diff = actual - expected;
      const totalDiff = actual - center;
      sumSqDiff += diff * diff;
      sumSqTotal += totalDiff * totalDiff;
    }

    if (sumSqTotal === 0) return 0;

    // R-squared correlation
    return Math.max(0, 1 - sumSqDiff / sumSqTotal);
  }
}
