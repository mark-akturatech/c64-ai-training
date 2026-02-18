// ============================================================================
// Basic Stub Emitter — BASIC SYS stubs → BasicUpstart2 or raw bytes
// Detects stubs from actual bytes at $0801, not static analyzer classification.
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

/** BASIC V2 token table (tokens likely in SYS stubs). */
const BASIC_TOKENS: Record<number, string> = {
  0x80: "END", 0x89: "GOTO", 0x8D: "GOSUB", 0x8F: "REM",
  0x97: "POKE", 0x99: "PRINT", 0x9E: "SYS",
};

export class BasicStubEmitter implements EmitterPlugin {
  name = "basic_stub";
  description = "Emit BASIC SYS stubs as BasicUpstart2 or raw bytes";
  priority = 5;

  handles(block: Block, context: BuilderContext): boolean {
    if (block.address !== 0x0801) return false;
    const bytes = this.getBlockBytes(block, context);
    if (!bytes || bytes.length < 5) return false;
    // Scan for SYS token ($9E) in the BASIC line (after the 4-byte header)
    for (let i = 4; i < bytes.length; i++) {
      if (bytes[i] === 0x00) break;
      if (bytes[i] === 0x9E) return true;
    }
    return false;
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const bytes = this.getBlockBytes(block, context);
    if (!bytes) return { lines: [...ka.byteDirective(new Uint8Array(0))] };

    // Decode the BASIC line for the comment
    const stubComment = decodeBasicLine(bytes);

    // Find the SYS target address from the BASIC line
    const sysAddr = parseSysAddress(bytes);

    // Get the entry label for BasicUpstart2
    const entryLabel = sysAddr !== null ? context.resolveLabel(sysAddr) : null;

    // Check if BasicUpstart2 would produce identical bytes
    // BasicUpstart2 generates the BASIC stub + a padding $00 byte, so it
    // consumes bytes up to the SYS target address.
    if (sysAddr !== null && entryLabel && matchesBasicUpstart2(sysAddr, context)) {
      if (stubComment) lines.push(ka.comment(stubComment));
      lines.push(`BasicUpstart2(${entryLabel})`);
      return { lines, skipOrigin: true, consumedEndAddress: sysAddr };
    }

    // Emit as raw bytes with decoded comment
    const label = context.resolveLabel(block.address);
    if (label) lines.push(ka.label(label));
    if (stubComment) lines.push(ka.comment(stubComment));
    lines.push(...ka.byteDirective(bytes));
    return { lines };
  }

  private getBlockBytes(block: Block, context: BuilderContext): Uint8Array | null {
    if (block.raw) return decodeRaw(block.raw);
    return context.getBytes(block.address, block.endAddress - block.address);
  }
}

/** Parse the SYS address from a tokenized BASIC stub at $0801. */
function parseSysAddress(bytes: Uint8Array): number | null {
  if (bytes.length < 6) return null;
  for (let i = 4; i < bytes.length; i++) {
    if (bytes[i] === 0x00) break;
    if (bytes[i] === 0x9E) {
      // Skip spaces and parens after SYS
      let j = i + 1;
      while (j < bytes.length && (bytes[j] === 0x20 || bytes[j] === 0x28)) j++;
      let addr = 0;
      let hasDigits = false;
      while (j < bytes.length && bytes[j] >= 0x30 && bytes[j] <= 0x39) {
        addr = addr * 10 + (bytes[j] - 0x30);
        hasDigits = true;
        j++;
      }
      return hasDigits && addr <= 0xFFFF ? addr : null;
    }
  }
  return null;
}

/**
 * Check if BasicUpstart2(sysAddr) would produce identical bytes.
 * KickAssembler's BasicUpstart2 generates:
 *   next_ptr(2) + line_10(2) + SYS(1) + digits + null(1) + eop(2) + padding(1)
 * Total = 13 bytes for a 4-digit address, with a $00 padding byte at the end.
 * The entry point label lands right after, so all bytes from $0801 to sysAddr
 * must match.
 */
function matchesBasicUpstart2(sysAddr: number, context: BuilderContext): boolean {
  const digits = sysAddr.toString(10);
  const nextPtr = 0x0807 + digits.length;
  const expected: number[] = [
    nextPtr & 0xFF, (nextPtr >> 8) & 0xFF,
    0x0A, 0x00,     // line number 10
    0x9E,           // SYS token
  ];
  for (const ch of digits) expected.push(ch.charCodeAt(0));
  expected.push(0x00);       // end of line
  expected.push(0x00, 0x00); // end of program
  expected.push(0x00);       // KickAssembler padding byte

  // Read the full range from memory ($0801 to sysAddr)
  const fullBytes = context.getBytes(0x0801, sysAddr - 0x0801);
  if (!fullBytes || fullBytes.length !== expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== fullBytes[i]) return false;
  }
  return true;
}

/** Decode a tokenized BASIC line into readable text like "BASIC: 10 SYS$080E". */
function decodeBasicLine(bytes: Uint8Array): string | null {
  if (bytes.length < 6) return null;
  const lineNum = bytes[2] | (bytes[3] << 8);
  let text = "";
  for (let i = 4; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === 0x00) break;
    if (b === 0x9E) {
      // SYS token — parse the decimal address and convert to hex
      text += "SYS";
      let j = i + 1;
      // Skip spaces/parens
      while (j < bytes.length && (bytes[j] === 0x20 || bytes[j] === 0x28)) j++;
      let addr = 0;
      let hasDigits = false;
      while (j < bytes.length && bytes[j] >= 0x30 && bytes[j] <= 0x39) {
        addr = addr * 10 + (bytes[j] - 0x30);
        hasDigits = true;
        j++;
      }
      if (hasDigits) {
        text += `$${addr.toString(16).toUpperCase().padStart(4, "0")}`;
      }
      // Append any remaining text after the address (e.g. " SCI 6")
      for (let k = j; k < bytes.length; k++) {
        const c = bytes[k];
        if (c === 0x00) break;
        if (BASIC_TOKENS[c]) text += BASIC_TOKENS[c];
        else if (c >= 0x20 && c <= 0x7E) text += String.fromCharCode(c);
        else if (c >= 0x80) text += `[${c.toString(16).toUpperCase()}]`;
      }
      break;
    } else if (BASIC_TOKENS[b]) {
      text += BASIC_TOKENS[b];
    } else if (b >= 0x20 && b <= 0x7E) {
      text += String.fromCharCode(b);
    } else if (b >= 0x80) {
      text += `[${b.toString(16).toUpperCase()}]`;
    }
  }
  return text ? `BASIC: ${lineNum} ${text}` : null;
}
