// RE Status Context (Priority 55, Stage 3 only)
// Tags context items with isReverseEngineered status.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class ReStatusContext implements ContextProvider {
  name = "re_status";
  priority = 55;
  appliesTo: (2 | 3)[] = [3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const nodeId = blockToNodeId(input.block);
    const node = input.graph.getNode(nodeId);
    if (!node) return null;

    const ps = node.pipelineState;
    const lines: string[] = [];

    lines.push(`Pipeline status:`);
    lines.push(`- Stage 1 (static enrichment): ${ps.staticEnrichmentComplete ? "COMPLETE" : "pending"}`);
    lines.push(`- Stage 2 (AI enrichment): ${ps.aiEnrichmentComplete ? "COMPLETE" : "pending"}`);
    lines.push(`- Stage 3 (reverse engineering): ${ps.reverseEngineered ? "COMPLETE" : "pending"}`);
    lines.push(`- Confidence: ${(ps.confidence * 100).toFixed(0)}%`);

    if (ps.stage3Iterations > 0) {
      lines.push(`- Stage 3 iterations so far: ${ps.stage3Iterations}`);
    }
    if (ps.bailReason) {
      lines.push(`- Last bail reason: ${ps.bailReason.type} — ${getBailDetails(ps.bailReason)}`);
    }

    // Show RE status of callers/callees
    const parents = input.graph.getParents(nodeId, "control_flow");
    const children = input.graph.getChildren(nodeId, "control_flow");

    const reversedCallers = parents.filter(p => p.pipelineState.reverseEngineered).length;
    const reversedCallees = children.filter(c => c.pipelineState.reverseEngineered).length;

    if (parents.length > 0 || children.length > 0) {
      lines.push(`\nDependency RE status:`);
      if (parents.length > 0) lines.push(`- Callers: ${reversedCallers}/${parents.length} reversed`);
      if (children.length > 0) lines.push(`- Callees: ${reversedCallees}/${children.length} reversed`);
    }

    return {
      section: "RE Pipeline Status",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 10,
    };
  }
}

function getBailDetails(bail: { type: string; [key: string]: unknown }): string {
  switch (bail.type) {
    case "needs_dependency": return `waiting for ${(bail.dependencies as string[])?.join(", ")}`;
    case "insufficient_context": return String(bail.details ?? "");
    case "block_too_complex": return `factors: ${(bail.complexityFactors as string[])?.join(", ")}`;
    case "hit_iteration_limit": return `after ${bail.iterations} iterations`;
    case "low_confidence": return `${bail.confidence}% < ${bail.threshold}% threshold`;
    default: return bail.type;
  }
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}
