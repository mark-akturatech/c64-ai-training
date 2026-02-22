// ============================================================================
// Stage 4 Orchestrator — Integration Analysis
//
// Whole-program analysis: structure, module assignment, dead code, docs.
// Runs all integration analyzers and assembles IntegrationJson.
// ============================================================================

import type { Block, LoadedRegion } from "@c64/shared";
import type {
  EnrichmentMap,
  VariableMapData,
  IntegrationJson,
  IntegrationAnalyzer,
  IntegrationAnalyzerInput,
  IntegrationContribution,
  BlockAnalysis,
} from "../types.js";
import type { BlockStore } from "../block_store.js";
import type { MutableGraph } from "../mutable_graph.js";
import { runIntegrationAnalyzers } from "./integration/index.js";

// Default analyzers (for testing — in production, auto-discovered)
import { ProgramStructureAnalyzer } from "./integration/program_structure_analyzer.js";
import { ModuleAssignmentAnalyzer } from "./integration/module_assignment_analyzer.js";
import { IrqChainAnalyzer } from "./integration/irq_chain_analyzer.js";
import { StateMachineAnalyzer } from "./integration/state_machine_analyzer.js";
import { MemoryMapAnalyzer } from "./integration/memory_map_analyzer.js";
import { FileDependencyAnalyzer } from "./integration/file_dependency_analyzer.js";
import { DeadCodeAnalyzer } from "./integration/dead_code_analyzer.js";

export interface Stage4Input {
  blockStore: BlockStore;
  graph: MutableGraph;
  memory: Uint8Array;
  loadedRegions: LoadedRegion[];
  enrichments: EnrichmentMap;
  variableMap: VariableMapData;
  analyses?: ReadonlyMap<string, BlockAnalysis>;
  analyzers?: IntegrationAnalyzer[];
  logger?: import("../shared/pipeline_logger.js").PipelineLogger;
}

export interface Stage4Output {
  integration: IntegrationJson;
}

export function runStage4(input: Stage4Input): Stage4Output {
  const { blockStore, graph, enrichments, variableMap, analyses } = input;

  const analyzers = input.analyzers ?? [
    new ProgramStructureAnalyzer(),
    new ModuleAssignmentAnalyzer(),
    new IrqChainAnalyzer(),
    new StateMachineAnalyzer(),
    new MemoryMapAnalyzer(),
    new FileDependencyAnalyzer(),
    new DeadCodeAnalyzer(),
  ];

  // Build allBlocks from analyses or from graph nodes
  const allBlocks: BlockAnalysis[] = [];
  if (analyses && analyses.size > 0) {
    for (const analysis of analyses.values()) {
      allBlocks.push(analysis);
    }
  } else {
    // Build from graph nodes
    for (const node of graph.getNodes().values()) {
      allBlocks.push({
        blockId: node.id,
        purpose: `Block at $${node.start.toString(16).toUpperCase().padStart(4, "0")}`,
        category: node.type === "data" ? "data" : "code",
        confidence: node.pipelineState.confidence,
        variables: {},
        headerComment: "",
        inlineComments: {},
        isReverseEngineered: node.pipelineState.reverseEngineered,
      });
    }
  }

  const analyzerInput: IntegrationAnalyzerInput = {
    allBlocks,
    graph,
    variableMap,
    enrichments,
    blockStore,
  };

  const contributions = runIntegrationAnalyzers(analyzers, analyzerInput);

  // Assemble IntegrationJson from contributions
  return { integration: assembleIntegration(contributions, allBlocks) };
}

function assembleIntegration(
  contributions: IntegrationContribution[],
  allBlocks: BlockAnalysis[],
): IntegrationJson {
  const result: IntegrationJson = {
    program: {
      type: "program",
      name: "unknown",
      description: "Unknown program",
      entryPoint: "unknown",
      mainLoop: null,
      initChain: [],
      irqHandlers: [],
      stateMachines: [],
    },
    files: [],
    fileBuildOrder: [],
    overviewComments: { fileHeaders: {}, memoryMap: "" },
    documentation: { readme: "", interesting: "", howItWorks: "" },
    blockToFileMap: {},
    deadCode: {
      nodes: [],
      totalDeadBytes: 0,
      percentOfProgram: 0,
    },
    unprocessedRegions: [],
  };

  for (const c of contributions) {
    switch (c.section) {
      case "program":
        result.program = c.data as IntegrationJson["program"];
        break;
      case "files":
        result.files = (c.data as Record<string, unknown>).files as IntegrationJson["files"];
        result.fileBuildOrder = (c.data as Record<string, unknown>).fileBuildOrder as string[];
        result.blockToFileMap = (c.data as Record<string, unknown>).blockToFileMap as Record<string, string>;
        break;
      case "irqChains":
        // Merge IRQ chain info into program
        break;
      case "stateMachines":
        // Already captured in program structure
        break;
      case "memoryMap":
        result.overviewComments.memoryMap = (c.data as Record<string, unknown>).memoryMapText as string;
        break;
      case "overviewComments":
        result.overviewComments.fileHeaders = (c.data as Record<string, unknown>).fileHeaders as Record<string, string>;
        break;
      case "deadCode":
        result.deadCode = c.data as IntegrationJson["deadCode"];
        break;
    }
  }

  // Build documentation stubs
  result.documentation.readme = buildReadme(result, allBlocks);

  // Low-confidence blocks → unprocessed regions
  for (const block of allBlocks) {
    if (block.confidence < 0.3) {
      const addr = parseInt(block.blockId.replace(/^(code|data)_/, ""), 16);
      result.unprocessedRegions.push({
        start: `$${addr.toString(16).toUpperCase().padStart(4, "0")}`,
        end: block.blockId,
        reason: `Low confidence: ${(block.confidence * 100).toFixed(0)}%`,
      });
    }
  }

  return result;
}

function buildReadme(integration: IntegrationJson, allBlocks: BlockAnalysis[]): string {
  const lines: string[] = [
    `# ${integration.program.name}`,
    "",
    `**Type:** ${integration.program.type}`,
    `**Entry point:** ${integration.program.entryPoint}`,
    "",
    `## Structure`,
    `- ${allBlocks.length} blocks total`,
    `- ${integration.files.length} files`,
  ];

  if (integration.program.mainLoop) {
    lines.push(`- Main loop: ${integration.program.mainLoop.description}`);
  }

  if (integration.program.irqHandlers.length > 0) {
    lines.push(`- ${integration.program.irqHandlers.length} IRQ handlers`);
  }

  if (integration.deadCode.totalDeadBytes > 0) {
    lines.push(`- Dead code: ${integration.deadCode.totalDeadBytes} bytes (${integration.deadCode.percentOfProgram}%)`);
  }

  return lines.join("\n");
}
