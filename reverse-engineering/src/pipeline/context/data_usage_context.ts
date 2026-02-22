// Data Usage Context (Priority 45, Stages 2,3)
// Provides data flow and access patterns for this block.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class DataUsageContext implements ContextProvider {
  name = "data_usage";
  priority = 45;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const dataFlowEnrichments = input.enrichments.get("data_flow") ?? [];
    const relevant = dataFlowEnrichments.filter(e => e.blockAddress === input.block.address);

    if (relevant.length === 0) return null;

    const lines: string[] = [];
    for (const e of relevant.slice(0, 8)) {
      lines.push(e.annotation);
    }
    if (relevant.length > 8) {
      lines.push(`... and ${relevant.length - 8} more data flow entries`);
    }

    return {
      section: "Data Usage",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 10,
    };
  }
}
