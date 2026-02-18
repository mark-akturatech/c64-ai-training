// ============================================================================
// Builder — core orchestrator: load blocks → run emitters → assemble output
// ============================================================================

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AnalysisOutput, Block } from "@c64/shared";
import { buildLabelMap } from "./label_resolver.js";
import { formatHex } from "./address_formatter.js";
import * as ka from "./kickass.js";
import { loadEmitters } from "./emitters/index.js";
import type { BinaryAsset, BuilderContext, EmittedBlock } from "./emitters/types.js";

export interface BuilderOptions {
  outputDir: string;
  memory?: Uint8Array;
  loadAddress: number;
  endAddress: number;
  includeJunk: boolean;
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
      return null;
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
  const mainLines = assembleMainFile(analysis, emittedBlocks, context);

  const result: BuildResult = {
    files: [{ path: "main.asm", content: mainLines.join("\n") + "\n" }],
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
  context: BuilderContext
): string[] {
  const lines: string[] = [];

  // Header comment
  lines.push(ka.comment(`Generated from ${context.metadata.source}`));
  lines.push(ka.comment(`Load address: ${context.metadata.loadAddress}`));
  lines.push(ka.comment(`Total blocks: ${context.metadata.totalBlocks}`));
  lines.push("");

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
