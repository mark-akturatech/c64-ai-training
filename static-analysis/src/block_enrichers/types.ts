import type { Block, BankingState, LoadedRegion } from "../types.js";
import type { DependencyTree } from "../dependency_tree.js";

export interface EnricherContext {
  tree: DependencyTree;
  loadedRegions: LoadedRegion[];
  memory: Uint8Array;
  bankingState: BankingState;
}

export interface BlockEnricher {
  name: string;
  description: string;
  priority: number;
  enrich(blocks: Block[], context: EnricherContext): Block[];
}
