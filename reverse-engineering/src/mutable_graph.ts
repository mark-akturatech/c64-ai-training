// ============================================================================
// Mutable Graph — mutable dependency graph with SCC tracking
//
// The dependency graph is mutable in memory throughout the pipeline. Both
// enrichment plugins and AI can add/remove nodes and edges. SCC decomposition
// is lazily cached and invalidated on any structural change.
// ============================================================================

import type { EdgeCategory } from "@c64/shared";
import type {
  DependencyGraphNode,
  DependencyGraphEdge,
  DependencyGraphJson,
  SCCDecomposition,
  BankingSnapshot,
  BlockPipelineState,
  MutableGraphInterface,
  SpeculativeDiscovery,
} from "./types.js";
import { computeSCCDecomposition } from "./scc_decomposition.js";

export class MutableGraph implements MutableGraphInterface {
  private nodes = new Map<string, DependencyGraphNode>();
  private edges: DependencyGraphEdge[] = [];
  private edgesBySource = new Map<string, DependencyGraphEdge[]>();
  private edgesByTarget = new Map<string, DependencyGraphEdge[]>();
  private entryPoints: string[] = [];
  private irqHandlers: string[] = [];

  // Cached SCC decomposition — invalidated on structural change
  private sccCache = new Map<string, SCCDecomposition>();

  // Quarantined speculative discoveries
  private quarantined = new Map<string, SpeculativeDiscovery>();

  constructor() {}

  /** Load from a typed DependencyGraphJson (internal format with numbers) */
  static fromJSON(json: DependencyGraphJson): MutableGraph {
    const graph = new MutableGraph();
    for (const [id, node] of Object.entries(json.nodes)) {
      graph.nodes.set(id, { ...node });
    }
    graph.entryPoints = [...json.entryPoints];
    graph.irqHandlers = [...json.irqHandlers];

    for (const edge of json.edges) {
      graph.addEdgeInternal({ ...edge });
    }
    return graph;
  }

  /**
   * Load from raw dependency_tree.json from static analysis.
   * Handles hex string addresses (e.g. "0x080e") and missing pipelineState.
   */
  static fromDependencyTree(raw: Record<string, unknown>): MutableGraph {
    const graph = new MutableGraph();

    const parseHex = (v: unknown): number => {
      if (typeof v === "number") return v;
      if (typeof v === "string") return parseInt(v, 16);
      return 0;
    };

    const defaultPipelineState = (): BlockPipelineState => ({
      staticEnrichmentComplete: false,
      aiEnrichmentComplete: false,
      reverseEngineered: false,
      confidence: 0,
      stage3Iterations: 0,
      bailCount: 0,
    });

    // Parse nodes
    const rawNodes = (raw.nodes ?? {}) as Record<string, Record<string, unknown>>;
    for (const [id, rawNode] of Object.entries(rawNodes)) {
      const node: DependencyGraphNode = {
        id,
        type: (rawNode.type as "code" | "data") ?? "code",
        start: parseHex(rawNode.start),
        end: parseHex(rawNode.end),
        blockId: (rawNode.blockId as string) ?? id,
        discoveredBy: (rawNode.discoveredBy as string) ?? "static_analysis",
        endConfidence: (rawNode.endConfidence as number) ?? 100,
        pipelineState: defaultPipelineState(),
      };
      graph.nodes.set(id, node);
    }

    // Parse edges
    const rawEdges = (raw.edges ?? []) as Record<string, unknown>[];
    for (const rawEdge of rawEdges) {
      const edge: DependencyGraphEdge = {
        source: rawEdge.source as string,
        target: parseHex(rawEdge.target),
        targetNodeId: rawEdge.targetNodeId as string | undefined,
        type: rawEdge.type as DependencyGraphEdge["type"],
        category: (rawEdge.category as EdgeCategory) ?? "control_flow",
        sourceInstruction: parseHex(rawEdge.sourceInstruction),
        confidence: (rawEdge.confidence as number) ?? 100,
        discoveredBy: (rawEdge.discoveredBy as string) ?? "static_analysis",
        discoveredInPhase: (rawEdge.discoveredInPhase as string) ?? "static_analysis",
      };
      graph.addEdgeInternal(edge);
    }

    graph.entryPoints = ((raw.entryPoints ?? []) as string[]).slice();
    graph.irqHandlers = ((raw.irqHandlers ?? []) as string[]).slice();

    return graph;
  }

  // ── Node operations ─────────────────────────────────────────

  addNode(node: DependencyGraphNode): void {
    this.nodes.set(node.id, node);
    this.invalidateSCCCache();
  }

  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    // Remove associated edges
    this.edges = this.edges.filter(
      e => e.source !== nodeId && e.targetNodeId !== nodeId,
    );
    this.rebuildEdgeIndices();
    this.invalidateSCCCache();
  }

  getNode(nodeId: string): DependencyGraphNode | undefined {
    return this.nodes.get(nodeId);
  }

  getNodes(): ReadonlyMap<string, DependencyGraphNode> {
    return this.nodes;
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  // ── Edge operations ─────────────────────────────────────────

  addEdge(edge: DependencyGraphEdge): void {
    this.addEdgeInternal(edge);
    this.invalidateSCCCache();
  }

  private addEdgeInternal(edge: DependencyGraphEdge): void {
    this.edges.push(edge);
    if (!this.edgesBySource.has(edge.source)) {
      this.edgesBySource.set(edge.source, []);
    }
    this.edgesBySource.get(edge.source)!.push(edge);

    if (edge.targetNodeId) {
      if (!this.edgesByTarget.has(edge.targetNodeId)) {
        this.edgesByTarget.set(edge.targetNodeId, []);
      }
      this.edgesByTarget.get(edge.targetNodeId)!.push(edge);
    }
  }

  getEdges(): readonly DependencyGraphEdge[] {
    return this.edges;
  }

  getEdgesFrom(nodeId: string): readonly DependencyGraphEdge[] {
    return this.edgesBySource.get(nodeId) ?? [];
  }

  getEdgesTo(nodeId: string): readonly DependencyGraphEdge[] {
    return this.edgesByTarget.get(nodeId) ?? [];
  }

  // ── Node mutations ──────────────────────────────────────────

  splitNode(nodeId: string, splitAt: number, newIds: [string, string]): void {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);

    const [id1, id2] = newIds;

    // Create two new nodes
    const node1: DependencyGraphNode = {
      ...node,
      id: id1,
      end: splitAt,
    };
    const node2: DependencyGraphNode = {
      ...node,
      id: id2,
      start: splitAt,
    };

    // Remove old node
    this.nodes.delete(nodeId);
    this.nodes.set(id1, node1);
    this.nodes.set(id2, node2);

    // Redistribute edges
    for (const edge of this.edges) {
      if (edge.source === nodeId) {
        // Edges from old node: assign to first or second based on instruction address
        edge.source = edge.sourceInstruction < splitAt ? id1 : id2;
      }
      if (edge.targetNodeId === nodeId) {
        // Edges to old node: assign based on target address
        edge.targetNodeId = edge.target < splitAt ? id1 : id2;
      }
    }

    // Add fallthrough edge between the two new nodes
    this.edges.push({
      source: id1,
      target: splitAt,
      targetNodeId: id2,
      type: "fallthrough",
      category: "control_flow",
      sourceInstruction: splitAt - 1, // approximate
      confidence: 100,
      discoveredBy: "split",
      discoveredInPhase: "enrichment",
    });

    // Update entry points / IRQ handlers
    this.entryPoints = this.entryPoints.map(ep => ep === nodeId ? id1 : ep);
    this.irqHandlers = this.irqHandlers.map(ih => ih === nodeId ? id1 : ih);

    this.rebuildEdgeIndices();
    this.invalidateSCCCache();
  }

  mergeNodes(nodeId1: string, nodeId2: string, mergedId: string): void {
    const n1 = this.nodes.get(nodeId1);
    const n2 = this.nodes.get(nodeId2);
    if (!n1 || !n2) throw new Error(`Node(s) not found: ${nodeId1}, ${nodeId2}`);

    const merged: DependencyGraphNode = {
      ...n1,
      id: mergedId,
      start: Math.min(n1.start, n2.start),
      end: Math.max(n1.end, n2.end),
    };

    this.nodes.delete(nodeId1);
    this.nodes.delete(nodeId2);
    this.nodes.set(mergedId, merged);

    // Redirect edges
    for (const edge of this.edges) {
      if (edge.source === nodeId1 || edge.source === nodeId2) {
        edge.source = mergedId;
      }
      if (edge.targetNodeId === nodeId1 || edge.targetNodeId === nodeId2) {
        edge.targetNodeId = mergedId;
      }
    }

    // Remove self-loops created by merge (internal edges between the two nodes)
    // Keep intentional self-loops (JMP to own start)
    this.edges = this.edges.filter(e => {
      if (e.source === mergedId && e.targetNodeId === mergedId && e.type === "fallthrough") {
        return false; // Remove fallthrough self-loops from merge
      }
      return true;
    });

    // Update entry points / IRQ handlers
    this.entryPoints = this.entryPoints.map(ep =>
      ep === nodeId1 || ep === nodeId2 ? mergedId : ep,
    );
    this.irqHandlers = this.irqHandlers.map(ih =>
      ih === nodeId1 || ih === nodeId2 ? mergedId : ih,
    );

    this.rebuildEdgeIndices();
    this.invalidateSCCCache();
  }

  // ── State updates ───────────────────────────────────────────

  setBankingState(nodeId: string, entry: BankingSnapshot, exit: BankingSnapshot): void {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);
    node.bankingState = { onEntry: entry, onExit: exit };
  }

  setPipelineState(nodeId: string, state: Partial<BlockPipelineState>): void {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);
    node.pipelineState = { ...node.pipelineState, ...state };
  }

  // ── Reachability ────────────────────────────────────────────

  getReachableNodes(): Set<string> {
    const visited = new Set<string>();
    const queue = [...this.entryPoints, ...this.irqHandlers];

    while (queue.length > 0) {
      const nodeId = queue.pop()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      for (const edge of this.edgesBySource.get(nodeId) ?? []) {
        if (edge.targetNodeId && !visited.has(edge.targetNodeId)) {
          queue.push(edge.targetNodeId);
        }
      }
    }

    return visited;
  }

  getDeadNodes(): DependencyGraphNode[] {
    const reachable = this.getReachableNodes();
    return [...this.nodes.values()].filter(n => !reachable.has(n.id));
  }

  // ── SCC Decomposition ───────────────────────────────────────

  getSCCDecomposition(edgeFilter: "control_flow" | "all" = "control_flow"): SCCDecomposition {
    const cacheKey = edgeFilter;
    if (this.sccCache.has(cacheKey)) {
      return this.sccCache.get(cacheKey)!;
    }
    const decomp = computeSCCDecomposition(this.nodes, this.edges, edgeFilter);
    this.sccCache.set(cacheKey, decomp);
    return decomp;
  }

  /**
   * Topological sort of SCC groups (leaves first = callees first).
   * Returns array of arrays — each inner array is the nodeIds in one SCC.
   */
  topologicalSort(edgeFilter: "control_flow" | "all" = "control_flow"): string[][] {
    const decomp = this.getSCCDecomposition(edgeFilter);
    return decomp.topologicalOrder.map(sccId => {
      const members = decomp.sccMembers.get(sccId);
      return members ? [...members] : [];
    });
  }

  // ── Children / Parents ──────────────────────────────────────

  getChildren(nodeId: string, filter: "control_flow" | "data" | "all" = "all"): DependencyGraphNode[] {
    const edges = this.edgesBySource.get(nodeId) ?? [];
    const childIds = new Set<string>();
    for (const edge of edges) {
      if (filter !== "all" && edge.category !== filter) continue;
      if (edge.targetNodeId) childIds.add(edge.targetNodeId);
    }
    return [...childIds].map(id => this.nodes.get(id)!).filter(Boolean);
  }

  getParents(nodeId: string, filter: "control_flow" | "data" | "all" = "all"): DependencyGraphNode[] {
    const edges = this.edgesByTarget.get(nodeId) ?? [];
    const parentIds = new Set<string>();
    for (const edge of edges) {
      if (filter !== "all" && edge.category !== filter) continue;
      parentIds.add(edge.source);
    }
    return [...parentIds].map(id => this.nodes.get(id)!).filter(Boolean);
  }

  hasSelfLoop(nodeId: string): boolean {
    const edges = this.edgesBySource.get(nodeId) ?? [];
    return edges.some(e => e.targetNodeId === nodeId);
  }

  // ── Quarantine ──────────────────────────────────────────────

  quarantine(discovery: SpeculativeDiscovery): void {
    this.quarantined.set(discovery.id, discovery);
  }

  promoteQuarantined(discoveryId: string): void {
    const discovery = this.quarantined.get(discoveryId);
    if (!discovery) return;
    this.quarantined.delete(discoveryId);

    if (discovery.edge) {
      this.addEdge(discovery.edge);
    }
  }

  getQuarantined(): readonly SpeculativeDiscovery[] {
    return [...this.quarantined.values()];
  }

  // ── Entry points / IRQ handlers ─────────────────────────────

  setEntryPoints(ids: string[]): void {
    this.entryPoints = [...ids];
  }

  setIrqHandlers(ids: string[]): void {
    this.irqHandlers = [...ids];
  }

  getEntryPoints(): readonly string[] {
    return this.entryPoints;
  }

  getIrqHandlers(): readonly string[] {
    return this.irqHandlers;
  }

  // ── Serialization ───────────────────────────────────────────

  toJSON(): DependencyGraphJson {
    const reachable = this.getReachableNodes();
    const nodes: Record<string, DependencyGraphNode> = {};
    let bankingAnnotated = 0;
    for (const [id, node] of this.nodes) {
      nodes[id] = node;
      if (node.bankingState) bankingAnnotated++;
    }

    return {
      nodes,
      edges: [...this.edges],
      entryPoints: [...this.entryPoints],
      irqHandlers: [...this.irqHandlers],
      metadata: {
        totalNodes: this.nodes.size,
        totalEdges: this.edges.length,
        reachableNodes: reachable.size,
        deadNodes: this.nodes.size - reachable.size,
        bankingAnnotated,
      },
    };
  }

  // ── Internal helpers ────────────────────────────────────────

  private invalidateSCCCache(): void {
    this.sccCache.clear();
  }

  private rebuildEdgeIndices(): void {
    this.edgesBySource.clear();
    this.edgesByTarget.clear();
    for (const edge of this.edges) {
      if (!this.edgesBySource.has(edge.source)) {
        this.edgesBySource.set(edge.source, []);
      }
      this.edgesBySource.get(edge.source)!.push(edge);

      if (edge.targetNodeId) {
        if (!this.edgesByTarget.has(edge.targetNodeId)) {
          this.edgesByTarget.set(edge.targetNodeId, []);
        }
        this.edgesByTarget.get(edge.targetNodeId)!.push(edge);
      }
    }
  }
}
