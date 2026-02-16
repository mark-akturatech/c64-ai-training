import type { DecodedInstruction, TreeNode, TreeEdge, BankingState } from "../types.js";
import type { DependencyTree } from "../dependency_tree.js";

export type PluginPhase = "instruction" | "node" | "tree";

export interface WalkContext {
  memory: Uint8Array;
  tree: DependencyTree;
  bankingState: BankingState;
  currentNode: TreeNode;
  byteRole: Uint8Array;         // 0=unknown, 1=code_opcode, 2=code_operand, 3=data
}

export interface PluginResult {
  newTargets?: number[];
  newNodes?: Partial<TreeNode>[];
  nodeUpdates?: Array<{ address: number; updates: Partial<TreeNode> }>;
  newEdges?: Array<{ from: number; edge: Partial<TreeEdge> }>;
  endNode?: boolean;            // signal that the current node should end here
}

export interface DiscoveryPlugin {
  name: string;
  description: string;
  priority: number;
  phase: PluginPhase;

  onInstruction?(instruction: DecodedInstruction, context: WalkContext): PluginResult | null;
  onNodeComplete?(node: TreeNode, context: WalkContext): PluginResult | null;
  onTreeComplete?(tree: DependencyTree, context: WalkContext): PluginResult | null;
}
