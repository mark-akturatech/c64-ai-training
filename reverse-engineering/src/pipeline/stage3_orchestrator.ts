// ============================================================================
// Stage 3 Orchestrator — Outer Loop with force-pick guarantee
//
// While unreversed blocks exist:
//   1. Run per-block RE loop on all un-RE'd blocks
//   2. If no progress, force-pick highest confidence block
//   3. Persist state after each pass
// ============================================================================

import type { Block, LoadedRegion } from "@c64/shared";
import type {
  EnrichmentMap,
  VariableMapData,
  VariableEntry,
  Stage3Output,
  BlockAnalysis,
  SymbolDBInterface,
  SearchHit,
  REBlockEnrichment,
} from "../types.js";
import type { BlockStore } from "../block_store.js";
import type { MutableGraph } from "../mutable_graph.js";
import { runPerBlockRELoop } from "./stage3_phases.js";

export interface Stage3OrchestratorInput {
  blockStore: BlockStore;
  graph: MutableGraph;
  memory: Uint8Array;
  loadedRegions: LoadedRegion[];
  enrichments: EnrichmentMap;
  variableMap: VariableMapData;
  symbolDb: SymbolDBInterface;
  qdrantSearch?: (query: string) => Promise<SearchHit[]>;
  maxOuterPasses?: number;
  confidenceThreshold?: number;
  maxIterationsPerBlock?: number;
  aiClient?: import("../shared/ai_client.js").AIClient;
  logger?: import("../shared/pipeline_logger.js").PipelineLogger;
}

export async function runStage3(input: Stage3OrchestratorInput): Promise<Stage3Output> {
  const {
    blockStore, graph, variableMap, symbolDb,
    qdrantSearch = async () => [],
    maxOuterPasses = 10,
    confidenceThreshold = 0.6,
    maxIterationsPerBlock = 3,
    aiClient,
  } = input;

  // Build mutable enrichment map
  const mutableEnrichments = new Map<string, REBlockEnrichment[]>();
  for (const [key, val] of input.enrichments) {
    mutableEnrichments.set(key, [...val]);
  }

  const analyses = new Map<string, BlockAnalysis>();
  let outerPass = 0;
  let totalBlockAttempts = 0;
  let blocksReverseEngineered = 0;
  let blocksBailed = 0;
  let forcePicks = 0;
  let aiCalls = 0;

  while (outerPass < maxOuterPasses) {
    outerPass++;
    let progressThisPass = false;

    // Get all un-RE'd code blocks
    const allNodes = [...graph.getNodes().values()];
    const unreversed = allNodes.filter(n =>
      n.type === "code" && !n.pipelineState.reverseEngineered
    );

    if (unreversed.length === 0) break;

    const totalCode = allNodes.filter(n => n.type === "code").length;
    const done = totalCode - unreversed.length;
    console.error(`  Pass ${outerPass}: ${unreversed.length} blocks remaining (${done}/${totalCode} done)`);

    // Process in topological order
    const order = graph.topologicalSort("control_flow");
    const flatOrder = order.flat();

    for (const nodeId of flatOrder) {
      const node = graph.getNode(nodeId);
      if (!node || node.type !== "code" || node.pipelineState.reverseEngineered) continue;

      const block = blockStore.getBlock(node.start);
      if (!block) {
        graph.setPipelineState(nodeId, { reverseEngineered: true, confidence: 0.5 });
        continue;
      }

      totalBlockAttempts++;
      const addr = `$${node.start.toString(16).toUpperCase().padStart(4, "0")}`;
      process.stderr.write(`\r    ${addr} (${block.instructions?.length ?? 0} insts)...  `);

      const result = await runPerBlockRELoop({
        block,
        graph,
        blockStore,
        enrichments: mutableEnrichments as EnrichmentMap,
        variableMap,
        symbolDb,
        analyses,
        qdrantSearch,
        maxIterations: maxIterationsPerBlock,
        confidenceThreshold,
        forceAttempt: false,
        aiClient,
      });

      if (result.reverseEngineered) {
        graph.setPipelineState(nodeId, {
          reverseEngineered: true,
          confidence: result.confidence,
          stage3Iterations: (node.pipelineState.stage3Iterations ?? 0) + 1,
        });
        if (result.analysis) analyses.set(result.analysis.blockId, result.analysis);
        blocksReverseEngineered++;
        progressThisPass = true;
      } else {
        graph.setPipelineState(nodeId, {
          confidence: result.confidence,
          bailReason: result.bailReason,
          bailCount: (node.pipelineState.bailCount ?? 0) + 1,
          stage3Iterations: (node.pipelineState.stage3Iterations ?? 0) + 1,
        });
        blocksBailed++;
      }

      // Merge enrichments
      for (const e of result.enrichments ?? []) {
        const existing = mutableEnrichments.get(e.source) ?? [];
        mutableEnrichments.set(e.source, [...existing, e]);
      }

      // Merge variable entries
      for (const entry of result.variableEntries ?? []) {
        mergeVariableEntry(variableMap, entry);
      }
    }

    // Force-pick if no progress
    if (!progressThisPass) {
      const candidate = pickHighestConfidence(graph);
      if (candidate) {
        const block = blockStore.getBlock(candidate.start);
        if (block) {
          const result = await runPerBlockRELoop({
            block,
            graph,
            blockStore,
            enrichments: mutableEnrichments as EnrichmentMap,
            variableMap,
            symbolDb,
            analyses,
            qdrantSearch,
            maxIterations: 1,
            confidenceThreshold: 0,
            forceAttempt: true,
            aiClient,
          });

          graph.setPipelineState(candidate.id, {
            reverseEngineered: true,
            confidence: result.confidence,
          });
          if (result.analysis) analyses.set(result.analysis.blockId, result.analysis);
          forcePicks++;
          progressThisPass = true;
        }
      }
    }

    if (!progressThisPass) break; // Truly stuck
  }

  // Mark any remaining un-RE'd nodes as complete
  for (const node of graph.getNodes().values()) {
    if (!node.pipelineState.reverseEngineered) {
      graph.setPipelineState(node.id, {
        reverseEngineered: true,
        confidence: node.pipelineState.confidence || (node.type === "data" ? 1.0 : 0.5),
      });
    }
  }

  variableMap.metadata.totalVariables = Object.keys(variableMap.variables).length;

  return {
    blockStore,
    graph,
    variableMap,
    enrichments: mutableEnrichments as EnrichmentMap,
    analyses,
    stats: {
      outerPasses: outerPass,
      totalBlockAttempts,
      blocksReverseEngineered,
      blocksBailed,
      forcePicks,
      aiCalls,
      blocksReclassified: 0,
      newGraphEdges: 0,
    },
  };
}

function pickHighestConfidence(graph: MutableGraph) {
  let best: { id: string; start: number; pipelineState: { confidence: number } } | null = null;
  for (const node of graph.getNodes().values()) {
    if (node.type !== "code" || node.pipelineState.reverseEngineered) continue;
    if (!best || node.pipelineState.confidence > best.pipelineState.confidence) {
      best = node;
    }
  }
  return best;
}

function mergeVariableEntry(map: VariableMapData, entry: VariableEntry): void {
  const hexKey = entry.address.toString(16).toUpperCase().padStart(2, "0");
  const existing = map.variables[hexKey];
  if (!existing) {
    map.variables[hexKey] = entry;
  } else {
    for (const ctx of entry.usageContexts) {
      if (!existing.usageContexts.find(e => e.blockId === ctx.blockId && e.name === ctx.name)) {
        existing.usageContexts.push(ctx);
      }
    }
    for (const blockId of entry.usedBy) {
      if (!existing.usedBy.includes(blockId)) existing.usedBy.push(blockId);
    }
  }
}
