import { describe, it, expect } from "vitest";
import { computeSCCDecomposition } from "../scc_decomposition.js";
import type { DependencyGraphNode, DependencyGraphEdge, BlockPipelineState } from "../types.js";

function makeNode(id: string, start: number): DependencyGraphNode {
  const defaultState: BlockPipelineState = {
    staticEnrichmentComplete: false,
    aiEnrichmentComplete: false,
    reverseEngineered: false,
    confidence: 0,
    stage3Iterations: 0,
    bailCount: 0,
  };
  return {
    id,
    type: "code",
    start,
    end: start + 0x100,
    blockId: `sub_${start.toString(16)}`,
    discoveredBy: "test",
    endConfidence: 100,
    pipelineState: defaultState,
  };
}

function makeEdge(
  source: string,
  target: number,
  targetNodeId: string,
  type: "call" | "jump" | "branch" | "fallthrough" = "call",
): DependencyGraphEdge {
  return {
    source,
    target,
    targetNodeId,
    type,
    category: "control_flow",
    sourceInstruction: 0,
    confidence: 100,
    discoveredBy: "test",
    discoveredInPhase: "static_analysis",
  };
}

describe("SCC Decomposition", () => {
  it("decomposes a simple DAG (no cycles) into singletons", () => {
    // A → B → C (linear chain, no cycles)
    const nodes = new Map([
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
      ["C", makeNode("C", 0x3000)],
    ]);
    const edges = [
      makeEdge("A", 0x2000, "B"),
      makeEdge("B", 0x3000, "C"),
    ];

    const decomp = computeSCCDecomposition(nodes, edges, "all");

    // Each node is its own SCC
    expect(decomp.sccMembers.size).toBe(3);
    for (const members of decomp.sccMembers.values()) {
      expect(members.size).toBe(1);
    }

    // Topological order: leaves first → C before B before A
    const order = decomp.topologicalOrder.map(sccId => {
      const members = decomp.sccMembers.get(sccId)!;
      return [...members][0];
    });
    expect(order.indexOf("C")).toBeLessThan(order.indexOf("B"));
    expect(order.indexOf("B")).toBeLessThan(order.indexOf("A"));
  });

  it("detects a simple cycle (main loop)", () => {
    // A → B → A (mutual cycle)
    const nodes = new Map([
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
    ]);
    const edges = [
      makeEdge("A", 0x2000, "B"),
      makeEdge("B", 0x1000, "A"),
    ];

    const decomp = computeSCCDecomposition(nodes, edges, "all");

    // Both nodes should be in the same SCC
    expect(decomp.sccMembers.size).toBe(1);
    const [sccId] = decomp.sccMembers.keys();
    const members = decomp.sccMembers.get(sccId)!;
    expect(members.has("A")).toBe(true);
    expect(members.has("B")).toBe(true);

    // Both mapped to same SCC
    expect(decomp.nodeToSCC.get("A")).toBe(decomp.nodeToSCC.get("B"));
  });

  it("detects self-loop (JMP to own start)", () => {
    // A → A (self-loop) + A → B
    const nodes = new Map([
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
    ]);
    const edges = [
      makeEdge("A", 0x1000, "A", "jump"), // self-loop
      makeEdge("A", 0x2000, "B"),
    ];

    const decomp = computeSCCDecomposition(nodes, edges, "all");

    // A is its own SCC (self-loop makes it a non-trivial SCC)
    const sccA = decomp.nodeToSCC.get("A")!;
    const membersA = decomp.sccMembers.get(sccA)!;
    expect(membersA.has("A")).toBe(true);
    expect(membersA.size).toBe(1);

    // B is its own SCC
    const sccB = decomp.nodeToSCC.get("B")!;
    expect(sccA).not.toBe(sccB);
  });

  it("handles IRQ handler chains (A installs B, B installs A)", () => {
    // entry → A → B → A (cycle), entry → C
    const nodes = new Map([
      ["entry", makeNode("entry", 0x0800)],
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
      ["C", makeNode("C", 0x3000)],
    ]);
    const edges = [
      makeEdge("entry", 0x1000, "A"),
      makeEdge("entry", 0x3000, "C"),
      makeEdge("A", 0x2000, "B"),
      makeEdge("B", 0x1000, "A"), // creates cycle
    ];

    const decomp = computeSCCDecomposition(nodes, edges, "all");

    // A and B form a cycle
    expect(decomp.nodeToSCC.get("A")).toBe(decomp.nodeToSCC.get("B"));

    // entry and C are singletons
    expect(decomp.nodeToSCC.get("entry")).not.toBe(decomp.nodeToSCC.get("A"));
    expect(decomp.nodeToSCC.get("C")).not.toBe(decomp.nodeToSCC.get("A"));

    // Topological: C and {A,B} before entry
    const order = decomp.topologicalOrder;
    const sccEntry = decomp.nodeToSCC.get("entry")!;
    const sccAB = decomp.nodeToSCC.get("A")!;
    const sccC = decomp.nodeToSCC.get("C")!;
    expect(order.indexOf(sccAB)).toBeLessThan(order.indexOf(sccEntry));
    expect(order.indexOf(sccC)).toBeLessThan(order.indexOf(sccEntry));
  });

  it("handles disconnected components", () => {
    // A → B, C → D (two disconnected components)
    const nodes = new Map([
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
      ["C", makeNode("C", 0x3000)],
      ["D", makeNode("D", 0x4000)],
    ]);
    const edges = [
      makeEdge("A", 0x2000, "B"),
      makeEdge("C", 0x4000, "D"),
    ];

    const decomp = computeSCCDecomposition(nodes, edges, "all");

    // 4 singleton SCCs
    expect(decomp.sccMembers.size).toBe(4);
  });

  it("filters by edge category (control_flow only)", () => {
    // A --call--> B --data_read--> C
    // Only control_flow edges: A → B (no cycle)
    // All edges: A → B → C
    const nodes = new Map([
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
      ["C", makeNode("C", 0x3000)],
    ]);
    const edges: DependencyGraphEdge[] = [
      makeEdge("A", 0x2000, "B"),
      {
        source: "B",
        target: 0x3000,
        targetNodeId: "C",
        type: "data_read",
        category: "data",
        sourceInstruction: 0,
        confidence: 100,
        discoveredBy: "test",
        discoveredInPhase: "static_analysis",
      },
    ];

    const cfDecomp = computeSCCDecomposition(nodes, edges, "control_flow");
    const allDecomp = computeSCCDecomposition(nodes, edges, "all");

    // With control_flow filter: B→C edge is ignored, C is disconnected
    // Both should have 3 singleton SCCs
    expect(cfDecomp.sccMembers.size).toBe(3);

    // But condensation edges differ: control_flow only has A→B edge's SCC connection
    const sccA_cf = cfDecomp.nodeToSCC.get("A")!;
    const sccB_cf = cfDecomp.nodeToSCC.get("B")!;
    const sccC_cf = cfDecomp.nodeToSCC.get("C")!;

    // A's SCC → B's SCC (control flow)
    expect(cfDecomp.condensationEdges.get(sccA_cf)?.has(sccB_cf)).toBe(true);
    // B's SCC → C's SCC should NOT exist (data edge filtered)
    expect(cfDecomp.condensationEdges.get(sccB_cf)?.has(sccC_cf)).toBe(false);

    // All edges: B→C exists in condensation
    const sccB_all = allDecomp.nodeToSCC.get("B")!;
    const sccC_all = allDecomp.nodeToSCC.get("C")!;
    expect(allDecomp.condensationEdges.get(sccB_all)?.has(sccC_all)).toBe(true);
  });

  it("produces correct condensation DAG edges", () => {
    // A → B → C, A → C (diamond, no cycles)
    const nodes = new Map([
      ["A", makeNode("A", 0x1000)],
      ["B", makeNode("B", 0x2000)],
      ["C", makeNode("C", 0x3000)],
    ]);
    const edges = [
      makeEdge("A", 0x2000, "B"),
      makeEdge("B", 0x3000, "C"),
      makeEdge("A", 0x3000, "C"),
    ];

    const decomp = computeSCCDecomposition(nodes, edges, "all");

    const sccA = decomp.nodeToSCC.get("A")!;
    const sccB = decomp.nodeToSCC.get("B")!;
    const sccC = decomp.nodeToSCC.get("C")!;

    // A → B, A → C, B → C in condensation
    expect(decomp.condensationEdges.get(sccA)?.has(sccB)).toBe(true);
    expect(decomp.condensationEdges.get(sccA)?.has(sccC)).toBe(true);
    expect(decomp.condensationEdges.get(sccB)?.has(sccC)).toBe(true);
  });
});
