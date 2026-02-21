// ============================================================================
// Step 3: DependencyTree class — the shared data structure
//
// Mutable dependency graph with typed edges, split/merge support,
// ID change events, overlap detection, and JSON serialization.
// ============================================================================

import { edgeCategory } from "@c64/shared";
import type { EdgeCategory } from "@c64/shared";
import type {
  TreeNode,
  TreeEdge,
  IDChangeEvent,
  OverlapConflict,
} from "./types.js";

/** Ensure every edge has its category field set (derived from type). */
function ensureCategory(edge: TreeEdge): void {
  if (!edge.category) {
    edge.category = edgeCategory(edge.type) as EdgeCategory;
  }
}

/** Format a number as a 4-digit hex string. */
function hex(n: number): string {
  return n.toString(16).padStart(4, "0");
}

export class DependencyTree {
  nodes: Map<number, TreeNode> = new Map();  // keyed by start address
  private edgeIndex: Map<number, TreeEdge[]> = new Map();  // edges TO a target
  private visited: Set<number> = new Set();  // bytes claimed by any node
  private changeListeners: Array<(event: IDChangeEvent) => void> = [];

  // ── Node operations ──────────────────────────────────────────────

  /**
   * Add a node to the tree.
   * Returns { status: "added" } on success, or { status: "conflict", conflict }
   * if the new node overlaps an existing node's address range.
   */
  addNode(node: TreeNode): { status: "added" | "conflict"; conflict?: OverlapConflict } {
    // Check for overlap with existing nodes
    for (const existing of this.nodes.values()) {
      if (node.start < existing.end && node.end > existing.start) {
        return {
          status: "conflict",
          conflict: {
            existingNode: existing,
            newNode: node,
            overlapStart: Math.max(node.start, existing.start),
            overlapEnd: Math.min(node.end, existing.end),
          },
        };
      }
    }

    // Auto-fill edge categories on the node's edges
    for (const edge of node.edges) {
      ensureCategory(edge);
    }

    this.nodes.set(node.start, node);
    this.markVisited(node.start, node.end);
    return { status: "added" };
  }

  /**
   * Add a node unconditionally (no overlap check).
   * Used by internal operations (tree_walker) where overlaps are already handled.
   */
  addNodeUnchecked(node: TreeNode): void {
    for (const edge of node.edges) {
      ensureCategory(edge);
    }
    this.nodes.set(node.start, node);
    this.markVisited(node.start, node.end);
  }

  getNode(address: number): TreeNode | undefined {
    return this.nodes.get(address);
  }

  hasNode(address: number): boolean {
    return this.nodes.has(address);
  }

  isVisited(address: number): boolean {
    return this.visited.has(address);
  }

  markVisited(start: number, end: number): void {
    for (let addr = start; addr < end; addr++) {
      this.visited.add(addr);
    }
  }

  /** Find which node (if any) contains the given address */
  findNodeContaining(address: number): TreeNode | undefined {
    for (const [, node] of this.nodes) {
      if (address >= node.start && address < node.end) return node;
    }
    return undefined;
  }

  // ── Edge operations ──────────────────────────────────────────────

  addEdge(fromNodeStart: number, edge: TreeEdge): void {
    ensureCategory(edge);

    const node = this.nodes.get(fromNodeStart);
    if (node) {
      node.edges.push(edge);
    }
    // Index by target for reverse lookups
    let targetEdges = this.edgeIndex.get(edge.target);
    if (!targetEdges) {
      targetEdges = [];
      this.edgeIndex.set(edge.target, targetEdges);
    }
    targetEdges.push({ ...edge, sourceInstruction: edge.sourceInstruction });
  }

  getEdgesTo(target: number): TreeEdge[] {
    return this.edgeIndex.get(target) || [];
  }

  /** Rebuild the target→edges index (after bulk modifications) */
  rebuildEdgeIndex(): void {
    this.edgeIndex.clear();
    for (const node of this.nodes.values()) {
      for (const edge of node.edges) {
        ensureCategory(edge);
        let targetEdges = this.edgeIndex.get(edge.target);
        if (!targetEdges) {
          targetEdges = [];
          this.edgeIndex.set(edge.target, targetEdges);
        }
        targetEdges.push(edge);
      }
    }
  }

  // ── Split / Merge ────────────────────────────────────────────────

  /**
   * Split a node at a given address. Creates two new nodes, redistributes edges.
   * Emits an IDChangeEvent.
   */
  splitNode(nodeStart: number, splitAt: number): { node1: TreeNode; node2: TreeNode } {
    const original = this.nodes.get(nodeStart);
    if (!original) throw new Error(`Node not found at $${hex(nodeStart)}`);
    if (splitAt <= original.start || splitAt >= original.end) {
      throw new Error(`splitAt $${hex(splitAt)} outside node range $${hex(original.start)}-$${hex(original.end)}`);
    }

    const node1: TreeNode = {
      ...original,
      end: splitAt,
      id: `${original.type}_${hex(original.start)}`,
      edges: [],
      instructions: original.instructions?.filter(i => i.address < splitAt),
      refinedBy: [...original.refinedBy, "split"],
    };

    const node2: TreeNode = {
      ...original,
      start: splitAt,
      id: `${original.type}_${hex(splitAt)}`,
      edges: [],
      instructions: original.instructions?.filter(i => i.address >= splitAt),
      refinedBy: [...original.refinedBy, "split"],
    };

    // Redistribute edges based on sourceInstruction address
    for (const edge of original.edges) {
      if (edge.sourceInstruction >= splitAt) {
        node2.edges.push(edge);
      } else {
        node1.edges.push(edge);
      }
    }

    // Add fallthrough edge from node1 to node2
    const lastInst = node1.instructions?.[node1.instructions.length - 1];
    node1.edges.push({
      target: splitAt,
      type: "fallthrough",
      category: "control_flow",
      sourceInstruction: lastInst ? lastInst.address : node1.end - 1,
      confidence: 100,
      discoveredBy: "split",
    });

    // Replace original node with the two new ones
    this.nodes.delete(nodeStart);
    this.nodes.set(node1.start, node1);
    this.nodes.set(node2.start, node2);
    this.rebuildEdgeIndex();

    // Emit ID change event
    this.emitChange({
      type: "split",
      oldIds: [original.id],
      newIds: [node1.id, node2.id],
      mapping: new Map([[original.id, node1.id]]),
    });

    return { node1, node2 };
  }

  /**
   * Merge two adjacent nodes into one. Combines edges, removing
   * the fallthrough edge between them. Emits an IDChangeEvent.
   */
  mergeNodes(startAddr1: number, startAddr2: number): TreeNode {
    const node1 = this.nodes.get(startAddr1);
    const node2 = this.nodes.get(startAddr2);
    if (!node1) throw new Error(`Node not found at $${hex(startAddr1)}`);
    if (!node2) throw new Error(`Node not found at $${hex(startAddr2)}`);

    const merged: TreeNode = {
      ...node1,
      end: Math.max(node1.end, node2.end),
      id: `${node1.type}_${hex(node1.start)}`,
      edges: [
        // Remove fallthrough edge from node1→node2
        ...node1.edges.filter(e => !(e.target === startAddr2 && e.type === "fallthrough")),
        ...node2.edges,
      ],
      instructions: node1.instructions && node2.instructions
        ? [...node1.instructions, ...node2.instructions]
        : node1.instructions || node2.instructions,
      refinedBy: [...new Set([...node1.refinedBy, ...node2.refinedBy, "merge"])],
    };

    this.nodes.delete(startAddr1);
    this.nodes.delete(startAddr2);
    this.nodes.set(merged.start, merged);
    this.rebuildEdgeIndex();

    // Emit ID change event
    this.emitChange({
      type: "merge",
      oldIds: [node1.id, node2.id],
      newIds: [merged.id],
      mapping: new Map([
        [node1.id, merged.id],
        [node2.id, merged.id],
      ]),
    });

    return merged;
  }

  // ── ID Change Events ─────────────────────────────────────────────

  onIDChange(listener: (event: IDChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }

  private emitChange(event: IDChangeEvent): void {
    for (const listener of this.changeListeners) {
      listener(event);
    }
  }

  // ── Query helpers ────────────────────────────────────────────────

  getSubroutines(): TreeNode[][] {
    // Group code nodes by subroutineId
    const groups = new Map<string, TreeNode[]>();
    for (const [, node] of this.nodes) {
      if (node.type !== "code") continue;
      const subId = node.subroutineId || node.id;
      let group = groups.get(subId);
      if (!group) {
        group = [];
        groups.set(subId, group);
      }
      group.push(node);
    }
    // Sort nodes within each group by address
    for (const group of groups.values()) {
      group.sort((a, b) => a.start - b.start);
    }
    return Array.from(groups.values());
  }

  getDataNodes(): TreeNode[] {
    return Array.from(this.nodes.values()).filter((n) => n.type === "data");
  }

  getOrphanRegions(loadedRegions: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> {
    const orphans: Array<{ start: number; end: number }> = [];
    for (const region of loadedRegions) {
      let gapStart: number | null = null;
      for (let addr = region.start; addr <= region.end; addr++) {
        const isGap = addr < region.end && !this.visited.has(addr);
        if (isGap && gapStart === null) {
          gapStart = addr;
        } else if (!isGap && gapStart !== null) {
          orphans.push({ start: gapStart, end: addr });
          gapStart = null;
        }
      }
    }
    return orphans;
  }

  // ── Serialization ────────────────────────────────────────────────

  /**
   * Serialize the complete tree to a JSON-compatible object for dependency_tree.json.
   */
  toJSON(): Record<string, unknown> {
    // Collect edge type/category counts
    const edgeTypeCounts: Record<string, number> = {};
    const edgeCategoryCounts: Record<string, number> = { control_flow: 0, data: 0 };
    const serializedEdges: Array<Record<string, unknown>> = [];

    // Build node→id mapping for edge serialization
    const addrToNodeId = new Map<number, string>();
    for (const node of this.nodes.values()) {
      addrToNodeId.set(node.start, node.id);
    }

    // Find entry points and IRQ handlers
    const entryPoints: string[] = [];
    const irqHandlers: string[] = [];

    // Serialize nodes
    const serializedNodes: Record<string, Record<string, unknown>> = {};
    for (const node of this.nodes.values()) {
      if (node.metadata.isEntryPoint) entryPoints.push(node.id);
      if (node.metadata.isIrqHandler) irqHandlers.push(node.id);

      serializedNodes[node.id] = {
        type: node.type,
        start: `0x${hex(node.start)}`,
        end: `0x${hex(node.end)}`,
        ...(node.blockId ? { blockId: node.blockId } : {}),
        discoveredBy: node.discoveredBy,
        endConfidence: node.endConfidence,
        ...(node.subroutineId ? { subroutineId: node.subroutineId } : {}),
        ...(node.metadata.isEntryPoint ? { isEntryPoint: true } : {}),
        ...(node.metadata.isIrqHandler ? { isIrqHandler: true } : {}),
      };

      // Serialize edges
      for (const edge of node.edges) {
        ensureCategory(edge);
        const cat = edge.category!;

        edgeTypeCounts[edge.type] = (edgeTypeCounts[edge.type] || 0) + 1;
        edgeCategoryCounts[cat]++;

        // Find which node the edge target falls into
        const targetNode = this.findNodeContaining(edge.target);
        const targetNodeId = targetNode?.id ?? null;

        serializedEdges.push({
          source: node.id,
          sourceInstruction: `0x${hex(edge.sourceInstruction)}`,
          target: `0x${hex(edge.target)}`,
          ...(targetNodeId ? { targetNodeId } : {}),
          type: edge.type,
          category: cat,
          confidence: edge.confidence,
          discoveredBy: edge.discoveredBy,
        });
      }
    }

    return {
      metadata: {
        generatedBy: "static-analysis",
        totalNodes: this.nodes.size,
        totalEdges: serializedEdges.length,
        edgeCategoryCounts,
        edgeTypeCounts,
      },
      entryPoints,
      irqHandlers,
      nodes: serializedNodes,
      edges: serializedEdges,
    };
  }
}
