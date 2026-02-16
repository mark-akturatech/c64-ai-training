// ============================================================================
// Step 2: Entry Point Detection
// ============================================================================

import { decode } from "./opcode_decoder.js";
import type {
  MemoryImage,
  EntryPoint,
  EntryPointSource,
  BankingState,
  DecodedInstruction,
} from "./types.js";

export interface EntryPointResult {
  entryPoints: EntryPoint[];
  bankingState: BankingState;
}

export function detectEntryPoints(
  image: MemoryImage,
  userEntryPoints?: number[]
): EntryPointResult {
  const entryPoints: EntryPoint[] = [];
  const { bytes: memory } = image;

  // User-specified entry points (highest priority)
  if (userEntryPoints) {
    for (const addr of userEntryPoints) {
      entryPoints.push({
        address: addr,
        source: "user_specified",
        confidence: "high",
        description: `User-specified entry point at $${addr.toString(16).toUpperCase().padStart(4, "0")}`,
      });
    }
  }

  // Parser-provided entry points (from VSF snapshots, etc.)
  if (image.parserEntryPoints) {
    for (const hint of image.parserEntryPoints) {
      const source = (
        ["snapshot_pc", "snapshot_vector", "irq_vector", "nmi_vector", "brk_vector"]
          .includes(hint.source) ? hint.source : "user_specified"
      ) as EntryPointSource;
      entryPoints.push({
        address: hint.address,
        source,
        confidence: hint.source === "snapshot_pc" ? "high" : "medium",
        description: hint.description,
      });
    }
  }

  // Detect BASIC stub: SYS xxxx
  const basicEntry = detectBasicStub(memory, image);
  if (basicEntry) entryPoints.push(basicEntry);

  // Detect IRQ/NMI handler installation
  const irqEntries = detectIrqInstallation(memory, image);
  entryPoints.push(...irqEntries);

  // Start with parser-provided banking hints if available, then refine from code
  const bankingState = image.parserBankingHints
    ? initBankingFromHints(image)
    : detectBankingState(memory, image);

  // Refine banking from code patterns even when parser hints exist
  if (image.parserBankingHints) {
    refineBankingFromCode(memory, image, bankingState);
  }

  // Deduplicate by address
  const seen = new Set<number>();
  const unique = entryPoints.filter((ep) => {
    if (seen.has(ep.address)) return false;
    seen.add(ep.address);
    return true;
  });

  return { entryPoints: unique, bankingState };
}

function detectBasicStub(memory: Uint8Array, image: MemoryImage): EntryPoint | null {
  // BASIC programs start at $0801. A SYS stub looks like:
  // 0801: [next-line-lo] [next-line-hi] [line-num-lo] [line-num-hi] [SYS-token=0x9E] [digits] [0x00]
  if (image.loadAddress > 0x0801) return null;

  const base = 0x0801;
  // Check for BASIC line link pointer (non-zero = valid line)
  const nextLine = memory[base] | (memory[base + 1] << 8);
  if (nextLine === 0) return null;

  // Line number
  const lineNum = memory[base + 2] | (memory[base + 3] << 8);

  // SYS token is 0x9E
  if (memory[base + 4] !== 0x9E) return null;

  // Extract digits after SYS token (skip spaces)
  let pos = base + 5;
  while (memory[pos] === 0x20) pos++; // skip spaces

  let numStr = "";
  while (pos < base + 20 && memory[pos] >= 0x30 && memory[pos] <= 0x39) {
    numStr += String.fromCharCode(memory[pos]);
    pos++;
  }

  if (!numStr) return null;

  // Check for arithmetic: SYS 2*4096+2*256+14 patterns
  // Also handle: SYS(2064) with parens
  let sysAddress: number;

  // Simple case: just digits
  sysAddress = parseInt(numStr, 10);

  // Check for expression after digits (e.g., SYS 2*4096+...)
  if (memory[pos] === 0x2A || memory[pos] === 0x2B || memory[pos] === 0x2D) {
    // Arithmetic expression — try to evaluate
    let expr = numStr;
    while (pos < base + 40 && memory[pos] !== 0x00 && memory[pos] !== 0x3A) {
      expr += String.fromCharCode(memory[pos]);
      pos++;
    }
    try {
      // Safe evaluation of simple arithmetic
      sysAddress = evaluateBasicExpr(expr);
    } catch {
      // Fall back to just the first number
    }
  }

  if (sysAddress < 0x0200 || sysAddress > 0xFFFF) return null;

  return {
    address: sysAddress,
    source: "basic_stub",
    confidence: "high",
    description: `BASIC SYS ${sysAddress} (line ${lineNum})`,
  };
}

function evaluateBasicExpr(expr: string): number {
  // Only allow digits, +, -, *, /, (, ), spaces
  if (!/^[\d+\-*/() ]+$/.test(expr)) throw new Error("Complex expression");
  // Use Function constructor for safe math-only evaluation
  const result = new Function(`return (${expr})`)() as number;
  if (typeof result !== "number" || isNaN(result)) throw new Error("Not a number");
  return Math.floor(result);
}

function detectIrqInstallation(memory: Uint8Array, image: MemoryImage): EntryPoint[] {
  const entries: EntryPoint[] = [];
  const { loaded } = image;

  // Scan loaded regions for patterns that install IRQ/NMI handlers:
  // LDA #<addr / STA $0314 / LDA #>addr / STA $0315 (IRQ vector)
  // LDA #<addr / STA $0318 / LDA #>addr / STA $0319 (NMI vector)
  // LDA #<addr / STA $FFFE / LDA #>addr / STA $FFFF (hardware IRQ)
  // SEI before any of these

  const IRQ_VECTORS: Array<{ lo: number; hi: number; name: string }> = [
    { lo: 0x0314, hi: 0x0315, name: "IRQ" },
    { lo: 0x0316, hi: 0x0317, name: "BRK" },
    { lo: 0x0318, hi: 0x0319, name: "NMI" },
    { lo: 0xFFFE, hi: 0xFFFF, name: "hardware IRQ" },
    { lo: 0xFFFA, hi: 0xFFFB, name: "hardware NMI" },
  ];

  for (const region of loaded) {
    for (let addr = region.start; addr < region.end - 8; addr++) {
      for (const vec of IRQ_VECTORS) {
        // Pattern: LDA #imm / STA $vec_lo / LDA #imm / STA $vec_hi
        const i0 = decode(memory, addr);
        if (!i0 || i0.info.mnemonic !== "lda" || i0.info.addressingMode !== "immediate")
          continue;
        const loVal = i0.operandValue!;

        const i1 = decode(memory, addr + i0.info.bytes);
        if (!i1 || i1.info.mnemonic !== "sta" || i1.info.addressingMode !== "absolute")
          continue;
        if (i1.operandAddress !== vec.lo) continue;

        const i2 = decode(memory, addr + i0.info.bytes + i1.info.bytes);
        if (!i2 || i2.info.mnemonic !== "lda" || i2.info.addressingMode !== "immediate")
          continue;
        const hiVal = i2.operandValue!;

        const i3 = decode(
          memory,
          addr + i0.info.bytes + i1.info.bytes + i2.info.bytes
        );
        if (!i3 || i3.info.mnemonic !== "sta" || i3.info.addressingMode !== "absolute")
          continue;
        if (i3.operandAddress !== vec.hi) continue;

        const handlerAddr = loVal | (hiVal << 8);

        entries.push({
          address: handlerAddr,
          source: vec.name.includes("NMI") ? "nmi_vector" : "irq_vector",
          confidence: "high",
          description: `${vec.name} handler installed at $${handlerAddr.toString(16).toUpperCase().padStart(4, "0")} (from $${addr.toString(16).toUpperCase().padStart(4, "0")})`,
        });
      }
    }
  }

  return entries;
}

function detectBankingState(memory: Uint8Array, image: MemoryImage): BankingState {
  // Default banking state: BASIC + KERNAL + IO visible
  const state: BankingState = {
    cpuPort: 0x37,       // default: all ROMs + IO visible
    basicRomVisible: true,
    kernalRomVisible: true,
    ioVisible: true,
    charRomVisible: false,
    vicBank: 0,
    vicBankBase: 0x0000,
    screenBase: 0x0400,
    charsetBase: 0x1000,
  };

  // Scan for writes to $01 (CPU port) in loaded regions
  for (const region of image.loaded) {
    for (let addr = region.start; addr < region.end - 4; addr++) {
      const inst = decode(memory, addr);
      if (!inst) continue;

      // LDA #imm / STA $01
      if (
        inst.info.mnemonic === "lda" &&
        inst.info.addressingMode === "immediate"
      ) {
        const next = decode(memory, addr + inst.info.bytes);
        if (
          next &&
          next.info.mnemonic === "sta" &&
          next.info.addressingMode === "zero_page" &&
          next.operandAddress === 0x01
        ) {
          const val = inst.operandValue!;
          state.cpuPort = val;
          state.basicRomVisible = (val & 0x01) !== 0 && (val & 0x02) !== 0;
          state.kernalRomVisible = (val & 0x02) !== 0;
          state.ioVisible = (val & 0x04) !== 0 && (val & 0x02) !== 0;
          state.charRomVisible = (val & 0x04) === 0 && (val & 0x02) !== 0;
        }
      }

      // Detect VIC bank: LDA #imm / STA $DD00
      if (
        inst.info.mnemonic === "lda" &&
        inst.info.addressingMode === "immediate"
      ) {
        const next = decode(memory, addr + inst.info.bytes);
        if (
          next &&
          next.info.mnemonic === "sta" &&
          next.info.addressingMode === "absolute" &&
          next.operandAddress === 0xDD00
        ) {
          const bankBits = (~inst.operandValue!) & 0x03;
          state.vicBank = bankBits;
          state.vicBankBase = bankBits * 0x4000;
        }
      }

      // Detect screen/charset from $D018
      if (
        inst.info.mnemonic === "lda" &&
        inst.info.addressingMode === "immediate"
      ) {
        const next = decode(memory, addr + inst.info.bytes);
        if (
          next &&
          next.info.mnemonic === "sta" &&
          next.info.addressingMode === "absolute" &&
          next.operandAddress === 0xD018
        ) {
          const val = inst.operandValue!;
          state.screenBase = ((val >> 4) & 0x0F) * 0x0400 + state.vicBankBase;
          state.charsetBase = ((val >> 1) & 0x07) * 0x0800 + state.vicBankBase;
        }
      }
    }
  }

  return state;
}

function initBankingFromHints(image: MemoryImage): BankingState {
  const h = image.parserBankingHints!;
  return {
    cpuPort: h.cpuPort,
    basicRomVisible: h.basicRomVisible,
    kernalRomVisible: h.kernalRomVisible,
    ioVisible: h.ioVisible,
    charRomVisible: h.charRomVisible,
    vicBank: h.vicBank,
    vicBankBase: h.vicBankBase,
    // Parser doesn't know D018 — use defaults for the given VIC bank
    screenBase: 0x0400 + h.vicBankBase,
    charsetBase: 0x1000 + h.vicBankBase,
  };
}

function refineBankingFromCode(
  memory: Uint8Array,
  image: MemoryImage,
  state: BankingState
): void {
  // Scan for $D018 writes to refine screen/charset base
  for (const region of image.loaded) {
    for (let addr = region.start; addr < region.end - 4; addr++) {
      const inst = decode(memory, addr);
      if (!inst) continue;
      if (
        inst.info.mnemonic === "lda" &&
        inst.info.addressingMode === "immediate"
      ) {
        const next = decode(memory, addr + inst.info.bytes);
        if (
          next &&
          next.info.mnemonic === "sta" &&
          next.info.addressingMode === "absolute" &&
          next.operandAddress === 0xD018
        ) {
          const val = inst.operandValue!;
          state.screenBase = ((val >> 4) & 0x0F) * 0x0400 + state.vicBankBase;
          state.charsetBase = ((val >> 1) & 0x07) * 0x0800 + state.vicBankBase;
        }
      }
    }
  }
}
