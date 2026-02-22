// Variable Context (Priority 35, Stages 2,3)
// Provides known variable names for addresses used by this block.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class VariableContext implements ContextProvider {
  name = "variable";
  priority = 35;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    if (!input.variableMap?.variables) return null;

    const lines: string[] = [];

    // Find variables referenced by this block
    for (const [addr, entry] of Object.entries(input.variableMap.variables)) {
      const blockId = input.block.id ?? `block_${input.block.address.toString(16)}`;
      if (entry.usedBy.includes(blockId)) {
        const type = entry.type ? ` (${entry.type})` : "";
        lines.push(`$${addr}: ${entry.currentName}${type} [${entry.scope}]`);
      }
    }

    if (lines.length === 0) return null;

    return {
      section: "Known Variables",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 8,
    };
  }
}
