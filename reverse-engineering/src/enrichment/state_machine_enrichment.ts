// ============================================================================
// State Machine Enrichment (Priority 48)
//
// Detects state machine patterns: a state variable (typically ZP or fixed
// address) read followed by dispatch via comparison chain (CMP/BEQ),
// indexed jump table (JMP (table,X)), or computed branch.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

interface StateDispatch {
  stateVarAddress: number;
  dispatchType: "comparison_chain" | "indexed_jump" | "computed_branch";
  stateValues: number[];
  instructionAddress: number;
}

export class StateMachineEnrichment implements EnrichmentPlugin {
  name = "state_machine";
  priority = 48;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const dispatches = this.detectStateMachine(block.instructions);
      for (const dispatch of dispatches) {
        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "pattern",
          annotation: `State machine: var=$${hex(dispatch.stateVarAddress)}, ${dispatch.stateValues.length} states (${dispatch.dispatchType})`,
          data: {
            stateVarAddress: dispatch.stateVarAddress,
            dispatchType: dispatch.dispatchType,
            stateValues: dispatch.stateValues,
            instructionAddress: dispatch.instructionAddress,
          },
        });
      }
    }

    return { enrichments };
  }

  private detectStateMachine(insts: BlockInstruction[]): StateDispatch[] {
    const results: StateDispatch[] = [];

    // Pattern: LDA $addr / CMP #$00 / BEQ ... / CMP #$01 / BEQ ... / CMP #$02 / BEQ ...
    for (let i = 0; i < insts.length; i++) {
      const mn = insts[i].mnemonic.toLowerCase();
      if (mn !== "lda") continue;

      const stateAddr = this.parseMemoryTarget(insts[i]);
      if (stateAddr === null) continue;

      // Count consecutive CMP #imm / BEQ patterns
      const stateValues: number[] = [];
      let j = i + 1;
      while (j < insts.length - 1) {
        const cmpMn = insts[j].mnemonic.toLowerCase();
        if (cmpMn !== "cmp") break;
        if (insts[j].addressingMode !== "immediate") break;

        const cmpVal = this.parseImmediate(insts[j]);
        if (cmpVal === null) break;

        const branchMn = insts[j + 1].mnemonic.toLowerCase();
        if (branchMn !== "beq" && branchMn !== "bne" && branchMn !== "bcc" && branchMn !== "bcs") break;

        stateValues.push(cmpVal);
        j += 2;
      }

      if (stateValues.length >= 3) {
        results.push({
          stateVarAddress: stateAddr,
          dispatchType: "comparison_chain",
          stateValues,
          instructionAddress: insts[i].address,
        });
      }
    }

    return results;
  }

  private parseMemoryTarget(inst: BlockInstruction): number | null {
    // Accept zero_page and absolute addressing
    if (inst.addressingMode === "zero_page" || inst.addressingMode === "absolute") {
      const match = inst.operand.match(/^\$([0-9a-fA-F]+)$/);
      if (match) return parseInt(match[1], 16);
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
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
