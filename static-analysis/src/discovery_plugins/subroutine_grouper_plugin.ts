import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";
import type { TreeNode } from "../types.js";
import { DependencyTree } from "../dependency_tree.js";

export class SubroutineGrouperPlugin implements DiscoveryPlugin {
  name = "subroutine_grouper";
  description = "Groups code nodes into subroutines using call edges and flow analysis";
  priority = 60;
  phase = "tree" as const;

  onTreeComplete(tree: DependencyTree, ctx: WalkContext): PluginResult | null {
    const updates: Array<{ address: number; updates: Partial<TreeNode> }> = [];

    // Find all subroutine entry points: nodes that are targets of "call" edges
    const subroutineEntries = new Set<number>();
    for (const [, node] of tree.nodes) {
      if (node.type !== "code") continue;
      for (const edge of node.edges) {
        if (edge.type === "call") {
          subroutineEntries.add(edge.target);
        }
      }
    }

    // Also treat nodes with incoming call edges as subroutine entries
    for (const [addr, node] of tree.nodes) {
      if (node.type !== "code") continue;
      const incomingCalls = tree.getEdgesTo(addr).filter((e) => e.type === "call");
      if (incomingCalls.length > 0) {
        subroutineEntries.add(addr);
      }
    }

    // Treat original entry points (snapshot PC, IRQ vectors, etc.) as subroutine entries
    for (const [addr, node] of tree.nodes) {
      if (node.type !== "code") continue;
      if (node.metadata.isEntryPoint) {
        subroutineEntries.add(addr);
      }
    }

    // BFS from each subroutine entry to claim code nodes via branch/fallthrough/jump edges
    const claimed = new Set<number>();

    for (const entryAddr of subroutineEntries) {
      const entry = tree.getNode(entryAddr);
      if (!entry || entry.type !== "code") continue;
      if (claimed.has(entryAddr)) continue;  // already claimed

      const subId = `sub_${entryAddr.toString(16).padStart(4, "0")}`;
      const queue = [entryAddr];
      const visited = new Set<number>();

      while (queue.length > 0) {
        const addr = queue.shift()!;
        if (visited.has(addr)) continue;
        visited.add(addr);

        const node = tree.getNode(addr);
        if (!node || node.type !== "code") continue;
        if (claimed.has(addr)) continue;  // claimed by another sub

        claimed.add(addr);
        updates.push({
          address: addr,
          updates: { subroutineId: subId },
        });

        // Follow branch, fallthrough, and jump edges (NOT call edges)
        // Never cross into another subroutine's entry point — that's a boundary
        for (const edge of node.edges) {
          if (
            edge.type === "branch" ||
            edge.type === "fallthrough" ||
            edge.type === "jump"
          ) {
            if (
              !visited.has(edge.target) &&
              (edge.target === entryAddr || !subroutineEntries.has(edge.target))
            ) {
              queue.push(edge.target);
            }
          }
        }
      }
    }

    // Any unclaimed code nodes get their own subroutine ID (fragments)
    for (const [addr, node] of tree.nodes) {
      if (node.type !== "code") continue;
      if (claimed.has(addr)) continue;

      updates.push({
        address: addr,
        updates: {
          subroutineId: `frag_${addr.toString(16).padStart(4, "0")}`,
        },
      });
    }

    return updates.length > 0 ? { nodeUpdates: updates } : null;
  }
}
