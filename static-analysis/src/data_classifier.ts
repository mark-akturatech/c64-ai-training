// ============================================================================
// Step 4: Data Classifier — runs detector plugins on tree data nodes
// ============================================================================

import { loadDetectors } from "./data_detectors/index.js";
import type { DetectorContext } from "./data_detectors/types.js";
import type { DependencyTree } from "./dependency_tree.js";
import type { DataCandidate, BankingState, LoadedRegion } from "./types.js";

export async function classifyDataRegions(
  memory: Uint8Array,
  tree: DependencyTree,
  bankingState: BankingState,
  byteRole: Uint8Array,
  loadedRegions: LoadedRegion[]
): Promise<DataCandidate[]> {
  const detectors = await loadDetectors();
  const allCandidates: DataCandidate[] = [];

  // Primary: classify tree data nodes
  for (const [, node] of tree.nodes) {
    if (node.type !== "data") continue;
    const region = { start: node.start, end: node.end };
    const codeRefs = tree.getEdgesTo(node.start);
    const context: DetectorContext = {
      tree,
      bankingState,
      treeNode: node,
      codeRefs,
      byteRole,
    };
    for (const detector of detectors) {
      const candidates = detector.detect(memory, region, context);
      allCandidates.push(...candidates);
    }
  }

  // Secondary: classify orphan regions (not in tree)
  const orphanRegions = tree.getOrphanRegions(loadedRegions);
  for (const region of orphanRegions) {
    // Skip tiny orphan regions (< 4 bytes)
    if (region.end - region.start < 4) continue;

    const context: DetectorContext = {
      tree,
      bankingState,
      codeRefs: [],
      byteRole,
    };
    for (const detector of detectors) {
      const candidates = detector.detect(memory, region, context);
      // Lower confidence for orphan regions
      for (const candidate of candidates) {
        candidate.confidence = Math.max(10, candidate.confidence - 20);
      }
      allCandidates.push(...candidates);
    }
  }

  // Filter out any candidates that overlap proven code.
  // Exception: BASIC programs at $0801 — the line-link chain is strong
  // evidence that overrides code discovery (BASIC data can look like valid
  // 6502 instructions).
  const filtered = allCandidates.filter((c) => {
    if (c.start === 0x0801 && c.type === "basic_program") return true;
    for (let addr = c.start; addr < c.end; addr++) {
      if (byteRole[addr] === 1 || byteRole[addr] === 2) return false;  // code
    }
    return true;
  });

  // Sort by confidence (highest first)
  filtered.sort((a, b) => b.confidence - a.confidence);

  return filtered;
}
