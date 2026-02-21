// ============================================================================
// String Merge Enricher
// Three passes:
// 1. Absorbs 1-byte data blocks into adjacent string blocks when the byte
//    is compatible with the string's encoding.
// 2. Merges adjacent string blocks with the same subtype into one block.
// 3. Trims trailing non-text bytes from string blocks, pushing them into
//    the next block (or creating a new block).
// Respects hard read boundaries (addresses in code blocks' dataRefs):
// - Only merges FORWARD (right) — code references create hard start boundaries
// - Caps forward merge at the next hard boundary
//
// Tree mutations: mergeNodes() called when two adjacent blocks are merged.
// ============================================================================

import { Buffer } from "node:buffer";
import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

export class StringMergeEnricher implements BlockEnricher {
  name = "string_merge";
  description = "Absorbs 1-byte data blocks into adjacent string blocks";
  priority = 8; // after code_promotion (5), before sub_splitter (20)

  enrich(blocks: Block[], context: EnricherContext): Block[] {
    const sorted = [...blocks].sort((a, b) => a.address - b.address);

    // Build hard boundaries from code blocks' dataRefs — addresses directly
    // referenced by LDA/STA/etc instructions. These are the real boundaries.
    const hardBoundaries = new Set<number>();
    for (const block of sorted) {
      if (block.dataRefs) {
        for (const addr of block.dataRefs) {
          hardBoundaries.add(addr);
        }
      }
    }

    // Pass 1: absorb 1-byte blocks into adjacent strings
    const afterAbsorb = this.absorbSingleByteBlocks(sorted, hardBoundaries, context);
    const absorbCount = sorted.length - afterAbsorb.length;

    // Pass 2: merge adjacent string blocks with the same subtype
    // (but not across hard boundaries — code references separate data)
    const afterMerge = this.mergeAdjacentStrings(afterAbsorb, hardBoundaries, context);
    const adjacentCount = afterAbsorb.length - afterMerge.length;

    // Pass 3: trim trailing non-text bytes from string blocks
    const result = this.trimTrailingNonText(afterMerge, hardBoundaries, context);

    if (absorbCount > 0) {
      console.error(`  string_merge: absorbed ${absorbCount} single-byte block(s) into adjacent strings`);
    }
    if (adjacentCount > 0) {
      console.error(`  string_merge: merged ${adjacentCount} adjacent string block(s)`);
    }

    return result;
  }

  /**
   * Merge tree nodes for two adjacent blocks being combined.
   * Silently skips if either node is not found (tree may not have nodes for gap-fill blocks).
   */
  private mergeTreeNodes(addr1: number, addr2: number, context: EnricherContext): void {
    const node1 = context.tree.getNode(addr1) ?? context.tree.findNodeContaining(addr1);
    const node2 = context.tree.getNode(addr2) ?? context.tree.findNodeContaining(addr2);
    if (node1 && node2 && node1 !== node2 && context.tree.hasNode(node1.start) && context.tree.hasNode(node2.start)) {
      try {
        context.tree.mergeNodes(node1.start, node2.start);
      } catch {
        // Nodes may not be adjacent in the tree — skip
      }
    }
  }

  /**
   * Absorb 1-byte data blocks into adjacent string blocks.
   * Only merges FORWARD (right). Caps at the next hard boundary so we
   * don't merge across separate data access ranges.
   */
  private absorbSingleByteBlocks(
    blocks: Block[],
    hardBoundaries: Set<number>,
    context: EnricherContext
  ): Block[] {
    const result: Block[] = [...blocks];
    let changed = true;

    while (changed) {
      changed = false;
      for (let i = 0; i < result.length; i++) {
        const block = result[i];
        if (block.endAddress - block.address !== 1) continue;
        if (block.type !== "data" && block.type !== "unknown") continue;

        const byte = context.memory[block.address];

        // Only merge FORWARD — the 1-byte block is a data access start boundary
        if (i + 1 < result.length) {
          const right = result[i + 1];
          if (this.isStringBlock(right) && right.address === block.endAddress) {
            const subtype = this.getStringSubtype(right);
            if (!this.isByteCompatible(byte, subtype)) continue;

            // Cap merge at the next hard boundary within the right block's range
            const mergeEnd = this.nextHardBoundary(block.endAddress, right.endAddress, hardBoundaries);

            if (mergeEnd > block.endAddress) {
              // Merge tree nodes
              this.mergeTreeNodes(block.address, right.address, context);

              result[i + 1] = this.expandBlock(right, block.address, mergeEnd, context);
              // If we capped the merge, keep the remainder as a separate block
              if (mergeEnd < right.endAddress) {
                result.splice(i + 2, 0, this.sliceBlock(right, mergeEnd, right.endAddress, context));
              }
              result.splice(i, 1);
              changed = true;
              break;
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Merge adjacent string blocks with the same subtype into a single block.
   */
  private mergeAdjacentStrings(blocks: Block[], hardBoundaries: Set<number>, context: EnricherContext): Block[] {
    const result: Block[] = [...blocks];
    let changed = true;

    while (changed) {
      changed = false;
      for (let i = 0; i < result.length - 1; i++) {
        const left = result[i];
        const right = result[i + 1];

        if (!this.isStringBlock(left) || !this.isStringBlock(right)) continue;
        if (left.endAddress !== right.address) continue;

        // Don't merge across hard boundaries — code references separate data
        if (hardBoundaries.has(right.address)) continue;

        // Same subtype required
        const leftSub = this.getStringSubtype(left);
        const rightSub = this.getStringSubtype(right);
        if (leftSub !== rightSub) continue;

        // Merge tree nodes
        this.mergeTreeNodes(left.address, right.address, context);

        // Merge right into left
        result[i] = this.expandBlock(left, left.address, right.endAddress, context);
        result.splice(i + 1, 1);
        changed = true;
        break;
      }
    }

    return result;
  }

  /**
   * Trim trailing non-text bytes from string blocks.
   * If the next block is not a hard boundary, prepend trimmed bytes to it.
   * Otherwise, create a new unknown block for the trimmed bytes.
   */
  private trimTrailingNonText(blocks: Block[], hardBoundaries: Set<number>, context: EnricherContext): Block[] {
    const result: Block[] = [...blocks];
    let trimCount = 0;

    for (let i = 0; i < result.length; i++) {
      const block = result[i];
      if (!this.isStringBlock(block)) continue;

      const subtype = this.getStringSubtype(block);
      const bytes = context.memory.slice(block.address, block.endAddress);

      // Find last text-compatible byte from the end
      let lastText = bytes.length - 1;
      while (lastText >= 0 && !this.isByteCompatible(bytes[lastText], subtype)) {
        lastText--;
      }

      const trimStart = lastText + 1;
      if (trimStart >= bytes.length) continue; // nothing to trim
      if (trimStart === 0) continue; // entire block is non-text — leave as-is

      const trimAddr = block.address + trimStart;

      // Don't trim at a hard boundary
      if (hardBoundaries.has(trimAddr)) continue;

      // Shrink the string block
      result[i] = this.expandBlock(block, block.address, trimAddr, context);

      // Push trimmed bytes: prepend to next block or create new unknown block
      const trimEnd = block.endAddress;
      if (i + 1 < result.length && result[i + 1].address === trimEnd && !hardBoundaries.has(trimEnd)) {
        // Expand next block backward to absorb trimmed bytes
        const next = result[i + 1];
        result[i + 1] = {
          ...next,
          id: `unknown_${trimAddr.toString(16).padStart(4, "0")}`,
          address: trimAddr,
          raw: Buffer.from(context.memory.slice(trimAddr, next.endAddress)).toString("base64"),
        };
      } else {
        // Create a new unknown block for the trimmed bytes
        const newBlock: Block = {
          id: `unknown_${trimAddr.toString(16).padStart(4, "0")}`,
          address: trimAddr,
          endAddress: trimEnd,
          type: "unknown",
          reachability: "unproven",
          raw: Buffer.from(context.memory.slice(trimAddr, trimEnd)).toString("base64"),
        };
        result.splice(i + 1, 0, newBlock);
      }
      trimCount++;
    }

    if (trimCount > 0) {
      console.error(`  string_merge: trimmed trailing non-text bytes from ${trimCount} string block(s)`);
    }

    return result;
  }

  /**
   * Find the next hard boundary between start (exclusive) and end (inclusive).
   * Returns the boundary address, or end if none found.
   */
  private nextHardBoundary(start: number, end: number, hardBoundaries: Set<number>): number {
    for (let addr = start + 1; addr < end; addr++) {
      if (hardBoundaries.has(addr)) return addr;
    }
    return end;
  }

  private isStringBlock(block: Block): boolean {
    if (block.type !== "data") return false;
    if (!block.candidates || block.bestCandidate === undefined) return false;
    const best = block.candidates[block.bestCandidate];
    return best?.type === "string" || best?.type === "text";
  }

  private getStringSubtype(block: Block): string {
    if (!block.candidates || block.bestCandidate === undefined) return "";
    return block.candidates[block.bestCandidate]?.subtype ?? "";
  }

  private isByteCompatible(byte: number, subtype: string): boolean {
    if (subtype === "screen_codes" || subtype === "screencode" || subtype === "screencode_mixed") {
      return byte <= 0x3f;
    }
    // PETSCII: printable range $20-$5F, $C0-$DF
    return (byte >= 0x20 && byte <= 0x5f) || (byte >= 0xc0 && byte <= 0xdf);
  }

  private expandBlock(block: Block, newStart: number, newEnd: number, context: EnricherContext): Block {
    const size = newEnd - newStart;

    const candidates = (block.candidates ?? []).map((c) => ({
      ...c,
      start: newStart,
      end: newEnd,
      comment: c.comment?.replace(/\d+ chars/, `${size} chars`),
    }));

    return {
      ...block,
      id: `data_${newStart.toString(16).padStart(4, "0")}`,
      address: newStart,
      endAddress: newEnd,
      candidates,
      raw: Buffer.from(context.memory.slice(newStart, newEnd)).toString("base64"),
    };
  }

  private sliceBlock(block: Block, start: number, end: number, context: EnricherContext): Block {
    return {
      ...block,
      id: `data_${start.toString(16).padStart(4, "0")}`,
      address: start,
      endAddress: end,
      raw: Buffer.from(context.memory.slice(start, end)).toString("base64"),
    };
  }
}
