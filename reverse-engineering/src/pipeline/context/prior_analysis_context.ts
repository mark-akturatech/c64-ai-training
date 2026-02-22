// Prior Analysis Context (Priority 30, Stages 2,3)
// Provides already-analyzed block purposes from prior stages.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class PriorAnalysisContext implements ContextProvider {
  name = "prior_analysis";
  priority = 30;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const blockId = input.block.id ?? `block_${input.block.address.toString(16)}`;
    const analysis = input.priorAnalyses.get(blockId);
    if (!analysis) return null;

    const lines: string[] = [];
    lines.push(`Prior analysis (confidence: ${(analysis.confidence * 100).toFixed(0)}%):`);
    lines.push(`- Purpose: ${analysis.purpose}`);
    lines.push(`- Category: ${analysis.category}`);
    if (analysis.algorithm) lines.push(`- Algorithm: ${analysis.algorithm}`);
    if (analysis.isReverseEngineered) lines.push(`- Status: REVERSE ENGINEERED`);

    return {
      section: "Prior Analysis",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 10,
    };
  }
}
