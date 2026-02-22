// ============================================================================
// Pass 1: Program Overview — file description, section headers, data groupings
//
// Single AI call using compact block summaries (~40 tokens each).
// Returns program description, section headers, and data groupings.
// ============================================================================

import type { Block } from "@c64/shared";
import type { AIClient } from "../../shared/ai_client.js";
import type { IntegrationJson, DependencyGraphEdge, MutableGraphInterface } from "../../types.js";
import { compactSummary } from "./block_summarizer.js";

export interface Pass1Result {
  programDescription: string;
  sectionHeaders: Record<string, string>;  // hex addr → section header text
  dataGroupings: Array<{
    blocks: string[];      // hex addresses
    groupName: string;
    groupPurpose?: string;
  }>;
}

export async function runPass1(opts: {
  blocks: Block[];
  integration: IntegrationJson;
  graph: MutableGraphInterface;
  aiClient: AIClient;
  refinedLabels?: Record<string, string>;
}): Promise<Pass1Result> {
  const { blocks, integration, graph, aiClient, refinedLabels } = opts;

  // Build compact summaries with data reference context
  const edges = graph.getEdges();
  const summaryLines: string[] = [];

  for (const block of blocks) {
    const dataRefs = getDataRefs(block, edges);
    const accessedBy = getAccessedBy(block, edges, blocks);
    summaryLines.push(compactSummary(block, dataRefs, accessedBy));
  }

  // Build integration context
  const integrationContext = buildIntegrationContext(integration);

  // Build refined labels context
  const labelContext = refinedLabels ? buildLabelContext(refinedLabels) : "";

  const prompt = `You are analyzing a reverse-engineered Commodore 64 program. Below is a compact summary of every block in the program, plus structural analysis from earlier pipeline stages.

Your job is to understand what this program does holistically and produce three things:

1. **programDescription**: A concise technical description (8-17 lines) for the top of the ASM file. Format:
   - Line 1: one-line title + attribution if visible in screen text strings (e.g., "16-sprite raster-split demo — www.0xc64.com")
   - Line 2: "Load address: $XXXX"
   - Blank line
   - What the program DISPLAYS: sprite count, text content visible on screen, visual effects. Decode any screen text data and QUOTE the visible strings.
   - HOW it works: describe the raster IRQ chain as a structured list. For each IRQ slot, show: slot number, raster line ($XX hex), handler label name, and one-line description. Example format:
     Three-stage raster IRQ chain:
       Slot 0 (line $00):  sprite_irq — set up top 8 sprites
       Slot 1 (line $8C):  sprite_irq — set up bottom 8 sprites (multiplex)
       Slot 2 (line $FA):  color_irq  — color-cycling animation, resets chain
   - Data layout: where sprite frames live (e.g., "Two hires sprite frames at $2000"), how many, hires vs multicolor
   Use LABEL NAMES from the refined labels list below when referring to code (init, sprite_irq, color_irq — NOT verbose descriptions). Use $-addresses only for hardware registers, raster lines, and memory regions. Do NOT reference block IDs, pipeline stages, or internal analysis details — write for a programmer reading the ASM source.

2. **sectionHeaders**: Logical section dividers to insert before specific blocks. Format: "--- Short title ---" (with dashes). Examples: "--- Initialization ---", "--- Sprite IRQ handler ---", "--- Animation state ---", "--- Screen layout data ---". Only add where there's a natural grouping boundary — don't add one before every block.

3. **dataGroupings**: Groups of adjacent data blocks that belong together conceptually (e.g., sprite X/Y position tables, color tables for the same screen region, IRQ vector pairs). This helps the polish pipeline understand which blocks share context.

## Program blocks (${blocks.length} total):
${summaryLines.join("\n")}

## Structural analysis:
${integrationContext}
${labelContext}

Respond with JSON:
{
  "programDescription": "Multi-line description...",
  "sectionHeaders": {
    "080E": "--- Initialization ---",
    "0954": "--- Sprite position tables ---"
  },
  "dataGroupings": [
    {
      "blocks": ["0954", "097C", "09A4", "09CC"],
      "groupName": "sprite_positions",
      "groupPurpose": "X/Y position tables for sprite animation frames"
    }
  ]
}

Rules:
- Use uppercase hex addresses WITHOUT $ prefix as keys (e.g., "080E" not "$080E")
- Section headers should be short (under 50 chars), use "--- Title ---" format
- programDescription should be insightful, not just restating block purposes
- Data groupings should only group blocks that are genuinely related`;

  const response = await aiClient.jsonCall(prompt, {
    reasoning_effort: "medium",
    systemPrompt: "You are a Commodore 64 reverse engineering expert producing publication-quality documentation. Respond with valid JSON only.",
  });

  return {
    programDescription: String(response.programDescription ?? ""),
    sectionHeaders: normalizeAddrKeys(response.sectionHeaders as Record<string, string> | undefined),
    dataGroupings: normalizeGroupings(response.dataGroupings as unknown[]),
  };
}

/** Get data block addresses referenced by a code block's instructions */
function getDataRefs(block: Block, edges: readonly DependencyGraphEdge[]): number[] {
  if (block.type === "data" || block.type === "unknown") return [];
  const nodeId = `code_${block.address.toString(16).padStart(4, "0")}`;
  return edges
    .filter(e => e.source === nodeId && e.category === "data")
    .map(e => e.target)
    .slice(0, 8);
}

/** Get code blocks that access a data block */
function getAccessedBy(
  block: Block,
  edges: readonly DependencyGraphEdge[],
  allBlocks: Block[],
): Array<{ address: number; via: string }> {
  if (block.type !== "data" && block.type !== "unknown") return [];
  const targetAddr = block.address;
  return edges
    .filter(e => e.target === targetAddr && e.category === "data")
    .map(e => {
      const sourceAddr = parseInt(e.source.replace(/^(code|data)_/, ""), 16);
      const sourceBlock = allBlocks.find(b => b.address === sourceAddr);
      const via = e.type ?? "ref";
      return { address: sourceAddr, via: `${via} from ${sourceBlock?.enrichment?.purpose ?? "code"}` };
    })
    .slice(0, 4);
}

function buildIntegrationContext(integration: IntegrationJson): string {
  const lines: string[] = [];

  lines.push(`Program: ${integration.program.name}`);
  if (integration.program.description && integration.program.description !== `program starting at ${integration.program.entryPoint}`) {
    lines.push(`Description: ${integration.program.description}`);
  }
  lines.push(`Entry point: ${integration.program.entryPoint}`);

  if (integration.program.mainLoop) {
    lines.push(`Main loop: ${integration.program.mainLoop.block} — ${integration.program.mainLoop.description}`);
  }

  if (integration.program.irqHandlers.length > 0) {
    lines.push(`IRQ handlers: ${integration.program.irqHandlers.map(h => `${h.address} (${h.purpose})`).join(", ")}`);
  }

  if (integration.program.initChain.length > 0) {
    lines.push(`Init chain: ${integration.program.initChain.map(h => `${h.block} (${h.purpose})`).join(" → ")}`);
  }

  lines.push(`Modules: ${integration.files.map(f => `${f.module} (${f.blocks.length} blocks)`).join(", ")}`);

  return lines.join("\n");
}

function buildLabelContext(refinedLabels: Record<string, string>): string {
  const entries = Object.entries(refinedLabels);
  if (entries.length === 0) return "";
  const lines = entries.map(([addr, label]) => `$${addr} → ${label}`);
  return `\n## Refined labels (use these names in the description):\n${lines.join("\n")}`;
}

function normalizeAddrKeys(obj: Record<string, string> | undefined): Record<string, string> {
  if (!obj || typeof obj !== "object") return {};
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    const clean = key.replace(/^\$/, "").toUpperCase().padStart(4, "0");
    result[clean] = String(val);
  }
  return result;
}

function normalizeGroupings(arr: unknown[] | undefined): Pass1Result["dataGroupings"] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((g): g is Record<string, unknown> => g != null && typeof g === "object")
    .map(g => ({
      blocks: (Array.isArray(g.blocks) ? g.blocks : []).map((b: unknown) =>
        String(b).replace(/^\$/, "").toUpperCase().padStart(4, "0")
      ),
      groupName: String(g.groupName ?? ""),
      groupPurpose: g.groupPurpose ? String(g.groupPurpose) : undefined,
    }));
}
