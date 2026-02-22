// ============================================================================
// Self-Modifying Code Target Enrichment (Priority 32)
//
// Detects self-modifying code (SMC): STA/STX/STY writes into operand bytes
// of code blocks. This is common in C64 programs for dynamic address patching.
// Adds smc_write edges to the graph.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  DependencyGraphEdge,
} from "../types.js";

export class SmcTargetEnrichment implements EnrichmentPlugin {
  name = "smc_target";
  priority = 32;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const newGraphEdges: DependencyGraphEdge[] = [];

    // Build a set of code block address ranges for fast lookup
    const codeRanges: Array<{ start: number; end: number; block: Block }> = [];
    for (const block of input.blocks) {
      if (block.type !== "data" && block.type !== "unknown") {
        codeRanges.push({ start: block.address, end: block.endAddress, block });
      }
    }

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();
        if (mn !== "sta" && mn !== "stx" && mn !== "sty") continue;

        const target = this.parseAbsoluteTarget(inst) ?? this.parseZPTarget(inst);
        if (target === null) continue;

        // Skip I/O and vector addresses — those are handled by other plugins
        if (target >= 0xD000 && target <= 0xDFFF) continue;
        if (target >= 0x0314 && target <= 0x0319) continue;

        // Check if the store target falls within a code block
        const targetCodeBlock = codeRanges.find(r =>
          target >= r.start && target < r.end
        );

        if (targetCodeBlock) {
          const nodeId = this.blockToNodeId(block);
          const targetNodeId = this.blockToNodeId(targetCodeBlock.block);

          enrichments.push({
            blockAddress: block.address,
            source: this.name,
            type: "annotation",
            annotation: `SMC: ${mn.toUpperCase()} writes to code at $${hex(target)} (in block $${hex(targetCodeBlock.start)})`,
            data: {
              instructionAddress: inst.address,
              smcTargetAddress: target,
              targetBlockAddress: targetCodeBlock.start,
              isSelfModifying: true,
            },
          });

          newGraphEdges.push({
            source: nodeId,
            target: target,
            targetNodeId: nodeId === targetNodeId ? undefined : targetNodeId,
            type: "smc_write",
            category: "data",
            sourceInstruction: inst.address,
            confidence: 85,
            discoveredBy: this.name,
            discoveredInPhase: "enrichment",
            discoveryTier: "confirmed",
          });
        }
      }
    }

    return { enrichments, newGraphEdges };
  }

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private parseZPTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "zero_page") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{2})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
