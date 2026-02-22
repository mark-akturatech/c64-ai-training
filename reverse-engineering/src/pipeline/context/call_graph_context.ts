// Call Graph Context (Priority 10, Stages 2,3)
// Provides caller/callee info with purposes and confidence levels.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class CallGraphContext implements ContextProvider {
  name = "call_graph";
  priority = 10;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const nodeId = blockToNodeId(input.block);
    const parents = input.graph.getParents(nodeId, "control_flow");
    const children = input.graph.getChildren(nodeId, "control_flow");

    if (parents.length === 0 && children.length === 0) return null;

    const lines: string[] = [];

    if (parents.length > 0) {
      lines.push(`Called by (${parents.length}):`);
      for (const p of parents.slice(0, 10)) {
        const analysis = input.priorAnalyses.get(p.blockId);
        const purpose = analysis ? ` — ${analysis.purpose}` : "";
        lines.push(`  - $${hex(p.start)}${purpose}`);
      }
    }

    if (children.length > 0) {
      lines.push(`Calls (${children.length}):`);
      for (const c of children.slice(0, 10)) {
        const analysis = input.priorAnalyses.get(c.blockId);
        const purpose = analysis ? ` — ${analysis.purpose}` : "";
        lines.push(`  - $${hex(c.start)}${purpose}`);
      }
    }

    return {
      section: "Call Graph",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 12,
    };
  }
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
