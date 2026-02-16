import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";
import { HARDWARE_SYMBOLS, KERNAL_SYMBOLS } from "../symbol_db.js";

export class CommentGeneratorEnricher implements BlockEnricher {
  name = "comment_generator";
  description = "Adds structural comments for AI consumption";
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

      // Hardware access summary
      if (block.hardwareRefs && block.hardwareRefs.length > 0) {
        const vicRefs = block.hardwareRefs.filter((a) => a >= 0xD000 && a < 0xD030);
        const sidRefs = block.hardwareRefs.filter((a) => a >= 0xD400 && a < 0xD420);
        const ciaRefs = block.hardwareRefs.filter((a) => a >= 0xDC00 && a < 0xDE00);

        if (vicRefs.length > 0) {
          const names = vicRefs
            .map((a) => HARDWARE_SYMBOLS[a]?.name)
            .filter(Boolean)
            .slice(0, 5);
          block.comments.push(`VIC-II access: ${names.join(", ")}${vicRefs.length > 5 ? ` (+${vicRefs.length - 5} more)` : ""}`);
        }
        if (sidRefs.length > 0) {
          block.comments.push(`SID access: ${sidRefs.length} register${sidRefs.length > 1 ? "s" : ""}`);
        }
        if (ciaRefs.length > 0) {
          block.comments.push(`CIA access: ${ciaRefs.length} register${ciaRefs.length > 1 ? "s" : ""}`);
        }
      }

      // KERNAL call summary
      if (block.callsOut && block.callsOut.length > 0) {
        const kernalCalls = block.callsOut
          .map((a) => KERNAL_SYMBOLS[a]?.name)
          .filter(Boolean);
        if (kernalCalls.length > 0) {
          block.comments.push(`KERNAL calls: ${kernalCalls.join(", ")}`);
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
