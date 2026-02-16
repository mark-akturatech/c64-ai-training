import type { DataCandidate, TreeEdge, TreeNode, BankingState } from "../types.js";
import type { DependencyTree } from "../dependency_tree.js";

export interface DetectorContext {
  tree: DependencyTree;
  bankingState: BankingState;
  treeNode?: TreeNode;
  codeRefs: TreeEdge[];
  byteRole: Uint8Array;
}

export interface DataDetector {
  name: string;
  description: string;
  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[];
}
