// Cross Reference Context (Priority 50, Stages 2,3)
// Provides cross-reference summary (all edges to/from this block).

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class CrossReferenceContext implements ContextProvider {
  name = "cross_reference";
  priority = 50;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const nodeId = blockToNodeId(input.block);
    const edges = input.graph.getEdges();

    const incoming = edges.filter(e => e.targetNodeId === nodeId || e.target === input.block.address);
    const outgoing = edges.filter(e => e.source === nodeId);

    if (incoming.length === 0 && outgoing.length === 0) return null;

    const lines: string[] = [];

    if (incoming.length > 0) {
      const byType = groupByType(incoming.map(e => e.type));
      lines.push(`Incoming references (${incoming.length}): ${formatGroups(byType)}`);
    }

    if (outgoing.length > 0) {
      const byType = groupByType(outgoing.map(e => e.type));
      lines.push(`Outgoing references (${outgoing.length}): ${formatGroups(byType)}`);
    }

    return {
      section: "Cross References",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 15,
    };
  }
}

function groupByType(types: string[]): Map<string, number> {
  const groups = new Map<string, number>();
  for (const t of types) {
    groups.set(t, (groups.get(t) ?? 0) + 1);
  }
  return groups;
}

function formatGroups(groups: Map<string, number>): string {
  return [...groups.entries()].map(([type, count]) => `${count}x ${type}`).join(", ");
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}
