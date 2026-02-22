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

  // Header comment — use program description from Stage 5 Polish if available
  const progDesc = (context.metadata as Record<string, unknown>).programDescription as string | undefined;
  if (progDesc) {
    for (const descLine of progDesc.split("\n")) {
      lines.push(ka.comment(descLine));
    }
    lines.push(ka.comment(`Generated from ${context.metadata.source}`));
  } else {
    lines.push(ka.comment(`Generated from ${context.metadata.source}`));
    lines.push(ka.comment(`Load address: ${context.metadata.loadAddress}`));
    lines.push(ka.comment(`Total blocks: ${context.metadata.totalBlocks}`));
  }
  lines.push("");

  // Generate .const definitions for labels outside the program's address space
  // (hardware registers, KERNAL ROM, system vectors, etc.)
  const constDefs = buildExternalConstants(context, emittedBlocks);
  if (constDefs.length > 0) {
    lines.push(...constDefs);
    lines.push("");
  }

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
      const segmentName = context.resolveLabel(block.address) ?? block.id;
      lines.push(ka.origin(block.address, segmentName));
    } else if (lastEnd >= 0) {
      // Blank line between contiguous blocks for readability
      lines.push("");
    }

    // Section header from Stage 5 Polish (e.g., "--- Animation state ---")
    if (block.enrichment?.sectionHeader) {
      lines.push("");
      lines.push(ka.comment(block.enrichment.sectionHeader));
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

  // Dead label elimination: remove label definitions and .const declarations
  // that aren't referenced anywhere else in the file
  return eliminateDeadLabels(lines);
}

/**
 * Remove label: definitions and .const declarations that aren't referenced
 * anywhere else in the file. Eliminates noise from unreferenced data sub-labels,
 * consumed-block constants, etc.
 */
function eliminateDeadLabels(lines: string[]): string[] {
  // Collect all label definitions: "name:" at start of line
  const labelDefs = new Map<string, number[]>();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([a-z_]\w*):$/);
    if (m) {
      const existing = labelDefs.get(m[1]);
      if (existing) { existing.push(i); }
      else { labelDefs.set(m[1], [i]); }
    }
  }

  // Collect all .const definitions
  const constDefs = new Map<string, number>();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\.const\s+(\w+)\s*=/);
    if (m) constDefs.set(m[1], i);
  }

  const allNames = [...labelDefs.keys(), ...constDefs.keys()];
  if (allNames.length === 0) return lines;

  // Build regex patterns once for efficiency
  const patterns = new Map<string, RegExp>();
  for (const name of allNames) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    patterns.set(name, new RegExp(`(?<![a-zA-Z0-9_])${escaped}(?![a-zA-Z0-9_:])`));
  }

  // Find which names are actually used (referenced in non-definition lines)
  const used = new Set<string>();
  for (const line of lines) {
    if (/^[a-z_]\w*:$/.test(line)) continue;
    if (/^\.const\s+\w+\s*=/.test(line)) continue;
    for (const [name, re] of patterns) {
      if (!used.has(name) && re.test(line)) {
        used.add(name);
      }
    }
  }

  // Remove unreferenced definitions
  const deadLines = new Set<number>();
  for (const [name, indices] of labelDefs) {
    if (!used.has(name)) {
      for (const i of indices) deadLines.add(i);
    }
  }
  for (const [name, idx] of constDefs) {
    if (!used.has(name)) deadLines.add(idx);
  }

  if (deadLines.size === 0) return lines;

  const filtered = lines.filter((_, i) => !deadLines.has(i));
  return cleanOrphanedHeaders(filtered);
}

/**
 * Remove region comment headers (e.g., "//  Other") that have no remaining
 * .const definitions below them (before the next header or blank line).
 */
function cleanOrphanedHeaders(lines: string[]): string[] {
  // Only clean region headers within the .const section, not the file header.
  // Find where .const declarations start and end.
  let constStart = -1;
  let constEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(".const ")) {
      if (constStart === -1) constStart = i;
      constEnd = i;
    }
  }
  if (constStart === -1) return lines;

  // Scan backwards from constStart to find region headers that precede .const
  let regionStart = constStart;
  for (let i = constStart - 1; i >= 0; i--) {
    if (/^\/\/\s{1,2}\w/.test(lines[i])) { regionStart = i; }
    else break;
  }

  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    // Only apply orphaned-header cleanup within the .const region
    if (i >= regionStart && i <= constEnd + 1) {
      const isRegionHeader = /^\/\/\s{1,2}\w/.test(lines[i])
        && !lines[i].includes("BASIC:")
        && !lines[i].includes("Generated")
        && !lines[i].includes("---");

      if (isRegionHeader) {
        let hasConst = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].startsWith(".const ")) { hasConst = true; break; }
          if (lines[j].trim() === "" || /^\/\/\s{1,2}\w/.test(lines[j])) break;
        }
        if (!hasConst) continue;
      }
    }
    result.push(lines[i]);
  }
  return result;
}

/**
 * Find block IDs that are unreachable based on the dependency tree.
 * A block is unreachable if there is no path from any entry point or IRQ handler
 * through any edge type (control_flow or data). Data blocks are reachable if
 * referenced by reachable code blocks via data_read/data_write edges.
 */
function findUnreachableBlockIds(treeJson: Record<string, unknown>): Set<string> {
  const unreachable = new Set<string>();

  // Build a set of node IDs reachable from entry points via control-flow edges
  const nodes = (treeJson.nodes ?? {}) as Record<string, Record<string, unknown>>;
  const edges = (treeJson.edges ?? []) as Array<Record<string, unknown>>;
  const entryPoints = (treeJson.entryPoints ?? []) as string[];
  const irqHandlers = (treeJson.irqHandlers ?? []) as string[];

  // Build adjacency list for ALL edges (control_flow + data)
  // Data blocks are reachable via data_read/data_write edges from code
  const successors = new Map<string, string[]>();
  for (const edge of edges) {
    const source = edge.source as string;
    const targetNodeId = edge.targetNodeId as string | undefined;
    if (!targetNodeId) continue;
    let list = successors.get(source);
    if (!list) {
      list = [];
      successors.set(source, list);
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
    for (const succ of successors.get(nodeId) ?? []) {
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

/**
 * Build .const definitions for labels that point outside the program's block range.
 * These are hardware registers, KERNAL entries, system vectors, etc. — addresses
 * that have semantic labels but no block/instruction definition.
 */
function buildExternalConstants(
  context: BuilderContext,
  emittedBlocks: Array<{ block: Block; emitted: EmittedBlock }>,
): string[] {
  // Build set of all block addresses + instruction addresses (where labels are defined in code)
  const internalAddrs = new Set<number>();
  for (const { block } of emittedBlocks) {
    internalAddrs.add(block.address);
    if (block.instructions) {
      for (const inst of block.instructions) internalAddrs.add(inst.address);
    }
  }

  // Build ranges from ALL blocks (including consumed ones) — prevents
  // labels within consumed blocks from leaking into .const declarations
  const blockRanges: Array<{ start: number; end: number }> = [];
  for (const block of context.allBlocks) {
    blockRanges.push({ start: block.address, end: block.endAddress });
  }
  const isInternalAddr = (addr: number): boolean => {
    if (internalAddrs.has(addr)) return true;
    return blockRanges.some(r => addr >= r.start && addr < r.end);
  };

  // Find labels that are external (not within any block range)
  // Skip offset expressions (e.g. COLOR_RAM+$1B8) — the base name (COLOR_RAM)
  // is emitted as its own .const entry.
  const externals: Array<{ addr: number; name: string }> = [];
  for (const [addr, name] of context.labelMap) {
    if (!isInternalAddr(addr) && !name.includes("+")) {
      externals.push({ addr, name });
    }
  }

  if (externals.length === 0) return [];

  // Sort by address and group by chip/region
  externals.sort((a, b) => a.addr - b.addr);

  const lines: string[] = [];
  lines.push(ka.comment("Hardware registers and system constants"));

  let lastRegion = "";
  for (const { addr, name } of externals) {
    const region = addr < 0x0100 ? "Zero Page"
      : addr < 0x0400 ? "System"
      : addr >= 0x0400 && addr <= 0x07E7 ? "Screen RAM"
      : addr >= 0x07F8 && addr <= 0x07FF ? "Sprite Pointers"
      : addr >= 0xA000 && addr <= 0xBFFF ? "BASIC ROM"
      : addr >= 0xD000 && addr <= 0xD3FF ? "VIC-II"
      : addr >= 0xD400 && addr <= 0xD7FF ? "SID"
      : addr >= 0xD800 && addr <= 0xDBFF ? "Color RAM"
      : addr >= 0xDC00 && addr <= 0xDC0F ? "CIA1"
      : addr >= 0xDD00 && addr <= 0xDD0F ? "CIA2"
      : addr >= 0xE000 ? "KERNAL"
      : "Other";
    if (region !== lastRegion) {
      lines.push(ka.comment(` ${region}`));
      lastRegion = region;
    }
    const width = addr < 0x0100 ? 2 : 4;
    const hex = `$${addr.toString(16).toUpperCase().padStart(width, "0")}`;
    lines.push(`.const ${name} = ${hex}`);
  }

  return lines;
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
