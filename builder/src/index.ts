#!/usr/bin/env tsx
// ============================================================================
// C64 Builder — CLI Entry Point
// ============================================================================

import { readFileSync } from "node:fs";
import type { AnalysisOutput } from "@c64/shared";
import { build, writeOutput } from "./builder.js";
import { loadPrg } from "./raw_data.js";

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.blocksFile) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const startTime = Date.now();

  // Load blocks.json
  console.error(`Loading ${args.blocksFile}...`);
  const analysis: AnalysisOutput = JSON.parse(readFileSync(args.blocksFile, "utf-8"));
  console.error(`  ${analysis.blocks.length} blocks, load address ${analysis.metadata.loadAddress}`);

  // Load binary if provided
  let memory: Uint8Array | undefined;
  let loadAddress = parseInt(analysis.metadata.loadAddress, 16);
  let endAddress = parseInt(analysis.metadata.endAddress, 16);

  if (args.binaryFile) {
    console.error(`Loading binary ${args.binaryFile}...`);
    const prg = loadPrg(args.binaryFile);
    memory = prg.memory;
    loadAddress = prg.loadAddress;
    endAddress = prg.endAddress;
    console.error(`  PRG load address: $${loadAddress.toString(16).toUpperCase().padStart(4, "0")}`);
  }

  // Build
  console.error("Building KickAssembler source...");
  const result = await build(analysis, {
    outputDir: args.outputDir,
    memory,
    loadAddress,
    endAddress,
    includeJunk: args.includeJunk,
  });

  // Write output
  const outputDir = args.outputDir || ".";
  writeOutput(result, outputDir);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.error(`\nDone in ${elapsed}s. Output: ${outputDir}/`);
  console.error(`  Emitted: ${result.stats.emittedBlocks}/${result.stats.totalBlocks} blocks`);
  if (result.stats.skippedJunk > 0) {
    console.error(`  Skipped (junk): ${result.stats.skippedJunk}`);
  }
  if (result.stats.unmatchedBlocks > 0) {
    console.error(`  Unmatched: ${result.stats.unmatchedBlocks}`);
  }
  console.error(`  Files: ${result.files.map((f) => f.path).join(", ")}`);
  if (result.assets.length > 0) {
    console.error(`  Assets: ${result.assets.length} binary files`);
  }
}

interface ParsedArgs {
  blocksFile?: string;
  binaryFile?: string;
  outputDir: string;
  includeJunk: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = { outputDir: ".", includeJunk: false, help: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--binary" || arg === "-b") {
      result.binaryFile = argv[++i];
    } else if (arg === "--output" || arg === "-o") {
      result.outputDir = argv[++i];
    } else if (arg === "--include-junk") {
      result.includeJunk = true;
    } else if (!arg.startsWith("-")) {
      result.blocksFile = arg;
    }
  }

  return result;
}

function printUsage(): void {
  console.error(`
C64 Builder — KickAssembler Code Generator

Usage: npx tsx src/index.ts <blocks.json> [options]

Arguments:
  blocks.json               Analysis output from static-analysis

Options:
  -b, --binary <file>       Original .prg for raw byte access
  -o, --output <dir>        Output directory (default: .)
  --include-junk            Emit junk blocks too (default: skip)
  -h, --help                Show this help

Examples:
  npx tsx src/index.ts blocks.json
  npx tsx src/index.ts blocks.json --binary game.prg -o output/
  npx tsx src/index.ts blocks.json --include-junk
`);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
