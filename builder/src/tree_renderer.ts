// ============================================================================
// Tree Renderer — renders dependency_tree.md from tree JSON + blocks
//
// Produces a human-readable markdown document showing:
// - Summary stats
// - Call chains from entry points (indented)
// - IRQ handler chains
// - Data block table
// - Dead/unreachable node table
// ============================================================================

import type { Block } from "@c64/shared";

export interface TreeRendererInput {
  tree: Record<string, unknown>;
  blocks: readonly Block[];
  integration?: Record<string, unknown>;
  labelMap: ReadonlyMap<number, string>;
}

interface TreeNodeInfo {
  id: string;
  type: string;
  start: number;
  end: number;
  blockId?: string;
  discoveredBy: string;
  endConfidence: number;
  subroutineId?: string;
  isEntryPoint?: boolean;
  isIrqHandler?: boolean;
}

interface TreeEdgeInfo {
  source: string;
  sourceInstruction: number;
  target: number;
  targetNodeId?: string;
  type: string;
  category: string;
  confidence: number;
  discoveredBy: string;
}

function hex(n: number): string {
  return "$" + n.toString(16).toUpperCase().padStart(4, "0");
}

function parseHex(s: string | number): number {
  if (typeof s === "number") return s;
  return parseInt(s.replace("0x", ""), 16);
}

export function renderDependencyTree(input: TreeRendererInput): string {
  const { tree, blocks, labelMap } = input;
  const metadata = tree.metadata as Record<string, unknown>;
  const nodesRaw = (tree.nodes ?? {}) as Record<string, Record<string, unknown>>;
  const edgesRaw = (tree.edges ?? []) as Array<Record<string, unknown>>;
  const entryPointIds = (tree.entryPoints ?? []) as string[];
  const irqHandlerIds = (tree.irqHandlers ?? []) as string[];

  // Parse nodes
  const nodes = new Map<string, TreeNodeInfo>();
  for (const [id, raw] of Object.entries(nodesRaw)) {
    nodes.set(id, {
      id,
      type: raw.type as string,
      start: parseHex(raw.start as string),
      end: parseHex(raw.end as string),
      blockId: raw.blockId as string | undefined,
      discoveredBy: raw.discoveredBy as string,
      endConfidence: raw.endConfidence as number,
      subroutineId: raw.subroutineId as string | undefined,
      isEntryPoint: raw.isEntryPoint as boolean | undefined,
      isIrqHandler: raw.isIrqHandler as boolean | undefined,
    });
  }

  // Parse edges
  const edges: TreeEdgeInfo[] = edgesRaw.map(raw => ({
    source: raw.source as string,
    sourceInstruction: parseHex(raw.sourceInstruction as string),
    target: parseHex(raw.target as string),
    targetNodeId: raw.targetNodeId as string | undefined,
    type: raw.type as string,
    category: raw.category as string,
    confidence: raw.confidence as number,
    discoveredBy: raw.discoveredBy as string,
  }));

  // Build adjacency: source → edges
  const outEdges = new Map<string, TreeEdgeInfo[]>();
  for (const edge of edges) {
    let list = outEdges.get(edge.source);
    if (!list) {
      list = [];
      outEdges.set(edge.source, list);
    }
    list.push(edge);
  }

  // Build block lookup: blockId → Block
  const blockMap = new Map<string, Block>();
  for (const block of blocks) {
    blockMap.set(block.id, block);
  }

  // Resolve label for an address
  const resolveLabel = (addr: number): string => {
    return labelMap.get(addr) ?? `addr_${addr.toString(16).toUpperCase().padStart(4, "0")}`;
  };

  // Determine reachable nodes via control-flow BFS
  const reachableNodes = new Set<string>();
  const bfsQueue = [...entryPointIds, ...irqHandlerIds];
  while (bfsQueue.length > 0) {
    const nodeId = bfsQueue.pop()!;
    if (reachableNodes.has(nodeId)) continue;
    reachableNodes.add(nodeId);
    for (const edge of outEdges.get(nodeId) ?? []) {
      if (edge.category === "control_flow" && edge.targetNodeId && !reachableNodes.has(edge.targetNodeId)) {
        bfsQueue.push(edge.targetNodeId);
      }
    }
  }

  const lines: string[] = [];

  // ── Summary ────────────────────────────────────────────────────
  lines.push(`# Dependency Tree — ${metadata.source ?? "unknown"}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");

  const totalNodes = nodes.size;
  const codeNodes = [...nodes.values()].filter(n => n.type === "code").length;
  const dataNodes = [...nodes.values()].filter(n => n.type === "data").length;
  const reachableCount = reachableNodes.size;
  const deadCount = totalNodes - reachableCount;

  lines.push(`- **Entry points:** ${entryPointIds.length}`);
  if (irqHandlerIds.length > 0) {
    lines.push(`- **IRQ handlers:** ${irqHandlerIds.length}`);
  }
  lines.push(`- **Total nodes:** ${totalNodes} (${codeNodes} code, ${dataNodes} data)`);
  lines.push(`- **Total edges:** ${edges.length} (${metadata.edgeCategoryCounts ? JSON.stringify(metadata.edgeCategoryCounts) : ""})`);
  lines.push(`- **Reachable:** ${reachableCount} (${totalNodes > 0 ? Math.round(reachableCount / totalNodes * 100) : 0}%)`);
  if (deadCount > 0) {
    lines.push(`- **Unreachable:** ${deadCount} (${Math.round(deadCount / totalNodes * 100)}%)`);
  }
  lines.push("");

  // ── Call Chains ────────────────────────────────────────────────
  for (const epId of entryPointIds) {
    const epNode = nodes.get(epId);
    if (!epNode) continue;

    const label = resolveLabel(epNode.start);
    const block = epNode.blockId ? blockMap.get(epNode.blockId) : undefined;
    const purpose = block?.enrichment?.purpose ?? "";

    lines.push(`## Call Chain (from ${label} ${hex(epNode.start)})`);
    lines.push("");

    // Depth-first walk of call chain
    const visited = new Set<string>();
    renderCallChain(epId, 0, visited, nodes, outEdges, blockMap, labelMap, lines);
    lines.push("");
  }

  // ── IRQ Handler Chains ─────────────────────────────────────────
  if (irqHandlerIds.length > 0) {
    lines.push("## IRQ Handler Chains");
    lines.push("");

    for (const irqId of irqHandlerIds) {
      const irqNode = nodes.get(irqId);
      if (!irqNode) continue;

      const label = resolveLabel(irqNode.start);
      lines.push(`- **${label}** (${hex(irqNode.start)})`);

      // Show data/hardware edges
      for (const edge of outEdges.get(irqId) ?? []) {
        if (edge.category === "data") {
          const desc = describeDataEdge(edge, labelMap);
          lines.push(`  ${desc}`);
        }
      }
    }
    lines.push("");
  }

  // ── Data Blocks Table ──────────────────────────────────────────
  const dataBlocks = blocks.filter(b => b.type === "data");
  if (dataBlocks.length > 0) {
    lines.push("## Data Blocks");
    lines.push("");
    lines.push("| Address | Label | Type | Size | Purpose | Reachable |");
    lines.push("|---------|-------|------|------|---------|-----------|");

    for (const block of dataBlocks) {
      const label = resolveLabel(block.address);
      const dataType = block.candidates?.[block.bestCandidate ?? 0]?.type ?? "unknown";
      const size = block.endAddress - block.address;
      const purpose = block.enrichment?.purpose ?? "";
      const reachable = block.reachability ?? "unproven";
      lines.push(`| ${hex(block.address)} | ${label} | ${dataType} | ${size} | ${purpose} | ${reachable} |`);
    }
    lines.push("");
  }

  // ── Dead/Unreachable Nodes ─────────────────────────────────────
  const deadNodes = [...nodes.values()].filter(n => !reachableNodes.has(n.id));
  if (deadNodes.length > 0) {
    deadNodes.sort((a, b) => a.start - b.start);

    lines.push("## Dead/Unreachable Nodes");
    lines.push("");
    lines.push("| Address | Node ID | Type | Size |");
    lines.push("|---------|---------|------|------|");

    for (const node of deadNodes) {
      const size = node.end - node.start;
      lines.push(`| ${hex(node.start)} | ${node.id} | ${node.type} | ${size} |`);
    }
    lines.push("");
  }

  return lines.join("\n") + "\n";
}

/**
 * Render a call chain starting from a node, depth-first.
 * Shows call edges as indented children, data edges as → lines.
 */
function renderCallChain(
  nodeId: string,
  depth: number,
  visited: Set<string>,
  nodes: Map<string, TreeNodeInfo>,
  outEdges: Map<string, TreeEdgeInfo[]>,
  blockMap: Map<string, Block>,
  labelMap: ReadonlyMap<number, string>,
  lines: string[]
): void {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);

  const node = nodes.get(nodeId);
  if (!node) return;

  const indent = "  ".repeat(depth);
  const label = labelMap.get(node.start) ?? node.id;
  const block = node.blockId ? blockMap.get(node.blockId) : undefined;
  const reachability = block?.reachability ?? "unproven";
  const purpose = block?.enrichment?.purpose ?? "";

  // Node line
  const purposeSuffix = purpose ? ` — ${purpose}` : "";
  lines.push(`${indent}- **${label}** (${hex(node.start)}) [${reachability}]${purposeSuffix}`);

  // Data/hardware edges as sub-lines
  const nodeEdges = outEdges.get(nodeId) ?? [];
  for (const edge of nodeEdges) {
    if (edge.category === "data") {
      const desc = describeDataEdge(edge, labelMap);
      lines.push(`${indent}  ${desc}`);
    }
  }

  // Recurse into call targets (control-flow edges of type "call")
  for (const edge of nodeEdges) {
    if (edge.type === "call" && edge.targetNodeId) {
      renderCallChain(edge.targetNodeId, depth + 1, visited, nodes, outEdges, blockMap, labelMap, lines);
    }
  }
}

/**
 * Describe a data edge as a human-readable string.
 */
function describeDataEdge(edge: TreeEdgeInfo, labelMap: ReadonlyMap<number, string>): string {
  const targetLabel = labelMap.get(edge.target);
  const targetHex = hex(edge.target);

  const verb = edge.type === "data_read" ? "reads"
    : edge.type === "data_write" ? "writes"
    : edge.type === "hardware_read" ? "reads"
    : edge.type === "hardware_write" ? "writes"
    : edge.type === "pointer_ref" ? "refs"
    : edge.type;

  const isHardware = edge.type === "hardware_read" || edge.type === "hardware_write";
  const target = targetLabel ? `${targetLabel} (${targetHex})` : targetHex;

  return `→ ${verb} ${target}`;
}
