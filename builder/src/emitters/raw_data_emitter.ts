// ============================================================================
// Raw Data Emitter — fallback for unclaimed data blocks → .byte hex rows
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class RawDataEmitter implements EmitterPlugin {
  name = "raw_data";
  description = "Fallback: emit data blocks as .byte hex rows";
  priority = 90;

  handles(block: Block): boolean {
    return block.type === "data";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const bytes = this.getBlockBytes(block, context);

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    // Best candidate info as comment
    if (block.candidates && block.bestCandidate !== undefined) {
      const best = block.candidates[block.bestCandidate];
      if (best) {
        lines.push(ka.comment(`${best.type}${best.subtype ? ` (${best.subtype})` : ""} — ${best.comment}`));
      }
    }

    if (bytes) {
      lines.push(...ka.smartByteDirective(bytes));
    } else {
      // No bytes available — emit placeholder
      const size = block.endAddress - block.address;
      lines.push(ka.comment(`WARNING: ${size} bytes — no raw data available`));
      lines.push(ka.fillDirective(size, 0));
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
