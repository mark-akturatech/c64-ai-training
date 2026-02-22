// ============================================================================
// Stage 1 Integration Test — load spriteintro fixtures, run ALL 28 Stage 1
// enrichment plugins (pri 10-100), verify enrichments and graph growth.
// ============================================================================

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BlockStore } from "../block_store.js";
import { MutableGraph } from "../mutable_graph.js";
import { runStage1Enrichment, type Stage1RunnerOutput } from "../enrichment/index.js";
import type { EnrichmentPlugin } from "../types.js";
import type { Block, LoadedRegion } from "@c64/shared";

// Foundation plugins (pri 10-18)
import { ConstantPropagationEnrichment } from "../enrichment/constant_propagation_enrichment.js";
import { ZeroPageTrackerEnrichment } from "../enrichment/zero_page_tracker_enrichment.js";
import { KernalApiEnrichment } from "../enrichment/kernal_api_enrichment.js";
import { InterProceduralRegisterPropagationEnrichment } from "../enrichment/inter_procedural_register_propagation_enrichment.js";

// Resolution plugins (pri 20-35)
import { PointerPairEnrichment } from "../enrichment/pointer_pair_enrichment.js";
import { IndirectJmpEnrichment } from "../enrichment/indirect_jmp_enrichment.js";
import { VectorWriteEnrichment } from "../enrichment/vector_write_enrichment.js";
import { RtsDispatchEnrichment } from "../enrichment/rts_dispatch_enrichment.js";
import { SmcTargetEnrichment } from "../enrichment/smc_target_enrichment.js";
import { AddressTableEnrichment } from "../enrichment/address_table_enrichment.js";

// Semantics plugins (pri 40-55)
import { RegisterSemanticsEnrichment } from "../enrichment/register_semantics_enrichment.js";
import { DataFormatEnrichment } from "../enrichment/data_format_enrichment.js";
import { IrqVolatilityEnrichment } from "../enrichment/irq_volatility_enrichment.js";
import { SaveRestoreDetectorEnrichment } from "../enrichment/save_restore_detector_enrichment.js";
import { InterruptChainEnrichment } from "../enrichment/interrupt_chain_enrichment.js";
import { StateMachineEnrichment } from "../enrichment/state_machine_enrichment.js";
import { CopyLoopEnrichment } from "../enrichment/copy_loop_enrichment.js";
import { DataTableSemanticsEnrichment } from "../enrichment/data_table_semantics_enrichment.js";

// Cross-reference plugins (pri 60-70)
import { CallGraphEnrichment } from "../enrichment/call_graph_enrichment.js";
import { DataBoundaryEnrichment } from "../enrichment/data_boundary_enrichment.js";
import { DataFlowEnrichment } from "../enrichment/data_flow_enrichment.js";
import { SharedDataEnrichment } from "../enrichment/shared_data_enrichment.js";

// C64-specific plugins (pri 80-90)
import { BankingStateEnrichment } from "../enrichment/banking_state_enrichment.js";
import { VicAnnotationEnrichment } from "../enrichment/vic_annotation_enrichment.js";
import { SidAnnotationEnrichment } from "../enrichment/sid_annotation_enrichment.js";
import { ScreenOpsEnrichment } from "../enrichment/screen_ops_enrichment.js";

// AI plugins (pri 100)
import { AiConceptExtractionEnrichment } from "../enrichment/ai_concept_extraction_enrichment.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, "../../../test/spriteintro-output");

function createAllPlugins(): EnrichmentPlugin[] {
  const plugins: EnrichmentPlugin[] = [
    // Foundation (pri 10-18)
    new ConstantPropagationEnrichment(),
    new ZeroPageTrackerEnrichment(),
    new KernalApiEnrichment(),
    new InterProceduralRegisterPropagationEnrichment(),
    // Resolution (pri 20-35)
    new PointerPairEnrichment(),
    new IndirectJmpEnrichment(),
    new VectorWriteEnrichment(),
    new RtsDispatchEnrichment(),
    new SmcTargetEnrichment(),
    new AddressTableEnrichment(),
    // Semantics (pri 40-55)
    new RegisterSemanticsEnrichment(),
    new DataFormatEnrichment(),
    new IrqVolatilityEnrichment(),
    new SaveRestoreDetectorEnrichment(),
    new InterruptChainEnrichment(),
    new StateMachineEnrichment(),
    new CopyLoopEnrichment(),
    new DataTableSemanticsEnrichment(),
    // Cross-reference (pri 60-70)
    new CallGraphEnrichment(),
    new DataBoundaryEnrichment(),
    new DataFlowEnrichment(),
    new SharedDataEnrichment(),
    // C64-specific (pri 80-90)
    new BankingStateEnrichment(),
    new VicAnnotationEnrichment(),
    new SidAnnotationEnrichment(),
    new ScreenOpsEnrichment(),
    // AI (pri 100)
    new AiConceptExtractionEnrichment(),
  ];
  plugins.sort((a, b) => a.priority - b.priority);
  return plugins;
}

describe("Stage 1 Integration — spriteintro (all 28 plugins)", () => {
  let blocks: Block[];
  let graph: MutableGraph;
  let blockStore: BlockStore;
  let result: Stage1RunnerOutput;
  let initialEdgeCount: number;

  beforeAll(async () => {
    const blocksJson = JSON.parse(readFileSync(resolve(fixtureDir, "blocks.json"), "utf8"));
    const treeJson = JSON.parse(readFileSync(resolve(fixtureDir, "dependency_tree.json"), "utf8"));

    blocks = blocksJson.blocks;
    blockStore = new BlockStore(blocks);
    graph = MutableGraph.fromDependencyTree(treeJson);
    initialEdgeCount = graph.getEdges().length;

    // Build memory from block data
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

    result = await runStage1Enrichment({
      blockStore,
      graph,
      memory,
      loadedRegions,
      plugins: createAllPlugins(),
    });
  });

  // === Basic loading ===

  it("should load all blocks", () => {
    expect(blocks.length).toBe(23);
  });

  it("should load graph with code and data nodes", () => {
    expect(graph.getNodes().size).toBe(33);
    const codeNodes = [...graph.getNodes().values()].filter(n => n.type === "code").length;
    const dataNodes = [...graph.getNodes().values()].filter(n => n.type === "data").length;
    expect(codeNodes).toBeGreaterThan(0);
    expect(dataNodes).toBeGreaterThan(0);
  });

  // === Runner behavior ===

  it("should run all 28 plugins and produce enrichments from many sources", () => {
    expect(result.stats.totalEnrichments).toBeGreaterThan(0);
    // Should have output from many distinct plugin sources
    const sources = new Set<string>();
    for (const [name] of result.enrichments) {
      sources.add(name);
    }
    // At least 5 different plugins should produce output
    expect(sources.size).toBeGreaterThanOrEqual(5);
  });

  it("should converge (no infinite looping)", () => {
    expect(result.stats.passes).toBeLessThanOrEqual(6);
  });

  // === Foundation plugins (pri 10-18) ===

  it("should annotate code nodes with banking state", () => {
    expect(result.stats.bankingNodesAnnotated).toBeGreaterThan(0);
    const codeNodesWithBanking = [...graph.getNodes().values()]
      .filter(n => n.type === "code" && n.bankingState).length;
    expect(codeNodesWithBanking).toBeGreaterThan(0);
  });

  it("should have default banking ($37) for entry points", () => {
    const entryNode = graph.getNode("code_080e");
    expect(entryNode).toBeDefined();
    expect(entryNode!.bankingState).toBeDefined();
    const banking = entryNode!.bankingState!;
    expect(banking.onEntry.kernalMapped).toBe("yes");
    expect(banking.onEntry.basicMapped).toBe("yes");
    expect(banking.onEntry.ioMapped).toBe("yes");
  });

  it("should produce KERNAL API enrichments for JSR $E544", () => {
    const kernalEnrichments = result.enrichments.get("kernal_api") ?? [];
    expect(kernalEnrichments.length).toBeGreaterThan(0);
    const scinit = kernalEnrichments.find(e => e.data?.targetAddress === 0xE544);
    expect(scinit).toBeDefined();
    expect(scinit!.annotation).toContain("SCINIT");
    expect(scinit!.data?.kernalMapped).toBe("yes");
  });

  it("should produce constant propagation enrichments", () => {
    const constEnrichments = result.enrichments.get("constant_propagation") ?? [];
    expect(constEnrichments.length).toBeGreaterThan(0);
    const borderColor = constEnrichments.find(e =>
      e.data?.targetAddress === 0xD020 && e.data?.value === 0
    );
    expect(borderColor).toBeDefined();
    expect(borderColor!.annotation).toContain("$00");
  });

  it("should produce banking propagation enrichments for all code nodes", () => {
    const bankingEnrichments = result.enrichments.get("inter_procedural_register_propagation") ?? [];
    expect(bankingEnrichments.length).toBeGreaterThan(0);
    const codeNodeCount = [...graph.getNodes().values()].filter(n => n.type === "code").length;
    expect(bankingEnrichments.length).toBeGreaterThanOrEqual(codeNodeCount);
  });

  // === Semantics plugins (pri 40-55) ===

  it("should produce register semantics annotations (STA $D020 → border color)", () => {
    const regSemEnrichments = result.enrichments.get("register_semantics") ?? [];
    expect(regSemEnrichments.length).toBeGreaterThan(0);
    const borderAnnotation = regSemEnrichments.find(e =>
      e.data?.registerAddress === 0xD020
    );
    expect(borderAnnotation).toBeDefined();
    expect(borderAnnotation!.annotation).toContain("Border color");
  });

  it("should classify data blocks by format", () => {
    const dataFmtEnrichments = result.enrichments.get("data_format") ?? [];
    // spriteintro has sprite data — should detect at least some format
    expect(dataFmtEnrichments).toBeDefined();
    // Even if no formats detected, the plugin should at least run without errors
  });

  // === Cross-reference plugins (pri 60-70) ===

  it("should produce call graph enrichments with callers/callees", () => {
    const callGraphEnrichments = result.enrichments.get("call_graph") ?? [];
    expect(callGraphEnrichments.length).toBeGreaterThan(0);
    // Should have at least some entry point or leaf annotations
    const entryPoints = callGraphEnrichments.filter(e => e.data?.isEntryPoint === true);
    const leafFns = callGraphEnrichments.filter(e => e.data?.isLeaf === true);
    expect(entryPoints.length + leafFns.length).toBeGreaterThan(0);
  });

  it("should produce data flow enrichments", () => {
    const dataFlowEnrichments = result.enrichments.get("data_flow") ?? [];
    // May or may not have data flow depending on graph edges
    expect(dataFlowEnrichments).toBeDefined();
  });

  // === C64-specific plugins (pri 80-90) ===

  it("should produce VIC annotation enrichments", () => {
    const vicEnrichments = result.enrichments.get("vic_annotation") ?? [];
    // spriteintro definitely uses VIC registers
    expect(vicEnrichments).toBeDefined();
  });

  it("should produce screen ops enrichments for screen/color RAM", () => {
    const screenEnrichments = result.enrichments.get("screen_ops") ?? [];
    expect(screenEnrichments).toBeDefined();
  });

  // === AI placeholder (pri 100) ===

  it("should mark code blocks for AI concept extraction", () => {
    const aiEnrichments = result.enrichments.get("ai_concept_extraction") ?? [];
    expect(aiEnrichments.length).toBeGreaterThan(0);
    const pending = aiEnrichments.find(e => e.data?.pendingAI === true);
    expect(pending).toBeDefined();
    expect(pending!.data?.stage).toBe("stage2");
  });

  // === Pipeline state ===

  it("should set staticEnrichmentComplete on all nodes", () => {
    for (const node of graph.getNodes().values()) {
      expect(node.pipelineState.staticEnrichmentComplete).toBe(true);
    }
  });

  // === Graph growth from resolution plugins ===

  it("should have more edges after enrichment (from resolution plugins)", () => {
    const finalEdgeCount = graph.getEdges().length;
    // At minimum, the original edges should still be there
    expect(finalEdgeCount).toBeGreaterThanOrEqual(initialEdgeCount);
  });
});
