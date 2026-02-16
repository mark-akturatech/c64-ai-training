// ============================================================================
// Bitmap Data Detector
// Detects 8000-byte bitmap data for hi-res and multicolor bitmap modes.
// Bitmap mode is enabled via $D011 bit 5. Bitmap base is selected via
// $D018 bit 3 (0 = VIC bank base, 1 = VIC bank base + $2000).
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const BITMAP_SIZE = 8000;       // 320x200 pixels / 8 bits = 8000 bytes
const BITMAP_ALIGNMENT = 0x2000; // 8KB aligned within VIC bank
const VIC_D011 = 0xd011;        // VIC control register 1 (bit 5 = bitmap mode)
const VIC_D016 = 0xd016;        // VIC control register 2 (bit 4 = multicolor)
const VIC_D018 = 0xd018;        // VIC memory control (bit 3 = bitmap base)

export class BitmapDetector implements DataDetector {
  name = "bitmap";
  description = "Detects 8000-byte bitmap data via $D011/$D018 register tracing";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    // Must be large enough for a bitmap
    if (regionSize < BITMAP_SIZE) return candidates;

    // Check for proven code overlap in the bitmap range
    const bitmapEnd = region.start + BITMAP_SIZE;
    if (this.hasCode(region.start, bitmapEnd, context)) return candidates;

    const vicBankBase = context.bankingState.vicBankBase;

    // Check register traces
    const registerEvidence = this.checkRegisterTraces(region, context);
    const d011Traced = registerEvidence.d011;
    const d018Traced = registerEvidence.d018;
    const isMulticolor = registerEvidence.multicolor;

    // Check alignment: bitmap data must be at vicBankBase or vicBankBase+$2000
    const offsetInBank = region.start - vicBankBase;
    const isAligned =
      offsetInBank === 0 || offsetInBank === BITMAP_ALIGNMENT;

    // Determine confidence
    let confidence: number;
    if (d011Traced && d018Traced) {
      confidence = 85;
    } else if (d011Traced || d018Traced) {
      confidence = 70;
    } else if (regionSize === BITMAP_SIZE && isAligned) {
      confidence = 50;
    } else if (regionSize >= BITMAP_SIZE && isAligned) {
      confidence = 40;
    } else {
      // Unaligned or wrong size — very low confidence
      return candidates;
    }

    const subtype = isMulticolor ? "multicolor_bitmap" : "hires_bitmap";

    candidates.push({
      start: region.start,
      end: bitmapEnd,
      detector: this.name,
      type: "bitmap",
      subtype,
      confidence,
      evidence: this.buildEvidence(
        d011Traced,
        d018Traced,
        isAligned,
        isMulticolor,
        vicBankBase,
        offsetInBank
      ),
      label: isMulticolor ? "mc_bitmap" : "hires_bitmap",
      comment: `${isMulticolor ? "Multicolor" : "Hi-res"} bitmap data (320x200, ${BITMAP_SIZE} bytes)`,
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

  private checkRegisterTraces(
    region: { start: number; end: number },
    context: DetectorContext
  ): { d011: boolean; d018: boolean; multicolor: boolean } {
    let d011 = false;
    let d018 = false;
    let multicolor = false;

    for (const edge of context.codeRefs) {
      if (
        (edge.type === "hardware_write" || edge.type === "data_write") &&
        edge.target === VIC_D011
      ) {
        // $D011 bit 5 enables bitmap mode
        d011 = true;
      }

      if (
        (edge.type === "hardware_write" || edge.type === "data_write") &&
        edge.target === VIC_D018
      ) {
        // $D018 bit 3 selects bitmap memory base within VIC bank
        // bit 3 = 0: bitmap at VIC bank base
        // bit 3 = 1: bitmap at VIC bank base + $2000
        const vicBankBase = context.bankingState.vicBankBase;
        const offsetInBank = region.start - vicBankBase;
        if (offsetInBank === 0 || offsetInBank === BITMAP_ALIGNMENT) {
          d018 = true;
        }
      }

      if (
        (edge.type === "hardware_write" || edge.type === "data_write") &&
        edge.target === VIC_D016
      ) {
        // $D016 bit 4 enables multicolor mode
        multicolor = true;
      }

      // Pointer references to the bitmap region
      if (
        edge.type === "pointer_ref" &&
        edge.target >= region.start &&
        edge.target < region.start + BITMAP_SIZE
      ) {
        d018 = true;
      }
    }

    return { d011, d018, multicolor };
  }

  private buildEvidence(
    d011Traced: boolean,
    d018Traced: boolean,
    aligned: boolean,
    multicolor: boolean,
    vicBankBase: number,
    offsetInBank: number
  ): string[] {
    const evidence: string[] = [];

    if (d011Traced) {
      evidence.push("$D011 write detected (bit 5 = bitmap mode enable)");
    }
    if (d018Traced) {
      evidence.push(
        `$D018 write detected (bit 3 = bitmap base at bank offset $${offsetInBank.toString(16).padStart(4, "0")})`
      );
    }
    if (multicolor) {
      evidence.push("$D016 write detected (bit 4 = multicolor mode)");
    }
    if (aligned) {
      evidence.push(
        `8KB aligned at $${(vicBankBase + offsetInBank).toString(16).padStart(4, "0")} within VIC bank ${vicBankBase / 0x4000}`
      );
    }
    evidence.push(`Bitmap data: 320x200 pixels = ${BITMAP_SIZE} bytes`);

    return evidence;
  }
}
