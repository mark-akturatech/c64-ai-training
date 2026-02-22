// ============================================================================
// Shared Data Enrichment (Priority 70)
//
// Identifies data referenced by multiple code blocks. Annotates as shared state.
// Flags potential race conditions: data modified by mainline AND IRQ handler
// without SEI protection.
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

export class SharedDataEnrichment implements EnrichmentPlugin {
  name = "shared_data";
  priority = 70;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Find IRQ handler nodes
    const irqNodeIds = new Set<string>();
    for (const block of input.blocks) {
      if (block.isIrqHandler) {
        irqNodeIds.add(this.blockToNodeId(block));
      }
    }
    for (const edge of input.graph.getEdges()) {
      if (edge.type === "vector_write") {
        const targetNode = this.findNodeForAddress(edge.target, input);
        if (targetNode) irqNodeIds.add(targetNode);
      }
    }

    // Build data address → accessing nodes map
    const dataAccessors = new Map<number, { readers: Set<string>; writers: Set<string> }>();

    for (const edge of input.graph.getEdges()) {
      if (edge.type !== "data_read" && edge.type !== "data_write") continue;
      // Skip I/O
      if (edge.target >= 0xD000 && edge.target <= 0xDFFF) continue;

      let entry = dataAccessors.get(edge.target);
      if (!entry) {
        entry = { readers: new Set(), writers: new Set() };
        dataAccessors.set(edge.target, entry);
      }

      if (edge.type === "data_read") {
        entry.readers.add(edge.source);
      } else {
        entry.writers.add(edge.source);
      }
    }

    // Find shared data (accessed by multiple distinct blocks)
    for (const [addr, accessors] of dataAccessors) {
      const allAccessors = new Set([...accessors.readers, ...accessors.writers]);
      if (allAccessors.size < 2) continue;

      // Check for race conditions
      const mainlineWriters = [...accessors.writers].filter(id => !irqNodeIds.has(id));
      const irqWriters = [...accessors.writers].filter(id => irqNodeIds.has(id));
      const irqReaders = [...accessors.readers].filter(id => irqNodeIds.has(id));

      const hasRaceCondition =
        (mainlineWriters.length > 0 && (irqWriters.length > 0 || irqReaders.length > 0)) ||
        (irqWriters.length > 0 && accessors.readers.size > irqReaders.length);

      // Find the owning data block
      const dataBlock = input.blocks.find(b =>
        (b.type === "data" || b.type === "unknown") &&
        addr >= b.address && addr < b.endAddress
      );

      if (dataBlock) {
        const parts = [`shared by ${allAccessors.size} blocks`];
        if (hasRaceCondition) {
          parts.push("POTENTIAL RACE: mainline + IRQ access without SEI");
        }

        enrichments.push({
          blockAddress: dataBlock.address,
          source: this.name,
          type: "annotation",
          annotation: `Shared data at $${hex(addr)}: ${parts.join("; ")}`,
          data: {
            dataAddress: addr,
            accessorCount: allAccessors.size,
            readerCount: accessors.readers.size,
            writerCount: accessors.writers.size,
            hasRaceCondition,
            mainlineWriters: mainlineWriters.length,
            irqWriters: irqWriters.length,
          },
        });
      }
    }

    return { enrichments };
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }

  private findNodeForAddress(addr: number, input: EnrichmentInput): string | null {
    for (const node of input.graph.getNodes().values()) {
      if (node.start === addr) return node.id;
    }
    return null;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
