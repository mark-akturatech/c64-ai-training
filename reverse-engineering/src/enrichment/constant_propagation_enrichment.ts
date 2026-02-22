// ============================================================================
// Constant Propagation Enrichment (Priority 10)
//
// Trace immediate values through LDA/LDX/LDY → STA/STX/STY chains within
// a block. Build a map of "at instruction X, register A/X/Y holds value V".
// Handles TAX/TAY/TXA/TYA register transfers.
//
// This is intra-block only — inter-procedural propagation is in priority 18.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

interface RegisterState {
  a: number | null;  // null = unknown
  x: number | null;
  y: number | null;
}

export class ConstantPropagationEnrichment implements EnrichmentPlugin {
  name = "constant_propagation";
  priority = 10;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const blockEnrichments = this.analyzeBlock(block);
      enrichments.push(...blockEnrichments);
    }

    return { enrichments };
  }

  private analyzeBlock(block: Block): REBlockEnrichment[] {
    const enrichments: REBlockEnrichment[] = [];
    const state: RegisterState = { a: null, x: null, y: null };

    for (const inst of block.instructions!) {
      const operandValue = this.parseImmediateOperand(inst);

      switch (inst.mnemonic.toLowerCase()) {
        // Load immediate
        case "lda":
          if (inst.addressingMode === "immediate" && operandValue !== null) {
            state.a = operandValue;
          } else {
            state.a = null; // unknown after memory load
          }
          break;
        case "ldx":
          if (inst.addressingMode === "immediate" && operandValue !== null) {
            state.x = operandValue;
          } else {
            state.x = null;
          }
          break;
        case "ldy":
          if (inst.addressingMode === "immediate" && operandValue !== null) {
            state.y = operandValue;
          } else {
            state.y = null;
          }
          break;

        // Store — record known value at store target
        case "sta":
          if (state.a !== null) {
            enrichments.push(this.makeEnrichment(block.address, inst, "A", state.a));
          }
          break;
        case "stx":
          if (state.x !== null) {
            enrichments.push(this.makeEnrichment(block.address, inst, "X", state.x));
          }
          break;
        case "sty":
          if (state.y !== null) {
            enrichments.push(this.makeEnrichment(block.address, inst, "Y", state.y));
          }
          break;

        // Register transfers
        case "tax": state.x = state.a; break;
        case "tay": state.y = state.a; break;
        case "txa": state.a = state.x; break;
        case "tya": state.a = state.y; break;

        // Increment/decrement — lose track
        case "inx": state.x = state.x !== null ? (state.x + 1) & 0xFF : null; break;
        case "dex": state.x = state.x !== null ? (state.x - 1) & 0xFF : null; break;
        case "iny": state.y = state.y !== null ? (state.y + 1) & 0xFF : null; break;
        case "dey": state.y = state.y !== null ? (state.y - 1) & 0xFF : null; break;
        case "inc":
        case "dec":
          // INC/DEC memory doesn't affect A/X/Y
          break;

        // Arithmetic on A — lose precision unless we track fully
        case "adc":
        case "sbc":
        case "and":
        case "ora":
        case "eor":
        case "asl":
        case "lsr":
        case "rol":
        case "ror":
          if (inst.addressingMode === "accumulator" || inst.addressingMode === "implied") {
            // Accumulator shifts — could track but simplify for now
            state.a = null;
          } else if (inst.addressingMode === "immediate" && operandValue !== null && state.a !== null) {
            // Known A + known immediate — compute result
            state.a = this.applyArithmetic(inst.mnemonic.toLowerCase(), state.a, operandValue);
          } else {
            state.a = null;
          }
          break;

        // Stack operations — lose A
        case "pha": break; // A still valid
        case "pla": state.a = null; break;

        // Branches/jumps don't invalidate within a basic block walk,
        // but for simplicity we just do a linear scan
        case "jsr":
          // JSR clobbers nothing in caller's register state for now
          // (inter-procedural handles this at priority 18)
          break;

        // Return instructions
        case "rts":
        case "rti":
          break;
      }
    }

    return enrichments;
  }

  private applyArithmetic(mnemonic: string, a: number, imm: number): number | null {
    switch (mnemonic) {
      case "and": return a & imm;
      case "ora": return a | imm;
      case "eor": return (a ^ imm) & 0xFF;
      default: return null; // ADC/SBC need carry flag — too complex for simple propagation
    }
  }

  private parseImmediateOperand(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "immediate") return null;
    const match = inst.operand.match(/^#\$([0-9a-fA-F]{1,2})$/);
    if (match) return parseInt(match[1], 16);
    const decMatch = inst.operand.match(/^#(\d+)$/);
    if (decMatch) return parseInt(decMatch[1], 10);
    return null;
  }

  private makeEnrichment(
    blockAddress: number,
    inst: BlockInstruction,
    register: string,
    value: number,
  ): REBlockEnrichment {
    const targetAddr = this.parseStoreTarget(inst);
    return {
      blockAddress,
      source: this.name,
      type: "annotation",
      annotation: `${register}=${formatHex(value)} at ${inst.mnemonic} ${inst.operand}`,
      data: {
        instructionAddress: inst.address,
        register,
        value,
        targetAddress: targetAddr,
        mnemonic: inst.mnemonic,
      },
    };
  }

  private parseStoreTarget(inst: BlockInstruction): number | null {
    const match = inst.operand.match(/^\$([0-9a-fA-F]+)/);
    if (match) return parseInt(match[1], 16);
    return null;
  }
}

function formatHex(v: number): string {
  return "$" + v.toString(16).toUpperCase().padStart(2, "0");
}
