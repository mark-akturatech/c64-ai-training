// ============================================================================
// Stage 1 Enrichment Runner — multi-pass fixpoint loop
//
// Runs all enrichment plugins in priority order. If any plugin causes a
// block reclassification (which bumps the BlockStore version), re-runs
// all plugins to let them discover new information.
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  REBlockEnrichment,
  EnrichmentMap,
  DependencyGraphEdge,
  DependencyGraphNode,
} from "../types.js";
import type { BlockStore } from "../block_store.js";
import type { MutableGraph } from "../mutable_graph.js";
import type { PipelineLogger } from "../shared/pipeline_logger.js";
import { loadPlugins } from "../plugin_loader.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MAX_PASSES = 10;

export interface Stage1RunnerInput {
  blockStore: BlockStore;
  graph: MutableGraph;
  memory: Uint8Array;
  loadedRegions: Array<{ start: number; end: number; source: string }>;
  /** Optional pre-loaded plugins (for testing). If not provided, auto-discovers. */
  plugins?: EnrichmentPlugin[];
  /** Optional logger for per-plugin progress */
  logger?: PipelineLogger;
}

export interface Stage1RunnerOutput {
  enrichments: EnrichmentMap;
  stats: {
    totalEnrichments: number;
    reclassifications: number;
    merges: number;
    splits: number;
    passes: number;
    newGraphEdges: number;
    bankingNodesAnnotated: number;
  };
}

export async function runStage1Enrichment(input: Stage1RunnerInput): Promise<Stage1RunnerOutput> {
  const { blockStore, graph, memory, loadedRegions, logger } = input;

  // Load plugins via auto-discovery or use provided ones
  const plugins = input.plugins ?? await loadPlugins<EnrichmentPlugin>(
    __dirname,
    "_enrichment.ts",
    "enrich",
  );

  const enrichmentsByPlugin = new Map<string, REBlockEnrichment[]>();
  let totalReclassifications = 0;
  let totalNewEdges = 0;
  let totalMerges = 0;
  let totalSplits = 0;
  let pass = 0;

  do {
    pass++;
    const lastVersion = blockStore.getVersion();

    let passEnrichments = 0;
    let passReclassifications = 0;
    let passMerges = 0;
    let passSplits = 0;
    let passEdges = 0;

    for (const plugin of plugins) {
      logger?.plugin(plugin.name);
      const enrichInput: EnrichmentInput = {
        blocks: blockStore.getSnapshot(),
        graph,
        memory,
        loadedRegions,
        priorEnrichments: enrichmentsByPlugin as EnrichmentMap,
      };

      const result = plugin.enrich(enrichInput);

      // Store enrichments
      if (result.enrichments.length > 0) {
        const existing = enrichmentsByPlugin.get(plugin.name) ?? [];
        enrichmentsByPlugin.set(plugin.name, [...existing, ...result.enrichments]);
      }

      // Apply new graph edges
      for (const edge of result.newGraphEdges ?? []) {
        graph.addEdge(edge);
        totalNewEdges++;
      }

      // Apply new graph nodes
      for (const node of result.newGraphNodes ?? []) {
        graph.addNode(node);
      }

      // Apply block reclassifications
      for (const r of result.reclassifications ?? []) {
        blockStore.reclassify(r.blockAddress, r.newType, r.reason);
        totalReclassifications++;
      }

      // Apply block merges
      for (const m of result.merges ?? []) {
        try {
          // Derive graph node IDs for the blocks being merged
          const b1 = blockStore.getBlock(m.addr1);
          const b2 = blockStore.getBlock(m.addr2);
          blockStore.merge(m.addr1, m.addr2, m.reason);
          totalMerges++;
          // Update graph if both blocks have nodes
          if (b1 && b2) {
            const nodeId1 = blockToNodeId(b1);
            const nodeId2 = blockToNodeId(b2);
            const mergedBlock = blockStore.findBlockContaining(Math.min(m.addr1, m.addr2));
            if (mergedBlock && graph.getNode(nodeId1) && graph.getNode(nodeId2)) {
              graph.mergeNodes(nodeId1, nodeId2, blockToNodeId(mergedBlock));
            }
          }
        } catch {
          // Merge may fail if blocks already merged or not adjacent — skip
        }
      }

      // Apply block splits
      let pluginSplits = 0;
      for (const s of result.splits ?? []) {
        try {
          const block = blockStore.getBlock(s.blockAddress);
          blockStore.split(s.blockAddress, s.splitAt, s.reason);
          totalSplits++;
          pluginSplits++;
          // Update graph if block has a node
          if (block) {
            const nodeId = blockToNodeId(block);
            if (graph.getNode(nodeId)) {
              const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
              const newId1 = `${type}_${block.address.toString(16).padStart(4, "0")}`;
              const newId2 = `${type}_${s.splitAt.toString(16).padStart(4, "0")}`;
              graph.splitNode(nodeId, s.splitAt, [newId1, newId2]);
            }
          }
        } catch {
          // Split may fail if address out of range — skip
        }
      }

      // Log plugin result
      const pluginEnrichments = result.enrichments.length;
      const pluginReclassifications = (result.reclassifications ?? []).length;
      const pluginMerges = (result.merges ?? []).length;
      const pluginEdges = (result.newGraphEdges ?? []).length;
      passEnrichments += pluginEnrichments;
      passReclassifications += pluginReclassifications;
      passMerges += pluginMerges;
      passSplits += pluginSplits;
      passEdges += pluginEdges;
      logger?.pluginResult(plugin.name, {
        enrichments: pluginEnrichments,
        reclassifications: pluginReclassifications,
        merges: pluginMerges,
        splits: pluginSplits,
        edges: pluginEdges,
      });
    }

    logger?.pass(pass, {
      enrichments: passEnrichments,
      reclassifications: passReclassifications,
      merges: passMerges,
      splits: passSplits,
      edges: passEdges,
    });

    // If nothing changed, we've converged
    if (!blockStore.hasChangedSince(lastVersion)) break;

  } while (pass < MAX_PASSES);

  // Mark all nodes as Stage 1 complete
  for (const node of graph.getNodes().values()) {
    graph.setPipelineState(node.id, { staticEnrichmentComplete: true });
  }

  // Count banking-annotated nodes
  let bankingNodesAnnotated = 0;
  for (const node of graph.getNodes().values()) {
    if (node.bankingState) bankingNodesAnnotated++;
  }

  // Count total enrichments
  let totalEnrichments = 0;
  for (const enrichments of enrichmentsByPlugin.values()) {
    totalEnrichments += enrichments.length;
  }

  return {
    enrichments: enrichmentsByPlugin,
    stats: {
      totalEnrichments,
      reclassifications: totalReclassifications,
      merges: totalMerges,
      splits: totalSplits,
      passes: pass,
      newGraphEdges: totalNewEdges,
      bankingNodesAnnotated,
    },
  };
}

function blockToNodeId(block: Block): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}
