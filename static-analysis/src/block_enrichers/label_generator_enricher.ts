import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

export class LabelGeneratorEnricher implements BlockEnricher {
  name = "label_generator";
  description = "Auto-generates labels for unlabeled blocks";
  priority = 30;

  enrich(blocks: Block[], _context: EnricherContext): Block[] {
    for (const block of blocks) {
      if (block.inputNameHint) continue; // already has a parser-provided label

      const addr = block.address.toString(16).toUpperCase().padStart(4, "0");

      if (!block.labels) block.labels = [];

      switch (block.type) {
        case "subroutine":
          block.labels.push(`sub_${addr}`);
          break;
        case "irq_handler":
          block.labels.push(`irq_${addr}`);
          break;
        case "fragment":
          block.labels.push(`frag_${addr}`);
          break;
        case "data": {
          const prefix = getDataPrefix(block);
          block.labels.push(`${prefix}_${addr}`);
          break;
        }
        case "unknown":
          block.labels.push(`unk_${addr}`);
          break;
      }
    }
    return blocks;
  }
}

function getDataPrefix(block: Block): string {
  if (!block.candidates || block.candidates.length === 0) return "dat";

  const best = block.candidates[0];
  switch (best.type) {
    case "sprite": return "spr";
    case "charset": return "chr";
    case "screen_map": return "scr";
    case "bitmap": return "bmp";
    case "string": return "str";
    case "sid_music": return "sid";
    case "jump_table": return "jmp_tbl";
    case "lookup_table": return "tbl";
    case "basic": return "bas";
    case "padding": return "pad";
    case "compressed": return "cmp";
    default: return "dat";
  }
}
