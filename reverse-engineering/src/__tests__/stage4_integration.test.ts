// ============================================================================
// Stage 4 Integration Test — run full pipeline (Stage 1+2+3+4) on spriteintro,
// verify integration analysis produces module assignments, dead code, etc.
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
import type { IntegrationJson, Stage3Output } from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, "../../../test/spriteintro-output");

describe("Stage 4 Integration — spriteintro", () => {
  let integration: IntegrationJson;

  beforeAll(async () => {
    const blocksJson = JSON.parse(readFileSync(resolve(fixtureDir, "blocks.json"), "utf8"));
    const treeJson = JSON.parse(readFileSync(resolve(fixtureDir, "dependency_tree.json"), "utf8"));

    const blocks: Block[] = blocksJson.blocks;
    const blockStore = new BlockStore(blocks);
    const graph = MutableGraph.fromDependencyTree(treeJson);
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
      maxOuterPasses: 10,
      confidenceThreshold: 0.6,
      maxIterationsPerBlock: 3,
    });

    // Stage 4
    const stage4Result = runStage4({
      blockStore, graph, memory, loadedRegions,
      enrichments: stage1Result.enrichments,
      variableMap: stage3Result.variableMap,
    });

    integration = stage4Result.integration;
  });

  it("should produce program structure", () => {
    expect(integration.program).toBeDefined();
    expect(integration.program.type).toBeTruthy();
    expect(integration.program.entryPoint).toBeTruthy();
  });

  it("should assign blocks to files", () => {
    expect(integration.files.length).toBeGreaterThan(0);
    expect(integration.fileBuildOrder.length).toBeGreaterThan(0);
  });

  it("should produce a block-to-file mapping", () => {
    expect(Object.keys(integration.blockToFileMap).length).toBeGreaterThan(0);
  });

  it("should produce dead code analysis", () => {
    expect(integration.deadCode).toBeDefined();
    expect(integration.deadCode.percentOfProgram).toBeGreaterThanOrEqual(0);
  });

  it("should produce overview comments with memory map", () => {
    expect(integration.overviewComments).toBeDefined();
    expect(integration.overviewComments.memoryMap).toBeTruthy();
  });

  it("should produce a readme", () => {
    expect(integration.documentation.readme).toBeTruthy();
  });

  it("should have reasonable number of modules (≤15)", () => {
    expect(integration.files.length).toBeLessThanOrEqual(15);
  });
});
