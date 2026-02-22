import { describe, it, expect } from "vitest";
import { MutableGraph } from "../mutable_graph.js";
import type { DependencyGraphNode, DependencyGraphEdge, BlockPipelineState } from "../types.js";

function defaultState(): BlockPipelineState {
  return {
    staticEnrichmentComplete: false,
    aiEnrichmentComplete: false,
    reverseEngineered: false,
    confidence: 0,
    stage3Iterations: 0,
    bailCount: 0,
  };
}

function makeNode(id: string, start: number): DependencyGraphNode {
  return {
    id,
    type: "code",
    start,
    end: start + 0x100,
    blockId: `sub_${start.toString(16)}`,
    discoveredBy: "test",
    endConfidence: 100,
    pipelineState: defaultState(),
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

describe("MutableGraph", () => {
  describe("node operations", () => {
    it("adds and retrieves nodes", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      expect(graph.getNode("A")).toBeDefined();
      expect(graph.getNodeCount()).toBe(1);
    });

    it("removes nodes and their edges", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));

      graph.removeNode("B");
      expect(graph.getNode("B")).toBeUndefined();
      expect(graph.getEdges().length).toBe(0);
    });
  });

  describe("edge operations", () => {
    it("adds edges and indexes by source/target", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));

      expect(graph.getEdgesFrom("A").length).toBe(1);
      expect(graph.getEdgesTo("B").length).toBe(1);
      expect(graph.getEdgesFrom("B").length).toBe(0);
    });
  });

  describe("split/merge", () => {
    it("splitNode creates two nodes and redistributes edges", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));

      graph.splitNode("A", 0x1080, ["A1", "A2"]);

      expect(graph.getNode("A")).toBeUndefined();
      expect(graph.getNode("A1")).toBeDefined();
      expect(graph.getNode("A2")).toBeDefined();
      expect(graph.getNode("A1")!.end).toBe(0x1080);
      expect(graph.getNode("A2")!.start).toBe(0x1080);
    });

    it("mergeNodes combines two nodes", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x1100));
      graph.addNode(makeNode("C", 0x2000));
      graph.addEdge(makeEdge("A", 0x1100, "B", "fallthrough"));
      graph.addEdge(makeEdge("B", 0x2000, "C"));

      graph.mergeNodes("A", "B", "AB");

      expect(graph.getNode("A")).toBeUndefined();
      expect(graph.getNode("B")).toBeUndefined();
      expect(graph.getNode("AB")).toBeDefined();
      expect(graph.getNode("AB")!.start).toBe(0x1000);
      expect(graph.getNode("AB")!.end).toBe(0x1200); // max of both ends

      // Edge from AB to C should exist
      const edges = graph.getEdgesFrom("AB");
      expect(edges.some(e => e.targetNodeId === "C")).toBe(true);
    });
  });

  describe("SCC decomposition", () => {
    it("caches SCC decomposition", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));

      const decomp1 = graph.getSCCDecomposition();
      const decomp2 = graph.getSCCDecomposition();
      expect(decomp1).toBe(decomp2); // same object (cached)
    });

    it("invalidates cache on addNode", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      const decomp1 = graph.getSCCDecomposition();

      graph.addNode(makeNode("B", 0x2000));
      const decomp2 = graph.getSCCDecomposition();
      expect(decomp1).not.toBe(decomp2);
    });

    it("invalidates cache on addEdge", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      const decomp1 = graph.getSCCDecomposition();

      graph.addEdge(makeEdge("A", 0x2000, "B"));
      const decomp2 = graph.getSCCDecomposition();
      expect(decomp1).not.toBe(decomp2);
    });
  });

  describe("topologicalSort", () => {
    it("returns callees before callers", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("main", 0x0800));
      graph.addNode(makeNode("init", 0x1000));
      graph.addNode(makeNode("draw", 0x2000));
      graph.addEdge(makeEdge("main", 0x1000, "init"));
      graph.addEdge(makeEdge("main", 0x2000, "draw"));

      const order = graph.topologicalSort().map(group => group[0]);
      // init and draw should come before main
      expect(order.indexOf("init")).toBeLessThan(order.indexOf("main"));
      expect(order.indexOf("draw")).toBeLessThan(order.indexOf("main"));
    });
  });

  describe("children/parents", () => {
    it("getChildren returns target nodes", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addNode(makeNode("C", 0x3000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));
      graph.addEdge(makeEdge("A", 0x3000, "C"));

      const children = graph.getChildren("A");
      expect(children.length).toBe(2);
      expect(children.map(c => c.id).sort()).toEqual(["B", "C"]);
    });

    it("getParents returns source nodes", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));

      const parents = graph.getParents("B");
      expect(parents.length).toBe(1);
      expect(parents[0].id).toBe("A");
    });

    it("filters by edge category", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addNode(makeNode("D", 0x3000));

      graph.addEdge(makeEdge("A", 0x2000, "B")); // control_flow
      graph.addEdge({
        source: "A",
        target: 0x3000,
        targetNodeId: "D",
        type: "data_read",
        category: "data",
        sourceInstruction: 0,
        confidence: 100,
        discoveredBy: "test",
        discoveredInPhase: "static_analysis",
      });

      expect(graph.getChildren("A", "control_flow").length).toBe(1);
      expect(graph.getChildren("A", "data").length).toBe(1);
      expect(graph.getChildren("A", "all").length).toBe(2);
    });
  });

  describe("self-loop detection", () => {
    it("hasSelfLoop detects JMP to own start", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("main", 0x0800));
      graph.addEdge(makeEdge("main", 0x0800, "main", "jump"));

      expect(graph.hasSelfLoop("main")).toBe(true);
    });

    it("hasSelfLoop returns false when no self-loop", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));

      expect(graph.hasSelfLoop("A")).toBe(false);
    });
  });

  describe("reachability", () => {
    it("finds reachable nodes from entry points", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("entry", 0x0800));
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addNode(makeNode("dead", 0x3000));
      graph.addEdge(makeEdge("entry", 0x1000, "A"));
      graph.addEdge(makeEdge("A", 0x2000, "B"));
      graph.setEntryPoints(["entry"]);

      const reachable = graph.getReachableNodes();
      expect(reachable.has("entry")).toBe(true);
      expect(reachable.has("A")).toBe(true);
      expect(reachable.has("B")).toBe(true);
      expect(reachable.has("dead")).toBe(false);
    });

    it("getDeadNodes returns unreachable nodes", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("entry", 0x0800));
      graph.addNode(makeNode("dead", 0x3000));
      graph.setEntryPoints(["entry"]);

      const dead = graph.getDeadNodes();
      expect(dead.length).toBe(1);
      expect(dead[0].id).toBe("dead");
    });
  });

  describe("serialization", () => {
    it("toJSON produces valid structure", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));
      graph.setEntryPoints(["A"]);

      const json = graph.toJSON();
      expect(json.nodes["A"]).toBeDefined();
      expect(json.nodes["B"]).toBeDefined();
      expect(json.edges.length).toBe(1);
      expect(json.entryPoints).toEqual(["A"]);
      expect(json.metadata.totalNodes).toBe(2);
      expect(json.metadata.totalEdges).toBe(1);
      expect(json.metadata.reachableNodes).toBe(2);
      expect(json.metadata.deadNodes).toBe(0);
    });

    it("fromJSON round-trips correctly", () => {
      const graph = new MutableGraph();
      graph.addNode(makeNode("A", 0x1000));
      graph.addNode(makeNode("B", 0x2000));
      graph.addEdge(makeEdge("A", 0x2000, "B"));
      graph.setEntryPoints(["A"]);

      const json = graph.toJSON();
      const restored = MutableGraph.fromJSON(json);

      expect(restored.getNode("A")).toBeDefined();
      expect(restored.getNode("B")).toBeDefined();
      expect(restored.getEdges().length).toBe(1);
      expect(restored.getEntryPoints()).toEqual(["A"]);
    });
  });
});
