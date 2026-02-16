import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

export class CoverageValidatorEnricher implements BlockEnricher {
  name = "coverage_validator";
  description = "Validates every loaded byte is owned by exactly one block";
  priority = 99;

  enrich(blocks: Block[], context: EnricherContext): Block[] {
    const owner = new Uint32Array(65536);
    const conflicts: Array<{ address: number; block1: string; block2: string }> = [];
    const gaps: Array<{ start: number; end: number }> = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockIndex = i + 1;

      for (let addr = block.address; addr < block.endAddress; addr++) {
        if (owner[addr] !== 0) {
          conflicts.push({
            address: addr,
            block1: blocks[owner[addr] - 1].id,
            block2: block.id,
          });
        }
        owner[addr] = blockIndex;
      }
    }

    for (const region of context.loadedRegions) {
      for (let addr = region.start; addr < region.end; addr++) {
        if (owner[addr] === 0) {
          let gapEnd = addr + 1;
          while (gapEnd < region.end && owner[gapEnd] === 0) gapEnd++;
          gaps.push({ start: addr, end: gapEnd });
          addr = gapEnd - 1;
        }
      }
    }

    if (gaps.length > 0 || conflicts.length > 0) {
      const gapStr = gaps.map((g) =>
        `$${g.start.toString(16).padStart(4, "0")}-$${g.end.toString(16).padStart(4, "0")}`
      ).join(", ");
      const conflictStr = conflicts.map((c) =>
        `$${c.address.toString(16).padStart(4, "0")} (${c.block1} vs ${c.block2})`
      ).join(", ");

      console.error(
        `Coverage warning: ${gaps.length} gap(s)${gapStr ? `: ${gapStr}` : ""}, ` +
        `${conflicts.length} conflict(s)${conflictStr ? `: ${conflictStr}` : ""}`
      );
    }

    return blocks;
  }
}
