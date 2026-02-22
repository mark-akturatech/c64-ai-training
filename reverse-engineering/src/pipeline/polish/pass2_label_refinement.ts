// ============================================================================
// Pass 2: Label Refinement — short, purposeful labels for all blocks
//
// Single AI call with all labels + block purposes (~20 tokens per label).
// Returns refined label names: 2-15 chars, snake_case, C64 conventions.
// ============================================================================

import type { Block } from "@c64/shared";
import type { AIClient } from "../../shared/ai_client.js";

export interface Pass2Result {
  /** hex addr (4-digit uppercase, no $) → refined label name */
  refinements: Record<string, string>;
}

export async function runPass2(opts: {
  blocks: Block[];
  aiClient: AIClient;
}): Promise<Pass2Result> {
  const { blocks, aiClient } = opts;

  // Build label summary: address, type, current label, purpose
  const labelLines: string[] = [];

  for (const block of blocks) {
    const addr = hex(block.address);
    const addrKey = addr.toUpperCase();
    const label = block.enrichment?.semanticLabels?.[addrKey] ?? "";
    const purpose = block.enrichment?.purpose ?? "";
    const type = block.type;

    // Include sub-labels within this block (branch targets, sprite frames)
    const subLabels: string[] = [];
    if (block.enrichment?.semanticLabels) {
      for (const [slAddr, slName] of Object.entries(block.enrichment.semanticLabels)) {
        if (slAddr !== addrKey && slName) {
          subLabels.push(`  sub: $${slAddr} "${slName}"`);
        }
      }
    }

    let line = `$${addr}  ${type.padEnd(12)}  "${label}"  purpose: "${purpose}"`;
    labelLines.push(line);
    for (const sl of subLabels.slice(0, 3)) {
      labelLines.push(sl);
    }
  }

  const prompt = `You are renaming labels in a reverse-engineered Commodore 64 assembly program. The current labels were auto-generated from verbose AI purpose descriptions and are too long/awkward.

Your job: produce short, expert-quality labels that a C64 programmer would use.

## Rules:
- Labels MUST be 2-15 characters, snake_case (shorter is ALWAYS better)
- NEVER include verbs describing HOW code works — describe WHAT it is
  BAD: "load_a_16bit_pointer_from_a_table_and", "periodic_update_called_each_tick"
  GOOD: "sprite_irq", "color_irq"
- NEVER use "entry", "flag", "loop_entry", or "shadows" in label names — these are implementation details
  BAD: "copy_loop_entry_flag", "sprite_ptr_shadows", "periodic_update_entry"
  GOOD: "copy_screen", "copy_pointers", "restore_irq"
- Branch targets: describe the SECTION being entered, not the loop mechanism
  BAD: "color_rotate_loop_entry", "color_rotate_loop_entry_rev"
  GOOD: "shift_left", "shift_right"
- Subroutines: use C64 demo/game conventions: init, main_loop, sprite_irq, color_irq, play_music, wait_frame
- For IRQ handlers that do periodic/timed work: "color_irq" or "anim_irq" — NOT "tick_irq" or "periodic_update"
- Data blocks: what the data IS, not how it's used: sprite_params, color_tbl, irq_vectors, screen_row_0
- Raster IRQ chain tables: "irq_vector_lo", "irq_vector_hi", "irq_raster_line", "irq_index"
- Sprite parameter data: "sprite_params_top"/"sprite_params_bottom" (for two sets), NOT "frame_0"/"frame_1"
- State variables: ultra-short: frame_counter, color_index_a, irq_index, anim_phase
- Follow C64 conventions: irq, nmi, init, raster, sprite, vic, sid
- Avoid redundant prefixes: "init" not "initialize_display", "display_init"
- BASIC stubs: "basic_stub" or similar
- Pointer tables: name by what they point to (irq_vector_lo, sprite_params_lo)
- If the current label is already good (short, clear), keep it unchanged

## Current labels (${labelLines.length} blocks):
${labelLines.join("\n")}

Respond with JSON. Include ALL addresses — both block addresses AND sub-label addresses (branch targets).
Sub-labels like branch targets are the MOST important to rename since they tend to be the most verbose.

{
  "refinements": {
    "080E": "init",
    "082C": "main_loop",
    "0954": "pos_x"
  }
}`;

  const response = await aiClient.jsonCall(prompt, {
    reasoning_effort: "medium",
    systemPrompt: "You are a Commodore 64 assembly expert producing publication-quality label names. Respond with valid JSON only.",
  });

  return {
    refinements: normalizeRefinements(response.refinements as Record<string, string> | undefined),
  };
}

function normalizeRefinements(obj: Record<string, string> | undefined): Record<string, string> {
  if (!obj || typeof obj !== "object") return {};
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val !== "string" || !val) continue;
    const clean = key.replace(/^\$/, "").toUpperCase().padStart(4, "0");
    // Sanitize: force snake_case, strip invalid chars, strip trailing address suffixes
    let label = val.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
    label = label.replace(/_[0-9a-f]{4}$/, "");
    label = label.replace(/_[0-9a-f]{3}$/, "");
    // Strip banned noise patterns the AI keeps producing despite instructions
    label = stripBannedPatterns(label);
    if (label.length < 2) continue;
    if (label.length > 15) label = label.substring(0, 15).replace(/_[^_]*$/, "");
    if (!/^[a-z]/.test(label)) label = "lbl_" + label;
    result[clean] = label;
  }
  return result;
}

/** Remove noise suffixes/infixes the AI produces despite explicit instructions not to */
function stripBannedPatterns(label: string): string {
  // Strip trailing noise words: _entry, _flag, _entry_flag, _loop_entry, _loop
  label = label.replace(/_(?:entry_flag|loop_entry|entry|flag)$/, "");
  // Strip "_loop" suffix unless the whole label IS "loop" or "main_loop"
  if (label !== "loop" && label !== "main_loop") {
    label = label.replace(/_loop$/, "");
  }
  // Strip "_shadows" suffix
  label = label.replace(/_shadows$/, "");
  // Strip leading "loop_" unless it's the whole thing
  if (label !== "loop") {
    label = label.replace(/^loop_/, "");
  }
  // Clean up any double underscores left behind
  label = label.replace(/_+/g, "_").replace(/^_|_$/g, "");
  return label;
}

function hex(n: number): string {
  return n.toString(16).toUpperCase().padStart(4, "0");
}
