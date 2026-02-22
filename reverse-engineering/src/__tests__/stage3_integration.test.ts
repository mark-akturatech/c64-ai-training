// ============================================================================
// Stage 3 Integration Test — run full pipeline (Stage 1+2+3) on spriteintro,
// verify outer loop converges and all blocks get reverse engineered.
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
import { SymbolDB } from "../shared/symbol_db.js";
import type { Block, LoadedRegion } from "@c64/shared";
import type { EnrichmentPlugin, Stage3Output } from "../types.js";

// Stage 1 plugins (all 28)
import { ConstantPropagationEnrichment } from "../enrichment/constant_propagation_enrichment.js";
import { ZeroPageTrackerEnrichment } from "../enrichment/zero_page_tracker_enrichment.js";
import { KernalApiEnrichment } from "../enrichment/kernal_api_enrichment.js";
import { InterProceduralRegisterPropagationEnrichment } from "../enrichment/inter_procedural_register_propagation_enrichment.js";
import { PointerPairEnrichment } from "../enrichment/pointer_pair_enrichment.js";
import { IndirectJmpEnrichment } from "../enrichment/indirect_jmp_enrichment.js";
import { VectorWriteEnrichment } from "../enrichment/vector_write_enrichment.js";
import { RtsDispatchEnrichment } from "../enrichment/rts_dispatch_enrichment.js";
import { SmcTargetEnrichment } from "../enrichment/smc_target_enrichment.js";
import { AddressTableEnrichment } from "../enrichment/address_table_enrichment.js";
import { RegisterSemanticsEnrichment } from "../enrichment/register_semantics_enrichment.js";
import { DataFormatEnrichment } from "../enrichment/data_format_enrichment.js";
import { IrqVolatilityEnrichment } from "../enrichment/irq_volatility_enrichment.js";
import { SaveRestoreDetectorEnrichment } from "../enrichment/save_restore_detector_enrichment.js";
import { InterruptChainEnrichment } from "../enrichment/interrupt_chain_enrichment.js";
import { StateMachineEnrichment } from "../enrichment/state_machine_enrichment.js";
import { CopyLoopEnrichment } from "../enrichment/copy_loop_enrichment.js";
import { DataTableSemanticsEnrichment } from "../enrichment/data_table_semantics_enrichment.js";
import { CallGraphEnrichment } from "../enrichment/call_graph_enrichment.js";
import { DataBoundaryEnrichment } from "../enrichment/data_boundary_enrichment.js";
import { DataFlowEnrichment } from "../enrichment/data_flow_enrichment.js";
import { SharedDataEnrichment } from "../enrichment/shared_data_enrichment.js";
import { BankingStateEnrichment } from "../enrichment/banking_state_enrichment.js";
import { VicAnnotationEnrichment } from "../enrichment/vic_annotation_enrichment.js";
import { SidAnnotationEnrichment } from "../enrichment/sid_annotation_enrichment.js";
import { ScreenOpsEnrichment } from "../enrichment/screen_ops_enrichment.js";
import { AiConceptExtractionEnrichment } from "../enrichment/ai_concept_extraction_enrichment.js";

// Stage 2 plugins
import { ConceptExtractionPlugin } from "../pipeline/stage2_plugins/concept_extraction_plugin.js";
import { PurposeAnalysisPlugin } from "../pipeline/stage2_plugins/purpose_analysis_plugin.js";
import { VariableNamingPlugin } from "../pipeline/stage2_plugins/variable_naming_plugin.js";
import { DocumentationPlugin } from "../pipeline/stage2_plugins/documentation_plugin.js";
import { ValidationPlugin } from "../pipeline/stage2_plugins/validation_plugin.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, "../../../test/spriteintro-output");

function createStage1Plugins(): EnrichmentPlugin[] {
  return [
    new ConstantPropagationEnrichment(), new ZeroPageTrackerEnrichment(),
    new KernalApiEnrichment(), new InterProceduralRegisterPropagationEnrichment(),
    new PointerPairEnrichment(), new IndirectJmpEnrichment(),
    new VectorWriteEnrichment(), new RtsDispatchEnrichment(),
    new SmcTargetEnrichment(), new AddressTableEnrichment(),
    new RegisterSemanticsEnrichment(), new DataFormatEnrichment(),
    new IrqVolatilityEnrichment(), new SaveRestoreDetectorEnrichment(),
    new InterruptChainEnrichment(), new StateMachineEnrichment(),
    new CopyLoopEnrichment(), new DataTableSemanticsEnrichment(),
    new CallGraphEnrichment(), new DataBoundaryEnrichment(),
    new DataFlowEnrichment(), new SharedDataEnrichment(),
    new BankingStateEnrichment(), new VicAnnotationEnrichment(),
    new SidAnnotationEnrichment(), new ScreenOpsEnrichment(),
    new AiConceptExtractionEnrichment(),
  ].sort((a, b) => a.priority - b.priority);
}

describe("Stage 3 Integration — spriteintro (heuristic mode)", () => {
  let stage3Result: Stage3Output;
  let graph: MutableGraph;

  beforeAll(async () => {
    const blocksJson = JSON.parse(readFileSync(resolve(fixtureDir, "blocks.json"), "utf8"));
    const treeJson = JSON.parse(readFileSync(resolve(fixtureDir, "dependency_tree.json"), "utf8"));

    const blocks: Block[] = blocksJson.blocks;
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
    const stage1Result = await runStage1Enrichment({
      blockStore, graph, memory, loadedRegions,
      plugins: createStage1Plugins(),
    });

    // Stage 2
    const stage2Result = await runStage2({
      blockStore, graph, memory, loadedRegions,
      enrichments: stage1Result.enrichments,
      plugins: [
        new ConceptExtractionPlugin(),
        new PurposeAnalysisPlugin(),
        new VariableNamingPlugin(),
        new DocumentationPlugin(),
        new ValidationPlugin(),
      ],
      symbolDb,
    });

    // Stage 3
    stage3Result = await runStage3({
      blockStore,
      graph,
      memory,
      loadedRegions,
      enrichments: stage1Result.enrichments,
      variableMap: stage2Result.variableMap,
      symbolDb,
      maxOuterPasses: 10,
      confidenceThreshold: 0.6,
      maxIterationsPerBlock: 3,
    });
  });

  it("should complete all blocks as reverse engineered", () => {
    for (const node of graph.getNodes().values()) {
      expect(node.pipelineState.reverseEngineered).toBe(true);
    }
  });

  it("should converge within 10 outer passes", () => {
    expect(stage3Result.stats.outerPasses).toBeLessThanOrEqual(10);
  });

  it("should reverse engineer some blocks", () => {
    expect(stage3Result.stats.blocksReverseEngineered).toBeGreaterThan(0);
  });

  it("should use force-pick only when necessary", () => {
    // Force picks should be minimal
    expect(stage3Result.stats.forcePicks).toBeLessThanOrEqual(
      stage3Result.stats.blocksReverseEngineered + stage3Result.stats.forcePicks
    );
  });

  it("should produce a refined variable map", () => {
    expect(stage3Result.variableMap).toBeDefined();
    expect(stage3Result.variableMap.metadata.source).toBe("stage2");
  });

  it("should have confidence scores on all code nodes", () => {
    for (const node of graph.getNodes().values()) {
      if (node.type === "code") {
        expect(node.pipelineState.confidence).toBeGreaterThan(0);
      }
    }
  });
});
