// ============================================================================
// Sprite Data Detector
// Detects 63-byte (or 64-byte aligned) sprite data blocks.
// Sprites are 24x21 pixels = 63 bytes, padded to 64 for alignment.
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

/** ByteRole constants: 1 = opcode, 2 = operand — both mean proven code */
const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

/** Default sprite pointer area when screen is at $0400 */
const DEFAULT_SPRITE_PTRS_START = 0x07f8;
const DEFAULT_SPRITE_PTRS_END = 0x0800; // exclusive, 8 pointers

const SPRITE_DATA_SIZE = 63;
const SPRITE_BLOCK_SIZE = 64;

export class SpriteDetector implements DataDetector {
  name = "sprite";
  description = "Detects 63/64-byte sprite data blocks via pointer tracing and alignment";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    // Skip tiny regions that cannot hold even one sprite
    if (regionSize < SPRITE_DATA_SIZE) return candidates;

    // Check if any byte in a range is proven code
    const hasCode = (start: number, end: number): boolean => {
      for (let i = start; i < end; i++) {
        if (context.byteRole[i] === ROLE_OPCODE || context.byteRole[i] === ROLE_OPERAND) {
          return true;
        }
      }
      return false;
    };

    // Compute the sprite pointer base from banking state
    const screenBase = context.bankingState.screenBase;
    const spritePtrsStart = screenBase + 0x03f8;
    const spritePtrsEnd = spritePtrsStart + 8;

    // Gather sprite pointer addresses that code writes to
    const pointerTargets = new Set<number>();
    for (const edge of context.codeRefs) {
      if (
        edge.type === "data_write" &&
        edge.target >= spritePtrsStart &&
        edge.target < spritePtrsEnd
      ) {
        // The value written to a sprite pointer is a block index:
        // spriteDataAddr = blockIndex * 64 + vicBankBase
        // We note that there IS a pointer write, but the actual block index
        // is in the instruction operand. We'll check from the other direction below.
        pointerTargets.add(edge.target);
      }
      // Also check default location if banking differs
      if (
        edge.type === "data_write" &&
        edge.target >= DEFAULT_SPRITE_PTRS_START &&
        edge.target < DEFAULT_SPRITE_PTRS_END
      ) {
        pointerTargets.add(edge.target);
      }
    }

    // Check if any code reference points INTO the region as a data source
    // (e.g., pointer_ref, data_read targeting the region)
    const vicBankBase = context.bankingState.vicBankBase;
    const hasPointerTrace = this.checkPointerTrace(
      memory,
      region,
      context,
      vicBankBase,
      spritePtrsStart,
      spritePtrsEnd
    );

    // Try to carve sprite blocks from the region
    // Sprites are 64-byte aligned within VIC bank
    const regionAlignedStart =
      region.start % SPRITE_BLOCK_SIZE === 0
        ? region.start
        : region.start + (SPRITE_BLOCK_SIZE - (region.start % SPRITE_BLOCK_SIZE));

    if (regionAlignedStart >= region.end) {
      // Region too small after alignment — try treating entire region as sprite data
      if (
        regionSize === SPRITE_DATA_SIZE ||
        regionSize === SPRITE_BLOCK_SIZE ||
        regionSize % SPRITE_DATA_SIZE === 0 ||
        regionSize % SPRITE_BLOCK_SIZE === 0
      ) {
        if (!hasCode(region.start, region.end)) {
          const spriteCount =
            regionSize % SPRITE_BLOCK_SIZE === 0
              ? regionSize / SPRITE_BLOCK_SIZE
              : Math.floor(regionSize / SPRITE_DATA_SIZE);

          const confidence = hasPointerTrace ? 95 : 20;
          candidates.push({
            start: region.start,
            end: region.end,
            detector: this.name,
            type: "sprite_data",
            subtype: spriteCount === 1 ? "single_sprite" : `${spriteCount}_sprites`,
            confidence,
            evidence: this.buildEvidence(hasPointerTrace, spriteCount, false),
            label: spriteCount === 1 ? "sprite" : `sprite_sheet_${spriteCount}`,
            comment: `${spriteCount} sprite frame(s), ${regionSize} bytes`,
          });
        }
      }
      return candidates;
    }

    // Check 64-byte aligned blocks within the region
    const numBlocks = Math.floor((region.end - regionAlignedStart) / SPRITE_BLOCK_SIZE);
    if (numBlocks === 0 && regionSize >= SPRITE_DATA_SIZE) {
      // Unaligned but right size — lower confidence
      if (!hasCode(region.start, region.end) && regionSize <= SPRITE_BLOCK_SIZE) {
        candidates.push({
          start: region.start,
          end: region.end,
          detector: this.name,
          type: "sprite_data",
          subtype: "single_sprite",
          confidence: hasPointerTrace ? 95 : 20,
          evidence: this.buildEvidence(hasPointerTrace, 1, false),
          label: "sprite",
          comment: `Sprite data (unaligned), ${regionSize} bytes`,
        });
      }
      return candidates;
    }

    if (numBlocks > 0 && !hasCode(regionAlignedStart, regionAlignedStart + numBlocks * SPRITE_BLOCK_SIZE)) {
      // Check how many blocks actually look like sprite data
      let spriteLikeBlocks = 0;
      for (let i = 0; i < numBlocks; i++) {
        const blockStart = regionAlignedStart + i * SPRITE_BLOCK_SIZE;
        if (this.looksLikeSpriteData(memory, blockStart)) {
          spriteLikeBlocks++;
        }
      }

      // Need at least half the blocks to look like sprites
      const spriteRatio = spriteLikeBlocks / numBlocks;
      if (spriteRatio < 0.5 && !hasPointerTrace) return candidates;

      // Determine confidence based on evidence
      let confidence: number;
      if (hasPointerTrace) {
        confidence = 95;
      } else if (spriteRatio >= 0.8) {
        confidence = 55;
      } else if (spriteRatio >= 0.5) {
        confidence = 35;
      } else {
        confidence = 20;
      }

      // Large sprite sheets (>32 sprites) are unusual — reduce confidence
      if (numBlocks > 32 && !hasPointerTrace) {
        confidence = Math.max(15, confidence - 15);
      }

      // Check adjacency to other known sprite data for boost
      const adjacentSpriteNode = context.tree.findNodeContaining(
        regionAlignedStart - 1
      );
      if (
        adjacentSpriteNode &&
        adjacentSpriteNode.metadata?.dataType === "sprite_data"
      ) {
        confidence = Math.min(95, Math.max(confidence, 50));
      }

      candidates.push({
        start: regionAlignedStart,
        end: regionAlignedStart + numBlocks * SPRITE_BLOCK_SIZE,
        detector: this.name,
        type: "sprite_data",
        subtype:
          numBlocks === 1 ? "single_sprite" : `${numBlocks}_sprites`,
        confidence,
        evidence: this.buildEvidence(
          hasPointerTrace,
          numBlocks,
          region.start % SPRITE_BLOCK_SIZE === 0
        ),
        label:
          numBlocks === 1
            ? "sprite"
            : `sprite_sheet_${numBlocks}`,
        comment: `${numBlocks} sprite frame(s), ${numBlocks * SPRITE_BLOCK_SIZE} bytes, 64-byte aligned`,
      });
    }

    return candidates;
  }

  /**
   * Heuristic check: does a 64-byte block look like sprite pixel data?
   * Real sprites typically have:
   *  - Non-trivial data in the 63 pixel bytes (not all $00 or all $FF)
   *  - The 64th padding byte is usually $00
   *  - Some row structure (24x21 = 3 bytes per row x 21 rows)
   *  - Mix of set and unset bits (not uniform fill)
   */
  private looksLikeSpriteData(memory: Uint8Array, blockStart: number): boolean {
    // Check padding byte (64th byte) — usually $00
    const paddingByte = memory[blockStart + 63];
    const goodPadding = paddingByte === 0x00;

    // Check the 63 pixel bytes
    let nonZeroCount = 0;
    let uniqueBytes = new Set<number>();
    let allSame = true;
    const firstByte = memory[blockStart];

    for (let i = 0; i < SPRITE_DATA_SIZE; i++) {
      const b = memory[blockStart + i];
      if (b !== 0) nonZeroCount++;
      uniqueBytes.add(b);
      if (b !== firstByte) allSame = false;
    }

    // All zero or all same byte = not a sprite (it's fill/padding)
    if (nonZeroCount === 0) return false;
    if (allSame) return false;

    // Need some variety — sprites have pixel patterns
    // At least 3 unique byte values in 63 bytes
    if (uniqueBytes.size < 3) return false;

    // Check for row structure: in multicolor sprites, bytes within a row
    // are often similar. Check if at least some rows have non-zero data
    let activeRows = 0;
    for (let row = 0; row < 21; row++) {
      const rowStart = blockStart + row * 3;
      if (memory[rowStart] !== 0 || memory[rowStart + 1] !== 0 || memory[rowStart + 2] !== 0) {
        activeRows++;
      }
    }

    // Sprites typically have at least a few active rows
    if (activeRows < 3) return false;

    // Bonus: good padding byte
    if (goodPadding && activeRows >= 5 && uniqueBytes.size >= 4) return true;

    // Moderate: some structure present
    return activeRows >= 5;
  }

  private checkPointerTrace(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext,
    vicBankBase: number,
    spritePtrsStart: number,
    spritePtrsEnd: number
  ): boolean {
    // Check if any code edges write to sprite pointer locations
    for (const edge of context.codeRefs) {
      if (
        edge.type === "data_write" &&
        edge.target >= spritePtrsStart &&
        edge.target < spritePtrsEnd
      ) {
        // A sprite pointer write exists. The value written (block index)
        // times 64 plus VIC bank base should land in our region.
        // We can't always know the immediate value, but the presence of
        // a write to sprite pointer area is strong evidence if the region
        // is aligned.
        const blockIndex = Math.floor(
          (region.start - vicBankBase) / SPRITE_BLOCK_SIZE
        );
        const expectedAddr = blockIndex * SPRITE_BLOCK_SIZE + vicBankBase;
        if (expectedAddr === region.start) {
          return true;
        }
      }

      // Also check pointer_ref edges targeting the region
      if (
        edge.type === "pointer_ref" &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        return true;
      }

      // Check data_read targeting the region (someone loading sprite data)
      if (
        edge.type === "data_read" &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        return true;
      }
    }

    // Check if values at sprite pointer locations in memory point to this region
    for (let ptr = spritePtrsStart; ptr < spritePtrsEnd; ptr++) {
      if (ptr < memory.length) {
        const blockIndex = memory[ptr];
        const spriteAddr = blockIndex * SPRITE_BLOCK_SIZE + vicBankBase;
        if (spriteAddr >= region.start && spriteAddr < region.end) {
          return true;
        }
      }
    }

    return false;
  }

  private buildEvidence(
    pointerTraced: boolean,
    spriteCount: number,
    aligned: boolean
  ): string[] {
    const evidence: string[] = [];
    if (pointerTraced) {
      evidence.push("Traced via sprite pointer write ($07F8-$07FF or screen+$03F8)");
    }
    evidence.push(`Region holds ${spriteCount} sprite frame(s)`);
    if (aligned) {
      evidence.push("64-byte aligned within VIC bank");
    }
    return evidence;
  }
}
