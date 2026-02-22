// ============================================================================
// Tarjan's SCC Decomposition — O(V+E) strongly connected components
//
// Single DFS traversal producing SCCs in reverse topological order of the
// condensation DAG. This means leaf SCCs (sinks) come first — exactly the
// order needed for bottom-up processing (callees before callers).
//
// Why Tarjan's (not Kosaraju's):
// - Single DFS (vs two for Kosaraju's)
// - No transpose graph needed
// - Produces SCCs in reverse topological order as a byproduct
// - Lower constant factors for small graphs (C64: 20-200 nodes)
// ============================================================================

import type {
  SCCDecomposition,
  DependencyGraphNode,
  DependencyGraphEdge,
} from "./types.js";
import type { EdgeCategory } from "@c64/shared";

/**
 * Compute SCC decomposition using Tarjan's algorithm.
 *
 * @param nodes - Map of nodeId → DependencyGraphNode
 * @param edges - Array of all edges in the graph
 * @param edgeFilter - "control_flow" to only follow control-flow edges (for scheduling),
 *                     "all" to follow all edges
 * @returns SCCDecomposition with nodeToSCC, sccMembers, condensationEdges, topologicalOrder
 */
export function computeSCCDecomposition(
  nodes: ReadonlyMap<string, DependencyGraphNode>,
  edges: readonly DependencyGraphEdge[],
  edgeFilter: "control_flow" | "all" = "control_flow",
): SCCDecomposition {
  // Build adjacency list (filtered by edge category)
  const adj = new Map<string, string[]>();
  for (const nodeId of nodes.keys()) {
    adj.set(nodeId, []);
  }

  for (const edge of edges) {
    if (edgeFilter === "control_flow" && edge.category !== "control_flow") continue;
    if (!edge.targetNodeId) continue; // skip unresolved edges
    if (!nodes.has(edge.source) || !nodes.has(edge.targetNodeId)) continue;
    adj.get(edge.source)!.push(edge.targetNodeId);
  }

  // Tarjan's algorithm state
  const ids = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  let timer = 0;

  // Result: SCCs in reverse topological order (leaves first)
  const sccs: string[][] = [];

  function dfs(nodeId: string): void {
    ids.set(nodeId, timer);
    low.set(nodeId, timer);
    timer++;
    stack.push(nodeId);
    onStack.add(nodeId);

    for (const targetId of adj.get(nodeId) ?? []) {
      if (!ids.has(targetId)) {
        // Tree edge — recurse
        dfs(targetId);
        low.set(nodeId, Math.min(low.get(nodeId)!, low.get(targetId)!));
      } else if (onStack.has(targetId)) {
        // Back edge — update low-link
        low.set(nodeId, Math.min(low.get(nodeId)!, ids.get(targetId)!));
      }
    }

    // If nodeId is the root of an SCC, pop the SCC from the stack
    if (ids.get(nodeId) === low.get(nodeId)) {
      const scc: string[] = [];
      let popped: string;
      do {
        popped = stack.pop()!;
        onStack.delete(popped);
        scc.push(popped);
      } while (popped !== nodeId);
      sccs.push(scc);
    }
  }

  // Visit all nodes (handles disconnected components)
  for (const nodeId of nodes.keys()) {
    if (!ids.has(nodeId)) {
      dfs(nodeId);
    }
  }

  // Build SCCDecomposition from raw SCCs
  const nodeToSCC = new Map<string, string>();
  const sccMembers = new Map<string, Set<string>>();

  for (const scc of sccs) {
    // Name the SCC after its first member (deterministic)
    const sccId = `scc_${scc[0]}`;
    sccMembers.set(sccId, new Set(scc));
    for (const nodeId of scc) {
      nodeToSCC.set(nodeId, sccId);
    }
  }

  // Build condensation DAG edges
  const condensationEdges = new Map<string, Set<string>>();
  for (const sccId of sccMembers.keys()) {
    condensationEdges.set(sccId, new Set());
  }

  for (const edge of edges) {
    if (edgeFilter === "control_flow" && edge.category !== "control_flow") continue;
    if (!edge.targetNodeId) continue;
    const sourceSCC = nodeToSCC.get(edge.source);
    const targetSCC = nodeToSCC.get(edge.targetNodeId);
    if (sourceSCC && targetSCC && sourceSCC !== targetSCC) {
      condensationEdges.get(sourceSCC)!.add(targetSCC);
    }
  }

  // Tarjan's produces SCCs in reverse topological order naturally —
  // leaves (sinks) come first. This is exactly what we want:
  // process callees before callers.
  const topologicalOrder = sccs.map(scc => `scc_${scc[0]}`);

  return {
    nodeToSCC,
    sccMembers,
    condensationEdges,
    topologicalOrder,
  };
}
