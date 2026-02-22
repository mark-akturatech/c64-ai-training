// ============================================================================
// Padding Emitter — fill regions → .fill N, $XX
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class PaddingEmitter implements EmitterPlugin {
  name = "padding";
  description = "Emit padding/fill data as .fill directives";
  priority = 28;

  handles(block: Block): boolean {
    if (block.type !== "data") return false;
    // Stage 5 Polish can set alignmentTarget for padding blocks
    if (block.enrichment?.alignmentTarget) return true;
    if (!block.candidates || block.bestCandidate === undefined) return false;
    const best = block.candidates[block.bestCandidate];
    return best?.type === "padding" || best?.type === "fill";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const size = block.endAddress - block.address;

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    // Alignment target: emit .fill $XXXX - *, $00 instead of .fill N, $00
    if (block.enrichment?.alignmentTarget) {
      const target = block.enrichment.alignmentTarget;
      const targetHex = `$${target.toString(16).toUpperCase().padStart(4, "0")}`;
      lines.push(`${ka.INDENT}.fill ${targetHex} - *, $00`);
      return { lines };
    }

    // Detect fill byte
    const bytes = this.getBlockBytes(block, context);
    let fillByte = 0x00;
    if (bytes && bytes.length > 0) {
      fillByte = bytes[0];
      // Verify all bytes are the same
      const allSame = bytes.every((b) => b === fillByte);
      if (!allSame) {
        // Not uniform fill — fall through to .byte output
        lines.push(ka.comment(`Non-uniform padding: ${size} bytes`));
        lines.push(...ka.smartByteDirective(bytes));
        return { lines };
      }
    }

    lines.push(ka.fillDirective(size, fillByte));

    return { lines };
  }

  private getBlockBytes(block: Block, context: BuilderContext): Uint8Array | null {
    if (block.raw) {
      return decodeRaw(block.raw);
    }
    return context.getBytes(block.address, block.endAddress - block.address);
  }
}
