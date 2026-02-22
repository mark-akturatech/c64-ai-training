// ============================================================================
// Stage 2 Orchestrator — process blocks with sequential AI plugins
//
// Processes blocks in SCC-aware topological order (callees first).
// Each plugin runs once per block, building on prior plugin results.
// Handles block splits/reclassifications with sub-loop processing.
// ============================================================================

import type { Block, LoadedRegion } from "@c64/shared";
import type {
  Stage2Plugin,
  Stage2PluginInput,
  Stage2PluginResult,
  EnrichmentMap,
  REBlockEnrichment,
  VariableMapData,
  VariableEntry,
  SearchHit,
  Stage2Output,
  BlockAnalysis,
} from "../types.js";
import type { BlockStore } from "../block_store.js";
import type { MutableGraph } from "../mutable_graph.js";
import type { SymbolDBInterface } from "../types.js";
import { ConceptExtractionPlugin } from "./stage2_plugins/concept_extraction_plugin.js";
import { PurposeAnalysisPlugin } from "./stage2_plugins/purpose_analysis_plugin.js";
import { VariableNamingPlugin } from "./stage2_plugins/variable_naming_plugin.js";
import { DocumentationPlugin } from "./stage2_plugins/documentation_plugin.js";
import { ValidationPlugin } from "./stage2_plugins/validation_plugin.js";
import type { AIClient } from "../shared/ai_client.js";
import type { PipelineLogger } from "../shared/pipeline_logger.js";

export interface Stage2OrchestratorInput {
  blockStore: BlockStore;
  graph: MutableGraph;
  memory: Uint8Array;
  loadedRegions: LoadedRegion[];
  enrichments: EnrichmentMap;
  plugins?: Stage2Plugin[];
  symbolDb: SymbolDBInterface;
  qdrantSearch?: (query: string) => Promise<SearchHit[]>;
  /** AI client for OpenAI calls. If absent, plugins use heuristic fallbacks. */
  aiClient?: AIClient;
  /** If true, skip actual AI calls (use stubs). For testing. */
  dryRun?: boolean;
  /** Optional logger for per-block progress */
  logger?: PipelineLogger;
}

export async function runStage2(input: Stage2OrchestratorInput): Promise<Stage2Output> {
  const {
    blockStore, graph, symbolDb,
    qdrantSearch = async () => [],
  } = input;

  const ai = input.aiClient;

  const plugins = input.plugins ?? [
    new ConceptExtractionPlugin(ai),
    new PurposeAnalysisPlugin(ai),
    new VariableNamingPlugin(ai),
    new DocumentationPlugin(ai),
    new ValidationPlugin(),
  ];
  const sortedPlugins = [...plugins].sort((a, b) => a.priority - b.priority);

  // Build mutable enrichment map (clone from Stage 1)
  const mutableEnrichments = new Map<string, REBlockEnrichment[]>();
  for (const [key, val] of input.enrichments) {
    mutableEnrichments.set(key, [...val]);
  }

  // Initialize variable map
  const variableMap: VariableMapData = {
    metadata: { source: "stage2", timestamp: new Date().toISOString(), totalVariables: 0 },
    variables: {},
  };

  // Track analyses for context
  const analyses = new Map<string, BlockAnalysis>();

  let aiCalls = 0;
  let blocksReclassified = 0;
  let newGraphEdges = 0;

  // Get processing order: SCC-aware topological (callees first)
  const order = graph.topologicalSort("control_flow");
  const flatOrder = order.flat(); // Flatten SCC groups

  // Count code blocks for progress
  const codeNodes = flatOrder.filter(id => {
    const n = graph.getNode(id);
    if (!n) return false;
    const b = blockStore.getBlock(n.start);
    return b && b.type !== "data" && b.type !== "unknown";
  });
  let processed = 0;

  // Process each node
  for (const nodeId of flatOrder) {
    const node = graph.getNode(nodeId);
    if (!node) continue;

    // Find corresponding block
    const block = blockStore.getBlock(node.start);
    if (!block) {
      graph.setPipelineState(nodeId, { aiEnrichmentComplete: true });
      continue;
    }

    // Skip data blocks for AI analysis (they get enriched in Stage 1)
    if (block.type === "data" || block.type === "unknown") {
      graph.setPipelineState(nodeId, { aiEnrichmentComplete: true });
      continue;
    }

    processed++;
    const logger = input.logger;
    if (logger) {
      logger.block(processed, codeNodes.length, block.address);
    } else {
      const addr = block.address.toString(16).toUpperCase().padStart(4, "0");
      process.stderr.write(`\r  Block ${processed}/${codeNodes.length}: $${addr}  `);
    }

    // Run all plugins sequentially for this block
    const priorResults = new Map<string, Stage2PluginResult>();

    for (const plugin of sortedPlugins) {
      const pluginInput: Stage2PluginInput = {
        block,
        graph,
        blockStore,
        enrichments: mutableEnrichments as EnrichmentMap,
        variableMap,
        priorStage2Results: priorResults,
        symbolDb,
        qdrantSearch,
      };

      const result = await plugin.run(pluginInput);
      priorResults.set(plugin.name, result);
      aiCalls++;

      // Store enrichments
      if (result.enrichments.length > 0) {
        const existing = mutableEnrichments.get(plugin.name) ?? [];
        mutableEnrichments.set(plugin.name, [...existing, ...result.enrichments]);
      }

      // Apply reclassifications
      for (const r of result.reclassifications ?? []) {
        blockStore.reclassify(r.blockAddress, r.newType, r.reason);
        blocksReclassified++;
      }

      // Merge variable entries
      for (const entry of result.variableEntries ?? []) {
        mergeVariableEntry(variableMap, entry);
      }
    }

    // Build analysis from accumulated plugin results
    const purposeResult = priorResults.get("ai_purpose_analysis");
    const docResult = priorResults.get("ai_documentation");
    const validationResult = priorResults.get("ai_validation");
    const varResult = priorResults.get("ai_variable_naming");

    const analysis: BlockAnalysis = {
      blockId: block.id ?? `block_${block.address.toString(16)}`,
      purpose: getField(purposeResult, "purpose") ?? "Unknown",
      category: getField(purposeResult, "category") ?? "unknown",
      algorithm: getField(purposeResult, "algorithm") ?? undefined,
      confidence: validationResult?.confidence ?? purposeResult?.confidence ?? 0.5,
      variables: getField(varResult, "variables") ?? {},
      headerComment: getField(docResult, "headerComment") ?? "",
      inlineComments: getField(docResult, "inlineComments") ?? {},
      isReverseEngineered: false,
    };

    analyses.set(analysis.blockId, analysis);

    // Update pipeline state
    graph.setPipelineState(nodeId, {
      aiEnrichmentComplete: true,
      confidence: analysis.confidence,
    });
  }

  if (processed > 0 && !input.logger) process.stderr.write("\n");

  // Mark any remaining nodes not in topological order as complete
  for (const node of graph.getNodes().values()) {
    if (!node.pipelineState.aiEnrichmentComplete) {
      graph.setPipelineState(node.id, { aiEnrichmentComplete: true });
    }
  }

  // Reconcile variable names across all blocks
  reconcileVariableNames(variableMap);

  variableMap.metadata.totalVariables = Object.keys(variableMap.variables).length;

  return {
    blockStore,
    graph,
    variableMap,
    enrichments: mutableEnrichments as EnrichmentMap,
    stats: {
      totalBlocks: flatOrder.length,
      pluginsRun: sortedPlugins.map(p => p.name),
      aiCalls,
      blocksReclassified,
      newGraphEdges,
    },
  };
}

function getField(result: Stage2PluginResult | undefined, field: string): any {
  if (!result) return undefined;
  for (const e of result.enrichments) {
    if (e.data?.[field] !== undefined) return e.data[field];
  }
  return undefined;
}

function mergeVariableEntry(map: VariableMapData, entry: VariableEntry): void {
  const hexKey = entry.address.toString(16).toUpperCase().padStart(2, "0");
  const existing = map.variables[hexKey];

  if (!existing) {
    map.variables[hexKey] = entry;
  } else {
    // Merge usage contexts
    for (const ctx of entry.usageContexts) {
      if (!existing.usageContexts.find(e => e.blockId === ctx.blockId && e.name === ctx.name)) {
        existing.usageContexts.push(ctx);
      }
    }
    // Merge usedBy
    for (const blockId of entry.usedBy) {
      if (!existing.usedBy.includes(blockId)) {
        existing.usedBy.push(blockId);
      }
    }
  }
}

/**
 * Reconcile variable names across all blocks.
 * After per-block AI suggestions are accumulated in usageContexts,
 * pick the best name based on confidence, or synthesize a generic name
 * when multiple blocks disagree.
 */
function reconcileVariableNames(map: VariableMapData): void {
  for (const [hexKey, entry] of Object.entries(map.variables)) {
    if (entry.usageContexts.length === 0) continue;

    // Collect unique name suggestions with max confidence per name
    const nameConfidence = new Map<string, number>();
    for (const ctx of entry.usageContexts) {
      const existing = nameConfidence.get(ctx.name) ?? 0;
      nameConfidence.set(ctx.name, Math.max(existing, ctx.confidence));
    }

    // If only one unique name, use it
    if (nameConfidence.size === 1) {
      const [name] = nameConfidence.keys();
      if (entry.currentName !== name) {
        recordNameChange(entry, name, "reconciliation: single suggestion");
      }
      continue;
    }

    // Multiple names — pick highest confidence
    let bestName = entry.currentName;
    let bestConf = 0;
    for (const [name, conf] of nameConfidence) {
      if (conf > bestConf) {
        bestConf = conf;
        bestName = name;
      }
    }

    // If top two are close in confidence (within 0.15), synthesize a generic name
    const sorted = [...nameConfidence.entries()].sort((a, b) => b[1] - a[1]);
    if (sorted.length >= 2 && sorted[0][1] - sorted[1][1] < 0.15) {
      // Try to find a common theme
      const names = sorted.map(s => s[0]);
      const commonName = synthesizeGenericName(names, entry.address);
      if (commonName) {
        bestName = commonName;
      }
    }

    if (entry.currentName !== bestName) {
      recordNameChange(entry, bestName, `reconciliation: picked from ${nameConfidence.size} suggestions`);
    }
  }
}

function recordNameChange(entry: VariableEntry, newName: string, reason: string): void {
  entry.nameHistory.push({
    from: entry.currentName,
    to: newName,
    reason,
    source: "reconciliation",
    timestamp: new Date().toISOString(),
  });
  entry.currentName = newName;
}

/**
 * When multiple blocks disagree on a variable name, try to synthesize
 * a generic name that captures the common usage pattern.
 */
function synthesizeGenericName(names: string[], address: number): string | null {
  // Find common prefix
  const prefix = longestCommonPrefix(names);
  if (prefix.length >= 4) {
    // e.g., "sprite_ptr" and "sprite_offset" → "sprite_ptr" (keep prefix)
    return prefix.replace(/_+$/, "");
  }

  // Check if all names suggest pointer usage
  if (names.every(n => /ptr|pointer/.test(n))) {
    return address < 0x100 ? `ptr_${address.toString(16).toLowerCase()}` : null;
  }

  // Check if all names suggest counter/index usage
  if (names.every(n => /count|index|idx|cnt/.test(n))) {
    return address < 0x100 ? `counter_${address.toString(16).toLowerCase()}` : null;
  }

  // Check if all names suggest temp/scratch usage (different purposes in different blocks)
  if (names.length >= 2) {
    // Multiple unrelated names → it's a temp variable
    return address < 0x100 ? `temp_${address.toString(16).toLowerCase()}` : null;
  }

  return null;
}

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}
