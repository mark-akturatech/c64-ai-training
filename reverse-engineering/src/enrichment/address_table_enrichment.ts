// ============================================================================
// Address Table Enrichment (Priority 35)
//
// For data blocks that contain address tables (.word entries), resolves each
// table entry to its target address and adds graph edges. Detects tables of
// 16-bit addresses stored as consecutive word pairs (lo, hi).
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

export class AddressTableEnrichment implements EnrichmentPlugin {
  name = "address_table";
  priority = 35;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const newGraphEdges: DependencyGraphEdge[] = [];
    const reclassifications: BlockReclassification[] = [];
    const splits: BlockSplitRequest[] = [];

    for (const block of input.blocks) {
      if (block.type !== "data" && block.type !== "unknown") continue;

      const size = block.endAddress - block.address;
      if (size < 4 || size % 2 !== 0) continue; // Need at least 2 word entries

      // Check if this looks like a word address table
      const addresses = this.tryParseWordTable(block, input);
      if (addresses.length < 2) continue;

      const nodeId = this.blockToNodeId(block);

      enrichments.push({
        blockAddress: block.address,
        source: this.name,
        type: "resolved_target",
        annotation: `Address table: ${addresses.length} entries at $${hex(block.address)}`,
        data: {
          entryCount: addresses.length,
          addresses,
        },
      });

      // Add graph edge for each valid table entry
      for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        newGraphEdges.push({
          source: nodeId,
          target: addr,
          type: "pointer_ref",
          category: "data",
          sourceInstruction: block.address + i * 2,
          confidence: 70,
          discoveredBy: this.name,
          discoveredInPhase: "enrichment",
          discoveryTier: "probable",
        });
      }

      // Annotate and reclassify targets
      this.annotateTargets(addresses, block.address, input, enrichments, reclassifications, splits);
    }

    return { enrichments, newGraphEdges, reclassifications, splits };
  }

  /**
   * Annotate target blocks referenced by an address table.
   * Reclassifies unknown targets based on what the majority of targets are.
   * Splits blocks when a target address falls mid-block.
   */
  private annotateTargets(
    addresses: number[],
    tableAddr: number,
    input: EnrichmentInput,
    enrichments: REBlockEnrichment[],
    reclassifications: BlockReclassification[],
    splits: BlockSplitRequest[],
  ): void {
    let codeCount = 0;
    let dataCount = 0;
    for (const addr of addresses) {
      const block = input.blocks.find(b => b.address === addr);
      if (!block) continue;
      if (block.type === "subroutine" || block.type === "irq_handler" || block.type === "fragment") {
        codeCount++;
      } else if (block.type === "data") {
        dataCount++;
      }
    }

    const majorityIsCode = codeCount > dataCount && codeCount > 0;

    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      const exactBlock = input.blocks.find(b => b.address === addr);

      if (exactBlock) {
        enrichments.push({
          blockAddress: addr,
          source: this.name,
          type: "resolved_target",
          annotation: `Target of address table at $${hex(tableAddr)} (entry ${i + 1} of ${addresses.length})`,
          data: {
            sourceTable: tableAddr,
            tableIndex: i,
            tableSize: addresses.length,
            sourcePlugin: this.name,
          },
        });

        if (exactBlock.type === "unknown") {
          if (majorityIsCode) {
            reclassifications.push({
              blockAddress: addr,
              newType: "subroutine",
              reason: `Address table at $${hex(tableAddr)}: ${codeCount}/${addresses.length} targets are code`,
            });
          } else if (dataCount > codeCount) {
            reclassifications.push({
              blockAddress: addr,
              newType: "data",
              reason: `Address table at $${hex(tableAddr)}: ${dataCount}/${addresses.length} targets are data`,
            });
          }
        }
      } else {
        const containing = input.blocks.find(
          b => addr > b.address && addr < b.endAddress,
        );
        if (containing) {
          splits.push({
            blockAddress: containing.address,
            splitAt: addr,
            reason: `Address table at $${hex(tableAddr)} entry ${i + 1} targets mid-block at $${hex(addr)}`,
          });
        }
      }
    }
  }

  private tryParseWordTable(block: Block, input: EnrichmentInput): number[] {
    const size = block.endAddress - block.address;
    const entryCount = size / 2;
    const addresses: number[] = [];

    // Read as little-endian word pairs
    let validCount = 0;
    for (let i = 0; i < entryCount; i++) {
      const lo = input.memory[block.address + i * 2];
      const hi = input.memory[block.address + i * 2 + 1];
      const addr = (hi << 8) | lo;

      // Sanity: addresses should be in reasonable program range
      if (addr >= 0x0200 && addr <= 0xFFF0) {
        addresses.push(addr);
        // Extra confidence if it matches a known block start
        if (input.blocks.some(b => b.address === addr)) {
          validCount++;
        }
      } else {
        addresses.push(addr); // Still include but won't match
      }
    }

    // Require at least 50% of entries to match known blocks
    // or all entries to be in valid program range
    const allInRange = addresses.every(a => a >= 0x0200 && a <= 0xFFF0);
    if (validCount >= entryCount * 0.5 || (allInRange && entryCount >= 3)) {
      return addresses.filter(a => a >= 0x0200 && a <= 0xFFF0);
    }

    return [];
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
