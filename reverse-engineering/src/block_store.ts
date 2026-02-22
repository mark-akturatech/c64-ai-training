// ============================================================================
// Block Store — mutable block store with versioning and change log
//
// Blocks are mutable in memory throughout the pipeline. Both enrichment
// plugins and AI can reclassify, split, or merge blocks. Every mutation
// bumps the version and logs the change.
// ============================================================================

import type { Block, BlockType } from "@c64/shared";
import type { BlockChange, BlockStoreInterface } from "./types.js";

export class BlockStore implements BlockStoreInterface {
  private blocks: Block[];
  private version = 0;
  private changeLog: BlockChange[] = [];

  constructor(blocks: Block[]) {
    // Deep copy to avoid external mutation
    this.blocks = blocks.map(b => ({ ...b }));
  }

  getVersion(): number {
    return this.version;
  }

  getSnapshot(): readonly Block[] {
    return this.blocks;
  }

  getBlock(address: number): Block | null {
    return this.blocks.find(b => b.address === address) ?? null;
  }

  getBlockById(id: string): Block | null {
    return this.blocks.find(b => b.id === id) ?? null;
  }

  findBlockContaining(address: number): Block | null {
    return this.blocks.find(b => address >= b.address && address < b.endAddress) ?? null;
  }

  /** Reclassify a block's type */
  reclassify(address: number, newType: BlockType, reason: string): void {
    const block = this.getBlock(address);
    if (!block) throw new Error(`Block not found at address $${address.toString(16)}`);

    const oldType = block.type;
    block.type = newType;
    this.version++;
    this.changeLog.push({
      timestamp: Date.now(),
      action: "reclassify",
      blockAddress: address,
      details: { oldType, newType },
      reason,
      source: "block_store",
    });
  }

  /** Split a block at a given address */
  split(address: number, splitAt: number, reason: string): void {
    const blockIndex = this.blocks.findIndex(b => b.address === address);
    if (blockIndex === -1) throw new Error(`Block not found at address $${address.toString(16)}`);

    const block = this.blocks[blockIndex];
    if (splitAt <= block.address || splitAt >= block.endAddress) {
      throw new Error(
        `Split address $${splitAt.toString(16)} not within block $${address.toString(16)}-$${block.endAddress.toString(16)}`,
      );
    }

    // Create two new blocks — first half keeps the original ID so that
    // analyses stored by block ID (Stage 2/3) still resolve correctly.
    const block1: Block = {
      ...block,
      endAddress: splitAt,
      instructions: block.instructions?.filter(i => i.address < splitAt),
    };

    const block2: Block = {
      ...block,
      id: `${block.type}_${splitAt.toString(16).toUpperCase()}`,
      address: splitAt,
      instructions: block.instructions?.filter(i => i.address >= splitAt),
    };

    // Split the raw (base64) field if present
    if (block.raw) {
      const rawBytes = Buffer.from(block.raw, "base64");
      const splitOffset = splitAt - block.address;
      if (splitOffset > 0 && splitOffset < rawBytes.length) {
        block1.raw = Buffer.from(rawBytes.slice(0, splitOffset)).toString("base64");
        block2.raw = Buffer.from(rawBytes.slice(splitOffset)).toString("base64");
      }
    }

    // Replace original with two new blocks
    this.blocks.splice(blockIndex, 1, block1, block2);
    this.version++;
    this.changeLog.push({
      timestamp: Date.now(),
      action: "split",
      blockAddress: address,
      details: { splitAt, newBlocks: [block1.address, block2.address] },
      reason,
      source: "block_store",
    });
  }

  /** Merge two adjacent blocks */
  merge(addr1: number, addr2: number, reason: string): void {
    const idx1 = this.blocks.findIndex(b => b.address === addr1);
    const idx2 = this.blocks.findIndex(b => b.address === addr2);
    if (idx1 === -1 || idx2 === -1) {
      throw new Error(`One or both blocks not found: $${addr1.toString(16)}, $${addr2.toString(16)}`);
    }

    const b1 = this.blocks[idx1];
    const b2 = this.blocks[idx2];

    // Ensure adjacency
    if (b1.endAddress !== b2.address && b2.endAddress !== b1.address) {
      throw new Error(`Blocks are not adjacent: $${addr1.toString(16)} and $${addr2.toString(16)}`);
    }

    // Determine order
    const [first, second] = b1.address < b2.address ? [b1, b2] : [b2, b1];

    const merged: Block = {
      ...first,
      endAddress: second.endAddress,
      instructions: [
        ...(first.instructions ?? []),
        ...(second.instructions ?? []),
      ],
    };

    // Concatenate raw (base64) fields
    if (first.raw || second.raw) {
      const buf1 = first.raw
        ? Buffer.from(first.raw, "base64")
        : Buffer.alloc(first.endAddress - first.address);
      const buf2 = second.raw
        ? Buffer.from(second.raw, "base64")
        : Buffer.alloc(second.endAddress - second.address);
      merged.raw = Buffer.concat([buf1, buf2]).toString("base64");
    }

    // Remove both and insert merged
    const removeIndices = [idx1, idx2].sort((a, b) => b - a);
    for (const idx of removeIndices) {
      this.blocks.splice(idx, 1);
    }
    // Insert at correct position
    const insertIdx = this.blocks.findIndex(b => b.address > merged.address);
    if (insertIdx === -1) {
      this.blocks.push(merged);
    } else {
      this.blocks.splice(insertIdx, 0, merged);
    }

    this.version++;
    this.changeLog.push({
      timestamp: Date.now(),
      action: "merge",
      blockAddress: addr1,
      details: { mergedWith: addr2, resultAddress: merged.address },
      reason,
      source: "block_store",
    });
  }

  hasChangedSince(version: number): boolean {
    return this.version > version;
  }

  getChanges(): readonly BlockChange[] {
    return this.changeLog;
  }

  /** Get all blocks sorted by address */
  getAllBlocks(): Block[] {
    return [...this.blocks].sort((a, b) => a.address - b.address);
  }

  /** Get block count */
  get size(): number {
    return this.blocks.length;
  }
}
