// ============================================================================
// Call Graph Enrichment (Priority 60)
//
// Builds complete call graph from graph edges. For each code block: lists
// callers/callees with mechanism (direct, indirect, rts_dispatch).
// Annotates entry points (no callers) and leaf functions (no callees).
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";
import { CONTROL_FLOW_EDGES } from "@c64/shared";

export class CallGraphEnrichment implements EnrichmentPlugin {
  name = "call_graph";
  priority = 60;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Build caller/callee maps from graph edges
    const callees = new Map<string, Array<{ target: number; type: string }>>();
    const callers = new Map<string, Array<{ source: string; type: string }>>();

    const callEdgeTypes = new Set(["call", "indirect_jump", "rts_dispatch"]);

    for (const edge of input.graph.getEdges()) {
      if (!callEdgeTypes.has(edge.type)) continue;

      // Add to callees for source
      const existing = callees.get(edge.source) ?? [];
      existing.push({ target: edge.target, type: edge.type });
      callees.set(edge.source, existing);

      // Find target node ID
      const targetNodeId = edge.targetNodeId ??
        this.findNodeForAddress(edge.target, input);
      if (targetNodeId) {
        const callerList = callers.get(targetNodeId) ?? [];
        callerList.push({ source: edge.source, type: edge.type });
        callers.set(targetNodeId, callerList);
      }
    }

    // Emit enrichments for each code node
    for (const node of input.graph.getNodes().values()) {
      if (node.type !== "code") continue;

      const nodeCallees = callees.get(node.id) ?? [];
      const nodeCallers = callers.get(node.id) ?? [];

      const isEntryPoint = nodeCallers.length === 0;
      const isLeaf = nodeCallees.length === 0;

      const parts: string[] = [];
      if (isEntryPoint) parts.push("entry point");
      if (isLeaf) parts.push("leaf function");
      if (nodeCallers.length > 0) parts.push(`${nodeCallers.length} caller(s)`);
      if (nodeCallees.length > 0) parts.push(`${nodeCallees.length} callee(s)`);

      enrichments.push({
        blockAddress: node.start,
        source: this.name,
        type: "call_relationship",
        annotation: `Call graph: ${parts.join(", ")}`,
        data: {
          nodeId: node.id,
          isEntryPoint,
          isLeaf,
          callerCount: nodeCallers.length,
          calleeCount: nodeCallees.length,
          callees: nodeCallees.map(c => ({ target: c.target, type: c.type })),
          callers: nodeCallers.map(c => ({ source: c.source, type: c.type })),
        },
      });
    }

    return { enrichments };
  }

  private findNodeForAddress(addr: number, input: EnrichmentInput): string | null {
    for (const node of input.graph.getNodes().values()) {
      if (node.start === addr) return node.id;
    }
    return null;
  }
}
