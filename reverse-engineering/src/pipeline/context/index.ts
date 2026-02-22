// ============================================================================
// Context Provider Registry — auto-discovers *_context.ts files
// ============================================================================

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

// Static imports for all context providers (auto-discovery equivalent)
import { BankingStateContext } from "./banking_state_context.js";
import { CallGraphContext } from "./call_graph_context.js";
import { EnrichmentContext } from "./enrichment_context.js";
import { QdrantKnowledgeContext } from "./qdrant_knowledge_context.js";
import { PatternMatchContext } from "./pattern_match_context.js";
import { SiblingContext } from "./sibling_context.js";
import { PriorAnalysisContext } from "./prior_analysis_context.js";
import { VariableContext } from "./variable_context.js";
import { HardwareContext } from "./hardware_context.js";
import { DataUsageContext } from "./data_usage_context.js";
import { CrossReferenceContext } from "./cross_reference_context.js";
import { ReStatusContext } from "./re_status_context.js";

export function createAllContextProviders(): ContextProvider[] {
  const providers: ContextProvider[] = [
    new BankingStateContext(),
    new CallGraphContext(),
    new EnrichmentContext(),
    new QdrantKnowledgeContext(),
    new PatternMatchContext(),
    new SiblingContext(),
    new PriorAnalysisContext(),
    new VariableContext(),
    new HardwareContext(),
    new DataUsageContext(),
    new CrossReferenceContext(),
    new ReStatusContext(),
  ];
  providers.sort((a, b) => a.priority - b.priority);
  return providers;
}

/**
 * Collect context contributions from all applicable providers.
 */
export function collectContext(
  providers: ContextProvider[],
  input: ContextProviderInput,
): ContextContribution[] {
  const contributions: ContextContribution[] = [];

  for (const provider of providers) {
    if (!provider.appliesTo.includes(input.stage)) continue;
    const contrib = provider.provide(input);
    if (contrib) {
      contributions.push(contrib);
    }
  }

  return contributions;
}
