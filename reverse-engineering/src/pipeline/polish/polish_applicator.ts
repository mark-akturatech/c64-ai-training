// ============================================================================
// Polish Applicator — applies all 3 pass results to blocks.json enrichment
//
// Takes the original blocks + results from passes 1-3 and produces a new
// blocks array with updated enrichment fields. Does NOT modify input blocks.
// ============================================================================

import type { Block, BlockEnrichment, DataLayoutEntry } from "@c64/shared";
import type { Pass1Result } from "./pass1_program_overview.js";
import type { Pass2Result } from "./pass2_label_refinement.js";
import type { Pass3Result } from "./pass3_comment_data.js";

export interface PolishOutput {
  blocks: Block[];
  programDescription: string;
}

export function applyPolish(opts: {
  blocks: Block[];
  pass1: Pass1Result;
  pass2: Pass2Result;
  pass3: Pass3Result;
}): PolishOutput {
  const { blocks, pass1, pass2, pass3 } = opts;

  const polished = blocks.map(block => {
    const addr = hex(block.address);
    const enrichment: BlockEnrichment = { ...(block.enrichment ?? {}) };

    // ── Pass 1: Section headers ──
    if (pass1.sectionHeaders[addr]) {
      enrichment.sectionHeader = pass1.sectionHeaders[addr];
    }

    // ── Pass 1: Module assignment from data groupings ──
    // (Module is already set from Stage 4, but groupings add context)

    // ── Pass 2: Label refinement ──
    {
      const labels = { ...(enrichment.semanticLabels ?? {}) };
      let changed = false;

      // Apply refinements to the block's own label AND any sub-labels within this block
      for (const [labelAddr, labelName] of Object.entries(labels)) {
        if (pass2.refinements[labelAddr]) {
          labels[labelAddr] = pass2.refinements[labelAddr];
          changed = true;
        } else {
          // Safety net: strip banned noise patterns from unrenamed labels
          const cleaned = stripBannedPatterns(labelName);
          if (cleaned !== labelName && cleaned.length >= 2) {
            labels[labelAddr] = cleaned;
            changed = true;
          }
        }
      }

      if (changed) {
        enrichment.semanticLabels = labels;
      }
    }

    // ── Pass 3: Comment + data refinements ──
    const p3 = pass3.blockResults[addr];
    if (p3) {
      // Header comment
      if (p3.headerComment !== undefined) {
        if (p3.headerComment === null) {
          delete enrichment.headerComment;
        } else {
          enrichment.headerComment = p3.headerComment;
        }
      }

      // Inline comments
      if (p3.inlineComments) {
        const existing = { ...(enrichment.inlineComments ?? {}) };
        for (const [iAddr, comment] of Object.entries(p3.inlineComments)) {
          if (comment === null) {
            delete existing[iAddr];
          } else {
            existing[iAddr] = comment;
          }
        }
        if (Object.keys(existing).length > 0) {
          enrichment.inlineComments = existing;
        } else {
          delete enrichment.inlineComments;
        }
      }

      // Data format override
      if (p3.dataFormat) {
        enrichment.dataFormat = {
          ...enrichment.dataFormat,
          type: p3.dataFormat.type,
          subtype: p3.dataFormat.subtype,
        };
      }

      // Structured data layout
      if (p3.dataLayout && p3.dataLayout.length > 0) {
        // Validate: total bytes in layout should match block size
        const totalLayoutBytes = p3.dataLayout.reduce((sum, entry) => sum + entry.bytes, 0);
        const blockSize = block.endAddress - block.address;
        if (totalLayoutBytes === blockSize) {
          enrichment.dataLayout = p3.dataLayout;
        }
        // If mismatch, skip — safety first, don't corrupt binary output
      }

      // Alignment target
      if (p3.alignmentTarget) {
        enrichment.alignmentTarget = p3.alignmentTarget;
      }

      // Label override for unknown blocks
      if (p3.labelOverride) {
        const labels = { ...(enrichment.semanticLabels ?? {}) };
        labels[addr] = p3.labelOverride;
        enrichment.semanticLabels = labels;
      }
    }

    return { ...block, enrichment };
  });

  // ── Deterministic alignment detection ──
  // If a padding/fill block ends at a well-known alignment boundary,
  // set alignmentTarget so PaddingEmitter renders `.fill $XXXX - *, $00`
  const ALIGNMENT_BOUNDARIES = [0x2000, 0x4000, 0x8000, 0xC000];
  for (const block of polished) {
    if (block.enrichment?.alignmentTarget) continue;
    const best = block.candidates?.[block.bestCandidate ?? -1];
    if (best?.type !== "padding" && best?.type !== "fill") continue;
    if (ALIGNMENT_BOUNDARIES.includes(block.endAddress)) {
      block.enrichment = { ...block.enrichment, alignmentTarget: block.endAddress };
    }
  }

  return {
    blocks: polished,
    programDescription: pass1.programDescription,
  };
}

function hex(n: number): string {
  return n.toString(16).toUpperCase().padStart(4, "0");
}

/** Remove noise suffixes the AI produces despite instructions not to */
function stripBannedPatterns(label: string): string {
  // Skip hardware register names (uppercase)
  if (label !== label.toLowerCase()) return label;
  label = label.replace(/_(?:entry_flag|loop_entry|entry|flag)$/, "");
  if (label !== "loop" && label !== "main_loop") {
    label = label.replace(/_loop$/, "");
  }
  label = label.replace(/_shadows$/, "");
  if (label !== "loop") {
    label = label.replace(/^loop_/, "");
  }
  return label.replace(/_+/g, "_").replace(/^_|_$/g, "");
}
