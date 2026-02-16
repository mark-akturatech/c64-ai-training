// ============================================================================
// SID Music / Frequency Table Detector
// Detects SID frequency tables used for music playback.
// The C64 SID chip uses 16-bit frequency values. The well-known PAL frequency
// table for equal-tempered tuning starts at C-0 = $0117.
// Tables can be stored as:
//   - Interleaved: lo, hi, lo, hi, ... (16-bit pairs)
//   - Split: all lo bytes followed by all hi bytes
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

// Well-known PAL frequency table (first 3 octaves, 36 notes C-0 to B-2)
// These are the 16-bit SID frequency values for equal-tempered tuning at PAL clock
const PAL_FREQ_TABLE: number[] = [
  0x0117, 0x0127, 0x0139, 0x014b, 0x015f, 0x0174, 0x018a, 0x01a1,
  0x01ba, 0x01d4, 0x01f0, 0x020e, // C-0 to B-0
  0x022d, 0x024e, 0x0271, 0x0296, 0x02be, 0x02e8, 0x0314, 0x0343,
  0x0374, 0x03a9, 0x03e1, 0x041c, // C-1 to B-1
  0x045a, 0x049c, 0x04e2, 0x052d, 0x057c, 0x05cf, 0x0628, 0x0685,
  0x06e8, 0x0752, 0x07c1, 0x0837, // C-2 to B-2
];

// Lo bytes of the PAL freq table
const PAL_FREQ_LO = PAL_FREQ_TABLE.map((f) => f & 0xff);
// Hi bytes of the PAL freq table
const PAL_FREQ_HI = PAL_FREQ_TABLE.map((f) => (f >> 8) & 0xff);

const SID_BASE = 0xd400;
const SID_END = 0xd800;

const MIN_NOTES = 6; // minimum notes to detect a frequency table

export class SidMusicDetector implements DataDetector {
  name = "sid_music";
  description = "Detects SID frequency tables and music data via pattern matching";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    if (regionSize < MIN_NOTES) return candidates;
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Check for SID register references in code
    const hasSidRefs = this.checkSidReferences(context);

    // Try to detect interleaved frequency table (lo, hi, lo, hi, ...)
    const interleavedResult = this.detectInterleavedFreqTable(memory, region);
    if (interleavedResult) {
      const confidence = interleavedResult.matchRatio > 0.8 ? 90 : 70;
      candidates.push({
        start: interleavedResult.start,
        end: interleavedResult.end,
        detector: this.name,
        type: "sid_data",
        subtype: "freq_table_interleaved",
        confidence,
        evidence: [
          `${interleavedResult.noteCount} PAL frequency values matched (interleaved lo/hi)`,
          `Match ratio: ${(interleavedResult.matchRatio * 100).toFixed(0)}%`,
          ...this.buildSidEvidence(hasSidRefs),
        ],
        label: "sid_freq_table",
        comment: `SID frequency table (interleaved), ${interleavedResult.noteCount} notes`,
      });
    }

    // Try to detect split lo/hi byte tables
    const splitResult = this.detectSplitFreqTable(memory, region);
    if (splitResult) {
      const confidence = splitResult.matchRatio > 0.8 ? 90 : 70;

      // Emit lo table
      candidates.push({
        start: splitResult.loStart,
        end: splitResult.loEnd,
        detector: this.name,
        type: "sid_data",
        subtype: "freq_table_lo",
        confidence,
        evidence: [
          `${splitResult.noteCount} PAL frequency lo-bytes matched`,
          `Match ratio: ${(splitResult.matchRatio * 100).toFixed(0)}%`,
          ...this.buildSidEvidence(hasSidRefs),
        ],
        label: "sid_freq_lo",
        comment: `SID frequency table (lo bytes), ${splitResult.noteCount} notes`,
      });

      // Check if hi table immediately follows
      if (splitResult.hiStart !== -1) {
        candidates.push({
          start: splitResult.hiStart,
          end: splitResult.hiEnd,
          detector: this.name,
          type: "sid_data",
          subtype: "freq_table_hi",
          confidence,
          evidence: [
            `${splitResult.noteCount} PAL frequency hi-bytes matched`,
            `Adjacent to lo-byte table`,
            ...this.buildSidEvidence(hasSidRefs),
          ],
          label: "sid_freq_hi",
          comment: `SID frequency table (hi bytes), ${splitResult.noteCount} notes`,
        });
      }
    }

    // Check for SID-labeled data (metadata from tree nodes)
    if (!interleavedResult && !splitResult && hasSidRefs) {
      const isReferenced = this.isReferenced(region, context);
      if (isReferenced) {
        candidates.push({
          start: region.start,
          end: region.end,
          detector: this.name,
          type: "sid_data",
          subtype: "music_data",
          confidence: 70,
          evidence: [
            "Region referenced by code that writes to SID registers",
            `Data size: ${regionSize} bytes`,
          ],
          label: "sid_data",
          comment: `Possible SID music/sound data, ${regionSize} bytes`,
        });
      }
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

  private checkSidReferences(context: DetectorContext): boolean {
    for (const edge of context.codeRefs) {
      if (
        (edge.type === "hardware_write" || edge.type === "hardware_read") &&
        edge.target >= SID_BASE &&
        edge.target < SID_END
      ) {
        return true;
      }
    }
    return false;
  }

  private isReferenced(
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

  private detectInterleavedFreqTable(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): { start: number; end: number; noteCount: number; matchRatio: number } | null {
    const regionSize = region.end - region.start;

    // Interleaved table: pairs of (lo, hi) bytes
    if (regionSize < MIN_NOTES * 2) return null;
    if (regionSize % 2 !== 0) return null;

    const pairCount = regionSize / 2;
    let matches = 0;
    let totalCompared = 0;

    for (let i = 0; i < pairCount; i++) {
      const lo = memory[region.start + i * 2];
      const hi = memory[region.start + i * 2 + 1];
      const freq = lo | (hi << 8);

      totalCompared++;

      // Check against all octaves (doubling pattern)
      if (this.isKnownFrequency(freq)) {
        matches++;
      }
    }

    if (matches < MIN_NOTES) return null;

    const matchRatio = matches / totalCompared;
    if (matchRatio < 0.5) return null;

    return {
      start: region.start,
      end: region.end,
      noteCount: matches,
      matchRatio,
    };
  }

  private detectSplitFreqTable(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): {
    loStart: number;
    loEnd: number;
    hiStart: number;
    hiEnd: number;
    noteCount: number;
    matchRatio: number;
  } | null {
    const regionSize = region.end - region.start;

    // Try matching lo bytes of the PAL freq table
    // Start with at least MIN_NOTES consecutive matches
    let bestLoRun = 0;
    let bestLoStart = -1;

    for (let start = region.start; start < region.end - MIN_NOTES; start++) {
      let run = 0;
      for (let i = 0; i < PAL_FREQ_LO.length && start + i < region.end; i++) {
        if (memory[start + i] === PAL_FREQ_LO[i]) {
          run++;
        } else {
          break;
        }
      }
      if (run > bestLoRun) {
        bestLoRun = run;
        bestLoStart = start;
      }
    }

    if (bestLoRun < MIN_NOTES) {
      // Also try matching full octave patterns (12 notes, any octave)
      // Frequency doubles each octave, so lo bytes cycle with doubling
      return null;
    }

    const loStart = bestLoStart;
    const loEnd = loStart + bestLoRun;
    const noteCount = bestLoRun;
    const matchRatio = 1.0; // consecutive match

    // Look for the hi-byte table right after the lo table
    let hiStart = -1;
    let hiEnd = -1;

    // Check immediately after lo table
    const candidateHiStart = loEnd;
    if (candidateHiStart + noteCount <= region.end) {
      let hiMatches = 0;
      for (let i = 0; i < noteCount; i++) {
        if (memory[candidateHiStart + i] === PAL_FREQ_HI[i]) {
          hiMatches++;
        }
      }
      if (hiMatches >= MIN_NOTES) {
        hiStart = candidateHiStart;
        hiEnd = candidateHiStart + noteCount;
      }
    }

    return {
      loStart: loStart,
      loEnd: loEnd,
      hiStart,
      hiEnd,
      noteCount,
      matchRatio,
    };
  }

  /** Check if a 16-bit value is a known SID frequency (any octave) */
  private isKnownFrequency(freq: number): boolean {
    // Check against the base PAL freq table
    if (PAL_FREQ_TABLE.includes(freq)) return true;

    // Higher octaves are simply doubled: octave 3 = table * 2, octave 4 = table * 4, etc.
    for (let octaveShift = 1; octaveShift <= 5; octaveShift++) {
      const divisor = 1 << octaveShift;
      if (freq % divisor === 0) {
        const baseFreq = freq / divisor;
        if (PAL_FREQ_TABLE.includes(baseFreq)) return true;
      }
    }

    return false;
  }

  private buildSidEvidence(hasSidRefs: boolean): string[] {
    const evidence: string[] = [];
    if (hasSidRefs) {
      evidence.push("Code writes to SID registers ($D400-$D7FF)");
    }
    return evidence;
  }
}
