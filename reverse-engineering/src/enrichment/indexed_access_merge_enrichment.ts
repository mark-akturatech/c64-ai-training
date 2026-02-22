// ============================================================================
// Indexed Access Merge Enrichment (Priority 14)
//
// Detects indexed addressing patterns like LDA $0954,X / CPX #$28 and
// computes the table width from the comparison bound. When the data block
// at the base address is smaller than the access width, emits merge
// requests to combine it with adjacent data/unknown blocks.
//
// Also handles the heuristic case where no explicit bound is found:
// 1-byte data blocks followed by adjacent unknown/data are merged up to
// the next code block, gap, or the start of the next referenced table.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  BlockMergeRequest,
  BlockSplitRequest,
} from "../types.js";

interface TableAccess {
  baseAddr: number;
  register: "X" | "Y";
  codeBlock: number;   // address of the code block
  instAddr: number;    // address of the indexed instruction
  bound: number | null; // from CPX/CPY #N, null if unknown
}

export class IndexedAccessMergeEnrichment implements EnrichmentPlugin {
  name = "indexed_access_merge";
  priority = 14;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const merges: BlockMergeRequest[] = [];
    const splits: BlockSplitRequest[] = [];

    // Step 1: Find all indexed accesses with their bounds
    const accesses = this.findIndexedAccesses(input.blocks);

    // Step 2: Group by base address, pick largest bound per table
    const tables = this.groupByTable(accesses, input.blocks);

    // Step 3: For each table, emit merges/splits to reach the target width
    for (const [baseAddr, info] of tables) {
      const { width, sources } = info;

      // Find the data block at baseAddr
      const baseBlock = input.blocks.find(
        b => b.address === baseAddr && (b.type === "data" || b.type === "unknown"),
      );
      if (!baseBlock) continue;

      const currentSize = baseBlock.endAddress - baseBlock.address;
      if (currentSize >= width) {
        // Already big enough — just annotate
        enrichments.push({
          blockAddress: baseAddr,
          source: this.name,
          type: "annotation",
          annotation: `Indexed table: ${width} entries accessed by ${sources.length} instruction(s)`,
          data: { tableWidth: width, accessedBy: sources },
        });
        continue;
      }

      // Need to grow: find adjacent data/unknown blocks to merge
      const blockMerges = this.planMerges(baseBlock, width, input.blocks);

      for (const m of blockMerges.merges) {
        merges.push(m);
      }
      for (const s of blockMerges.splits) {
        splits.push(s);
      }

      enrichments.push({
        blockAddress: baseAddr,
        source: this.name,
        type: "annotation",
        annotation: `Indexed table: ${width} entries, merging ${blockMerges.merges.length} adjacent block(s)`,
        data: {
          tableWidth: width,
          accessedBy: sources,
          mergeCount: blockMerges.merges.length,
          splitCount: blockMerges.splits.length,
        },
      });
    }

    return { enrichments, merges, splits };
  }

  /**
   * Scan code blocks for indexed addressing patterns and associated bounds.
   */
  private findIndexedAccesses(blocks: readonly Block[]): TableAccess[] {
    const accesses: TableAccess[] = [];

    for (const block of blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      // Find backward branches (loop closers)
      const loops = this.findLoops(block.instructions);

      // For each instruction, check if it's an indexed access
      for (const inst of block.instructions) {
        const indexed = this.parseIndexedAccess(inst);
        if (!indexed) continue;

        // Skip ZP and hardware addresses — we only care about data tables
        if (indexed.baseAddr < 0x0200) continue;
        if (indexed.baseAddr >= 0xD000 && indexed.baseAddr <= 0xDFFF) continue;

        // Find the bound from the enclosing loop
        const bound = this.findBoundForAccess(inst, indexed.register, loops);

        accesses.push({
          baseAddr: indexed.baseAddr,
          register: indexed.register,
          codeBlock: block.address,
          instAddr: inst.address,
          bound,
        });
      }
    }

    return accesses;
  }

  /**
   * Parse an instruction's operand for absolute indexed addressing.
   * Returns the base address and register, or null.
   */
  private parseIndexedAccess(
    inst: BlockInstruction,
  ): { baseAddr: number; register: "X" | "Y" } | null {
    if (inst.addressingMode !== "absolute_x" && inst.addressingMode !== "absolute_y") {
      return null;
    }

    const match = inst.operand.match(/^\$([0-9A-Fa-f]{4})/);
    if (!match) return null;

    return {
      baseAddr: parseInt(match[1], 16),
      register: inst.addressingMode === "absolute_x" ? "X" : "Y",
    };
  }

  /**
   * Find backward branches (loops) in a block's instructions.
   * Returns array of { branchAddr, targetAddr, register, bound }.
   */
  private findLoops(
    instructions: readonly BlockInstruction[],
  ): Array<{ branchAddr: number; targetAddr: number; register: "X" | "Y" | null; bound: number | null }> {
    const loops: Array<{
      branchAddr: number;
      targetAddr: number;
      register: "X" | "Y" | null;
      bound: number | null;
    }> = [];

    for (let i = 0; i < instructions.length; i++) {
      const inst = instructions[i];
      const mn = inst.mnemonic.toUpperCase();

      // Look for conditional backward branches
      if (!["BNE", "BCC", "BCS", "BEQ", "BPL", "BMI"].includes(mn)) continue;

      const targetMatch = inst.operand.match(/^\$([0-9A-Fa-f]{4})/);
      if (!targetMatch) continue;

      const targetAddr = parseInt(targetMatch[1], 16);
      if (targetAddr >= inst.address) continue; // Forward branch, skip

      // Look for CPX/CPY #imm just before this branch
      let register: "X" | "Y" | null = null;
      let bound: number | null = null;

      // Check the 1-3 instructions before the branch for a comparison
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const prev = instructions[j];
        const prevMn = prev.mnemonic.toUpperCase();

        if (prevMn === "CPX" && prev.addressingMode === "immediate") {
          const immMatch = prev.operand.match(/^#\$([0-9A-Fa-f]+)/);
          if (immMatch) {
            register = "X";
            bound = parseInt(immMatch[1], 16);
          }
        } else if (prevMn === "CPY" && prev.addressingMode === "immediate") {
          const immMatch = prev.operand.match(/^#\$([0-9A-Fa-f]+)/);
          if (immMatch) {
            register = "Y";
            bound = parseInt(immMatch[1], 16);
          }
        }
      }

      loops.push({ branchAddr: inst.address, targetAddr, register, bound });
    }

    return loops;
  }

  /**
   * Find the bound for an indexed access from enclosing loops.
   */
  private findBoundForAccess(
    inst: BlockInstruction,
    register: "X" | "Y",
    loops: Array<{ branchAddr: number; targetAddr: number; register: "X" | "Y" | null; bound: number | null }>,
  ): number | null {
    // Find a loop that contains this instruction and uses the same register
    for (const loop of loops) {
      if (loop.register !== register) continue;
      if (inst.address >= loop.targetAddr && inst.address <= loop.branchAddr) {
        return loop.bound;
      }
    }
    return null;
  }

  /**
   * Group indexed accesses by base address.
   * Pick the largest bound across all references to the same table.
   */
  private groupByTable(
    accesses: TableAccess[],
    blocks: readonly Block[],
  ): Map<number, { width: number; sources: Array<{ codeBlock: number; instAddr: number }> }> {
    const tables = new Map<
      number,
      { bounds: number[]; sources: Array<{ codeBlock: number; instAddr: number }> }
    >();

    for (const access of accesses) {
      const existing = tables.get(access.baseAddr);
      if (existing) {
        if (access.bound !== null) existing.bounds.push(access.bound);
        existing.sources.push({ codeBlock: access.codeBlock, instAddr: access.instAddr });
      } else {
        tables.set(access.baseAddr, {
          bounds: access.bound !== null ? [access.bound] : [],
          sources: [{ codeBlock: access.codeBlock, instAddr: access.instAddr }],
        });
      }
    }

    // Compute final width per table
    const result = new Map<
      number,
      { width: number; sources: Array<{ codeBlock: number; instAddr: number }> }
    >();

    for (const [baseAddr, info] of tables) {
      let width: number;

      if (info.bounds.length > 0) {
        // Use the largest explicit bound
        width = Math.max(...info.bounds);
      } else {
        // Heuristic: find distance to next referenced table or next code block
        width = this.estimateTableWidth(baseAddr, tables, blocks);
      }

      if (width > 0) {
        result.set(baseAddr, { width, sources: info.sources });
      }
    }

    return result;
  }

  /**
   * Heuristic: estimate table width when no explicit bound exists.
   * Uses distance to next known table base or next code block.
   */
  private estimateTableWidth(
    baseAddr: number,
    allTables: Map<number, unknown>,
    blocks: readonly Block[],
  ): number {
    // Find the next table base address after this one
    const otherBases = [...allTables.keys()]
      .filter(a => a > baseAddr)
      .sort((a, b) => a - b);

    // Find the next code block after baseAddr
    const nextCode = blocks
      .filter(b => b.address > baseAddr && b.type !== "data" && b.type !== "unknown")
      .sort((a, b) => a.address - b.address)[0];

    const candidates: number[] = [];
    if (otherBases.length > 0) candidates.push(otherBases[0] - baseAddr);
    if (nextCode) candidates.push(nextCode.address - baseAddr);

    if (candidates.length === 0) return 0;

    const width = Math.min(...candidates);

    // Sanity: don't create tables larger than 256 bytes from heuristics
    return width > 256 ? 0 : width;
  }

  /**
   * Plan merges (and possibly splits) to grow a data block to the target width.
   */
  private planMerges(
    baseBlock: Block,
    targetWidth: number,
    blocks: readonly Block[],
  ): { merges: BlockMergeRequest[]; splits: BlockSplitRequest[] } {
    const merges: BlockMergeRequest[] = [];
    const splitRequests: BlockSplitRequest[] = [];

    const targetEnd = baseBlock.address + targetWidth;
    let currentEnd = baseBlock.endAddress;
    let lastAddr = baseBlock.address;

    // Sort blocks by address for sequential scanning
    const sorted = [...blocks].sort((a, b) => a.address - b.address);

    for (const block of sorted) {
      if (block.address < currentEnd) continue; // Before or overlapping current range
      if (block.address > currentEnd) break;     // Gap — can't merge across gaps
      if (currentEnd >= targetEnd) break;         // Already reached target

      // Only merge data/unknown blocks
      if (block.type !== "data" && block.type !== "unknown") break;

      if (block.endAddress <= targetEnd) {
        // Block fits entirely within target range — merge it
        merges.push({
          addr1: lastAddr,
          addr2: block.address,
          reason: `Indexed table merge: growing table at $${baseBlock.address.toString(16).toUpperCase()} to ${targetWidth} bytes`,
        });
        lastAddr = baseBlock.address; // After merge, the combined block starts at baseBlock.address
        currentEnd = block.endAddress;
      } else {
        // Block extends beyond target — split it first, then merge the first part
        splitRequests.push({
          blockAddress: block.address,
          splitAt: targetEnd,
          reason: `Split for indexed table at $${baseBlock.address.toString(16).toUpperCase()}: need ${targetWidth} bytes`,
        });
        merges.push({
          addr1: lastAddr,
          addr2: block.address,
          reason: `Indexed table merge: growing table at $${baseBlock.address.toString(16).toUpperCase()} to ${targetWidth} bytes`,
        });
        currentEnd = targetEnd;
        break;
      }
    }

    return { merges, splits: splitRequests };
  }
}
