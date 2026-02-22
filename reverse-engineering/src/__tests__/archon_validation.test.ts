// ============================================================================
// Archon Validation Test — run full pipeline on archon, verify it completes.
// ============================================================================

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BlockStore } from "../block_store.js";
import { MutableGraph } from "../mutable_graph.js";
import { runStage1Enrichment } from "../enrichment/index.js";
import { runStage2 } from "../pipeline/stage2_orchestrator.js";
import { runStage3 } from "../pipeline/stage3_orchestrator.js";
import { runStage4 } from "../pipeline/stage4_integration.js";
import { SymbolDB } from "../shared/symbol_db.js";
import type { Block, LoadedRegion } from "@c64/shared";
import type { IntegrationJson } from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, "../../../test/archon-output");

describe("Archon Validation — full pipeline", () => {
  let integration: IntegrationJson;
  let graph: MutableGraph;
  let blockCount: number;
  let outerPasses: number;
  let forcePicks: number;

  beforeAll(async () => {
    const blocksJson = JSON.parse(readFileSync(resolve(fixtureDir, "blocks.json"), "utf8"));
    const treeJson = JSON.parse(readFileSync(resolve(fixtureDir, "dependency_tree.json"), "utf8"));

    const blocks: Block[] = blocksJson.blocks;
    blockCount = blocks.length;
    const blockStore = new BlockStore(blocks);
    graph = MutableGraph.fromDependencyTree(treeJson);
    const symbolDb = new SymbolDB();

    const memory = new Uint8Array(65536);
    for (const block of blocks) {
      if (block.raw) {
        const bytes = Buffer.from(block.raw, "base64");
        for (let i = 0; i < bytes.length && block.address + i < 65536; i++) {
          memory[block.address + i] = bytes[i];
        }
      }
    }

    const loadedRegions: LoadedRegion[] = blocksJson.metadata?.loadedRegions ?? [{
      start: blocks[0]?.address ?? 0x0800,
      end: Math.max(...blocks.map((b: Block) => b.endAddress)),
      source: "test",
    }];

    // Stage 1
    const stage1Result = await runStage1Enrichment({ blockStore, graph, memory, loadedRegions });

    // Stage 2
    const stage2Result = await runStage2({
      blockStore, graph, memory, loadedRegions,
      enrichments: stage1Result.enrichments, symbolDb,
    });

    // Stage 3
    const stage3Result = await runStage3({
      blockStore, graph, memory, loadedRegions,
      enrichments: stage1Result.enrichments,
      variableMap: stage2Result.variableMap,
      symbolDb,
      maxOuterPasses: 15,
      confidenceThreshold: 0.6,
      maxIterationsPerBlock: 3,
    });
    outerPasses = stage3Result.stats.outerPasses;
    forcePicks = stage3Result.stats.forcePicks;

    // Stage 4
    const stage4Result = runStage4({
      blockStore, graph, memory, loadedRegions,
      enrichments: stage1Result.enrichments,
      variableMap: stage3Result.variableMap,
    });
    integration = stage4Result.integration;
  });

  it("should complete without crashes", () => {
    expect(integration).toBeDefined();
  });

  it("should reverse engineer all nodes", () => {
    for (const node of graph.getNodes().values()) {
      expect(node.pipelineState.reverseEngineered).toBe(true);
    }
  });

  it("should converge within 15 passes", () => {
    expect(outerPasses).toBeLessThanOrEqual(15);
  });

  it("should have banking state on all nodes", () => {
    for (const node of graph.getNodes().values()) {
      expect(node.bankingState).toBeDefined();
    }
  });

  it("should assign modules (≤15)", () => {
    expect(integration.files.length).toBeLessThanOrEqual(15);
  });

  it("should detect dead code", () => {
    expect(integration.deadCode).toBeDefined();
  });

  it("should handle circular dependencies (SCC)", () => {
    const scc = graph.getSCCDecomposition("control_flow");
    // Archon should have some multi-node SCCs (loops, mutual recursion)
    expect(scc.sccMembers.size).toBeGreaterThan(0);
  });
});
