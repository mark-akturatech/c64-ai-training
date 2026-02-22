// ============================================================================
// Integration Analyzer Registry — auto-discovery + orchestration
// ============================================================================

import type {
  IntegrationAnalyzer,
  IntegrationAnalyzerInput,
  IntegrationContribution,
} from "./types.js";
import { loadPlugins } from "../../plugin_loader.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadIntegrationAnalyzers(): Promise<IntegrationAnalyzer[]> {
  return loadPlugins<IntegrationAnalyzer>(__dirname, "_analyzer.ts", "analyze");
}

export function runIntegrationAnalyzers(
  analyzers: IntegrationAnalyzer[],
  input: IntegrationAnalyzerInput,
): IntegrationContribution[] {
  const sorted = [...analyzers].sort((a, b) => a.priority - b.priority);
  const contributions: IntegrationContribution[] = [];

  for (const analyzer of sorted) {
    contributions.push(analyzer.analyze(input));
  }

  return contributions;
}
