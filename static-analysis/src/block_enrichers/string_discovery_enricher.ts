// ============================================================================
// String Discovery Enricher
// Promotes unknown blocks (and data blocks with only low-confidence non-string
// candidates) to string blocks when their bytes are valid screen codes or PETSCII.
// For blocks where only the leading portion is text, splits the block and
// promotes just the text prefix.
// Runs BEFORE string_merge so that the merge enricher can absorb adjacent
// 1-byte boundary blocks into the newly-found strings.
// ============================================================================

import { Buffer } from "node:buffer";
import type { Block, DataCandidate } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

const MIN_STRING_LENGTH = 4;
/** Threshold: at least this fraction of bytes must be in-range for whole-block promotion */
const SCREEN_CODE_THRESHOLD = 0.8;
const PETSCII_THRESHOLD = 0.75;

export class StringDiscoveryEnricher implements BlockEnricher {
  name = "string_discovery";
  description = "Promotes unknown/unclassified blocks to strings when bytes are valid text";
  priority = 7; // before string_merge (8)

  enrich(blocks: Block[], context: EnricherContext): Block[] {
    let promoted = 0;
    let split = 0;
    const result: Block[] = [];

    for (const block of blocks) {
      if (this.alreadyHasStringCandidate(block) || !this.isPromotable(block)) {
        result.push(block);
        continue;
      }

      const size = block.endAddress - block.address;
      if (size < MIN_STRING_LENGTH) {
        result.push(block);
        continue;
      }

      const bytes = context.memory.slice(block.address, block.endAddress);

      // Try whole-block promotion first
      const screenResult = this.checkScreenCodes(bytes);
      if (screenResult) {
        this.addStringCandidate(block, "screen_codes", size, screenResult.ratio, context);
        promoted++;
        result.push(block);
        continue;
      }

      const petsciiResult = this.checkPetscii(bytes);
      if (petsciiResult) {
        this.addStringCandidate(block, "petscii", size, petsciiResult.ratio, context);
        promoted++;
        result.push(block);
        continue;
      }

      // Whole block doesn't qualify — try prefix split
      const prefixResult = this.findStringPrefix(bytes);
      if (prefixResult) {
        const splitAddr = block.address + prefixResult.length;
        // Create string block for the prefix
        const stringBlock = this.createSplitBlock(
          block, block.address, splitAddr, prefixResult.subtype, prefixResult.length, context
        );
        result.push(stringBlock);
        // Remainder block
        if (splitAddr < block.endAddress) {
          const remainder: Block = {
            id: `unknown_${splitAddr.toString(16).padStart(4, "0")}`,
            address: splitAddr,
            endAddress: block.endAddress,
            type: "unknown",
            reachability: block.reachability,
            raw: Buffer.from(context.memory.slice(splitAddr, block.endAddress)).toString("base64"),
          };
          result.push(remainder);
        }
        promoted++;
        split++;
        continue;
      }

      result.push(block);
    }

    if (promoted > 0) {
      console.error(`  string_discovery: promoted ${promoted} block(s) to string${split > 0 ? ` (${split} split)` : ""}`);
    }

    return result;
  }

  private alreadyHasStringCandidate(block: Block): boolean {
    if (!block.candidates) return false;
    return block.candidates.some((c) => c.type === "string" || c.type === "text");
  }

  private isPromotable(block: Block): boolean {
    if (block.type === "unknown") return true;
    if (block.type !== "data") return false;
    if (!block.candidates || block.candidates.length === 0) return true;
    if (block.bestCandidate === undefined) return true;
    const best = block.candidates[block.bestCandidate];
    return best !== undefined && best.confidence <= 30;
  }

  private checkScreenCodes(bytes: Uint8Array): { ratio: number } | null {
    let inRange = 0;
    for (const b of bytes) {
      if (b <= 0x3f) inRange++;
    }
    const ratio = inRange / bytes.length;
    return ratio >= SCREEN_CODE_THRESHOLD ? { ratio } : null;
  }

  private checkPetscii(bytes: Uint8Array): { ratio: number } | null {
    let printable = 0;
    for (const b of bytes) {
      if ((b >= 0x20 && b <= 0x5f) || (b >= 0xc0 && b <= 0xdf)) printable++;
    }
    const ratio = printable / bytes.length;
    return ratio >= PETSCII_THRESHOLD ? { ratio } : null;
  }

  /**
   * Find the longest text prefix in a byte array.
   * Returns null if the prefix is too short (< MIN_STRING_LENGTH).
   */
  private findStringPrefix(bytes: Uint8Array): { subtype: string; length: number } | null {
    // Try screen codes first
    let scLen = 0;
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] <= 0x3f) {
        scLen++;
      } else {
        break;
      }
    }
    if (scLen >= MIN_STRING_LENGTH) {
      return { subtype: "screen_codes", length: scLen };
    }

    // Try PETSCII
    let pLen = 0;
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if ((b >= 0x20 && b <= 0x5f) || (b >= 0xc0 && b <= 0xdf)) {
        pLen++;
      } else {
        break;
      }
    }
    if (pLen >= MIN_STRING_LENGTH) {
      return { subtype: "petscii", length: pLen };
    }

    return null;
  }

  private addStringCandidate(
    block: Block,
    subtype: string,
    size: number,
    ratio: number,
    context: EnricherContext
  ): void {
    const confidence = ratio > 0.9 ? 55 : 40;

    const candidate: DataCandidate = {
      start: block.address,
      end: block.endAddress,
      detector: "string_discovery",
      type: "string",
      subtype,
      confidence,
      evidence: [
        `Discovered ${subtype} string: ${size} characters`,
        `Ratio: ${(ratio * 100).toFixed(0)}% in range`,
      ],
      comment: subtype === "screen_codes"
        ? `Screen code string, ${size} chars`
        : `PETSCII string, ${size} chars`,
    };

    if (!block.candidates) block.candidates = [];
    block.candidates.push(candidate);

    const bestIdx = block.candidates.length - 1;
    if (block.bestCandidate === undefined ||
        block.candidates[block.bestCandidate].confidence < confidence) {
      block.bestCandidate = bestIdx;
    }

    if (block.type === "unknown") {
      block.type = "data";
    }

    if (!block.raw) {
      block.raw = Buffer.from(context.memory.slice(block.address, block.endAddress)).toString("base64");
    }
  }

  private createSplitBlock(
    original: Block,
    start: number,
    end: number,
    subtype: string,
    size: number,
    context: EnricherContext
  ): Block {
    const candidate: DataCandidate = {
      start,
      end,
      detector: "string_discovery",
      type: "string",
      subtype,
      confidence: 45,
      evidence: [
        `Discovered ${subtype} string prefix: ${size} characters`,
      ],
      comment: subtype === "screen_codes"
        ? `Screen code string, ${size} chars`
        : `PETSCII string, ${size} chars`,
    };

    return {
      id: `data_${start.toString(16).padStart(4, "0")}`,
      address: start,
      endAddress: end,
      type: "data",
      reachability: original.reachability,
      candidates: [candidate],
      bestCandidate: 0,
      raw: Buffer.from(context.memory.slice(start, end)).toString("base64"),
    };
  }
}
