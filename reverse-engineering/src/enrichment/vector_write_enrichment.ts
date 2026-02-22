// ============================================================================
// Vector Write Enrichment (Priority 27)
//
// Detects writes to known IRQ/NMI/BRK vector locations:
//   $0314/$0315 = IRQ vector
//   $0316/$0317 = BRK vector
//   $0318/$0319 = NMI vector
//   $FFFE/$FFFF = hardware IRQ vector
// Uses constant propagation to resolve target addresses and adds graph edges.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  DependencyGraphEdge,
} from "../types.js";

const VECTOR_MAP: Record<number, { name: string; pairAddr: number; isLow: boolean }> = {
  0x0314: { name: "IRQ", pairAddr: 0x0315, isLow: true },
  0x0315: { name: "IRQ", pairAddr: 0x0314, isLow: false },
  0x0316: { name: "BRK", pairAddr: 0x0317, isLow: true },
  0x0317: { name: "BRK", pairAddr: 0x0316, isLow: false },
  0x0318: { name: "NMI", pairAddr: 0x0319, isLow: true },
  0x0319: { name: "NMI", pairAddr: 0x0318, isLow: false },
  0xFFFE: { name: "HW_IRQ", pairAddr: 0xFFFF, isLow: true },
  0xFFFF: { name: "HW_IRQ", pairAddr: 0xFFFE, isLow: false },
};

export class VectorWriteEnrichment implements EnrichmentPlugin {
  name = "vector_write";
  priority = 27;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const newGraphEdges: DependencyGraphEdge[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      // Track pending vector writes: vectorName → { lo, hi, instAddr }
      const pendingWrites = new Map<string, { lo: number | null; hi: number | null; instAddr: number }>();

      // Track A register for LDA #imm / STA pattern
      let aValue: number | null = null;

      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();

        if (mn === "lda" && inst.addressingMode === "immediate") {
          aValue = this.parseImmediate(inst);
        } else if (mn === "ldx" || mn === "ldy") {
          // Don't reset A on other loads
        } else if (mn === "sta" || mn === "stx" || mn === "sty") {
          const target = this.parseStoreTarget(inst);
          if (target !== null && VECTOR_MAP[target]) {
            const vec = VECTOR_MAP[target];
            const value = (mn === "sta") ? aValue : null;

            let pending = pendingWrites.get(vec.name);
            if (!pending) {
              pending = { lo: null, hi: null, instAddr: inst.address };
              pendingWrites.set(vec.name, pending);
            }

            if (vec.isLow) {
              pending.lo = value;
            } else {
              pending.hi = value;
            }

            // If we have both bytes, resolve the vector target
            if (pending.lo !== null && pending.hi !== null) {
              const targetAddr = (pending.hi << 8) | pending.lo;
              const nodeId = this.blockToNodeId(block);

              enrichments.push({
                blockAddress: block.address,
                source: this.name,
                type: "vector_write",
                annotation: `Sets ${vec.name} vector to $${hex(targetAddr)}`,
                data: {
                  vectorName: vec.name,
                  targetAddress: targetAddr,
                  instructionAddress: pending.instAddr,
                },
              });

              newGraphEdges.push({
                source: nodeId,
                target: targetAddr,
                type: "vector_write",
                category: "control_flow",
                sourceInstruction: pending.instAddr,
                confidence: 95,
                discoveredBy: this.name,
                discoveredInPhase: "enrichment",
                discoveryTier: "confirmed",
              });

              pendingWrites.delete(vec.name);
            }
          } else {
            // Non-vector store — reset A tracking
            if (mn === "sta") aValue = null;
          }
        } else if (mn === "tax" || mn === "tay") {
          // A still valid
        } else if (mn !== "sei" && mn !== "cli" && mn !== "nop" && mn !== "pha") {
          // Most other instructions clobber A or change flow
          if (mn !== "stx" && mn !== "sty" && mn !== "inx" && mn !== "dex" &&
              mn !== "iny" && mn !== "dey" && mn !== "php" && mn !== "clc" &&
              mn !== "sec" && mn !== "cld" && mn !== "sed" && mn !== "clv") {
            aValue = null;
          }
        }
      }
    }

    return { enrichments, newGraphEdges };
  }

  private parseImmediate(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "immediate") return null;
    const match = inst.operand.match(/^#\$([0-9a-fA-F]{1,2})$/);
    if (match) return parseInt(match[1], 16);
    const decMatch = inst.operand.match(/^#(\d+)$/);
    if (decMatch) return parseInt(decMatch[1], 10);
    return null;
  }

  private parseStoreTarget(inst: BlockInstruction): number | null {
    const match = inst.operand.match(/^\$([0-9a-fA-F]+)$/);
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
