// ============================================================================
// Indirect Jump Enrichment (Priority 25)
//
// Resolves JMP ($xxxx) indirect jump instructions using constant propagation
// and pointer pair results. Adds graph edges for resolved targets.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  DependencyGraphEdge,
} from "../types.js";

export class IndirectJmpEnrichment implements EnrichmentPlugin {
  name = "indirect_jmp";
  priority = 25;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const newGraphEdges: DependencyGraphEdge[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      for (const inst of block.instructions) {
        if (inst.mnemonic.toLowerCase() !== "jmp") continue;
        if (inst.addressingMode !== "indirect") continue;

        const vectorAddr = this.parseIndirectTarget(inst);
        if (vectorAddr === null) continue;

        // Read the 16-bit pointer from memory
        const lo = input.memory[vectorAddr];
        const hi = input.memory[vectorAddr + 1];
        const targetAddr = (hi << 8) | lo;

        const nodeId = this.blockToNodeId(block);

        if (targetAddr >= 0x0200 && targetAddr <= 0xFFF0) {
          // Check if target is a known block
          const targetBlock = input.blocks.find(b => b.address === targetAddr);
          const confidence = targetBlock ? 90 : 60;

          enrichments.push({
            blockAddress: block.address,
            source: this.name,
            type: "resolved_target",
            annotation: `JMP ($${hex(vectorAddr)}) → $${hex(targetAddr)}`,
            data: {
              instructionAddress: inst.address,
              vectorAddress: vectorAddr,
              targetAddress: targetAddr,
              confidence,
            },
          });

          newGraphEdges.push({
            source: nodeId,
            target: targetAddr,
            type: "indirect_jump",
            category: "control_flow",
            sourceInstruction: inst.address,
            confidence,
            discoveredBy: this.name,
            discoveredInPhase: "enrichment",
            discoveryTier: confidence >= 80 ? "confirmed" : "probable",
          });
        } else {
          // Unresolvable — the vector may be set dynamically
          enrichments.push({
            blockAddress: block.address,
            source: this.name,
            type: "annotation",
            annotation: `JMP ($${hex(vectorAddr)}) — dynamic target (vector at $${hex(vectorAddr)})`,
            data: {
              instructionAddress: inst.address,
              vectorAddress: vectorAddr,
              dynamic: true,
            },
          });
        }
      }
    }

    return { enrichments, newGraphEdges };
  }

  private parseIndirectTarget(inst: BlockInstruction): number | null {
    // JMP ($xxxx) — operand is ($xxxx)
    const match = inst.operand.match(/\(\$([0-9a-fA-F]{4})\)/);
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
