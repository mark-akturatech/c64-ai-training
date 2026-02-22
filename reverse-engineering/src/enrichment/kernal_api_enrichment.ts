// ============================================================================
// KERNAL API Enrichment (Priority 15)
//
// Identify JSR targets that hit known KERNAL ROM entry points.
// Banking-aware: only labels as KERNAL if bankingState.kernalMapped !== "no".
// Uses banking_resolver to decide label: CHROUT (mapped), ram_FFD2 (banked
// out), maybe_CHROUT (unknown).
//
// Writes to enrichment.semanticLabels — the builder applies these directly.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  BankingSnapshot,
} from "../types.js";
import { SymbolDB } from "../shared/symbol_db.js";
import { resolveLabelForAddress } from "../shared/banking_resolver.js";
import {
  bitmaskFromImm,
  registerFromImm,
} from "../bitmask_value.js";

const symbolDb = new SymbolDB();

// Default C64 banking state ($01 = $37)
const DEFAULT_BANKING: BankingSnapshot = {
  cpuPort: registerFromImm(0x37, "default"),
  vicBank: registerFromImm(0x03, "default"),
  vicMemPtr: registerFromImm(0x14, "default"),
  kernalMapped: "yes",
  basicMapped: "yes",
  ioMapped: "yes",
  chargenMapped: "no",
};

export class KernalApiEnrichment implements EnrichmentPlugin {
  name = "kernal_api";
  priority = 15;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      // Get banking state for this block from the graph
      const nodeId = this.blockToNodeId(block);
      const graphNode = input.graph.getNode(nodeId);
      const banking = graphNode?.bankingState?.onEntry ?? DEFAULT_BANKING;

      for (const inst of block.instructions) {
        if (inst.mnemonic.toLowerCase() !== "jsr") continue;

        const target = this.parseAbsoluteTarget(inst);
        if (target === null) continue;

        // Only interested in KERNAL range
        if (target < 0xE000 || target > 0xFFFF) continue;

        const resolved = resolveLabelForAddress(target, banking);
        if (!resolved) continue;

        const sym = symbolDb.lookup(target);
        const isKernalCall = sym?.category === "kernal" && banking.kernalMapped !== "no";

        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: isKernalCall ? "api_call" : "annotation",
          annotation: `JSR ${resolved.label} — ${resolved.description}`,
          data: {
            instructionAddress: inst.address,
            targetAddress: target,
            label: resolved.label,
            description: resolved.description,
            confidence: resolved.confidence,
            kernalMapped: banking.kernalMapped,
            isKernalCall,
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

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }
}
