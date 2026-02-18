// ============================================================================
// Lookup Table Emitter — byte/word tables → .byte/.word with annotations
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class LookupTableEmitter implements EmitterPlugin {
  name = "lookup_table";
  description = "Emit byte/word lookup tables";
  priority = 25;

  handles(block: Block): boolean {
    if (block.type !== "data") return false;
    if (!block.candidates || block.bestCandidate === undefined) return false;
    const best = block.candidates[block.bestCandidate];
    return best?.type === "lookup_table" || best?.type === "byte_table" || best?.type === "word_table";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const best = block.candidates![block.bestCandidate!];
    const bytes = this.getBlockBytes(block, context);

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    if (best.comment) {
      lines.push(ka.comment(best.comment));
    }

    if (!bytes) {
      const size = block.endAddress - block.address;
      lines.push(ka.fillDirective(size, 0));
      return { lines };
    }

    if (best.type === "word_table" || best.subtype === "word") {
      // Emit as .word
      const words: number[] = [];
      for (let i = 0; i < bytes.length - 1; i += 2) {
        words.push(bytes[i] | (bytes[i + 1] << 8));
      }
      // Try to resolve labels for word values
      const wordStrs = words.map((w) => {
        const lbl = context.resolveLabel(w);
        return lbl || `$${w.toString(16).toUpperCase().padStart(4, "0")}`;
      });
      // Emit in groups of 8
      for (let i = 0; i < wordStrs.length; i += 8) {
        const chunk = wordStrs.slice(i, i + 8);
        lines.push(`${ka.INDENT}.word ${chunk.join(", ")}`);
      }
    } else {
      // Emit as .byte
      lines.push(...ka.byteDirective(bytes, 16));
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
