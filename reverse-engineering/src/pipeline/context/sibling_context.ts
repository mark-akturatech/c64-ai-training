// Sibling Context (Priority 25, Stages 2,3)
// Provides summaries of blocks adjacent in memory (siblings).

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class SiblingContext implements ContextProvider {
  name = "sibling";
  priority = 25;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const blocks = input.blockStore.getSnapshot();
    const idx = blocks.findIndex(b => b.address === input.block.address);
    if (idx === -1) return null;

    const lines: string[] = [];

    // Previous block
    if (idx > 0) {
      const prev = blocks[idx - 1];
      const analysis = input.priorAnalyses.get(prev.id ?? `block_${prev.address.toString(16)}`);
      const purpose = analysis ? ` — ${analysis.purpose}` : "";
      lines.push(`Previous: $${hex(prev.address)} (${prev.type})${purpose}`);
    }

    // Next block
    if (idx < blocks.length - 1) {
      const next = blocks[idx + 1];
      const analysis = input.priorAnalyses.get(next.id ?? `block_${next.address.toString(16)}`);
      const purpose = analysis ? ` — ${analysis.purpose}` : "";
      lines.push(`Next: $${hex(next.address)} (${next.type})${purpose}`);
    }

    if (lines.length === 0) return null;

    return {
      section: "Adjacent Blocks",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 12,
    };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
