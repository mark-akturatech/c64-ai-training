// ============================================================================
// General Code Discoverer
// Scans orphan regions for valid 6502 instruction sequences that the tree
// walker couldn't reach from known entry points.
// Finds "code islands" — stretches of valid instructions bounded by
// terminators (RTS/RTI/JMP) or invalid bytes.
// ============================================================================

import { decode } from "../opcode_decoder.js";
import type { EntryPoint } from "../types.js";
import type { CodeDiscoveryContext, CodeDiscoveryPlugin } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const MIN_CODE_BYTES = 6;
const MIN_INSTRUCTIONS = 3;
const MIN_CONFIDENCE = 50;

// Opcodes that halt/crash — end a code island
const JAM_OPCODES = new Set([
  0x02, 0x12, 0x22, 0x32, 0x42, 0x52,
  0x62, 0x72, 0x92, 0xb2, 0xd2, 0xf2,
]);

interface CodeIsland {
  start: number;
  end: number;          // exclusive
  instrCount: number;
  undocumentedCount: number;
  jsrCount: number;
  branchCount: number;
  flowCount: number;
  knownTargets: number;
  plausibleTargets: number;
  hasTerminator: boolean;
  zpAccesses: number;
  ldaStaPairs: number;
}

export class GeneralCodeDiscoverer implements CodeDiscoveryPlugin {
  name = "general_code";
  description = "Detects unreached code islands by scoring instruction validity and flow patterns";

  discover(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: CodeDiscoveryContext
  ): EntryPoint[] {
    const regionSize = region.end - region.start;
    if (regionSize < MIN_CODE_BYTES) return [];

    const islands = this.findIslands(memory, region, context);
    const entryPoints: EntryPoint[] = [];

    for (const island of islands) {
      const result = this.scoreIsland(island, context);
      if (result) entryPoints.push(result);
    }

    return entryPoints;
  }

  private findIslands(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: CodeDiscoveryContext
  ): CodeIsland[] {
    const islands: CodeIsland[] = [];
    let pos = region.start;

    while (pos < region.end) {
      if (context.byteRole[pos] === ROLE_OPCODE || context.byteRole[pos] === ROLE_OPERAND) {
        pos++;
        continue;
      }

      const island = this.traceIsland(memory, pos, region.end, context);
      if (island && island.end - island.start >= MIN_CODE_BYTES && island.instrCount >= MIN_INSTRUCTIONS) {
        islands.push(island);
        pos = island.end;
      } else {
        pos++;
      }
    }

    return islands;
  }

  private traceIsland(
    memory: Uint8Array,
    start: number,
    regionEnd: number,
    context: CodeDiscoveryContext
  ): CodeIsland | null {
    let addr = start;
    let instrCount = 0;
    let undocumentedCount = 0;
    let flowCount = 0;
    let jsrCount = 0;
    let branchCount = 0;
    let knownTargets = 0;
    let plausibleTargets = 0;
    let hasTerminator = false;
    let zpAccesses = 0;
    let ldaStaPairs = 0;
    let lastMnemonic = "";
    let consecutiveUndoc = 0;

    while (addr < regionEnd) {
      if (context.byteRole[addr] === ROLE_OPCODE || context.byteRole[addr] === ROLE_OPERAND) {
        break;
      }

      const opcode = memory[addr];
      if (JAM_OPCODES.has(opcode)) break;

      const inst = decode(memory, addr);
      if (!inst) break;

      if (addr + inst.info.bytes > regionEnd) break;

      let operandClaimed = false;
      for (let i = 1; i < inst.info.bytes; i++) {
        if (context.byteRole[addr + i] === ROLE_OPCODE || context.byteRole[addr + i] === ROLE_OPERAND) {
          operandClaimed = true;
          break;
        }
      }
      if (operandClaimed) break;

      instrCount++;

      if (inst.info.undocumented) {
        undocumentedCount++;
        consecutiveUndoc++;
        if (consecutiveUndoc >= 3) {
          instrCount -= consecutiveUndoc;
          addr -= consecutiveUndoc;
          break;
        }
      } else {
        consecutiveUndoc = 0;
      }

      if (
        inst.info.addressingMode === "zero_page" ||
        inst.info.addressingMode === "zero_page_x" ||
        inst.info.addressingMode === "zero_page_y"
      ) {
        zpAccesses++;
      }

      if (
        (inst.info.mnemonic === "sta" || inst.info.mnemonic === "stx" || inst.info.mnemonic === "sty") &&
        (lastMnemonic === "lda" || lastMnemonic === "ldx" || lastMnemonic === "ldy")
      ) {
        ldaStaPairs++;
      }

      if (inst.info.flowType === "call") {
        flowCount++;
        jsrCount++;
        if (inst.operandAddress !== undefined) {
          if (this.isKnownCode(inst.operandAddress, context)) {
            knownTargets++;
          } else if (this.isPlausibleCodeAddress(inst.operandAddress)) {
            plausibleTargets++;
          }
        }
      } else if (inst.info.flowType === "jump") {
        flowCount++;
        if (inst.operandAddress !== undefined && inst.info.addressingMode !== "indirect") {
          if (this.isKnownCode(inst.operandAddress, context)) {
            knownTargets++;
          } else if (this.isPlausibleCodeAddress(inst.operandAddress)) {
            plausibleTargets++;
          }
        }
      } else if (inst.info.flowType === "branch") {
        flowCount++;
        branchCount++;
        if (inst.operandAddress !== undefined) {
          if (inst.operandAddress >= start && inst.operandAddress < regionEnd) {
            knownTargets++;
          }
        }
      }

      lastMnemonic = inst.info.mnemonic;
      addr += inst.info.bytes;

      if (
        inst.info.flowType === "return" ||
        inst.info.flowType === "halt" ||
        inst.info.flowType === "jump"
      ) {
        hasTerminator = true;
        break;
      }
    }

    if (instrCount < MIN_INSTRUCTIONS) return null;

    return {
      start,
      end: addr,
      instrCount,
      undocumentedCount,
      jsrCount,
      branchCount,
      flowCount,
      knownTargets,
      plausibleTargets,
      hasTerminator,
      zpAccesses,
      ldaStaPairs,
    };
  }

  private scoreIsland(island: CodeIsland, context: CodeDiscoveryContext): EntryPoint | null {
    const size = island.end - island.start;

    const undocRatio = island.undocumentedCount / island.instrCount;
    if (undocRatio > 0.4) return null;

    let score = 0;
    const evidence: string[] = [];

    if (island.instrCount >= 10) {
      score += 25;
    } else if (island.instrCount >= 5) {
      score += 15;
    } else {
      score += 10;
    }
    evidence.push(`${island.instrCount} instructions, ${size} bytes`);

    if (island.hasTerminator) {
      score += 15;
      evidence.push("Ends with RTS/RTI/JMP (proper termination)");
    }

    if (island.jsrCount > 0) {
      score += Math.min(island.jsrCount * 5, 15);
      evidence.push(`${island.jsrCount} JSR call(s)`);
    }
    if (island.branchCount > 0) {
      score += Math.min(island.branchCount * 2, 5);
      evidence.push(`${island.branchCount} conditional branch(es)`);
    }

    if (island.knownTargets > 0) {
      score += Math.min(island.knownTargets * 7, 20);
      evidence.push(`${island.knownTargets} target(s) point to known code or internal branches`);
    } else if (island.plausibleTargets > 0) {
      score += Math.min(island.plausibleTargets * 3, 10);
      evidence.push(`${island.plausibleTargets} target(s) point to plausible code addresses`);
    }

    if (island.zpAccesses > 0) {
      score += Math.min(island.zpAccesses, 5);
      evidence.push(`${island.zpAccesses} zero-page access(es)`);
    }
    if (island.ldaStaPairs > 0) {
      score += Math.min(island.ldaStaPairs * 2, 5);
      evidence.push(`${island.ldaStaPairs} load/store pair(s)`);
    }

    if (island.undocumentedCount > 0) {
      score -= island.undocumentedCount * 3;
      evidence.push(`${island.undocumentedCount} undocumented opcode(s) (penalty)`);
    }

    if (island.flowCount === 0 && !island.hasTerminator && island.instrCount > 8) {
      score -= 10;
      evidence.push("No flow control or terminator in long sequence (suspicious)");
    }

    const confidence = Math.max(10, Math.min(85, score));
    if (confidence < MIN_CONFIDENCE) return null;

    return {
      address: island.start,
      source: "code_discoverer",
      confidence: confidence >= 60 ? "high" : confidence >= 40 ? "medium" : "low",
      description: `Unreached code: ${island.instrCount} instructions, ${size} bytes [${evidence.join("; ")}]`,
    };
  }

  private isKnownCode(addr: number, context: CodeDiscoveryContext): boolean {
    const node = context.tree.findNodeContaining(addr);
    return node !== undefined && node.type === "code";
  }

  private isPlausibleCodeAddress(addr: number): boolean {
    return addr >= 0x0200 && addr < 0x10000 && !(addr >= 0xd000 && addr < 0xe000);
  }
}
