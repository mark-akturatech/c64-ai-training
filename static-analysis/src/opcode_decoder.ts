// ============================================================================
// Opcode Decoder — shared module used by Steps 2 and 3
// ============================================================================

import { OPCODE_TABLE } from "./opcode_table.js";
import type { DecodedInstruction, OpcodeInfo } from "./types.js";

/**
 * Decode a single instruction at the given address from the memory image.
 * Returns null if the address is out of range.
 */
export function decode(memory: Uint8Array, address: number): DecodedInstruction | null {
  if (address < 0 || address >= 0x10000) return null;

  const opcode = memory[address];
  const info = OPCODE_TABLE[opcode];
  const rawBytes = new Uint8Array(info.bytes);

  for (let i = 0; i < info.bytes && address + i < 0x10000; i++) {
    rawBytes[i] = memory[address + i];
  }

  let operandValue: number | undefined;
  let operandAddress: number | undefined;

  if (info.bytes === 2) {
    operandValue = memory[(address + 1) & 0xFFFF];
  } else if (info.bytes === 3) {
    operandValue = memory[(address + 1) & 0xFFFF] | (memory[(address + 2) & 0xFFFF] << 8);
  }

  if (operandValue !== undefined) {
    operandAddress = resolveAddress(info, address, operandValue, memory);
  }

  return {
    address,
    opcode,
    info,
    rawBytes,
    operandValue,
    operandAddress,
  };
}

/**
 * Resolve the effective address for an instruction's operand.
 * For branches: compute the target from the signed relative offset.
 * For absolute/ZP: the operand IS the address.
 * For indirect: read through the pointer.
 */
function resolveAddress(
  info: OpcodeInfo,
  instrAddress: number,
  operandValue: number,
  memory: Uint8Array
): number | undefined {
  switch (info.addressingMode) {
    case "immediate":
    case "implied":
    case "accumulator":
      return undefined;

    case "relative": {
      // Signed 8-bit offset from the NEXT instruction
      const offset = operandValue > 127 ? operandValue - 256 : operandValue;
      return (instrAddress + 2 + offset) & 0xFFFF;
    }

    case "zero_page":
      return operandValue & 0xFF;

    case "zero_page_x":
      // Can't resolve statically — depends on X register
      return operandValue & 0xFF; // base address only

    case "zero_page_y":
      return operandValue & 0xFF;

    case "absolute":
      return operandValue;

    case "absolute_x":
      return operandValue; // base address; actual depends on X

    case "absolute_y":
      return operandValue; // base address; actual depends on Y

    case "indirect":
      // JMP ($xxxx) — read 16-bit pointer from memory
      // 6502 bug: wraps within page (e.g. JMP ($10FF) reads from $10FF and $1000)
      if (operandValue !== undefined) {
        const lo = memory[operandValue];
        const hiAddr = (operandValue & 0xFF00) | ((operandValue + 1) & 0xFF);
        const hi = memory[hiAddr];
        return lo | (hi << 8);
      }
      return undefined;

    case "indirect_x":
      // (zp,X) — can't resolve statically
      return undefined;

    case "indirect_y":
      // (zp),Y — can read the ZP pointer but Y offset is unknown
      // Return the pointer address (the ZP location) for reference
      return undefined;

    default:
      return undefined;
  }
}

/**
 * Format an instruction as a human-readable string.
 */
export function formatInstruction(inst: DecodedInstruction): string {
  const { info, operandValue } = inst;
  const mnemonic = info.mnemonic.toUpperCase();

  switch (info.addressingMode) {
    case "implied":
      return mnemonic;
    case "accumulator":
      return `${mnemonic} A`;
    case "immediate":
      return `${mnemonic} #$${hex8(operandValue!)}`;
    case "zero_page":
      return `${mnemonic} $${hex8(operandValue!)}`;
    case "zero_page_x":
      return `${mnemonic} $${hex8(operandValue!)},X`;
    case "zero_page_y":
      return `${mnemonic} $${hex8(operandValue!)},Y`;
    case "absolute":
      return `${mnemonic} $${hex16(operandValue!)}`;
    case "absolute_x":
      return `${mnemonic} $${hex16(operandValue!)},X`;
    case "absolute_y":
      return `${mnemonic} $${hex16(operandValue!)},Y`;
    case "indirect":
      return `${mnemonic} ($${hex16(operandValue!)})`;
    case "indirect_x":
      return `${mnemonic} ($${hex8(operandValue!)},X)`;
    case "indirect_y":
      return `${mnemonic} ($${hex8(operandValue!)}),Y`;
    case "relative":
      return `${mnemonic} $${hex16(inst.operandAddress!)}`;
    default:
      return mnemonic;
  }
}

function hex8(value: number): string {
  return value.toString(16).toUpperCase().padStart(2, "0");
}

function hex16(value: number): string {
  return value.toString(16).toUpperCase().padStart(4, "0");
}
