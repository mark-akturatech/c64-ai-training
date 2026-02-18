// ============================================================================
// Code Discoverer — orchestrator for code discovery plugins
// Runs AFTER the initial tree walk, BEFORE data classification.
// Loads all code_discovery/ plugins and runs them on orphan regions.
// Discovered code gets fed back into the tree walker as new entry points
// so that all code edges (dataRefs, hardwareRefs, etc.) are properly traced.
// ============================================================================

import { loadCodeDiscoveryPlugins } from "./code_discovery/index.js";
import type { CodeDiscoveryContext } from "./code_discovery/types.js";
import type { DependencyTree } from "./dependency_tree.js";
import type { BankingState, LoadedRegion, EntryPoint } from "./types.js";

export async function discoverCode(
  memory: Uint8Array,
  tree: DependencyTree,
  bankingState: BankingState,
  byteRole: Uint8Array,
  loadedRegions: LoadedRegion[]
): Promise<EntryPoint[]> {
  const plugins = await loadCodeDiscoveryPlugins();
  const orphanRegions = tree.getOrphanRegions(loadedRegions);
  const newEntryPoints: EntryPoint[] = [];

  const context: CodeDiscoveryContext = {
    tree,
    bankingState,
    byteRole,
  };

  for (const region of orphanRegions) {
    if (region.end - region.start < 6) continue;

    for (const plugin of plugins) {
      const entries = plugin.discover(memory, region, context);
      newEntryPoints.push(...entries);
    }
  }

  return newEntryPoints;
}
