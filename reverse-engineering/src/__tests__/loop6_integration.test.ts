// ============================================================================
// Loop 6 Integration Test — verify context providers, prompt assembly,
// tool handlers, annotation sources, and response processors.
// ============================================================================

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BlockStore } from "../block_store.js";
import { MutableGraph } from "../mutable_graph.js";
import { runStage1Enrichment } from "../enrichment/index.js";
import { SymbolDB } from "../shared/symbol_db.js";
import { buildPrompt, estimateTokens } from "../shared/prompt_builder.js";
import { createAllContextProviders, collectContext } from "../pipeline/context/index.js";
import { createAllToolHandlers, toolsToOpenAIFormat } from "../pipeline/tools/index.js";
import { createAllAnnotationSources, annotateInstruction } from "../pipeline/annotations/index.js";
import { createAllProcessors, processAIResponse } from "../pipeline/processors/index.js";
import { ProjectCollection } from "../shared/project_collection.js";
import { toSnakeCase, isValidVariableName, sanitizeName } from "../shared/naming.js";
import type { Block, LoadedRegion } from "@c64/shared";
import type { ContextProviderInput, EnrichmentMap, VariableMapData, BlockAnalysis } from "../types.js";

// Import all 28 enrichment plugins
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, "../../../test/spriteintro-output");

describe("Loop 6 — Plugin Framework Integration", () => {
  let blocks: Block[];
  let graph: MutableGraph;
  let blockStore: BlockStore;
  let enrichments: EnrichmentMap;
  let symbolDb: SymbolDB;

  beforeAll(async () => {
    const blocksJson = JSON.parse(readFileSync(resolve(fixtureDir, "blocks.json"), "utf8"));
    const treeJson = JSON.parse(readFileSync(resolve(fixtureDir, "dependency_tree.json"), "utf8"));

    blocks = blocksJson.blocks;
    blockStore = new BlockStore(blocks);
    graph = MutableGraph.fromDependencyTree(treeJson);
    symbolDb = new SymbolDB();

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

    // Create all 28 plugins
    const plugins = [
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

    const result = await runStage1Enrichment({
      blockStore, graph, memory, loadedRegions, plugins,
    });

    enrichments = result.enrichments;
  });

  // === Naming module ===

  it("should convert names to snake_case", () => {
    expect(toSnakeCase("borderColor")).toBe("border_color");
    expect(toSnakeCase("SPRITE_X_POS")).toBe("sprite_x_pos");
    expect(toSnakeCase("update loop counter")).toBe("update_loop_counter");
  });

  it("should validate variable names", () => {
    expect(isValidVariableName("border_color")).toBe(true);
    expect(isValidVariableName("2bad")).toBe(false);
    expect(isValidVariableName("")).toBe(false);
  });

  it("should sanitize names", () => {
    expect(sanitizeName("Border Color!")).toBe("border_color");
    expect(sanitizeName("123start")).toBe("var_123start");
  });

  // === Context providers ===

  it("should create all 12 context providers", () => {
    const providers = createAllContextProviders();
    expect(providers.length).toBe(12);
    expect(providers[0].name).toBe("banking_state"); // Lowest priority = first
  });

  it("should collect context contributions for a spriteintro block", () => {
    const providers = createAllContextProviders();
    const entryBlock = blocks.find(b => b.address === 0x080E);
    expect(entryBlock).toBeDefined();

    const emptyVarMap: VariableMapData = {
      metadata: { source: "test", timestamp: new Date().toISOString(), totalVariables: 0 },
      variables: {},
    };

    const input: ContextProviderInput = {
      block: entryBlock!,
      graph,
      blockStore,
      enrichments,
      variableMap: emptyVarMap,
      priorAnalyses: new Map<string, BlockAnalysis>(),
      symbolDb,
      stage: 2,
    };

    const contributions = collectContext(providers, input);
    expect(contributions.length).toBeGreaterThan(0);

    // Banking state should be present (entry block has default banking)
    const bankingContrib = contributions.find(c => c.section === "Banking State");
    expect(bankingContrib).toBeDefined();
    expect(bankingContrib!.content).toContain("MAPPED");
  });

  // === Prompt builder ===

  it("should build a structured prompt from context contributions", () => {
    const providers = createAllContextProviders();
    const entryBlock = blocks.find(b => b.address === 0x080E)!;

    const input: ContextProviderInput = {
      block: entryBlock,
      graph,
      blockStore,
      enrichments,
      variableMap: {
        metadata: { source: "test", timestamp: new Date().toISOString(), totalVariables: 0 },
        variables: {},
      },
      priorAnalyses: new Map<string, BlockAnalysis>(),
      symbolDb,
      stage: 2,
    };

    const contributions = collectContext(providers, input);
    const prompt = buildPrompt(contributions, entryBlock, {
      systemPrefix: "You are a C64 reverse engineering assistant.",
      maxTokens: 8000,
    });

    expect(prompt.system).toContain("Banking State");
    expect(prompt.system).toContain("reverse engineering assistant");
    expect(prompt.sectionsIncluded.length).toBeGreaterThan(0);
    expect(prompt.totalTokenEstimate).toBeGreaterThan(0);
    expect(prompt.totalTokenEstimate).toBeLessThanOrEqual(8000);
  });

  it("should estimate tokens roughly", () => {
    expect(estimateTokens("hello world")).toBeGreaterThan(0);
    expect(estimateTokens("")).toBe(0);
  });

  // === Tool handlers ===

  it("should create all 10 tool handlers", () => {
    const handlers = createAllToolHandlers();
    expect(handlers.length).toBe(10);
  });

  it("should convert tools to OpenAI format", () => {
    const handlers = createAllToolHandlers();
    const openai = toolsToOpenAIFormat(handlers);
    expect(openai.length).toBe(10);
    expect(openai[0].type).toBe("function");
    expect(openai[0].function.name).toBeDefined();
    expect(openai[0].function.parameters).toBeDefined();
  });

  // === Annotation sources ===

  it("should create all 4 annotation sources", () => {
    const sources = createAllAnnotationSources();
    expect(sources.length).toBe(4);
    expect(sources[0].name).toBe("symbol_db"); // Lowest priority
  });

  it("should annotate JSR $FFD2 as CHROUT (when KERNAL mapped)", () => {
    const sources = createAllAnnotationSources();
    const result = annotateInstruction(sources, {
      instruction: {
        address: 0x0820,
        opcode: 0x20,
        mnemonic: "jsr",
        operand: "$FFD2",
        bytes: [0x20, 0xD2, 0xFF],
        size: 3,
        addressingMode: "absolute",
      },
      block: blocks[0],
      enrichments: [],
      symbolDb,
      bankingState: {
        cpuPort: { bitmask: { knownMask: 0xFF, knownValue: 0x37 }, possibleValues: new Set([0x37]), isDynamic: false, source: "default" },
        vicBank: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
        vicMemPtr: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
        kernalMapped: "yes",
        basicMapped: "yes",
        ioMapped: "yes",
        chargenMapped: "no",
      },
    });
    expect(result).not.toBeNull();
    expect(result!.annotation).toContain("CHROUT");
    expect(result!.source).toBe("symbol_db");
  });

  it("should NOT annotate JSR $FFD2 when KERNAL is unmapped", () => {
    const sources = createAllAnnotationSources();
    const result = annotateInstruction(sources, {
      instruction: {
        address: 0x0820,
        opcode: 0x20,
        mnemonic: "jsr",
        operand: "$FFD2",
        bytes: [0x20, 0xD2, 0xFF],
        size: 3,
        addressingMode: "absolute",
      },
      block: blocks[0],
      enrichments: [],
      symbolDb,
      bankingState: {
        cpuPort: { bitmask: { knownMask: 0xFF, knownValue: 0x35 }, possibleValues: new Set([0x35]), isDynamic: false, source: "default" },
        vicBank: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
        vicMemPtr: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
        kernalMapped: "no",
        basicMapped: "no",
        ioMapped: "yes",
        chargenMapped: "no",
      },
    });
    // symbol_db should return null, kernal_api should return null too
    expect(result).toBeNull();
  });

  // === Response processors ===

  it("should create all 10 response processors", () => {
    const processors = createAllProcessors();
    expect(processors.length).toBe(10);
  });

  it("should detect banking conflict in certainty processor", async () => {
    const processors = createAllProcessors();
    const entryBlock = blocks.find(b => b.address === 0x080E)!;

    // Simulate a node with KERNAL unmapped
    const nodeId = "code_080e";
    const node = graph.getNode(nodeId);
    // Save original state
    const origBanking = node?.bankingState;

    // Temporarily set KERNAL unmapped
    graph.setBankingState(nodeId, {
      cpuPort: { bitmask: { knownMask: 0xFF, knownValue: 0x35 }, possibleValues: new Set([0x35]), isDynamic: false, source: "test" },
      vicBank: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
      vicMemPtr: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
      kernalMapped: "no",
      basicMapped: "no",
      ioMapped: "yes",
      chargenMapped: "no",
    }, {
      cpuPort: { bitmask: { knownMask: 0xFF, knownValue: 0x35 }, possibleValues: new Set([0x35]), isDynamic: false, source: "test" },
      vicBank: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
      vicMemPtr: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
      kernalMapped: "no",
      basicMapped: "no",
      ioMapped: "yes",
      chargenMapped: "no",
    });

    const result = await processAIResponse(processors, {
      block: entryBlock,
      graph,
      aiResponse: { purpose: "calls CHROUT to print text", confidence: 0.9 },
      blockStore,
      enrichments,
      variableMap: { metadata: { source: "test", timestamp: "", totalVariables: 0 }, variables: {} },
      projectCollection: new ProjectCollection(),
      stage: 2,
    });

    // Should flag the banking conflict
    expect(result.reviewFlags!.length).toBeGreaterThan(0);
    const bankingFlag = result.reviewFlags!.find(f => f.reason.includes("KERNAL"));
    expect(bankingFlag).toBeDefined();

    // Restore original state
    if (origBanking) {
      graph.setBankingState(nodeId, origBanking.onEntry, origBanking.onExit);
    }
  });

  // === Project collection ===

  it("should embed and search blocks", async () => {
    const collection = new ProjectCollection();
    await collection.embedBlock({
      blockId: "block_080e",
      purpose: "initialize sprites and screen",
      category: "initialization",
      confidence: 0.8,
      variables: {},
      headerComment: "Setup routine",
      inlineComments: {},
      isReverseEngineered: true,
    });

    const results = await collection.searchSimilar("sprite initialization", []);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].blockId).toBe("block_080e");
  });
});
