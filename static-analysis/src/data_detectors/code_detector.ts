// ============================================================================
// Unreached Code Detector
// Scans unknown/orphan regions for valid 6502 instruction sequences that
// the tree walker couldn't reach from known entry points.
// Finds "code islands" within larger regions — stretches of valid instructions
// bounded by terminators (RTS/RTI/JMP) or invalid bytes.
// Non-code gaps are left for other detectors (sprite, charset, etc.).
// ============================================================================

import { decode } from "../opcode_decoder.js";
import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const MIN_CODE_BYTES = 6;
const MIN_INSTRUCTIONS = 3;

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

export class CodeDetector implements DataDetector {
  name = "code";
  description = "Detects unreached code islands by scoring instruction validity and flow patterns";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const regionSize = region.end - region.start;
    if (regionSize < MIN_CODE_BYTES) return [];

    // Find all code islands within this region
    const islands = this.findIslands(memory, region, context);

    // Score each island and build candidates
    const candidates: DataCandidate[] = [];
    for (const island of islands) {
      const result = this.scoreIsland(island, context);
      if (result) candidates.push(result);
    }

    return candidates;
  }

  private findIslands(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): CodeIsland[] {
    const islands: CodeIsland[] = [];
    let pos = region.start;

    while (pos < region.end) {
      // Skip bytes that are already claimed as code
      if (context.byteRole[pos] === ROLE_OPCODE || context.byteRole[pos] === ROLE_OPERAND) {
        pos++;
        continue;
      }

      // Try to start a code island here
      const island = this.traceIsland(memory, pos, region.end, context);
      if (island && island.end - island.start >= MIN_CODE_BYTES && island.instrCount >= MIN_INSTRUCTIONS) {
        islands.push(island);
        pos = island.end;
      } else {
        // Not valid code at this position — skip forward
        pos++;
      }
    }

    return islands;
  }

  private traceIsland(
    memory: Uint8Array,
    start: number,
    regionEnd: number,
    context: DetectorContext
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
      // Already claimed — stop island here
      if (context.byteRole[addr] === ROLE_OPCODE || context.byteRole[addr] === ROLE_OPERAND) {
        break;
      }

      const opcode = memory[addr];

      // JAM opcode — end island
      if (JAM_OPCODES.has(opcode)) break;

      const inst = decode(memory, addr);
      if (!inst) break;

      // Would extend past region
      if (addr + inst.info.bytes > regionEnd) break;

      // Check operand bytes aren't claimed
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
        // Too many consecutive undocumented = probably data
        if (consecutiveUndoc >= 3) {
          // Rewind past the undocumented stretch
          instrCount -= consecutiveUndoc;
          addr -= consecutiveUndoc; // approximate — not perfect but prevents garbage
          break;
        }
      } else {
        consecutiveUndoc = 0;
      }

      // Track zero-page accesses
      if (
        inst.info.addressingMode === "zero_page" ||
        inst.info.addressingMode === "zero_page_x" ||
        inst.info.addressingMode === "zero_page_y"
      ) {
        zpAccesses++;
      }

      // Track LDA/STA pairing
      if (
        (inst.info.mnemonic === "STA" || inst.info.mnemonic === "STX" || inst.info.mnemonic === "STY") &&
        (lastMnemonic === "LDA" || lastMnemonic === "LDX" || lastMnemonic === "LDY")
      ) {
        ldaStaPairs++;
      }

      // Track flow instructions
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
            knownTargets++; // internal branch
          }
        }
      }

      lastMnemonic = inst.info.mnemonic;
      addr += inst.info.bytes;

      // Terminator ends this island (but it's a clean end)
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

  private scoreIsland(island: CodeIsland, context: DetectorContext): DataCandidate | null {
    const size = island.end - island.start;

    // Too many undocumented opcodes = likely data
    const undocRatio = island.undocumentedCount / island.instrCount;
    if (undocRatio > 0.4) return null;

    let score = 0;
    const evidence: string[] = [];

    // Base: instruction count and size (0-25 points)
    if (island.instrCount >= 10) {
      score += 25;
    } else if (island.instrCount >= 5) {
      score += 15;
    } else {
      score += 10;
    }
    evidence.push(`${island.instrCount} instructions, ${size} bytes`);

    // Terminator bonus (0-15 points)
    if (island.hasTerminator) {
      score += 15;
      evidence.push("Ends with RTS/RTI/JMP (proper termination)");
    }

    // Flow instructions (0-20 points)
    if (island.jsrCount > 0) {
      score += Math.min(island.jsrCount * 5, 15);
      evidence.push(`${island.jsrCount} JSR call(s)`);
    }
    if (island.branchCount > 0) {
      score += Math.min(island.branchCount * 2, 5);
      evidence.push(`${island.branchCount} conditional branch(es)`);
    }

    // Known targets bonus (0-20 points)
    if (island.knownTargets > 0) {
      score += Math.min(island.knownTargets * 7, 20);
      evidence.push(`${island.knownTargets} target(s) point to known code or internal branches`);
    } else if (island.plausibleTargets > 0) {
      score += Math.min(island.plausibleTargets * 3, 10);
      evidence.push(`${island.plausibleTargets} target(s) point to plausible code addresses`);
    }

    // Common code patterns (0-10 points)
    if (island.zpAccesses > 0) {
      score += Math.min(island.zpAccesses, 5);
      evidence.push(`${island.zpAccesses} zero-page access(es)`);
    }
    if (island.ldaStaPairs > 0) {
      score += Math.min(island.ldaStaPairs * 2, 5);
      evidence.push(`${island.ldaStaPairs} load/store pair(s)`);
    }

    // Undocumented penalty
    if (island.undocumentedCount > 0) {
      score -= island.undocumentedCount * 3;
      evidence.push(`${island.undocumentedCount} undocumented opcode(s) (penalty)`);
    }

    // No flow at all is suspicious in longer sequences
    if (island.flowCount === 0 && !island.hasTerminator && island.instrCount > 8) {
      score -= 10;
      evidence.push("No flow control or terminator in long sequence (suspicious)");
    }

    // Clamp to 10-85
    const confidence = Math.max(10, Math.min(85, score));

    // Minimum threshold
    if (confidence < 20) return null;

    const subtype = island.hasTerminator ? "unreached_subroutine" : "unreached_fragment";

    return {
      start: island.start,
      end: island.end,
      detector: this.name,
      type: "code",
      subtype,
      confidence,
      evidence,
      label: subtype,
      comment: `Potential unreached code, ${island.instrCount} instructions, ${size} bytes`,
    };
  }

  private isKnownCode(addr: number, context: DetectorContext): boolean {
    const node = context.tree.findNodeContaining(addr);
    return node !== undefined && node.type === "code";
  }

  private isPlausibleCodeAddress(addr: number): boolean {
    return addr >= 0x0200 && addr < 0x10000 && !(addr >= 0xd000 && addr < 0xe000);
  }
}
