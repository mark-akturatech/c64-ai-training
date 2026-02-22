// ============================================================================
// Copy Loop Enrichment (Priority 50)
//
// Detects memory copy and fill loops:
//   Direct: LDA source,X / STA dest,X / INX / BNE
//   Indirect: LDA ($ZP),Y / STA ($ZP),Y / INY / BNE
//   Fill: LDA #imm / STA dest,X / INX / BNE
// Identifies source, destination, size, and direction.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

interface CopyLoopInfo {
  type: "copy" | "fill";
  sourceAddress: number | null;
  destAddress: number | null;
  indexRegister: "X" | "Y";
  addressing: "absolute_indexed" | "indirect_indexed" | "zero_page_indexed";
  fillValue: number | null;
  instructionAddress: number;
}

export class CopyLoopEnrichment implements EnrichmentPlugin {
  name = "copy_loop";
  priority = 50;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const loops = this.detectCopyLoops(block.instructions);
      for (const loop of loops) {
        const desc = loop.type === "copy"
          ? `Memory copy: $${hexOrQ(loop.sourceAddress)} → $${hexOrQ(loop.destAddress)} (${loop.indexRegister}-indexed)`
          : `Memory fill: $${hexOrQ(loop.destAddress)} with $${loop.fillValue?.toString(16).toUpperCase().padStart(2, "0") ?? "??"} (${loop.indexRegister}-indexed)`;

        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "pattern",
          annotation: desc,
          data: {
            loopType: loop.type,
            sourceAddress: loop.sourceAddress,
            destAddress: loop.destAddress,
            indexRegister: loop.indexRegister,
            addressing: loop.addressing,
            fillValue: loop.fillValue,
            instructionAddress: loop.instructionAddress,
          },
        });
      }
    }

    return { enrichments };
  }

  private detectCopyLoops(insts: BlockInstruction[]): CopyLoopInfo[] {
    const results: CopyLoopInfo[] = [];

    // Look for backward branches (loop indicators)
    for (let i = 0; i < insts.length; i++) {
      const mn = insts[i].mnemonic.toLowerCase();
      if (mn !== "bne" && mn !== "bpl" && mn !== "bcc") continue;

      // This is a potential loop terminator — look back for LDA/STA + index pattern
      const loopBody = this.findLoopBody(insts, i);
      if (!loopBody) continue;

      results.push(loopBody);
    }

    return results;
  }

  private findLoopBody(insts: BlockInstruction[], branchIdx: number): CopyLoopInfo | null {
    // Look back up to 8 instructions for the loop body
    const start = Math.max(0, branchIdx - 8);

    let loadAddr: number | null = null;
    let storeAddr: number | null = null;
    let loadAddrMode: string | null = null;
    let storeAddrMode: string | null = null;
    let indexReg: "X" | "Y" | null = null;
    let isImmediateLoad = false;
    let immValue: number | null = null;

    for (let i = start; i < branchIdx; i++) {
      const mn = insts[i].mnemonic.toLowerCase();
      const mode = insts[i].addressingMode;

      // LDA with indexed addressing
      if (mn === "lda") {
        if (mode === "immediate") {
          isImmediateLoad = true;
          immValue = this.parseImmediate(insts[i]);
          loadAddr = null;
        } else if (mode === "absolute_x" || mode === "absolute_y" ||
                   mode === "zero_page_x" || mode === "zero_page_y") {
          loadAddr = this.parseBaseAddress(insts[i]);
          loadAddrMode = mode;
          indexReg = mode.endsWith("_x") ? "X" : "Y";
          isImmediateLoad = false;
        } else if (mode === "indirect_y") {
          loadAddr = this.parseZPPointer(insts[i]);
          loadAddrMode = mode;
          indexReg = "Y";
          isImmediateLoad = false;
        }
      }

      // STA with indexed addressing
      if (mn === "sta") {
        if (mode === "absolute_x" || mode === "absolute_y" ||
            mode === "zero_page_x" || mode === "zero_page_y") {
          storeAddr = this.parseBaseAddress(insts[i]);
          storeAddrMode = mode;
          if (!indexReg) indexReg = mode.endsWith("_x") ? "X" : "Y";
        } else if (mode === "indirect_y") {
          storeAddr = this.parseZPPointer(insts[i]);
          storeAddrMode = mode;
          if (!indexReg) indexReg = "Y";
        }
      }

      // Index register changes
      if (mn === "inx" || mn === "dex") indexReg = "X";
      if (mn === "iny" || mn === "dey") indexReg = "Y";
    }

    if (!indexReg) return null;
    if (storeAddr === null && loadAddr === null) return null;

    if (isImmediateLoad && storeAddr !== null) {
      return {
        type: "fill",
        sourceAddress: null,
        destAddress: storeAddr,
        indexRegister: indexReg,
        addressing: this.classifyAddressing(storeAddrMode),
        fillValue: immValue,
        instructionAddress: insts[start].address,
      };
    }

    if (loadAddr !== null && storeAddr !== null) {
      return {
        type: "copy",
        sourceAddress: loadAddr,
        destAddress: storeAddr,
        indexRegister: indexReg,
        addressing: this.classifyAddressing(loadAddrMode),
        fillValue: null,
        instructionAddress: insts[start].address,
      };
    }

    return null;
  }

  private classifyAddressing(mode: string | null): "absolute_indexed" | "indirect_indexed" | "zero_page_indexed" {
    if (mode?.startsWith("indirect")) return "indirect_indexed";
    if (mode?.startsWith("zero_page")) return "zero_page_indexed";
    return "absolute_indexed";
  }

  private parseBaseAddress(inst: BlockInstruction): number | null {
    // Strip index register suffix from operand: $1234,X → $1234
    const match = inst.operand.match(/^\$([0-9a-fA-F]+)/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private parseZPPointer(inst: BlockInstruction): number | null {
    // ($FB),Y → $FB
    const match = inst.operand.match(/\(\$([0-9a-fA-F]{2})\)/);
    if (match) return parseInt(match[1], 16);
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

function hexOrQ(addr: number | null): string {
  if (addr === null) return "????";
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
