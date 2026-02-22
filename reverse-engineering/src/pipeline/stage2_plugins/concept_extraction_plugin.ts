// ============================================================================
// AI Concept Extraction Plugin (Priority 10)
//
// Extracts key C64 concepts from code using AI + pattern matching,
// queries Qdrant for authoritative documentation.
// ============================================================================

import type {
  Stage2Plugin,
  Stage2PluginInput,
  Stage2PluginResult,
  REBlockEnrichment,
} from "../../types.js";
import type { AIClient } from "../../shared/ai_client.js";

export class ConceptExtractionPlugin implements Stage2Plugin {
  name = "ai_concept_extraction";
  priority = 10;
  private ai?: AIClient;

  constructor(ai?: AIClient) {
    this.ai = ai;
  }

  async run(input: Stage2PluginInput): Promise<Stage2PluginResult> {
    const enrichments: REBlockEnrichment[] = [];
    const block = input.block;

    if (!block.instructions || block.instructions.length < 3) {
      return { enrichments, confidence: 0.5 };
    }

    // Pattern-based concept extraction (always runs)
    const patternConcepts = this.extractPatternConcepts(block);

    // AI-based concept extraction (if available, adds to pattern results)
    let aiConcepts: string[] = [];
    if (this.ai) {
      aiConcepts = await this.extractAIConcepts(block);
    }

    // Merge and deduplicate
    const concepts = [...new Set([...patternConcepts, ...aiConcepts])];

    // Query Qdrant for each concept
    for (const concept of concepts.slice(0, 3)) {
      const hits = await input.qdrantSearch(concept);
      for (const hit of hits.slice(0, 2)) {
        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "qdrant_knowledge",
          annotation: `Knowledge: ${concept}`,
          data: {
            concept,
            content: hit.content,
            score: hit.score,
            qdrantId: hit.id,
          },
        });
      }
    }

    // Store concept list
    if (concepts.length > 0) {
      enrichments.push({
        blockAddress: block.address,
        source: this.name,
        type: "annotation",
        annotation: `Concepts: ${concepts.join(", ")}`,
        data: { concepts },
      });
    }

    return { enrichments, confidence: 0.7 };
  }

  private extractPatternConcepts(block: import("@c64/shared").Block): string[] {
    const concepts: string[] = [];
    const hwRefs = new Set<number>();

    for (const inst of block.instructions!) {
      const match = inst.operand.match(/^\$([0-9a-fA-F]{4})/);
      if (match) {
        const addr = parseInt(match[1], 16);
        if (addr >= 0xD000 && addr <= 0xDFFF) hwRefs.add(addr);
      }
    }

    if (hwRefs.size > 0) {
      const vicRefs = [...hwRefs].filter(a => a >= 0xD000 && a <= 0xD3FF);
      const sidRefs = [...hwRefs].filter(a => a >= 0xD400 && a <= 0xD7FF);
      const ciaRefs = [...hwRefs].filter(a => a >= 0xDC00 && a <= 0xDDFF);
      if (vicRefs.length > 0) concepts.push("VIC-II graphics programming");
      if (sidRefs.length > 0) concepts.push("SID sound programming");
      if (ciaRefs.length > 0) concepts.push("CIA timer/interrupt programming");
    }

    if (block.instructions!.some(i => i.operand.includes("$D012") || i.operand.includes("$D01A"))) {
      concepts.push("raster interrupt technique");
    }
    if (block.instructions!.some(i => i.operand.includes("$D015") || i.operand.includes("$D000"))) {
      concepts.push("sprite programming");
    }

    return concepts;
  }

  private async extractAIConcepts(block: import("@c64/shared").Block): Promise<string[]> {
    const lines: string[] = [];
    lines.push(`Disassembly at $${hex(block.address)}:`);
    for (const inst of (block.instructions ?? []).slice(0, 30)) {
      lines.push(`  $${hex(inst.address)}: ${inst.mnemonic} ${inst.operand}`);
    }
    lines.push("");
    lines.push("List the C64/6502 programming concepts used in this code.");
    lines.push("Return a short comma-separated list. Examples: raster interrupt, sprite multiplexing, SID music playback, memory copy loop, KERNAL file I/O");

    const text = await this.ai!.textCall(lines.join("\n"), {
      reasoning_effort: "low",
      text_verbosity: "low",
    });

    return text.split(",").map(s => s.trim()).filter(s => s.length > 0 && s.length < 60);
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
