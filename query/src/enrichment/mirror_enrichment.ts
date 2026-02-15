/**
 * Mirror register enrichment plugin.
 *
 * Detects VIC-II/SID/CIA mirror addresses and adds the canonical
 * address as context and filter tag so Qdrant finds the right docs.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";
import { toHex } from "../numbers.js";

interface MirrorRange {
  /** Start of the I/O region */
  regionStart: number;
  /** End of the I/O region (inclusive) */
  regionEnd: number;
  /** Number of unique registers in this chip */
  registerCount: number;
  /** Mirroring period in bytes */
  period: number;
  /** Chip name for annotations */
  chipName: string;
}

const MIRROR_RANGES: readonly MirrorRange[] = [
  // VIC-II: 47 registers at $D000-$D02E, mirrored every 64 bytes through $D3FF
  { regionStart: 0xd000, regionEnd: 0xd3ff, registerCount: 47, period: 64, chipName: "VIC-II" },
  // SID: 29 registers at $D400-$D41C, mirrored every 32 bytes through $D7FF
  { regionStart: 0xd400, regionEnd: 0xd7ff, registerCount: 29, period: 32, chipName: "SID" },
  // CIA1: 16 registers at $DC00-$DC0F, mirrored every 16 bytes through $DCFF
  { regionStart: 0xdc00, regionEnd: 0xdcff, registerCount: 16, period: 16, chipName: "CIA1" },
  // CIA2: 16 registers at $DD00-$DD0F, mirrored every 16 bytes through $DDFF
  { regionStart: 0xdd00, regionEnd: 0xddff, registerCount: 16, period: 16, chipName: "CIA2" },
];

/**
 * Resolve a mirror address to its canonical address.
 *
 * Returns null if the address is not in any mirror range,
 * or if it's already the canonical address (not a mirror).
 */
function resolveMirror(
  address: number,
): { canonical: number; chipName: string } | null {
  for (const range of MIRROR_RANGES) {
    if (address < range.regionStart || address > range.regionEnd) continue;

    const offset = (address - range.regionStart) % range.period;
    if (offset >= range.registerCount) {
      // Unused mirror slot — still resolve to canonical range
      // but there's no actual register here
      return null;
    }

    const canonical = range.regionStart + offset;
    if (canonical === address) return null; // already canonical

    return { canonical, chipName: range.chipName };
  }

  return null;
}

export class MirrorEnrichment implements EnrichmentPlugin {
  name = "mirror";

  enrich(input: EnrichmentInput): EnrichmentResult {
    const additionalContext: string[] = [];
    const filterTags: string[] = [];

    for (const num of input.numbers) {
      const resolved = resolveMirror(num.value);
      if (!resolved) continue;

      const canonicalHex = toHex(resolved.canonical);
      additionalContext.push(
        `${num.hex} is mirror of ${canonicalHex} (${resolved.chipName})`,
      );
      filterTags.push(canonicalHex);
    }

    return { additionalContext, filterTags };
  }
}
