#!/usr/bin/env tsx
// ============================================================================
// prg2vsf — Convert C64 .prg to VICE .vsf snapshot
// ============================================================================

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parsePrg, detectBasicSys, loadTemplate, patchVsf, hex16 } from "./prg2vsf.js";

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.input) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  // Read PRG
  const prgData = new Uint8Array(readFileSync(args.input));

  let loadAddress: number;
  let payload: Uint8Array;

  if (args.fullRam) {
    if (prgData.length !== 65536) {
      die(`--full-ram expects exactly 65536 bytes, got ${prgData.length}`);
    }
    loadAddress = 0x0000;
    payload = prgData;
  } else {
    const prg = parsePrg(prgData);
    loadAddress = prg.loadAddress;
    payload = prg.payload;
  }

  const endAddress = loadAddress + payload.length;
  console.log(`PRG: load=$${hex16(loadAddress)}  end=$${hex16(endAddress)}  size=${payload.length} bytes`);

  // Determine entry point
  let entryPoint: number;
  let entrySource: string;
  let hasBasicSys = false;

  if (args.pc !== undefined) {
    entryPoint = args.pc;
    entrySource = "command line";
  } else {
    const sysAddr = detectBasicSys(payload, loadAddress);
    if (sysAddr !== null) {
      entryPoint = sysAddr;
      entrySource = "BASIC SYS stub → RUN via keyboard buffer";
      hasBasicSys = true;
    } else {
      entryPoint = loadAddress;
      entrySource = "load address";
    }
  }
  console.log(`Entry: $${hex16(entryPoint)} (${entrySource})`);

  // Load template and patch
  const template = loadTemplate();
  const vsf = patchVsf(template, { loadAddress, payload, entryPoint, hasBasicSys, fullRam: args.fullRam });

  // Write output
  const output = args.output ?? defaultOutput(args.input);
  writeFileSync(output, vsf);
  console.log(`Output: ${output} (${vsf.length} bytes)`);
}

function defaultOutput(input: string): string {
  const name = basename(input).replace(/\.[^.]+$/, "");
  return join(dirname(input), `${name}.vsf`);
}

interface ParsedArgs {
  input?: string;
  output?: string;
  pc?: number;
  fullRam: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = { fullRam: false, help: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "-o" || arg === "--output") {
      result.output = argv[++i];
    } else if (arg === "--pc") {
      const val = argv[++i];
      result.pc = parseInt(val, val.startsWith("0x") || val.startsWith("0X") ? 16 : 10);
      if (isNaN(result.pc)) die(`Invalid --pc value: ${val}`);
    } else if (arg === "--full-ram") {
      result.fullRam = true;
    } else if (!arg.startsWith("-")) {
      result.input = arg;
    }
  }

  return result;
}

function printUsage(): void {
  console.error(`
prg2vsf — Convert C64 .prg to VICE .vsf snapshot

Usage: npx tsx src/index.ts <input.prg> [options]

Options:
  -o, --output <file>   Output .vsf file (default: <input>.vsf)
  --pc <address>        Override entry point (e.g. 0x0810 or 2064)
  --full-ram            Input is raw 64KB RAM dump (no 2-byte PRG header)
  -h, --help            Show this help

Entry point detection:
  1. --pc override (if given)
  2. BASIC SYS stub parsing (if detected)
  3. Load address (fallback)

Examples:
  npx tsx src/index.ts game.prg
  npx tsx src/index.ts game.prg -o game.vsf
  npx tsx src/index.ts game.prg --pc 0x0810
  npx tsx src/index.ts ramdump.bin --full-ram --pc 0xFCE2
`);
}

function die(msg: string): never {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

main();
