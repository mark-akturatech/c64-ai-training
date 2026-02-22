// ============================================================================
// String Emitter — text strings → .text directives
// Handles both PETSCII and screen code strings using KickAssembler encoding
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class StringEmitter implements EmitterPlugin {
  name = "string";
  description = "Emit text strings with .text directive (PETSCII and screen codes)";
  priority = 22;

  handles(block: Block): boolean {
    if (block.type !== "data") return false;
    // Stage 5 Polish can override data format to "text" via enrichment
    if (block.enrichment?.dataFormat?.type === "text") return true;
    if (!block.candidates || block.bestCandidate === undefined) return false;
    const best = block.candidates[block.bestCandidate];
    return best?.type === "string" || best?.type === "text";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const best = block.bestCandidate !== undefined ? block.candidates?.[block.bestCandidate] : undefined;

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    // Get raw bytes
    const bytes = this.getBlockBytes(block, context);

    if (best?.comment) {
      lines.push(ka.comment(best.comment));
    }

    if (bytes) {
      const subtype = block.enrichment?.dataFormat?.subtype ?? best?.subtype ?? "";

      if (isScreenCodeSubtype(subtype)) {
        // Screen code string — use KickAssembler's screencode encoding
        // Emit .text for representable runs, .byte for non-representable bytes
        lines.push(...emitScreenCodeMixed(bytes));
      } else if (isPetsciiSubtype(subtype) || subtype === "") {
        // PETSCII string — use petscii_upper encoding where possible
        // petscii_upper maps source 'A'-'Z' → $41-$5A (matching unshifted PETSCII)
        lines.push(...emitPetsciiUpper(bytes));
      } else {
        lines.push(...ka.byteDirective(bytes));
      }
    }

    return { lines };
  }

  private getBlockBytes(block: Block, context: BuilderContext): Uint8Array | null {
    if (block.raw) {
      return decodeRaw(block.raw);
    }
    return context.getBytes(block.address, block.endAddress - block.address);
  }
}

function isPetsciiSubtype(subtype: string): boolean {
  const s = subtype.toLowerCase();
  return s === "petscii" || s === "petscii_mixed" || s === "petscii_upper" || s === "ascii" || s === "";
}

function isScreenCodeSubtype(subtype: string): boolean {
  const s = subtype.toLowerCase();
  return s === "screen_codes" || s === "screencode" || s === "screencode_mixed";
}


/**
 * Emit screen code bytes as a mix of .text and .byte directives.
 * Representable runs → .encoding "screencode_mixed" + .text "..."
 * Non-representable bytes → .byte
 * Only switches encoding when needed (wraps all .text runs in one encoding block).
 */
function emitScreenCodeMixed(bytes: Uint8Array): string[] {
  // Build runs: { text: string } or { rawBytes: number[] }
  type TextRun = { kind: "text"; text: string };
  type ByteRun = { kind: "bytes"; data: number[] };
  type Run = TextRun | ByteRun;

  const runs: Run[] = [];
  let textBuf: string[] = [];

  const flushText = () => {
    if (textBuf.length > 0) {
      runs.push({ kind: "text", text: textBuf.join("") });
      textBuf = [];
    }
  };

  for (const b of bytes) {
    const ch = screenCodeToChar(b);
    if (ch !== null) {
      textBuf.push(ch);
    } else {
      flushText();
      // Append to existing byte run or create new one
      const last = runs[runs.length - 1];
      if (last?.kind === "bytes") {
        last.data.push(b);
      } else {
        runs.push({ kind: "bytes", data: [b] });
      }
    }
  }
  flushText();

  // Check if we need encoding directives at all
  const hasText = runs.some((r) => r.kind === "text");
  const lines: string[] = [];

  if (hasText) {
    lines.push(`${ka.INDENT}.encoding "screencode_mixed"`);
  }

  for (const run of runs) {
    if (run.kind === "text") {
      lines.push(ka.textDirective(run.text));
    } else {
      lines.push(...ka.byteDirective(new Uint8Array(run.data)));
    }
  }

  if (hasText) {
    lines.push(`${ka.INDENT}.encoding "petscii_mixed"`);
  }

  return lines;
}

/**
 * Emit PETSCII bytes as a mix of .text and .byte directives using petscii_upper.
 * In petscii_upper: source 'A'-'Z' → $41-$5A (unshifted PETSCII uppercase).
 * Representable runs → .encoding "petscii_upper" + .text "..."
 * Non-representable bytes → .byte
 */
function emitPetsciiUpper(bytes: Uint8Array): string[] {
  type TextRun = { kind: "text"; text: string };
  type ByteRun = { kind: "bytes"; data: number[] };
  type Run = TextRun | ByteRun;

  const runs: Run[] = [];
  let textBuf: string[] = [];

  const flushText = () => {
    if (textBuf.length > 0) {
      runs.push({ kind: "text", text: textBuf.join("") });
      textBuf = [];
    }
  };

  for (const b of bytes) {
    const ch = petsciiUpperToChar(b);
    if (ch !== null) {
      textBuf.push(ch);
    } else {
      flushText();
      const last = runs[runs.length - 1];
      if (last?.kind === "bytes") {
        last.data.push(b);
      } else {
        runs.push({ kind: "bytes", data: [b] });
      }
    }
  }
  flushText();

  const hasText = runs.some((r) => r.kind === "text");
  const lines: string[] = [];

  if (hasText) {
    lines.push(`${ka.INDENT}.encoding "petscii_upper"`);
  }

  for (const run of runs) {
    if (run.kind === "text") {
      lines.push(ka.textDirective(run.text));
    } else {
      lines.push(...ka.byteDirective(new Uint8Array(run.data)));
    }
  }

  if (hasText) {
    lines.push(`${ka.INDENT}.encoding "petscii_mixed"`);
  }

  return lines;
}

/**
 * Convert a PETSCII byte to the source character that KickAssembler's
 * petscii_upper encoding will map back to the same byte.
 *
 * petscii_upper mapping:
 *   'A'-'Z' → $41-$5A  (uppercase source → uppercase PETSCII)
 *   ' '     → $20
 *   '0'-'9' → $30-$39
 *   punctuation ($21-$3F except $22) → identity
 */
function petsciiUpperToChar(b: number): string | null {
  // $22 = double quote — can't embed in .text "..." string
  if (b === 0x22) return null;
  // $20-$5A range (space through Z) maps identically in petscii_upper
  if (b >= 0x20 && b <= 0x5a) return String.fromCharCode(b);
  return null;
}

/**
 * Convert a screen code byte to the character that KickAssembler's
 * screencode_mixed encoding will map back to the same byte.
 *
 * KickAssembler screencode_mixed mapping:
 *   'a'-'z' → $01-$1A  (lowercase → uppercase screen codes)
 *   'A'-'Z' → $41-$5A  (uppercase → lowercase screen codes in shifted mode)
 *   '@'     → $00
 *   ' '     → $20
 *   '0'-'9' → $30-$39
 *   punctuation → same as ASCII
 */
function screenCodeToChar(b: number): string | null {
  // $00 = @ (screencode_mixed: '@' → $00)
  if (b === 0x00) return "@";
  // $01-$1A: screencode_mixed maps lowercase 'a'-'z' → $01-$1A
  if (b >= 0x01 && b <= 0x1a) return String.fromCharCode(b + 0x60); // a-z
  // $1B = [
  if (b === 0x1b) return "[";
  // $1C = £ (British pound) — not easily representable
  if (b === 0x1c) return null;
  // $1D = ]
  if (b === 0x1d) return "]";
  // $1E = ↑, $1F = ← — not representable in ASCII .text
  if (b === 0x1e || b === 0x1f) return null;
  // $20 = space
  if (b === 0x20) return " ";
  // $21-$3F = ASCII punctuation and digits (same mapping)
  if (b >= 0x21 && b <= 0x3f) {
    // $22 = " — can't embed quote in .text "..." string
    if (b === 0x22) return null;
    return String.fromCharCode(b);
  }
  // $40-$5F = shifted mode lowercase display — not commonly used in .text
  // $60-$7F = graphics characters
  // $80+ = reverse video versions
  return null;
}
