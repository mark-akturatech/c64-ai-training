// ============================================================================
// RTS Dispatch Enrichment (Priority 30)
//
// Detects RTS-as-jump pattern: push address high byte, push low byte, RTS.
// The 6502 RTS pops address and adds 1, so the pushed value should be
// target - 1. Resolves the target and adds control flow edges.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  DependencyGraphEdge,
} from "../types.js";

export class RtsDispatchEnrichment implements EnrichmentPlugin {
  name = "rts_dispatch";
  priority = 30;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];
    const newGraphEdges: DependencyGraphEdge[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const insts = block.instructions;
      for (let i = 0; i < insts.length; i++) {
        if (insts[i].mnemonic.toLowerCase() !== "rts") continue;

        // Look back for PHA/PHA pattern (push hi then lo, or variants)
        const dispatch = this.findPushPattern(insts, i);
        if (!dispatch) continue;

        // RTS adds 1 to the popped address
        const targetAddr = (dispatch.pushedAddr + 1) & 0xFFFF;
        const nodeId = this.blockToNodeId(block);

        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "resolved_target",
          annotation: `RTS dispatch → $${hex(targetAddr)} (pushed $${hex(dispatch.pushedAddr)})`,
          data: {
            instructionAddress: insts[i].address,
            targetAddress: targetAddr,
            pushedAddress: dispatch.pushedAddr,
            patternStart: dispatch.patternStart,
          },
        });

        newGraphEdges.push({
          source: nodeId,
          target: targetAddr,
          type: "rts_dispatch",
          category: "control_flow",
          sourceInstruction: insts[i].address,
          confidence: dispatch.confidence,
          discoveredBy: this.name,
          discoveredInPhase: "enrichment",
          discoveryTier: dispatch.confidence >= 80 ? "confirmed" : "probable",
        });
      }
    }

    return { enrichments, newGraphEdges };
  }

  private findPushPattern(
    insts: BlockInstruction[],
    rtsIdx: number,
  ): { pushedAddr: number; patternStart: number; confidence: number } | null {
    // Pattern 1: LDA #hi / PHA / LDA #lo / PHA / RTS
    // Look back up to 8 instructions
    const pushes: Array<{ value: number | null; idx: number }> = [];
    let aValue: number | null = null;

    for (let i = Math.max(0, rtsIdx - 8); i < rtsIdx; i++) {
      const mn = insts[i].mnemonic.toLowerCase();

      if (mn === "lda" && insts[i].addressingMode === "immediate") {
        aValue = this.parseImmediate(insts[i]);
      } else if (mn === "pha") {
        pushes.push({ value: aValue, idx: i });
      } else if (mn === "sta" || mn === "jsr" || mn === "rts" || mn === "rti") {
        // Break on store or flow change
        pushes.length = 0;
        aValue = null;
      }
    }

    // Need exactly 2 pushes with known values: first = hi, second = lo
    if (pushes.length >= 2) {
      const hiPush = pushes[pushes.length - 2];
      const loPush = pushes[pushes.length - 1];

      if (hiPush.value !== null && loPush.value !== null) {
        const addr = (hiPush.value << 8) | loPush.value;
        return {
          pushedAddr: addr,
          patternStart: insts[hiPush.idx].address,
          confidence: 90,
        };
      }
    }

    return null;
  }

  private parseImmediate(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "immediate") return null;
    const match = inst.operand.match(/^#\$([0-9a-fA-F]{1,2})$/);
    if (match) return parseInt(match[1], 16);
    const decMatch = inst.operand.match(/^#(\d+)$/);
    if (decMatch) return parseInt(decMatch[1], 10);
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
