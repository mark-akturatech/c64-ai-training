// ============================================================================
// Code Emitter — subroutine/fragment/irq_handler → labelled instructions
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import * as ka from "../kickass.js";
import { rewriteOperand } from "../address_formatter.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

/** Expected instruction size by addressing mode (standard 6502) */
const MODE_SIZES: Record<string, number> = {
  implied: 1, accumulator: 1,
  immediate: 2, zero_page: 2, zero_page_x: 2, zero_page_y: 2,
  relative: 2, indirect_x: 2, indirect_y: 2,
  absolute: 3, absolute_x: 3, absolute_y: 3, indirect: 3,
};

/** Mnemonics KickAssembler doesn't recognize (undocumented 6502) */
const UNSUPPORTED_MNEMONICS = new Set([
  "slo", "rla", "sre", "rra", "sax", "lax", "dcp", "isc",
  "anc", "alr", "arr", "xaa", "axs", "ahx", "shy", "shx",
  "tas", "las", "jam", "nop*", "sbc*",
]);

/** Relative branch mnemonics */
const BRANCH_MNEMONICS = new Set([
  "bcc", "bcs", "beq", "bne", "bpl", "bmi", "bvc", "bvs",
]);

export class CodeEmitter implements EmitterPlugin {
  name = "code";
  description = "Emit code blocks as labelled instructions";
  priority = 10;

  handles(block: Block): boolean {
    return block.type === "subroutine" || block.type === "irq_handler" || block.type === "fragment";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];

    // Header comment from enrichment
    if (block.enrichment?.headerComment) {
      for (const line of block.enrichment.headerComment.split("\n")) {
        lines.push(ka.comment(line));
      }
    }

    // Block label
    const blockLabel = context.resolveLabel(block.address);
    if (blockLabel) {
      lines.push(ka.label(blockLabel));
    }

    // Instructions (with gap filling for uncovered byte ranges)
    let cursor = block.address;

    if (block.instructions && block.instructions.length > 0) {
      for (const inst of block.instructions) {
        // Fill gap before this instruction (if any)
        if (inst.address > cursor) {
          lines.push(...emitGapBytes(cursor, inst.address, block, context));
        }

        const rawSize = inst.rawBytes.split(/\s+/).length;

        // Instruction-level label (if different from block label)
        if (inst.label && inst.address !== block.address) {
          lines.push(ka.label(inst.label));
        } else if (inst.address !== block.address) {
          const instLabel = context.resolveLabel(inst.address);
          if (instLabel && instLabel !== blockLabel) {
            lines.push(ka.label(instLabel));
          }
        }

        // Inline comment from enrichment
        const addrHex = inst.address.toString(16).toUpperCase().padStart(4, "0");
        const inlineComment = block.enrichment?.inlineComments?.[addrHex];

        const mnemonic = inst.mnemonic.toLowerCase();
        const expectedSize = MODE_SIZES[inst.addressingMode] ?? rawSize;

        // Safety net: emit as raw bytes when KickAssembler would produce
        // different output. Catches: undocumented opcodes, BRK (2 vs 1),
        // undocumented NOPs, absolute mode for zero-page addresses, etc.
        if (UNSUPPORTED_MNEMONICS.has(mnemonic) || rawSize !== expectedSize || wouldReencode(inst)) {
          const rawComment = `${mnemonic} ${inst.operand}`.trim();
          lines.push(...emitRawInstruction(inst, inlineComment ?? rawComment));
          cursor = inst.address + rawSize;
          continue;
        }

        // Accumulator addressing: KickAssembler uses "rol" not "rol A"
        const operand = inst.addressingMode === "accumulator"
          ? ""
          : rewriteOperand(inst.operand, context);

        // Relative branches: emit as raw bytes when the branch offset is
        // large (|offset| > 100) or the target has no label.  PC drift from
        // KickAssembler re-encoding earlier instructions can push branches
        // out of the ±128 range.
        if (BRANCH_MNEMONICS.has(mnemonic) && inst.addressingMode === "relative") {
          const rawOffset = inst.rawBytes.split(/\s+/)[1];
          const offset = rawOffset ? parseInt(rawOffset, 16) : 0;
          const signedOffset = offset > 127 ? offset - 256 : offset;
          const isUnresolved = /^\$[0-9A-Fa-f]{4}$/.test(operand);
          if (isUnresolved || Math.abs(signedOffset) > 100) {
            const rawComment = `${mnemonic} ${operand}`;
            lines.push(...emitRawInstruction(inst, inlineComment ?? rawComment));
            cursor = inst.address + rawSize;
            continue;
          }
        }

        // Force absolute addressing when the original instruction used absolute
        // mode but the operand targets zero-page — KickAssembler would otherwise
        // optimize to a 2-byte zero-page instruction.
        let emitMnemonic = mnemonic;
        if (isZeroPageAbsolute(inst)) {
          emitMnemonic = `${mnemonic}.abs`;
        }

        lines.push(ka.instruction(emitMnemonic, operand, inlineComment));
        cursor = inst.address + rawSize;
      }
    }

    // Fill trailing gap after last instruction
    if (cursor < block.endAddress) {
      lines.push(...emitGapBytes(cursor, block.endAddress, block, context));
    }

    return { lines };
  }
}

/**
 * Check if KickAssembler would re-encode this instruction differently.
 */
function wouldReencode(inst: BlockInstruction): boolean {
  const mnemonic = inst.mnemonic.toLowerCase();

  const opcode = parseInt(inst.rawBytes.split(/\s+/)[0], 16);

  // Undocumented NOP variants: KickAssembler may use a different opcode byte
  // or not support the addressing mode at all. Standard NOP is $EA implied.
  if (mnemonic === "nop" && opcode !== 0xEA) return true;

  // Undocumented SBC immediate ($EB) — KickAssembler emits standard $E9
  if (mnemonic === "sbc" && opcode !== 0xE9 && inst.addressingMode === "immediate") return true;

  // Absolute mode referencing zero-page: handled with .abs suffix in emit(),
  // no longer falls back to raw bytes.

  return false;
}

/** Check if instruction uses absolute mode to address zero-page ($0000-$00FF). */
function isZeroPageAbsolute(inst: BlockInstruction): boolean {
  if (inst.addressingMode !== "absolute" &&
      inst.addressingMode !== "absolute_x" &&
      inst.addressingMode !== "absolute_y") return false;
  const m = inst.operand.match(/\$([0-9A-Fa-f]{4})/);
  return !!m && parseInt(m[1], 16) < 0x0100;
}

/** Emit raw bytes for a gap in instruction coverage within a code block. */
function emitGapBytes(start: number, end: number, block: Block, context: BuilderContext): string[] {
  // Prefer block.raw (base64-encoded bytes for this block's range)
  if (block.raw) {
    const blockBytes = decodeRaw(block.raw);
    const offset = start - block.address;
    if (offset >= 0 && offset + (end - start) <= blockBytes.length) {
      return ka.byteDirective(blockBytes.slice(offset, offset + (end - start)));
    }
  }
  // Fallback: global memory image
  const bytes = context.getBytes(start, end - start);
  if (bytes) {
    return ka.byteDirective(bytes);
  }
  // Last resort: fill with the raw byte values we know exist
  return ka.byteDirective(new Uint8Array(end - start));
}

/** Emit an undocumented opcode as .byte with a comment showing the mnemonic */
function emitRawInstruction(inst: BlockInstruction, comment: string): string[] {
  const rawHex = inst.rawBytes
    .split(/\s+/)
    .map((h) => `$${h.toUpperCase()}`)
    .join(", ");
  return [`${ka.INDENT}.byte ${rawHex}`.padEnd(40) + `// ${comment}`];
}
