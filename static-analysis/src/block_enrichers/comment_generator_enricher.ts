import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

export class CommentGeneratorEnricher implements BlockEnricher {
  name = "comment_generator";
  description = "Adds structural comments derived from control flow and data classification";
  priority = 40;

  enrich(blocks: Block[], _context: EnricherContext): Block[] {
    for (const block of blocks) {
      if (block.type === "unknown") continue;
      if (!block.comments) block.comments = [];

      if (block.type === "data") {
        addDataComments(block);
        continue;
      }

      // Loop detection
      if (block.loopBackEdges && block.loopBackEdges.length > 0) {
        for (const edge of block.loopBackEdges) {
          block.comments.push(
            `Contains loop: back-edge from $${edge.from.toString(16).toUpperCase().padStart(4, "0")} to $${edge.to.toString(16).toUpperCase().padStart(4, "0")}`
          );
        }
      }

      // Hardware access counts (structural — just counts, no names)
      if (block.hardwareRefs && block.hardwareRefs.length > 0) {
        const vicRefs = block.hardwareRefs.filter((a) => a >= 0xD000 && a < 0xD030);
        const sidRefs = block.hardwareRefs.filter((a) => a >= 0xD400 && a < 0xD420);
        const ciaRefs = block.hardwareRefs.filter((a) => a >= 0xDC00 && a < 0xDE00);

        if (vicRefs.length > 0) {
          block.comments.push(`VIC-II access: ${vicRefs.length} register${vicRefs.length > 1 ? "s" : ""}`);
        }
        if (sidRefs.length > 0) {
          block.comments.push(`SID access: ${sidRefs.length} register${sidRefs.length > 1 ? "s" : ""}`);
        }
        if (ciaRefs.length > 0) {
          block.comments.push(`CIA access: ${ciaRefs.length} register${ciaRefs.length > 1 ? "s" : ""}`);
        }
      }

      // SMC warning
      if (block.smcTargets && block.smcTargets.length > 0) {
        block.comments.push(
          `Self-modifying code: writes to ${block.smcTargets.length} code location${block.smcTargets.length > 1 ? "s" : ""}`
        );
      }
    }
    return blocks;
  }
}

function addDataComments(block: Block): void {
  if (!block.candidates || block.candidates.length === 0) return;
  if (!block.comments) block.comments = [];

  const best = block.candidates[0];
  block.comments.push(best.comment);

  if (block.candidates.length > 1) {
    block.comments.push(
      `${block.candidates.length} detector proposals (${block.candidates.map((c) => `${c.detector}:${c.confidence}`).join(", ")})`
    );
  }
}
