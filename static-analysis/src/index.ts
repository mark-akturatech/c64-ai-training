#!/usr/bin/env tsx
// ============================================================================
// C64 Static Analysis Pipeline — CLI Entry Point
// ============================================================================

import { writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { loadBinary, detectPacker } from "./binary_loader.js";
import { detectEntryPoints } from "./entry_point_detector.js";
import { buildDependencyTree } from "./tree_walker.js";
import { discoverCode } from "./code_discoverer.js";
import { classifyDataRegions } from "./data_classifier.js";
import { assembleBlocks } from "./block_assembler.js";
import { loadEnrichers } from "./block_enrichers/index.js";
import type { AnalysisOutput, Block, BlockType } from "./types.js";

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.files.length === 0) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const startTime = Date.now();

  // Step 1: Binary Loader
  console.error(`[1/7] Loading ${args.files[0]}...`);
  const image = await loadBinary(args.files[0], {
    format: args.format,
    loadAddress: args.loadAddress,
  });
  console.error(
    `  Loaded $${image.loadAddress.toString(16).toUpperCase().padStart(4, "0")}-$${(image.endAddress - 1).toString(16).toUpperCase().padStart(4, "0")} ` +
    `(${image.endAddress - image.loadAddress} bytes, ${image.loaded.length} region${image.loaded.length > 1 ? "s" : ""})`
  );

  // Packer detection
  const packer = detectPacker(image.bytes, image.loaded);
  if (packer) {
    console.error(`  WARNING: Binary appears packed with ${packer}. Consider unpacking first.`);
  }

  // Step 2: Entry Point Detection
  console.error("[2/7] Detecting entry points...");
  const { entryPoints, bankingState } = detectEntryPoints(image, args.entryPoints);
  if (entryPoints.length === 0) {
    console.error("  ERROR: No entry points found. Use --entry to specify one.");
    process.exit(1);
  }
  for (const ep of entryPoints) {
    console.error(
      `  ${ep.source}: $${ep.address.toString(16).toUpperCase().padStart(4, "0")} [${ep.confidence}] — ${ep.description}`
    );
  }
  console.error(
    `  Banking: KERNAL=${bankingState.kernalRomVisible ? "ROM" : "RAM"}, ` +
    `BASIC=${bankingState.basicRomVisible ? "ROM" : "RAM"}, ` +
    `IO=${bankingState.ioVisible ? "visible" : "hidden"}, ` +
    `VIC bank=${bankingState.vicBank} ($${bankingState.vicBankBase.toString(16).toUpperCase()})`
  );

  // Step 3: Dependency Tree Builder
  console.error("[3/7] Building dependency tree...");
  let { tree, byteRole } = await buildDependencyTree(image, entryPoints, bankingState);
  let codeNodes = Array.from(tree.nodes.values()).filter((n) => n.type === "code");
  let dataNodes = Array.from(tree.nodes.values()).filter((n) => n.type === "data");
  console.error(
    `  ${codeNodes.length} code nodes, ${dataNodes.length} data nodes, ` +
    `${tree.getSubroutines().length} subroutines`
  );

  // Step 4: Code Discovery — find unreached code islands, trace them through tree walker
  console.error("[4/7] Discovering unreached code...");
  const discoveredEntryPoints = await discoverCode(image.bytes, tree, bankingState, byteRole, image.loaded);
  if (discoveredEntryPoints.length > 0) {
    console.error(`  Found ${discoveredEntryPoints.length} unreached code region(s), re-tracing...`);
    for (const ep of discoveredEntryPoints) {
      console.error(
        `  $${ep.address.toString(16).toUpperCase().padStart(4, "0")} [${ep.confidence}] — ${ep.description}`
      );
    }
    ({ tree, byteRole } = await buildDependencyTree(image, discoveredEntryPoints, bankingState, { tree, byteRole }));
    codeNodes = Array.from(tree.nodes.values()).filter((n) => n.type === "code");
    dataNodes = Array.from(tree.nodes.values()).filter((n) => n.type === "data");
    console.error(
      `  After re-trace: ${codeNodes.length} code nodes, ${dataNodes.length} data nodes, ` +
      `${tree.getSubroutines().length} subroutines`
    );
  } else {
    console.error("  No unreached code found");
  }

  // Step 5: Data Classifier
  console.error("[5/7] Classifying data regions...");
  const dataCandidates = await classifyDataRegions(
    image.bytes,
    tree,
    bankingState,
    byteRole,
    image.loaded
  );
  console.error(`  ${dataCandidates.length} data candidates from ${dataNodes.length} data nodes`);

  // Step 6: Block Assembler
  console.error("[6/7] Assembling blocks...");
  let blocks = assembleBlocks(tree, dataCandidates, image.loaded, image.bytes);
  console.error(`  ${blocks.length} raw blocks`);

  // Step 7: Block Enrichment
  console.error("[7/7] Enriching blocks...");
  const enrichers = await loadEnrichers();
  const enricherContext = {
    tree,
    loadedRegions: image.loaded,
    memory: image.bytes,
    bankingState,
  };
  for (const enricher of enrichers) {
    blocks = enricher.enrich(blocks, enricherContext);
  }
  console.error(`  ${blocks.length} final blocks (after enrichment)`);

  // Build output
  const output = buildOutput(args.files[0], image, entryPoints, blocks);

  // Write output
  const outputPath = args.output || "blocks.json";
  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  // Write dependency_tree.json alongside blocks.json
  const treeOutputPath = join(dirname(outputPath), "dependency_tree.json");
  const treeJson = tree.toJSON();
  (treeJson.metadata as Record<string, unknown>).source = basename(args.files[0]);
  writeFileSync(treeOutputPath, JSON.stringify(treeJson, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.error(`\nDone in ${elapsed}s. Output: ${outputPath}, ${treeOutputPath}`);
  console.error(`  Code: ${output.coverage.classified.code.bytes} bytes (${output.coverage.classified.code.pct}%)`);
  console.error(`  Data: ${output.coverage.classified.data.bytes} bytes (${output.coverage.classified.data.pct}%)`);
  console.error(`  Unknown: ${output.coverage.classified.unknown.bytes} bytes (${output.coverage.classified.unknown.pct}%)`);
}

function buildOutput(
  source: string,
  image: { loadAddress: number; endAddress: number; loaded: Array<{ start: number; end: number }> },
  entryPoints: Array<{ address: number }>,
  blocks: Block[]
): AnalysisOutput {
  const totalLoaded = image.loaded.reduce((sum, r) => sum + (r.end - r.start), 0);

  const blockCounts: Record<BlockType, number> = {
    subroutine: 0,
    irq_handler: 0,
    fragment: 0,
    data: 0,
    unknown: 0,
  };
  let codeBytes = 0;
  let dataBytes = 0;
  let unknownBytes = 0;

  for (const block of blocks) {
    blockCounts[block.type]++;
    const size = block.endAddress - block.address;
    if (block.type === "data") dataBytes += size;
    else if (block.type === "unknown") unknownBytes += size;
    else codeBytes += size;
  }

  return {
    metadata: {
      source: basename(source),
      loadAddress: `0x${image.loadAddress.toString(16).padStart(4, "0")}`,
      endAddress: `0x${image.endAddress.toString(16).padStart(4, "0")}`,
      entryPoints: entryPoints.map((ep) => `0x${ep.address.toString(16).padStart(4, "0")}`),
      totalBytesLoaded: totalLoaded,
      totalBlocks: blocks.length,
      blockCounts,
    },
    coverage: {
      loadedRegions: image.loaded.map((r) => ({
        start: `0x${r.start.toString(16).padStart(4, "0")}`,
        end: `0x${r.end.toString(16).padStart(4, "0")}`,
      })),
      classified: {
        code: { bytes: codeBytes, pct: round((codeBytes / totalLoaded) * 100) },
        data: { bytes: dataBytes, pct: round((dataBytes / totalLoaded) * 100) },
        unknown: { bytes: unknownBytes, pct: round((unknownBytes / totalLoaded) * 100) },
      },
      gaps: [],
    },
    blocks,
  };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

interface ParsedArgs {
  files: string[];
  entryPoints?: number[];
  format?: string;
  loadAddress?: number;
  output?: string;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = { files: [], help: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--entry" || arg === "-e") {
      const val = argv[++i];
      if (!result.entryPoints) result.entryPoints = [];
      result.entryPoints.push(parseAddress(val));
    } else if (arg === "--format" || arg === "-f") {
      result.format = argv[++i];
    } else if (arg === "--load-address") {
      result.loadAddress = parseAddress(argv[++i]);
    } else if (arg === "--output" || arg === "-o") {
      result.output = argv[++i];
    } else if (!arg.startsWith("-")) {
      result.files.push(arg);
    }
  }

  return result;
}

function parseAddress(s: string): number {
  if (s.startsWith("0x") || s.startsWith("0X")) return parseInt(s, 16);
  if (s.startsWith("$")) return parseInt(s.slice(1), 16);
  return parseInt(s, 10);
}

function printUsage(): void {
  console.error(`
C64 Static Analysis Pipeline

Usage: npx tsx src/index.ts <input> [options]

Arguments:
  input                     Input file (.prg, .sid, .asm, .dump)

Options:
  -e, --entry <addr>        Entry point address (hex: 0x0810 or $0810)
                            Can be specified multiple times
  -f, --format <name>       Force parser (prg, sid, regenerator, vice, c64_debugger, generic)
  --load-address <addr>     Override load address
  -o, --output <path>       Output file (default: blocks.json)
  -h, --help                Show this help

Examples:
  npx tsx src/index.ts game.prg
  npx tsx src/index.ts game.prg --entry 0x0810
  npx tsx src/index.ts disasm.asm --format regenerator --entry 0x0810
  npx tsx src/index.ts part1.prg --entry 0xC000 -o analysis.json
`);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
