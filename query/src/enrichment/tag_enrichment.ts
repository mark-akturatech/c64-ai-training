/**
 * KERNAL label enrichment plugin.
 *
 * Scans query text for known KERNAL API labels and adds them
 * as filter tags for Qdrant keyword search.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

/** KERNAL API entry point labels (jump table $FF81-$FFF3) */
const KERNAL_LABELS: ReadonlySet<string> = new Set([
  "ACPTR", "CHKIN", "CHKOUT", "CHRIN", "CHROUT", "CINT", "CIOUT",
  "CLALL", "CLOSE", "CLRCHN", "GETIN", "IOBASE", "IOINIT", "LISTEN",
  "LOAD", "MEMBOT", "MEMTOP", "OPEN", "PLOT", "RAMTAS", "RDTIM",
  "READST", "RESTOR", "SAVE", "SCNKEY", "SCREEN", "SECOND", "SETLFS",
  "SETMSG", "SETNAM", "SETTIM", "SETTMO", "STOP", "TALK", "TKSA",
  "TALKSA", "UDTIM", "UNLSN", "UNTLK", "UNTALK", "VECTOR",
]);

export class TagEnrichment implements EnrichmentPlugin {
  name = "tag";

  enrich(input: EnrichmentInput): EnrichmentResult {
    const filterTags: string[] = [];

    const words = input.query.match(/\b[A-Za-z][A-Za-z0-9_]{1,7}\b/g) || [];
    for (const word of words) {
      const upper = word.toUpperCase();
      if (KERNAL_LABELS.has(upper)) {
        filterTags.push(upper);
      }
    }

    return { additionalContext: [], filterTags };
  }
}
