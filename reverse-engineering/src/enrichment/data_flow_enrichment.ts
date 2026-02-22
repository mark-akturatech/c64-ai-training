// ============================================================================
// Data Flow Enrichment (Priority 65)
//
// Tracks data flow between blocks — which code blocks write/read each data
// block. Identifies "write-once" tables vs "read-write" state.
// Builds data usage records with access patterns.
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

interface DataUsageRecord {
  dataAddress: number;
  readers: Array<{ nodeId: string; instAddr: number; mode: string }>;
  writers: Array<{ nodeId: string; instAddr: number; mode: string }>;
  accessPattern: "sequential" | "random" | "indexed" | "indirect" | "constant";
}

export class DataFlowEnrichment implements EnrichmentPlugin {
  name = "data_flow";
  priority = 65;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Build data usage records from graph edges
    const usageMap = new Map<number, DataUsageRecord>();

    for (const edge of input.graph.getEdges()) {
      if (edge.type !== "data_read" && edge.type !== "data_write" &&
          edge.type !== "hardware_read" && edge.type !== "hardware_write") continue;

      // Skip I/O registers — handled by register_semantics
      if (edge.target >= 0xD000 && edge.target <= 0xDFFF) continue;

      let record = usageMap.get(edge.target);
      if (!record) {
        record = {
          dataAddress: edge.target,
          readers: [],
          writers: [],
          accessPattern: "constant",
        };
        usageMap.set(edge.target, record);
      }

      const entry = {
        nodeId: edge.source,
        instAddr: edge.sourceInstruction,
        mode: edge.type,
      };

      if (edge.type === "data_read" || edge.type === "hardware_read") {
        record.readers.push(entry);
      } else {
        record.writers.push(entry);
      }
    }

    // Classify access patterns and emit enrichments
    for (const [addr, record] of usageMap) {
      // Determine access pattern
      if (record.writers.length === 0) {
        record.accessPattern = "constant";
      } else if (record.writers.length === 1 && record.readers.length > 0) {
        record.accessPattern = "sequential";
      } else if (record.writers.length > 1) {
        record.accessPattern = "random";
      }

      // Find the data block this address belongs to
      const dataBlock = input.blocks.find(b =>
        (b.type === "data" || b.type === "unknown") &&
        addr >= b.address && addr < b.endAddress
      );

      const isWriteOnce = record.writers.length <= 1;
      const isShared = record.readers.length + record.writers.length > 1;

      if (dataBlock) {
        enrichments.push({
          blockAddress: dataBlock.address,
          source: this.name,
          type: "data_semantic",
          annotation: `Data flow: ${record.readers.length} reader(s), ${record.writers.length} writer(s) — ${isWriteOnce ? "write-once" : "read-write"}`,
          data: {
            dataAddress: addr,
            readerCount: record.readers.length,
            writerCount: record.writers.length,
            accessPattern: record.accessPattern,
            isWriteOnce,
            isShared,
            readers: record.readers.map(r => r.nodeId),
            writers: record.writers.map(w => w.nodeId),
          },
        });
      }
    }

    return { enrichments };
  }
}
