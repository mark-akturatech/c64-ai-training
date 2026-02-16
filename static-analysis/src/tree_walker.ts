// ============================================================================
// Step 3: Queue-based tree walker engine
// ============================================================================

import { decode } from "./opcode_decoder.js";
import { DependencyTree } from "./dependency_tree.js";
import { loadDiscoveryPlugins } from "./discovery_plugins/index.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./discovery_plugins/types.js";
import type {
  MemoryImage,
  BankingState,
  EntryPoint,
  TreeNode,
  TreeEdge,
  DecodedInstruction,
} from "./types.js";

const BYTE_UNKNOWN = 0;
const BYTE_CODE_OPCODE = 1;
const BYTE_CODE_OPERAND = 2;
const BYTE_DATA = 3;

export async function buildDependencyTree(
  image: MemoryImage,
  entryPoints: EntryPoint[],
  bankingState: BankingState
): Promise<{ tree: DependencyTree; byteRole: Uint8Array }> {
  const tree = new DependencyTree();
  const byteRole = new Uint8Array(65536);
  const plugins = await loadDiscoveryPlugins();

  const instructionPlugins = plugins.filter((p) => p.phase === "instruction");
  const nodePlugins = plugins.filter((p) => p.phase === "node");
  const treePlugins = plugins.filter((p) => p.phase === "tree");

  // Initialize queue with entry points
  const queue: number[] = [];
  const queued = new Set<number>();
  const entryPointAddresses = new Set(entryPoints.map((ep) => ep.address));

  for (const ep of entryPoints) {
    enqueue(ep.address);
  }

  function enqueue(addr: number): void {
    if (addr < 0 || addr >= 0x10000) return;
    if (queued.has(addr)) return;
    if (isROMAddress(addr, bankingState)) return;
    // Don't queue addresses outside loaded regions
    if (!isInLoadedRegion(addr, image.loaded)) return;
    queued.add(addr);
    queue.push(addr);
  }

  // Walk one target address: decode instructions, build a tree node, run plugins
  function walkTarget(targetAddr: number): void {
    // Skip if this address is already part of a code node
    if (byteRole[targetAddr] === BYTE_CODE_OPCODE || byteRole[targetAddr] === BYTE_CODE_OPERAND) {
      return;
    }

    // Create a new code node starting at this address
    const isEntryPoint = entryPointAddresses.has(targetAddr);
    const node: TreeNode = {
      id: `code_${targetAddr.toString(16).padStart(4, "0")}`,
      type: "code",
      start: targetAddr,
      end: targetAddr,  // will be extended
      endConfidence: 0,
      discoveredBy: "tree_walker",
      refinedBy: [],
      instructions: [],
      edges: [],
      metadata: isEntryPoint ? { isEntryPoint: true } : {},
    };

    const context: WalkContext = {
      memory: image.bytes,
      tree,
      bankingState,
      currentNode: node,
      byteRole,
    };

    // Walk instructions from the start
    let addr = targetAddr;
    let nodeEnded = false;

    while (!nodeEnded && addr < 0x10000) {
      // Check for conflicts
      if (addr !== targetAddr && byteRole[addr] !== BYTE_UNKNOWN) {
        // We've hit bytes already claimed — end the node here
        node.end = addr;
        node.endConfidence = 100;
        break;
      }

      const inst = decode(image.bytes, addr);
      if (!inst) {
        node.end = addr;
        node.endConfidence = 50;
        break;
      }

      // Check if instruction bytes would overlap with existing code
      let overlap = false;
      for (let i = 0; i < inst.info.bytes; i++) {
        if (byteRole[addr + i] !== BYTE_UNKNOWN) {
          overlap = true;
          break;
        }
      }
      if (overlap) {
        node.end = addr;
        node.endConfidence = 100;
        break;
      }

      // Mark bytes
      byteRole[addr] = BYTE_CODE_OPCODE;
      for (let i = 1; i < inst.info.bytes; i++) {
        byteRole[addr + i] = BYTE_CODE_OPERAND;
      }

      node.instructions!.push(inst);
      node.end = addr + inst.info.bytes;

      // Run instruction-phase plugins (priority order)
      for (const plugin of instructionPlugins) {
        if (!plugin.onInstruction) continue;
        const result = plugin.onInstruction(inst, context);
        if (result) {
          applyResult(result, node, tree, enqueue, plugin.name);
          if (result.endNode) {
            nodeEnded = true;
            break;
          }
        }
      }

      if (!nodeEnded) {
        // Check if instruction naturally ends the node
        if (
          inst.info.flowType === "jump" ||
          inst.info.flowType === "return" ||
          inst.info.flowType === "halt"
        ) {
          nodeEnded = true;
        } else {
          addr += inst.info.bytes;
        }
      }
    }

    // Set end if not already set
    if (node.end <= node.start) {
      node.end = node.start + 1;
      node.endConfidence = 10;
    }

    // Add node to tree
    tree.addNode(node);

    // Run node-phase plugins
    for (const plugin of nodePlugins) {
      if (!plugin.onNodeComplete) continue;
      const result = plugin.onNodeComplete(node, context);
      if (result) {
        applyResult(result, node, tree, enqueue, plugin.name);
      }
    }
  }

  // Process queue
  while (queue.length > 0) {
    walkTarget(queue.shift()!);
  }

  // Run tree-phase plugins (after queue drains)
  const treeContext: WalkContext = {
    memory: image.bytes,
    tree,
    bankingState,
    currentNode: null!,  // not applicable for tree phase
    byteRole,
  };

  for (const plugin of treePlugins) {
    if (!plugin.onTreeComplete) continue;
    const result = plugin.onTreeComplete(tree, treeContext);
    if (result) {
      // Tree plugins can add new targets — re-process queue
      if (result.newTargets) {
        for (const target of result.newTargets) {
          enqueue(target);
        }
      }
      if (result.newNodes) {
        for (const partial of result.newNodes) {
          const newNode = createNodeFromPartial(partial);
          tree.addNode(newNode);
          markNodeBytes(newNode, byteRole);
        }
      }
      if (result.newEdges) {
        for (const { from, edge } of result.newEdges) {
          tree.addEdge(from, edge as TreeEdge);
        }
      }
      if (result.nodeUpdates) {
        for (const { address, updates } of result.nodeUpdates) {
          const existing = tree.getNode(address);
          if (existing) {
            Object.assign(existing, updates);
            if (updates.refinedBy) {
              // Merge arrays, don't replace
            }
          }
        }
      }
    }
  }

  // Re-process any new queue entries from tree plugins
  while (queue.length > 0) {
    walkTarget(queue.shift()!);
  }

  return { tree, byteRole };
}

function applyResult(
  result: PluginResult,
  currentNode: TreeNode,
  tree: DependencyTree,
  enqueue: (addr: number) => void,
  pluginName: string
): void {
  if (result.newTargets) {
    for (const target of result.newTargets) {
      enqueue(target);
    }
  }

  if (result.newNodes) {
    for (const partial of result.newNodes) {
      const node = createNodeFromPartial(partial, pluginName);
      if (!tree.hasNode(node.start)) {
        tree.addNode(node);
      }
    }
  }

  if (result.newEdges) {
    for (const { from, edge } of result.newEdges) {
      const fullEdge: TreeEdge = {
        target: edge.target!,
        type: edge.type!,
        sourceInstruction: edge.sourceInstruction ?? currentNode.start,
        confidence: edge.confidence ?? 100,
        discoveredBy: edge.discoveredBy ?? pluginName,
        metadata: edge.metadata,
      };
      // The current node may not be in the tree yet (added after walk loop),
      // so add the edge directly to the node object when it's the source.
      if (from === currentNode.start) {
        currentNode.edges.push(fullEdge);
      }
      tree.addEdge(from, fullEdge);
    }
  }

  if (result.nodeUpdates) {
    for (const { address, updates } of result.nodeUpdates) {
      const node = tree.getNode(address);
      if (node) {
        Object.assign(node, updates);
        if (!node.refinedBy.includes(pluginName)) {
          node.refinedBy.push(pluginName);
        }
      }
    }
  }
}

function createNodeFromPartial(partial: Partial<TreeNode>, pluginName?: string): TreeNode {
  return {
    id: partial.id || `node_${(partial.start || 0).toString(16).padStart(4, "0")}`,
    type: partial.type || "data",
    start: partial.start || 0,
    end: partial.end || (partial.start || 0) + 1,
    endConfidence: partial.endConfidence || 50,
    discoveredBy: partial.discoveredBy || pluginName || "unknown",
    refinedBy: partial.refinedBy || [],
    instructions: partial.instructions,
    edges: partial.edges || [],
    metadata: partial.metadata || {},
    subroutineId: partial.subroutineId,
  };
}

function markNodeBytes(node: TreeNode, byteRole: Uint8Array): void {
  const role = node.type === "code" ? BYTE_CODE_OPCODE : BYTE_DATA;
  for (let addr = node.start; addr < node.end; addr++) {
    if (byteRole[addr] === BYTE_UNKNOWN) {
      byteRole[addr] = role;
    }
  }
}

function isROMAddress(addr: number, banking: BankingState): boolean {
  if (addr >= 0xE000 && banking.kernalRomVisible) return true;
  if (addr >= 0xA000 && addr < 0xC000 && banking.basicRomVisible) return true;
  return false;
}

function isInLoadedRegion(addr: number, regions: Array<{ start: number; end: number }>): boolean {
  return regions.some((r) => addr >= r.start && addr < r.end);
}
