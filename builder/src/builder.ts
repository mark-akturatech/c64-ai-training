// ============================================================================
// Builder — core orchestrator: load blocks → run emitters → assemble output
// ============================================================================

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AnalysisOutput, Block } from "@c64/shared";
import { decodeRaw } from "./raw_data.js";
import { buildLabelMap } from "./label_resolver.js";
import { formatHex } from "./address_formatter.js";
import * as ka from "./kickass.js";
import { loadEmitters } from "./emitters/index.js";
import type { BinaryAsset, BuilderContext, EmittedBlock } from "./emitters/types.js";
import { renderDependencyTree } from "./tree_renderer.js";

export interface BuilderOptions {
  outputDir: string;
  memory?: Uint8Array;
  loadAddress: number;
  endAddress: number;
  includeJunk: boolean;
  treeJson?: Record<string, unknown>;
  integrationJson?: Record<string, unknown>;
  noTreeDoc?: boolean;
  includeDead?: boolean;
}

export interface BuildResult {
  files: Array<{ path: string; content: string }>;
  assets: BinaryAsset[];
  stats: {
    totalBlocks: number;
    emittedBlocks: number;
    skippedJunk: number;
    unmatchedBlocks: number;
  };
}

export async function build(
  analysis: AnalysisOutput,
  options: BuilderOptions
): Promise<BuildResult> {
  const { blocks } = analysis;

  // Filter junk, sort by address, and remove overlapping blocks
  const activeBlocks = options.includeJunk
    ? blocks
    : blocks.filter((b) => !b.junk);
  const sorted = [...activeBlocks].sort((a, b) => a.address - b.address);
  const nonOverlapping = removeOverlaps(sorted);

  // Build label map
  const labelMap = buildLabelMap(nonOverlapping);

  // Build context
  const context: BuilderContext = {
    allBlocks: nonOverlapping,
    labelMap,
    metadata: analysis.metadata,
    memory: options.memory,
    loadAddress: options.loadAddress,
    endAddress: options.endAddress,
    includeJunk: options.includeJunk,
    resolveLabel: (addr: number) => labelMap.get(addr) ?? null,
    getBytes: (start: number, length: number) => {
      if (options.memory) {
        return options.memory.slice(start, start + length);
      }
      // Fall back to reading from block raw data
      return getBytesFromBlocks(nonOverlapping, start, length);
    },
    formatHex: (value: number, width?: number) => formatHex(value, width),
  };

  // Load emitters
  const emitters = await loadEmitters();

  // Dispatch blocks to emitters
  const emittedBlocks: Array<{ block: Block; emitted: EmittedBlock }> = [];
  let unmatchedCount = 0;
  let consumedEnd = -1;

  for (const block of nonOverlapping) {
    // Skip blocks already consumed by a previous emitter (e.g. BasicUpstart2 padding)
    if (block.address < consumedEnd) continue;

    const emitter = emitters.find((e) => e.handles(block, context));
    if (emitter) {
      const emitted = emitter.emit(block, context);
      emittedBlocks.push({ block, emitted });
      if (emitted.consumedEndAddress) consumedEnd = emitted.consumedEndAddress;
    } else {
      unmatchedCount++;
      console.error(`  WARNING: No emitter matched block ${block.id} (${block.type})`);
    }
  }

  // Collect all assets
  const allAssets: BinaryAsset[] = [];
  for (const { emitted } of emittedBlocks) {
    if (emitted.assets) allAssets.push(...emitted.assets);
  }

  // Assemble main.asm
  const mainLines = assembleMainFile(analysis, emittedBlocks, context, options.treeJson);

  const files: Array<{ path: string; content: string }> = [
    { path: "main.asm", content: mainLines.join("\n") + "\n" },
  ];

  // Render dependency_tree.md if we have tree data and it's not suppressed
  if (options.treeJson && !options.noTreeDoc) {
    const treeDoc = renderDependencyTree({
      tree: options.treeJson,
      blocks: nonOverlapping,
      integration: options.integrationJson,
      labelMap,
    });
    files.push({ path: "dependency_tree.md", content: treeDoc });
  }

  const result: BuildResult = {
    files,
    assets: allAssets,
    stats: {
      totalBlocks: blocks.length,
      emittedBlocks: emittedBlocks.length,
      skippedJunk: blocks.length - activeBlocks.length,
      unmatchedBlocks: unmatchedCount,
    },
  };

  return result;
}

function assembleMainFile(
  _analysis: AnalysisOutput,
  emittedBlocks: Array<{ block: Block; emitted: EmittedBlock }>,
  context: BuilderContext,
  treeJson?: Record<string, unknown>
): string[] {
  const lines: string[] = [];

  // Header comment
  lines.push(ka.comment(`Generated from ${context.metadata.source}`));
  lines.push(ka.comment(`Load address: ${context.metadata.loadAddress}`));
  lines.push(ka.comment(`Total blocks: ${context.metadata.totalBlocks}`));
  lines.push("");

  // Build a set of reachable block IDs from the tree (if available)
  const unreachableBlockIds = treeJson ? findUnreachableBlockIds(treeJson) : new Set<string>();

  let lastEnd = -1;

  // Track emitted labels to skip duplicates from overlapping code/data blocks
  const emittedLabels = new Set<string>();

  // Emit each block
  for (const { block, emitted } of emittedBlocks) {
    // Origin directive if there's a gap or first block
    // Skip if emitter handles its own origin (e.g. BasicUpstart2)
    if (block.address !== lastEnd && !emitted.skipOrigin) {
      lines.push("");
      lines.push(ka.origin(block.address, block.id));
    }

    // Dead node warning (if tree is loaded and block is unreachable)
    if (unreachableBlockIds.has(block.id)) {
      const reason = block.type === "data" || block.type === "unknown"
        ? "Not referenced by any code"
        : "No path from any entry point";
      lines.push(ka.comment("============================================================"));
      lines.push(ka.comment(`UNREACHABLE: ${block.id} — ${reason}`));
      lines.push(ka.comment("This block may be called via unresolved indirect jump,"));
      lines.push(ka.comment("or may be dead/debug code."));
      lines.push(ka.comment("============================================================"));
    }

    // Strip duplicate label definitions (from overlapping blocks at same address)
    const dedupedLines = emitted.lines.filter((line) => {
      const m = line.match(/^(\w+):$/);
      if (m) {
        if (emittedLabels.has(m[1])) return false;
        emittedLabels.add(m[1]);
      }
      return true;
    });

    lines.push(...dedupedLines);
    lastEnd = block.endAddress;
  }

  return lines;
}

/**
 * Find block IDs that are unreachable based on the dependency tree.
 * A block is unreachable if its reachability is "unproven" — meaning no proven
 * path from any entry point through resolved control flow.
 *
 * We determine this by checking the tree nodes: if all tree nodes for a block
 * have no incoming control-flow edges from proven reachable nodes, the block
 * is considered unreachable. For simplicity, we use the block's own
 * reachability field from blocks.json (set by block_assembler).
 */
function findUnreachableBlockIds(treeJson: Record<string, unknown>): Set<string> {
  const unreachable = new Set<string>();

  // Build a set of node IDs reachable from entry points via control-flow edges
  const nodes = (treeJson.nodes ?? {}) as Record<string, Record<string, unknown>>;
  const edges = (treeJson.edges ?? []) as Array<Record<string, unknown>>;
  const entryPoints = (treeJson.entryPoints ?? []) as string[];
  const irqHandlers = (treeJson.irqHandlers ?? []) as string[];

  // Build adjacency list for control-flow edges
  const cfSuccessors = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.category !== "control_flow") continue;
    const source = edge.source as string;
    const targetNodeId = edge.targetNodeId as string | undefined;
    if (!targetNodeId) continue;
    let list = cfSuccessors.get(source);
    if (!list) {
      list = [];
      cfSuccessors.set(source, list);
    }
    list.push(targetNodeId);
  }

  // BFS from entry points + IRQ handlers
  const reachableNodes = new Set<string>();
  const queue = [...entryPoints, ...irqHandlers];
  while (queue.length > 0) {
    const nodeId = queue.pop()!;
    if (reachableNodes.has(nodeId)) continue;
    reachableNodes.add(nodeId);
    for (const succ of cfSuccessors.get(nodeId) ?? []) {
      if (!reachableNodes.has(succ)) queue.push(succ);
    }
  }

  // Any node not in reachable set → its blockId is unreachable
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (!reachableNodes.has(nodeId) && node.blockId) {
      unreachable.add(node.blockId as string);
    }
  }

  return unreachable;
}

/**
 * Remove overlapping blocks from a sorted block list.
 * When two blocks overlap, keep the one that starts first (already sorted).
 * Blocks starting at the same address as the previous block's end are NOT overlapping.
 */
function removeOverlaps(sorted: Block[]): Block[] {
  const result: Block[] = [];
  let lastEnd = -1;

  for (const block of sorted) {
    if (lastEnd > 0 && block.address < lastEnd) {
      // This block overlaps with a previously kept block — skip it
      continue;
    }
    result.push(block);
    lastEnd = block.endAddress;
  }

  return result;
}

/**
 * Read bytes from block raw data, spanning across block boundaries if needed.
 */
function getBytesFromBlocks(blocks: readonly Block[], start: number, length: number): Uint8Array | null {
  const result = new Uint8Array(length);
  let filled = 0;

  for (const block of blocks) {
    if (!block.raw) continue;
    const blockEnd = block.endAddress;
    if (block.address >= start + length) break;
    if (blockEnd <= start) continue;

    const bytes = decodeRaw(block.raw);
    const copyStart = Math.max(start, block.address);
    const copyEnd = Math.min(start + length, blockEnd);
    const srcOffset = copyStart - block.address;
    const dstOffset = copyStart - start;
    result.set(bytes.subarray(srcOffset, srcOffset + (copyEnd - copyStart)), dstOffset);
    filled += copyEnd - copyStart;
  }

  return filled === length ? result : null;
}

/** Write build results to disk. */
export function writeOutput(result: BuildResult, outputDir: string): void {
  mkdirSync(outputDir, { recursive: true });

  // Write source files
  for (const file of result.files) {
    writeFileSync(join(outputDir, file.path), file.content);
  }

  // Write binary assets
  if (result.assets.length > 0) {
    const assetsDir = join(outputDir, "assets");
    mkdirSync(assetsDir, { recursive: true });
    for (const asset of result.assets) {
      writeFileSync(join(assetsDir, asset.filename), asset.data);
    }
  }
}
