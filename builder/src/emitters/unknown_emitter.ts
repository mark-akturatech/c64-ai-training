// ============================================================================
// Unknown Emitter — unknown blocks → .byte/.fill with warning comment
// Uses .fill for runs of repeated bytes (> 4 identical)
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class UnknownEmitter implements EmitterPlugin {
  name = "unknown";
  description = "Emit unknown blocks as .byte/.fill with warning";
  priority = 95;

  handles(block: Block): boolean {
    return block.type === "unknown";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const size = block.endAddress - block.address;

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    lines.push(ka.comment(`Unknown region: ${size} bytes`));

    const bytes = this.getBlockBytes(block, context);
    if (bytes) {
      lines.push(...ka.smartByteDirective(bytes));
    } else {
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
