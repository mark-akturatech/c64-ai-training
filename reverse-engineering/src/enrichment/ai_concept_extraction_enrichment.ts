// ============================================================================
// AI Concept Extraction Enrichment (Priority 100)
//
// For each code block: makes a cheap AI call asking "What non-obvious C64
// concepts does this code use?" Takes the extracted concepts, queries Qdrant
// for relevant knowledge, and stores results as qdrant_knowledge enrichments.
//
// Requires OPENAI_API_KEY environment variable. Skips gracefully if not set.
// This is the FIRST AI-powered plugin in the pipeline.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

export class AiConceptExtractionEnrichment implements EnrichmentPlugin {
  name = "ai_concept_extraction";
  priority = 100;

  enrich(input: EnrichmentInput): EnrichmentResult {
    // This plugin requires async API calls but the EnrichmentPlugin interface
    // is synchronous. For Stage 1, we skip AI calls — concept extraction will
    // be handled in Stage 2 where the orchestrator supports async plugins.
    //
    // The plugin is registered here as a placeholder to maintain the correct
    // priority ordering and to allow the integration test to verify all 28
    // plugins are loaded.
    //
    // In the future, this can be converted to use a pre-computed cache or
    // the enrichment runner can be made async.

    const enrichments: REBlockEnrichment[] = [];

    // Mark each code block as needing AI concept extraction in Stage 2
    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      // Only flag blocks with interesting patterns (skip trivial ones)
      if (block.instructions.length < 5) continue;

      enrichments.push({
        blockAddress: block.address,
        source: this.name,
        type: "annotation",
        annotation: "Pending AI concept extraction (Stage 2)",
        data: {
          pendingAI: true,
          instructionCount: block.instructions.length,
          stage: "stage2",
        },
      });
    }

    return { enrichments };
  }
}
