// Enrichment Context (Priority 15, Stages 2,3)
// Provides Stage 1 deterministic annotations for this block.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class EnrichmentContext implements ContextProvider {
  name = "enrichment";
  priority = 15;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const blockAddr = input.block.address;
    const lines: string[] = [];

    for (const [source, enrichments] of input.enrichments) {
      const relevant = enrichments.filter(e => e.blockAddress === blockAddr);
      if (relevant.length === 0) continue;

      for (const e of relevant.slice(0, 5)) {
        lines.push(`[${source}] ${e.annotation}`);
      }
      if (relevant.length > 5) {
        lines.push(`  ... and ${relevant.length - 5} more from ${source}`);
      }
    }

    if (lines.length === 0) return null;

    return {
      section: "Stage 1 Enrichments",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 10,
    };
  }
}
