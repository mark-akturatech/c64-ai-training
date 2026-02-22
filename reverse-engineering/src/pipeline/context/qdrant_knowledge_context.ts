// Qdrant Knowledge Context (Priority 18, Stages 2,3)
// Provides authoritative Qdrant documentation hits attached by AI concept extraction.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class QdrantKnowledgeContext implements ContextProvider {
  name = "qdrant_knowledge";
  priority = 18;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const blockAddr = input.block.address;
    const qdrantEnrichments = input.enrichments.get("qdrant_knowledge") ?? [];
    const relevant = qdrantEnrichments.filter(e => e.blockAddress === blockAddr);

    if (relevant.length === 0) return null;

    const lines: string[] = [];
    for (const e of relevant.slice(0, 3)) {
      lines.push(`**${e.annotation}**`);
      if (e.data?.content) {
        const content = String(e.data.content);
        lines.push(content.length > 500 ? content.slice(0, 500) + "..." : content);
      }
    }

    return {
      section: "Knowledge Base",
      content: lines.join("\n\n"),
      priority: this.priority,
      tokenEstimate: lines.join("").length / 4,
    };
  }
}
