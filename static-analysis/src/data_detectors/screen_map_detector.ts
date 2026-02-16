// ============================================================================
// Screen Map Detector
// Detects 1000-byte screen maps (40x25 characters) and color RAM data.
// Screen location is configured via $D018 bits 4-7 within the VIC bank.
// Color RAM is always at $D800-$DBE7 (1000 bytes).
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const SCREEN_SIZE = 1000;      // 40 columns * 25 rows
const SCREEN_COLS = 40;
const SCREEN_ROWS = 25;
const VIC_D018 = 0xd018;
const COLOR_RAM_START = 0xd800;
const COLOR_RAM_END = 0xdbe8;  // $D800 + 1000
const SCREEN_ALIGNMENT = 1024; // screen must be 1KB aligned within VIC bank

export class ScreenMapDetector implements DataDetector {
  name = "screen_map";
  description = "Detects 1000-byte screen maps and color RAM data via $D018 tracing";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    // Check for color RAM region
    if (this.isColorRamRegion(region)) {
      if (!this.hasCode(region.start, region.end, context)) {
        candidates.push({
          start: region.start,
          end: Math.min(region.end, COLOR_RAM_END),
          detector: this.name,
          type: "color_ram",
          subtype: "color_data",
          confidence: 90,
          evidence: [
            `Region overlaps Color RAM ($D800-$DBE7)`,
            "Color RAM is hardware-mapped, always at $D800",
          ],
          label: "color_ram",
          comment: "Color RAM data (40x25, 4-bit color per cell)",
        });
      }
      return candidates;
    }

    // Need at least a full screen for screen map detection
    if (regionSize < SCREEN_SIZE) return candidates;

    // Check for proven code overlap
    if (this.hasCode(region.start, region.end, context)) return candidates;

    const vicBankBase = context.bankingState.vicBankBase;
    const d018Traced = this.checkD018ScreenConfig(region, context);

    // Check 1KB alignment within VIC bank
    const offsetInBank = region.start - vicBankBase;
    const isAligned = offsetInBank >= 0 && offsetInBank % SCREEN_ALIGNMENT === 0;

    // Validate screen content heuristic: screen codes are typically 0x00-0xFF
    // but predominantly in the printable range. Check for reasonable distribution.
    const hasReasonableContent = this.checkScreenContent(
      memory,
      region.start,
      region.start + SCREEN_SIZE
    );

    if (regionSize === SCREEN_SIZE || (regionSize >= SCREEN_SIZE && regionSize <= SCREEN_SIZE + 24)) {
      // Exact or near-exact screen size (may include the 24 padding bytes to fill 1024)
      const confidence = d018Traced ? 80 : hasReasonableContent && isAligned ? 50 : 30;
      if (confidence >= 30) {
        candidates.push({
          start: region.start,
          end: region.start + SCREEN_SIZE,
          detector: this.name,
          type: "screen_map",
          subtype: "text_screen",
          confidence,
          evidence: this.buildEvidence(d018Traced, isAligned, hasReasonableContent, vicBankBase),
          label: "screen",
          comment: `Screen map (${SCREEN_COLS}x${SCREEN_ROWS}, ${SCREEN_SIZE} bytes)`,
        });
      }
    } else if (regionSize >= SCREEN_SIZE && regionSize % SCREEN_SIZE === 0) {
      // Multiple screens (animation frames, etc.)
      const screenCount = Math.floor(regionSize / SCREEN_SIZE);
      const confidence = d018Traced ? 75 : isAligned ? 45 : 25;
      candidates.push({
        start: region.start,
        end: region.start + screenCount * SCREEN_SIZE,
        detector: this.name,
        type: "screen_map",
        subtype: `${screenCount}_screens`,
        confidence,
        evidence: [
          ...this.buildEvidence(d018Traced, isAligned, hasReasonableContent, vicBankBase),
          `Region contains ${screenCount} complete screen(s)`,
        ],
        label: `screens_${screenCount}`,
        comment: `${screenCount} screen map(s) (${screenCount * SCREEN_SIZE} bytes)`,
      });
    } else if (regionSize >= SCREEN_SIZE) {
      // Region larger than one screen — propose the first screen
      const confidence = d018Traced ? 80 : isAligned && hasReasonableContent ? 50 : 25;
      if (confidence >= 25) {
        candidates.push({
          start: region.start,
          end: region.start + SCREEN_SIZE,
          detector: this.name,
          type: "screen_map",
          subtype: "text_screen",
          confidence,
          evidence: this.buildEvidence(d018Traced, isAligned, hasReasonableContent, vicBankBase),
          label: "screen",
          comment: `Screen map (${SCREEN_COLS}x${SCREEN_ROWS}, ${SCREEN_SIZE} bytes)`,
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

  private isColorRamRegion(region: { start: number; end: number }): boolean {
    return (
      region.start >= COLOR_RAM_START &&
      region.start < COLOR_RAM_END &&
      region.end <= COLOR_RAM_END + 24 // allow slight overshoot
    );
  }

  private checkD018ScreenConfig(
    region: { start: number; end: number },
    context: DetectorContext
  ): boolean {
    // Check if banking state's screenBase matches
    if (context.bankingState.screenBase === region.start) {
      return true;
    }

    // Look for writes to $D018 in code references
    for (const edge of context.codeRefs) {
      if (
        (edge.type === "hardware_write" || edge.type === "data_write") &&
        edge.target === VIC_D018
      ) {
        // $D018 bits 4-7 select screen memory:
        //   screenBase = (($D018 >> 4) & 0x0F) * 1024 + vicBankBase
        const vicBankBase = context.bankingState.vicBankBase;
        const offsetInBank = region.start - vicBankBase;
        if (offsetInBank >= 0 && offsetInBank % SCREEN_ALIGNMENT === 0) {
          return true;
        }
      }

      // Pointer references to the region
      if (
        edge.type === "pointer_ref" &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        return true;
      }
    }

    return false;
  }

  private checkScreenContent(
    memory: Uint8Array,
    start: number,
    end: number
  ): boolean {
    // Heuristic: count how many bytes are common screen codes
    // Space ($20), letters ($01-$1A in screen codes), digits, etc.
    let printableCount = 0;
    const len = end - start;
    for (let i = start; i < end && i < memory.length; i++) {
      const b = memory[i];
      // Screen codes: $00 = @, $01-$1A = A-Z, $20 = space, etc.
      // Common values for text screens
      if (b === 0x20 || (b >= 0x01 && b <= 0x1a) || (b >= 0x30 && b <= 0x39)) {
        printableCount++;
      }
    }
    // If more than 30% is printable text, likely a screen map
    return printableCount / len > 0.3;
  }

  private buildEvidence(
    d018Traced: boolean,
    aligned: boolean,
    hasReasonableContent: boolean,
    vicBankBase: number
  ): string[] {
    const evidence: string[] = [];
    if (d018Traced) {
      evidence.push("Traced via $D018 screen base configuration (bits 4-7)");
    }
    if (aligned) {
      evidence.push(
        `1KB aligned within VIC bank (base $${vicBankBase.toString(16).padStart(4, "0")})`
      );
    }
    if (hasReasonableContent) {
      evidence.push("Content contains printable screen codes (>30% text characters)");
    }
    evidence.push(`Screen dimensions: ${SCREEN_COLS}x${SCREEN_ROWS} = ${SCREEN_SIZE} bytes`);
    return evidence;
  }
}
