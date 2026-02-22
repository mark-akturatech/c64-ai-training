// ============================================================================
// Structured Data Emitter — renders data blocks using enrichment.dataLayout
//
// Priority 15 (before most other data emitters). Handles blocks where
// Stage 5 Polish has provided a DataLayoutEntry[] spec describing how
// bytes should be grouped and annotated.
// ============================================================================

import type { Block, DataLayoutEntry } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class StructuredDataEmitter implements EmitterPlugin {
  name = "structured_data";
  description = "Emit data blocks with structured layout annotations from Stage 5 Polish";
  priority = 15;

  handles(block: Block): boolean {
    if ((block.enrichment?.dataLayout ?? []).length === 0) return false;

    // Defer to PointerTableEmitter — based on Stage 5 dataFormat, not static
    // analysis pointerTable flag (which incorrectly tags screen text blocks)
    const dfType = block.enrichment?.dataFormat?.type ?? "";
    const dfSub = block.enrichment?.dataFormat?.subtype ?? "";
    if (dfType === "pointer_table_lo" || dfType === "pointer_table_hi") return false;
    if (dfSub === "low_bytes" || dfSub === "high_bytes") return false;

    // Defer to PaddingEmitter
    if (block.enrichment?.alignmentTarget) return false;
    if (block.candidates && block.bestCandidate !== undefined) {
      const best = block.candidates[block.bestCandidate];
      if (best?.type === "padding" || best?.type === "fill") return false;
    }

    // Defer to SpriteEmitter
    if (block.candidates && block.bestCandidate !== undefined) {
      const best = block.candidates[block.bestCandidate];
      if (best?.type === "sprite_data") return false;
    }

    // Don't render mostly-zero blocks as text
    const layout = block.enrichment!.dataLayout!;
    const allText = layout.every(e => e.format === "text");
    if (allText && block.raw) {
      const bytes = decodeRaw(block.raw);
      const zeroCount = Array.from(bytes).filter(b => b === 0).length;
      if (zeroCount / bytes.length > 0.9) return false;
    }

    return true;
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const layout = block.enrichment!.dataLayout!;
    const bytes = this.getBlockBytes(block, context);

    // Block label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    // Header comment
    if (block.enrichment?.headerComment) {
      lines.push(...ka.wrapComment(block.enrichment.headerComment));
    }

    if (!bytes) {
      const size = block.endAddress - block.address;
      lines.push(ka.fillDirective(size, 0));
      return { lines };
    }

    // Validate layout matches block size
    const totalLayoutBytes = layout.reduce((sum, entry) => sum + entry.bytes, 0);
    if (totalLayoutBytes !== bytes.length) {
      // Layout doesn't match — fall back to raw bytes with a warning
      lines.push(ka.comment(`WARNING: dataLayout (${totalLayoutBytes}B) != block size (${bytes.length}B), using raw bytes`));
      lines.push(...ka.smartByteDirective(bytes));
      return { lines };
    }

    // Emit each layout group
    let offset = 0;
    for (const entry of layout) {
      const chunk = bytes.slice(offset, offset + entry.bytes);
      offset += entry.bytes;

      // Sub-header comment
      if (entry.subHeader) {
        lines.push(ka.comment(entry.subHeader));
      }

      // Sub-label
      if (entry.subLabel) {
        const resolved = context.resolveLabel(block.address + offset - entry.bytes);
        const subLabel = resolved ?? entry.subLabel;
        if (subLabel !== label) {
          lines.push(ka.label(subLabel));
        }
      }

      // Emit the bytes in the requested format
      const byteLine = formatLayoutEntry(chunk, entry, context);
      if (byteLine.includes("\n")) {
        // Multi-line output (e.g. encoding switches) — add comment to first data line
        const multiLines = byteLine.split("\n");
        if (entry.comment) {
          // Find the .text or .byte line and append comment there
          const dataIdx = multiLines.findIndex(l => l.includes(".text") || l.includes(".byte"));
          if (dataIdx >= 0) {
            multiLines[dataIdx] = `${multiLines[dataIdx].padEnd(40)}// ${entry.comment}`;
          }
        }
        lines.push(...multiLines);
      } else if (entry.comment) {
        // Inline comment on the data line
        const padded = byteLine.padEnd(40);
        lines.push(`${padded}// ${entry.comment}`);
      } else {
        lines.push(byteLine);
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

function formatLayoutEntry(
  bytes: Uint8Array,
  entry: DataLayoutEntry,
  _context: BuilderContext,
): string {
  const format = entry.format ?? "hex";

  // Text encoding — trigger on format:"text" OR when a screencode encoding is set
  // (AI often sets format:"hex" but encoding:"screencode_mixed" — still render as text)
  if ((format === "text" || entry.encoding?.includes("screencode")) && entry.encoding) {
    const enc = entry.encoding.toLowerCase();
    const textLines: string[] = [];
    textLines.push(`${ka.INDENT}.encoding "${enc}"`);
    // Try to represent as .text — fall back to .byte for non-representable bytes
    const text = tryDecodeText(bytes, enc);
    if (text) {
      textLines.push(ka.textDirective(text));
    } else {
      textLines.push(...ka.byteDirective(bytes));
    }
    textLines.push(`${ka.INDENT}.encoding "petscii_mixed"`);
    return textLines.join("\n");
  }

  // Numeric formats — split long lines at 16 values per row
  switch (format) {
    case "decimal": {
      const vals = Array.from(bytes).map(b => b.toString());
      return splitByteRows(vals);
    }
    case "binary": {
      const vals = Array.from(bytes).map(b => `%${b.toString(2).padStart(8, "0")}`);
      return splitByteRows(vals);
    }
    default: {
      // hex (default)
      const vals = Array.from(bytes).map(b => `$${b.toString(16).toUpperCase().padStart(2, "0")}`);
      return splitByteRows(vals);
    }
  }
}

/** Split byte values across multiple .byte lines when there are >16 values. */
function splitByteRows(vals: string[], perLine: number = 16): string {
  if (vals.length <= perLine) {
    return `${ka.INDENT}.byte ${vals.join(", ")}`;
  }
  const rows: string[] = [];
  for (let i = 0; i < vals.length; i += perLine) {
    rows.push(`${ka.INDENT}.byte ${vals.slice(i, i + perLine).join(", ")}`);
  }
  return rows.join("\n");
}

function tryDecodeText(bytes: Uint8Array, encoding: string): string | null {
  if (encoding.includes("screencode")) {
    // Try screen code decode
    const chars: string[] = [];
    for (const b of bytes) {
      const ch = screenCodeToChar(b);
      if (ch === null) return null;
      chars.push(ch);
    }
    return chars.join("");
  }
  // PETSCII
  const chars: string[] = [];
  for (const b of bytes) {
    if (b >= 0x20 && b <= 0x5a && b !== 0x22) {
      chars.push(String.fromCharCode(b));
    } else {
      return null;
    }
  }
  return chars.join("");
}

function screenCodeToChar(b: number): string | null {
  if (b === 0x00) return "@";
  if (b >= 0x01 && b <= 0x1a) return String.fromCharCode(b + 0x60);
  if (b === 0x1b) return "[";
  if (b === 0x1d) return "]";
  if (b === 0x20) return " ";
  if (b >= 0x21 && b <= 0x3f && b !== 0x22) return String.fromCharCode(b);
  return null;
}
