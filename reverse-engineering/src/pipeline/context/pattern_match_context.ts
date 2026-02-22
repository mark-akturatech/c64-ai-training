// Pattern Match Context (Priority 20, Stage 2 only)
// Cross-program Qdrant pattern matches for similar code structures.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class PatternMatchContext implements ContextProvider {
  name = "pattern_match";
  priority = 20;
  appliesTo: (2 | 3)[] = [2];

  provide(input: ContextProviderInput): ContextContribution | null {
    // Pattern matching enrichments come from ai_concept_extraction
    const conceptEnrichments = input.enrichments.get("ai_concept_extraction") ?? [];
    const relevant = conceptEnrichments.filter(
      e => e.blockAddress === input.block.address && e.data?.concepts
    );

    if (relevant.length === 0) return null;

    const concepts = relevant.flatMap(e => {
      const c = e.data?.concepts;
      return Array.isArray(c) ? c as string[] : [];
    });

    if (concepts.length === 0) return null;

    return {
      section: "Detected Patterns",
      content: `Concepts identified: ${concepts.join(", ")}`,
      priority: this.priority,
      tokenEstimate: concepts.join(", ").length / 4 + 10,
    };
  }
}
