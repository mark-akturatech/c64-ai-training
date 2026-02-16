// ============================================================================
// Step 1: Binary Loader
// ============================================================================

import { readFileSync } from "node:fs";
import { loadParsers } from "./input_parsers/index.js";
import type { MemoryImage, LoadedRegion, EntryPointHint, BankingHints } from "./types.js";

export interface LoadOptions {
  format?: string;        // force a specific parser by name
  loadAddress?: number;   // override load address
  entryPoints?: number[]; // user-specified entry points (passed through)
}

export async function loadBinary(
  filePath: string,
  options?: LoadOptions
): Promise<MemoryImage> {
  const data = readFileSync(filePath);
  const fileData = new Uint8Array(data);
  const parsers = await loadParsers();

  let selectedParser;

  if (options?.format) {
    selectedParser = parsers.find((p) => p.name === options.format);
    if (!selectedParser) {
      const available = parsers.map((p) => p.name).join(", ");
      throw new Error(`Unknown format: ${options.format}. Available: ${available}`);
    }
  } else {
    // Auto-detect: score all parsers, pick highest
    const scores = parsers.map((p) => ({
      parser: p,
      score: p.detect(fileData, filePath),
    }));
    scores.sort((a, b) => b.score - a.score || a.parser.priority - b.parser.priority);

    if (scores[0].score === 0) {
      throw new Error(
        `No parser recognized this file. Tried: ${parsers.map((p) => p.name).join(", ")}`
      );
    }
    selectedParser = scores[0].parser;
  }

  const regions = selectedParser.parse(fileData, filePath);

  // Build 64KB memory image
  const memory = new Uint8Array(65536);
  const loaded: LoadedRegion[] = [];
  const parserEntryPoints: EntryPointHint[] = [];
  let parserBankingHints: BankingHints | undefined;

  for (const region of regions) {
    // Collect parser-provided hints
    if (region.entryPointHints) {
      parserEntryPoints.push(...region.entryPointHints);
    }
    if (region.bankingHints && !parserBankingHints) {
      parserBankingHints = region.bankingHints;
    }
    const addr = options?.loadAddress ?? region.address;
    const end = addr + region.bytes.length;

    if (end > 0x10000) {
      throw new Error(
        `Region exceeds 64KB: $${addr.toString(16)}-$${end.toString(16)}`
      );
    }

    // Check for overlaps with existing regions
    for (const existing of loaded) {
      if (addr < existing.end && end > existing.start) {
        throw new Error(
          `Overlapping regions: $${addr.toString(16)}-$${end.toString(16)} ` +
          `overlaps $${existing.start.toString(16)}-$${existing.end.toString(16)}`
        );
      }
    }

    memory.set(region.bytes, addr);
    loaded.push({
      start: addr,
      end,
      source: selectedParser.name,
    });
  }

  if (loaded.length === 0) {
    throw new Error("No data loaded from input file");
  }

  // Sort regions by start address
  loaded.sort((a, b) => a.start - b.start);

  const loadAddress = options?.loadAddress ?? loaded[0].start;
  const endAddress = Math.max(...loaded.map((r) => r.end));

  return {
    bytes: memory,
    loaded,
    loadAddress,
    endAddress,
    parserEntryPoints: parserEntryPoints.length > 0 ? parserEntryPoints : undefined,
    parserBankingHints,
  };
}

// Packer detection (informational only)
export function detectPacker(memory: Uint8Array, loaded: LoadedRegion[]): string | null {
  for (const region of loaded) {
    const start = region.start;
    // Exomizer: look for characteristic decompressor patterns
    // ByteBoozer: check for BB init sequence
    // PuCrunch: magic bytes
    // This is a best-effort heuristic scan
    const bytes = memory.slice(start, Math.min(start + 64, region.end));

    // Exomizer v2 typically has a specific ZP usage pattern
    // ByteBoozer starts with a JMP to decompressor
    // For now, return null — extend with real signatures later
    void bytes;
  }
  return null;
}
