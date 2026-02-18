import type { BankingState, EntryPoint } from "../types.js";
import type { DependencyTree } from "../dependency_tree.js";

export interface CodeDiscoveryContext {
  tree: DependencyTree;
  bankingState: BankingState;
  byteRole: Uint8Array;
}

export interface CodeDiscoveryPlugin {
  name: string;
  description: string;
  discover(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: CodeDiscoveryContext
  ): EntryPoint[];
}
