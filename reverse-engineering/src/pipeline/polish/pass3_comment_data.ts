// ============================================================================
// Pass 3: Comment + Data Refinement — per-module AI calls
//
// For each module: sends full block details (instructions + comments for code,
// raw hex + access context for data), gets back refined comments, data layout
// specs, and formatting overrides.
// ============================================================================

import type { Block, DataLayoutEntry } from "@c64/shared";
import type { AIClient } from "../../shared/ai_client.js";
import type { IntegrationJson, DependencyGraphEdge, MutableGraphInterface } from "../../types.js";
import { fullCodeSummary, fullDataSummary, compactSummary } from "./block_summarizer.js";

export interface Pass3BlockResult {
  /** Revised header comment (null = remove, string = replace) */
  headerComment?: string | null;
  /** Revised inline comments: addr → comment (null = remove that comment) */
  inlineComments?: Record<string, string | null>;
  /** Data format override */
  dataFormat?: { type: string; subtype?: string };
  /** Structured data layout spec */
  dataLayout?: DataLayoutEntry[];
  /** Alignment target for padding blocks */
  alignmentTarget?: number;
  /** Label override (for unknown blocks the AI can now identify) */
  labelOverride?: string;
}

export interface Pass3Result {
  /** hex addr (4-digit uppercase, no $) → block refinements */
  blockResults: Record<string, Pass3BlockResult>;
}

const MAX_BLOCKS_PER_CALL = 150;

export async function runPass3(opts: {
  blocks: Block[];
  integration: IntegrationJson;
  graph: MutableGraphInterface;
  aiClient: AIClient;
}): Promise<Pass3Result> {
  const { blocks, integration, graph, aiClient } = opts;

  const allResults: Record<string, Pass3BlockResult> = {};
  const edges = graph.getEdges();

  // Group blocks by module
  const moduleBlocks = groupByModule(blocks, integration);

  for (const [moduleName, moduleBlockList] of Object.entries(moduleBlocks)) {
    // Build cross-module context: compact summaries of blocks NOT in this module
    const crossModuleContext = blocks
      .filter(b => !moduleBlockList.includes(b))
      .map(b => compactSummary(b))
      .join("\n");

    // Sub-chunk if module is too large
    const chunks = chunkBlocks(moduleBlockList, MAX_BLOCKS_PER_CALL);

    for (const chunk of chunks) {
      const results = await processChunk(chunk, moduleName, crossModuleContext, edges, blocks, aiClient);
      Object.assign(allResults, results);
    }
  }

  return { blockResults: allResults };
}

async function processChunk(
  chunk: Block[],
  moduleName: string,
  crossModuleContext: string,
  edges: readonly DependencyGraphEdge[],
  allBlocks: Block[],
  aiClient: AIClient,
): Promise<Record<string, Pass3BlockResult>> {
  // Build detailed block descriptions
  const blockDetails: string[] = [];

  for (const block of chunk) {
    if (block.instructions && block.instructions.length > 0) {
      blockDetails.push(fullCodeSummary(block));
    } else {
      const accessedBy = getDataAccessors(block, edges, allBlocks);
      blockDetails.push(fullDataSummary(block, accessedBy));
    }
    blockDetails.push(""); // separator
  }

  const prompt = `You are improving the documentation quality of a reverse-engineered Commodore 64 program. Below are the full details of blocks in the "${moduleName}" module, followed by compact summaries of other modules for context.

## Your tasks:

### For CODE blocks:
1. **headerComment**: Rewrite the block header comment. Focus on INTENT — what does this code accomplish and why? 1-3 lines max. Never paraphrase individual instructions.
2. **inlineComments**: AGGRESSIVELY remove comments. Target: <20% of lines should have comments. A 20-instruction subroutine needs only 3-5 comments, NOT 15-20. Remove ALL of these patterns:
   - Register loads/stores where the purpose is obvious from context ("load zero", "store to register", "save to X")
   - Loop counter comparisons ("compare X to 40", "check if done")
   - Branch instructions ("branch if not equal", "loop back")
   - Stack operations ("push/pull accumulator")
   - Any comment that just restates the instruction in English
   - Comments that mention hex addresses ($XXXX) — the reader can see the address from labels and origin directives
   - Comments that name registers the instruction already references (e.g., "VIC-II border color register ($D020)" on a line that already says 'sta EXTCOL')
   - Comments starting with "pulse", "advance", "reload", "decrement", "save", "restore", "load", "store", "write", "copy", "set" — these restate the instruction mechanically
   - Comments on inc VICIRQ / inc $D019 — just "acknowledge VIC IRQ" or null
   - Comments on jmp KERNAL_IRQ_RET — the label is self-documenting, set to null
   - Comments that mention BOTH a label name AND what it does — redundant with the label
   Only KEEP comments that explain: magic numbers ($7F = disable CIA, $FF = all sprites), what a hardware register DOES on first use only (e.g., "enable all 8 sprites"), algorithmic intent ("advance palette index mod 8"), or non-obvious data transformations. Keep comments SHORT (under 40 chars). Set removed comments to null.

### CRITICAL comment rules:
- NEVER include hex addresses ($XXXX) in ANY comment — not header comments, not inline comments, not data comments
- NEVER restate what the label name already says
- NEVER describe what an instruction does mechanically — describe WHY

### For DATA blocks:
1. **dataFormat**: If you can identify what the data represents (sprite data, screen text, color values, position tables, etc.), specify the format.
2. **dataLayout**: For structured data (records, multi-field tables), specify how bytes should be grouped and annotated. Each entry has: bytes (count), comment (what this group is), format ("hex"|"decimal"|"binary"|"text"), encoding (for text: "screencode_mixed"|"petscii_upper"), subLabel (optional label), subHeader (optional section comment).
   **IMPORTANT for screen text**: When a 40-byte block contains screen codes (values $00-$3F and $41-$5A), set format to "text" AND encoding to "screencode_mixed". This renders as readable .text directives instead of raw hex bytes. Screen codes $01-$1A are lowercase letters a-z, $20 is space, $21-$3F are digits/punctuation.
3. **alignmentTarget**: For padding/fill blocks (all zeros or $FF before a power-of-2 address), set the alignment address (e.g., 8192 for $2000).
4. **labelOverride**: For unknown blocks you can now identify from context, suggest a label. Use clear, readable names — NOT abbreviations:
   BAD: "div_cnt", "rot_ptr_a", "pal_rot", "spr_ptr_lo"
   GOOD: "frame_counter", "color_index_a", "color_palette", "sprite_params_lo"

### C64-specific patterns to look for:
- **Sprite parameter blocks**: When code copies bytes to VIC sprite registers ($D000-$D01F) via indirect indexed addressing, the source data is typically structured as: 16 bytes positions (8x X,Y pairs), 8 bytes individual colors, 2 bytes multicolors (SPMC0/SPMC1), 8 bytes sprite pointers. Use AT MOST 2 subLabels per sprite parameter region — one per set with DISTINCT names (e.g., "sprite_params_top" for the first 34 bytes and "sprite_params_bottom" for the second 34 bytes). CRITICAL: sub-label names MUST be unique — never use the same name twice. Do NOT create per-sprite sub-labels like "spr0_pos", "spr1_pos", "spr0_color" — these are noise. Instead, use the COMMENT field to document individual bytes. Group as:
  - 16 bytes: positions (comment per 2-byte pair: "sprite 0: X=$59 Y=$32")
  - 8 bytes: individual colors (one comment: "colors: red, purple, blue, orange...")
  - 2 bytes: multicolors (one comment: "SPMC0/SPMC1")
  - 8 bytes: sprite pointers (one comment: "sprite pointers (alternating frames)")
- **Alignment padding**: Zero-filled blocks before $2000/$4000/$8000 are sprite/charset alignment padding. Set alignmentTarget to the boundary address (e.g., 8192 for $2000). Do NOT set dataLayout on these — just alignmentTarget.
- **Zero-filled regions**: If a data block is entirely or mostly $00 bytes, it is NOT screen text. Do NOT set dataFormat to "text" or "screen_matrix" on zero-filled blocks. Leave them as padding/fill.
- **Pointer tables**: When a block's bytes are lo/hi bytes of known addresses, set dataFormat type to "pointer_table_lo" or "pointer_table_hi".
- **IRQ vector tables**: Tables of lo/hi bytes for interrupt handler addresses — identify the handlers they point to.
- **Color/data rows**: When a data block has 40 bytes of color RAM values, use a single dataLayout entry with all 40 bytes. The builder automatically splits long rows at 16 bytes per line. No need to split into multiple layout entries for line-wrapping.
- **subLabel usage**: Use subLabels SPARINGLY — only for major structural boundaries (e.g., start of each sprite param set in a multi-set block). A 34-byte block needs at most 1-2 subLabels, not one per field.

### For ALL blocks:
- Look at the raw hex data and access patterns — can you figure out what unknown data actually is?
- Look for patterns: sequential values = position tables, repeated structures = sprite params, etc.

## Module "${moduleName}" blocks (${chunk.length} total):
${blockDetails.join("\n")}

## Other modules (compact context):
${crossModuleContext || "(no other modules)"}

Respond with JSON. Only include blocks you have changes for. Use 4-digit uppercase hex addresses without $ prefix.

{
  "blocks": {
    "080E": {
      "headerComment": "Initialize display, set up sprite multiplexer, install raster IRQ chain",
      "inlineComments": {
        "0811": null,
        "0814": "Bank 0, screen at $0400, chars at $1000",
        "0820": null
      }
    },
    "09F4": {
      "dataFormat": { "type": "table", "subtype": "sprite_params" },
      "dataLayout": [
        { "bytes": 3, "comment": "Sprite 0: X=89, Y=50, color=1", "format": "decimal" },
        { "bytes": 3, "comment": "Sprite 1: X=71, Y=60, color=2", "format": "decimal" }
      ],
      "labelOverride": "sprite_params"
    },
    "0A44": {
      "alignmentTarget": 8192
    }
  }
}`;

  const response = await aiClient.jsonCall(prompt, {
    reasoning_effort: "high",
    systemPrompt: "You are a Commodore 64 reverse engineering expert producing publication-quality assembly documentation. Respond with valid JSON only.",
  });

  return normalizePass3Response(response.blocks as Record<string, unknown> | undefined);
}

/** Group blocks by their module assignment from integration.json */
function groupByModule(blocks: Block[], integration: IntegrationJson): Record<string, Block[]> {
  const result: Record<string, Block[]> = {};
  const blockMap = new Map(blocks.map(b => [b.address, b]));

  for (const file of integration.files) {
    const moduleBlocks: Block[] = [];
    for (const blockId of file.blocks) {
      const addrMatch = blockId.match(/[_]([0-9a-fA-F]+)$/);
      if (addrMatch) {
        const addr = parseInt(addrMatch[1], 16);
        const block = blockMap.get(addr);
        if (block) moduleBlocks.push(block);
      }
    }
    if (moduleBlocks.length > 0) {
      result[file.module] = moduleBlocks;
    }
  }

  // Any blocks not assigned to a module go into "unassigned"
  const assignedAddrs = new Set(Object.values(result).flat().map(b => b.address));
  const unassigned = blocks.filter(b => !assignedAddrs.has(b.address));
  if (unassigned.length > 0) {
    result.unassigned = unassigned;
  }

  return result;
}

function chunkBlocks(blocks: Block[], maxPerChunk: number): Block[][] {
  if (blocks.length <= maxPerChunk) return [blocks];
  const chunks: Block[][] = [];
  for (let i = 0; i < blocks.length; i += maxPerChunk) {
    chunks.push(blocks.slice(i, i + maxPerChunk));
  }
  return chunks;
}

/** Get code blocks that access a data block, with purpose context */
function getDataAccessors(
  block: Block,
  edges: readonly DependencyGraphEdge[],
  allBlocks: Block[],
): Array<{ address: number; purpose: string; via: string }> {
  if (block.type !== "data" && block.type !== "unknown") return [];
  return edges
    .filter(e => e.target === block.address && e.category === "data")
    .map(e => {
      const sourceAddr = parseInt(e.source.replace(/^(code|data)_/, ""), 16);
      const sourceBlock = allBlocks.find(b => b.address === sourceAddr);
      return {
        address: sourceAddr,
        purpose: sourceBlock?.enrichment?.purpose ?? "unknown",
        via: e.type ?? "ref",
      };
    })
    .slice(0, 6);
}

function normalizePass3Response(blocks: Record<string, unknown> | undefined): Record<string, Pass3BlockResult> {
  if (!blocks || typeof blocks !== "object") return {};
  const result: Record<string, Pass3BlockResult> = {};

  for (const [key, val] of Object.entries(blocks)) {
    if (!val || typeof val !== "object") continue;
    const v = val as Record<string, unknown>;
    const addr = key.replace(/^\$/, "").toUpperCase().padStart(4, "0");

    const entry: Pass3BlockResult = {};

    if ("headerComment" in v) {
      entry.headerComment = v.headerComment === null ? null : String(v.headerComment ?? "");
    }

    if (v.inlineComments && typeof v.inlineComments === "object") {
      entry.inlineComments = {};
      for (const [iAddr, comment] of Object.entries(v.inlineComments as Record<string, unknown>)) {
        const cleanAddr = iAddr.replace(/^\$/, "").toUpperCase().padStart(4, "0");
        entry.inlineComments[cleanAddr] = comment === null ? null : String(comment ?? "");
      }
    }

    if (v.dataFormat && typeof v.dataFormat === "object") {
      const df = v.dataFormat as Record<string, unknown>;
      entry.dataFormat = { type: String(df.type ?? ""), subtype: df.subtype ? String(df.subtype) : undefined };
    }

    if (Array.isArray(v.dataLayout)) {
      entry.dataLayout = v.dataLayout
        .filter((d): d is Record<string, unknown> => d != null && typeof d === "object")
        .map(d => ({
          bytes: Number(d.bytes ?? 0),
          comment: d.comment ? String(d.comment) : undefined,
          format: (d.format as DataLayoutEntry["format"]) ?? undefined,
          encoding: d.encoding ? String(d.encoding) : undefined,
          subLabel: d.subLabel ? normalizeLabel(String(d.subLabel)) : undefined,
          subHeader: d.subHeader ? String(d.subHeader) : undefined,
        }));
    }

    if (typeof v.alignmentTarget === "number") {
      entry.alignmentTarget = v.alignmentTarget;
    }

    if (typeof v.labelOverride === "string" && v.labelOverride) {
      entry.labelOverride = normalizeLabel(v.labelOverride);
    }

    result[addr] = entry;
  }

  return result;
}

/** Normalize a label: snake_case, max 15 chars, strip trailing address suffixes */
function normalizeLabel(raw: string): string {
  let label = raw.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  // Strip trailing hex address suffixes like _09f4, _2000, _0a42
  label = label.replace(/_[0-9a-f]{4}$/, "");
  label = label.replace(/_[0-9a-f]{3}$/, "");
  if (label.length < 2) return raw.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 8);
  if (label.length > 15) label = label.substring(0, 15).replace(/_[^_]*$/, "");
  if (!/^[a-z]/.test(label)) label = "lbl_" + label;
  return label;
}
