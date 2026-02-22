// ============================================================================
// Pointer Pair Enrichment (Priority 20)
//
// Detects paired low/high byte address tables in data blocks. Pattern:
// Table A entries = low bytes, Table B entries = high bytes of 16-bit addresses.
// Reconstructs full addresses and adds graph edges for each resolved pointer.
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  DependencyGraphEdge,
  BlockReclassification,
  BlockSplitRequest,
} from "../types.js";

export class PointerPairEnrichment implements EnrichmentPlugin {
  name = "pointer_pair";
  priority = 20;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const newGraphEdges: DependencyGraphEdge[] = [];
    const reclassifications: BlockReclassification[] = [];
    const splits: BlockSplitRequest[] = [];

    const dataBlocks = input.blocks.filter(b => b.type === "data" || b.type === "unknown");

    // Look for pairs of same-size data blocks at nearby addresses
    for (let i = 0; i < dataBlocks.length; i++) {
      for (let j = i + 1; j < dataBlocks.length; j++) {
        const a = dataBlocks[i];
        const b = dataBlocks[j];

        const sizeA = a.endAddress - a.address;
        const sizeB = b.endAddress - b.address;
        if (sizeA !== sizeB || sizeA < 2) continue;

        // Check if they could be lo/hi tables
        // Tables are typically adjacent or close together
        const gap = Math.abs(b.address - a.endAddress);
        if (gap > sizeA * 4) continue; // too far apart

        const resolved = this.tryResolvePair(a, b, input.memory, input);
        if (resolved.length > 0) {
          const nodeIdA = this.blockToNodeId(a);

          enrichments.push({
            blockAddress: a.address,
            source: this.name,
            type: "pointer_pair",
            annotation: `Pointer table: ${resolved.length} entries (lo=$${hex(a.address)}, hi=$${hex(b.address)})`,
            data: {
              loTableAddress: a.address,
              hiTableAddress: b.address,
              entryCount: resolved.length,
              resolvedAddresses: resolved,
            },
          });

          // Add graph edges for each resolved pointer
          for (let k = 0; k < resolved.length; k++) {
            newGraphEdges.push({
              source: nodeIdA,
              target: resolved[k],
              type: "pointer_ref",
              category: "data",
              sourceInstruction: a.address + k,
              confidence: 70,
              discoveredBy: this.name,
              discoveredInPhase: "enrichment",
              discoveryTier: "probable",
            });
          }

          // Annotate and reclassify target blocks
          this.annotateTargets(resolved, a.address, input, enrichments, reclassifications, splits);
        }
      }
    }

    return { enrichments, newGraphEdges, reclassifications, splits };
  }

  /**
   * Annotate target blocks referenced by a pointer table.
   * Reclassifies unknown targets based on what the majority of targets are.
   * Splits blocks when a target address falls mid-block.
   */
  private annotateTargets(
    resolved: number[],
    tableAddr: number,
    input: EnrichmentInput,
    enrichments: REBlockEnrichment[],
    reclassifications: BlockReclassification[],
    splits: BlockSplitRequest[],
  ): void {
    // Count target block types to determine majority
    let codeCount = 0;
    let dataCount = 0;
    for (const addr of resolved) {
      const block = input.blocks.find(b => b.address === addr);
      if (!block) continue;
      if (block.type === "subroutine" || block.type === "irq_handler" || block.type === "fragment") {
        codeCount++;
      } else if (block.type === "data") {
        dataCount++;
      }
    }

    const majorityIsCode = codeCount > dataCount && codeCount > 0;

    for (let i = 0; i < resolved.length; i++) {
      const addr = resolved[i];
      const exactBlock = input.blocks.find(b => b.address === addr);

      if (exactBlock) {
        // Add annotation on the target
        enrichments.push({
          blockAddress: addr,
          source: this.name,
          type: "resolved_target",
          annotation: `Target of pointer table at $${hex(tableAddr)} (entry ${i + 1} of ${resolved.length})`,
          data: {
            sourceTable: tableAddr,
            tableIndex: i,
            tableSize: resolved.length,
            sourcePlugin: this.name,
          },
        });

        // Reclassify unknown targets based on majority
        if (exactBlock.type === "unknown") {
          if (majorityIsCode) {
            reclassifications.push({
              blockAddress: addr,
              newType: "subroutine",
              reason: `Pointer table at $${hex(tableAddr)}: ${codeCount}/${resolved.length} targets are code`,
            });
          } else if (dataCount > codeCount) {
            reclassifications.push({
              blockAddress: addr,
              newType: "data",
              reason: `Pointer table at $${hex(tableAddr)}: ${dataCount}/${resolved.length} targets are data`,
            });
          }
        }
      } else {
        // Address doesn't match any block start — check if it's mid-block
        const containing = input.blocks.find(
          b => addr > b.address && addr < b.endAddress,
        );
        if (containing) {
          splits.push({
            blockAddress: containing.address,
            splitAt: addr,
            reason: `Pointer table at $${hex(tableAddr)} entry ${i + 1} targets mid-block at $${hex(addr)}`,
          });
        }
      }
    }
  }

  private tryResolvePair(
    a: Block,
    b: Block,
    memory: Readonly<Uint8Array>,
    input: EnrichmentInput,
  ): number[] {
    const size = a.endAddress - a.address;
    const resolved: number[] = [];

    // Try a=lo, b=hi
    let validLH = true;
    const addrLH: number[] = [];
    for (let i = 0; i < size; i++) {
      const lo = memory[a.address + i];
      const hi = memory[b.address + i];
      const addr = (hi << 8) | lo;
      // Sanity check: address should be in loaded program range
      if (addr < 0x0200 || addr > 0xFFF0) { validLH = false; break; }
      addrLH.push(addr);
    }

    // Try a=hi, b=lo
    let validHL = true;
    const addrHL: number[] = [];
    for (let i = 0; i < size; i++) {
      const hi = memory[a.address + i];
      const lo = memory[b.address + i];
      const addr = (hi << 8) | lo;
      if (addr < 0x0200 || addr > 0xFFF0) { validHL = false; break; }
      addrHL.push(addr);
    }

    // Prefer the arrangement where more addresses match known blocks
    if (validLH) {
      const matchesLH = addrLH.filter(addr => this.isKnownAddress(addr, input)).length;
      const matchesHL = validHL ? addrHL.filter(addr => this.isKnownAddress(addr, input)).length : 0;
      if (matchesLH >= matchesHL) return addrLH;
    }
    if (validHL) return addrHL;

    return resolved;
  }

  private isKnownAddress(addr: number, input: EnrichmentInput): boolean {
    for (const block of input.blocks) {
      if (block.address === addr) return true;
    }
    return false;
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
