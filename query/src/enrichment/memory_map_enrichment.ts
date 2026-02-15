/**
 * Memory map enrichment plugin.
 *
 * Looks up each address > 255 in the C64 memory map and adds
 * broad region context to the search query. Individual VIC-II/SID
 * registers are omitted — filter tags already handle those and the
 * search results contain full register detail.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

interface MemoryRegion {
  start: number;
  end: number;
  name: string;
}

/**
 * C64 memory map — broad regions only.
 * VIC-II and SID get a single entry each (per-register detail is noise
 * since filter tags already return the right docs).
 */
const C64_MEMORY_MAP: readonly MemoryRegion[] = [
  { start: 0x0000, end: 0x00ff, name: "Zero Page" },
  { start: 0x0100, end: 0x01ff, name: "Stack" },
  { start: 0x0200, end: 0x03ff, name: "OS Work Area" },
  { start: 0x0400, end: 0x07ff, name: "Screen RAM" },
  { start: 0x0800, end: 0x9fff, name: "BASIC Program Area" },
  { start: 0xa000, end: 0xbfff, name: "BASIC ROM" },
  { start: 0xd000, end: 0xd3ff, name: "VIC-II" },
  { start: 0xd400, end: 0xd7ff, name: "SID" },
  { start: 0xd800, end: 0xdbff, name: "Color RAM" },
  { start: 0xdc00, end: 0xdc0f, name: "CIA 1" },
  { start: 0xdd00, end: 0xdd0f, name: "CIA 2" },
  { start: 0xe000, end: 0xffff, name: "KERNAL ROM" },
];

export class MemoryMapEnrichment implements EnrichmentPlugin {
  name = "memory_map";

  enrich(input: EnrichmentInput): EnrichmentResult {
    const additionalContext: string[] = [];
    const seenRegions = new Set<string>();

    for (const num of input.numbers) {
      if (num.value <= 255) continue;

      for (const region of C64_MEMORY_MAP) {
        if (num.value < region.start || num.value > region.end) continue;

        const key = region.name;
        if (seenRegions.has(key)) continue;
        seenRegions.add(key);

        additionalContext.push(`${num.hex} → ${region.name}`);
        break; // one match per address
      }
    }

    return { additionalContext, filterTags: [] };
  }
}
