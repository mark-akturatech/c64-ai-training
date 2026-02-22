// ============================================================================
// Response Processor Registry — static imports for all processors
// ============================================================================

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

import { DataDiscoveryProcessor } from "./data_discovery_processor.js";
import { ReclassificationProcessor } from "./reclassification_processor.js";
import { ResearchRequestProcessor } from "./research_request_processor.js";
import { ContextRequestProcessor } from "./context_request_processor.js";
import { EmbeddingProcessor } from "./embedding_processor.js";
import { CertaintyProcessor } from "./certainty_processor.js";
import { VariableMergeProcessor } from "./variable_merge_processor.js";
import { ConflictProcessor } from "./conflict_processor.js";
import { ReviewFlagProcessor } from "./review_flag_processor.js";
import { BailReasonProcessor } from "./bail_reason_processor.js";

export function createAllProcessors(): ResponseProcessor[] {
  const processors: ResponseProcessor[] = [
    new DataDiscoveryProcessor(),
    new ReclassificationProcessor(),
    new ResearchRequestProcessor(),
    new ContextRequestProcessor(),
    new EmbeddingProcessor(),
    new CertaintyProcessor(),
    new VariableMergeProcessor(),
    new ConflictProcessor(),
    new ReviewFlagProcessor(),
    new BailReasonProcessor(),
  ];
  processors.sort((a, b) => a.priority - b.priority);
  return processors;
}

/**
 * Run all applicable processors on an AI response and merge results.
 */
export async function processAIResponse(
  processors: ResponseProcessor[],
  input: ProcessorInput,
): Promise<ProcessorResult> {
  const merged: ProcessorResult = {
    mutations: [],
    graphEdges: [],
    graphNodes: [],
    embeddings: [],
    reviewFlags: [],
    discoveries: [],
    variableEntries: [],
  };

  for (const processor of processors) {
    if (!processor.appliesTo.includes(input.stage)) continue;
    const result = await processor.process(input);
    if (result.mutations) merged.mutations!.push(...result.mutations);
    if (result.graphEdges) merged.graphEdges!.push(...result.graphEdges);
    if (result.graphNodes) merged.graphNodes!.push(...result.graphNodes);
    if (result.embeddings) merged.embeddings!.push(...result.embeddings);
    if (result.reviewFlags) merged.reviewFlags!.push(...result.reviewFlags);
    if (result.discoveries) merged.discoveries!.push(...result.discoveries);
    if (result.variableEntries) merged.variableEntries!.push(...result.variableEntries);
  }

  return merged;
}
