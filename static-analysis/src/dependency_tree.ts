// ============================================================================
// Step 3: DependencyTree class — the shared data structure
// ============================================================================

import type { TreeNode, TreeEdge, DecodedInstruction } from "./types.js";

export class DependencyTree {
  nodes: Map<number, TreeNode> = new Map();  // keyed by start address
  private edgeIndex: Map<number, TreeEdge[]> = new Map();  // edges TO a target
  private visited: Set<number> = new Set();  // bytes claimed by any node

  addNode(node: TreeNode): void {
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

  addEdge(fromNodeStart: number, edge: TreeEdge): void {
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

  /** Find which node (if any) contains the given address */
  findNodeContaining(address: number): TreeNode | undefined {
    for (const [, node] of this.nodes) {
      if (address >= node.start && address < node.end) return node;
    }
    return undefined;
  }
}
