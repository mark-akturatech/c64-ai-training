/**
 * Color name enrichment plugin.
 *
 * Checks if any parsed number is a valid C64 color value (0-15)
 * and adds the color name as context. Also detects color name
 * words in the query text and adds them as filter tags.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

/** C64 color palette — VIC-II 4-bit color values (0-15) */
const C64_COLORS: readonly string[] = [
  "Black",        // 0
  "White",        // 1
  "Red",          // 2
  "Cyan",         // 3
  "Purple",       // 4
  "Green",        // 5
  "Blue",         // 6
  "Yellow",       // 7
  "Orange",       // 8
  "Brown",        // 9
  "Light Red",    // 10
  "Dark Grey",    // 11
  "Grey",         // 12
  "Light Green",  // 13
  "Light Blue",   // 14
  "Light Grey",   // 15
];

/** Single-word color names for tag matching in query text */
const COLOR_NAME_TAGS: ReadonlySet<string> = new Set([
  "BLACK", "WHITE", "RED", "CYAN", "PURPLE", "GREEN", "BLUE", "YELLOW",
  "ORANGE", "BROWN", "GREY"
]);

/** Address ranges where a 4-bit color index is meaningful */
const COLOR_ADDRESS_RANGES: readonly { start: number; end: number }[] = [
  { start: 0x0286, end: 0x0287 }, // 646-647 — current text color + color under cursor
  { start: 0xd020, end: 0xd02e }, // VIC-II: border, backgrounds, sprite colors
  { start: 0xd800, end: 0xdbff }, // Color RAM (per-character color nybbles)
];

/** Check if an address is in a color-relevant context */
function isColorAddress(value: number): boolean {
  return COLOR_ADDRESS_RANGES.some((r) => value >= r.start && value <= r.end);
}

export class ColorEnrichment implements EnrichmentPlugin {
  name = "color";

  enrich(input: EnrichmentInput): EnrichmentResult {
    const additionalContext: string[] = [];
    const filterTags: string[] = [];

    // Add color names for 0-15 values, but only in a color-relevant context:
    // - query mentions "color"/"colour"
    // - query contains an address in a color register/RAM range
    const mentionsColor = /\bcolo[u]?r/i.test(input.query);
    const hasColorAddress = input.numbers.some((n) => isColorAddress(n.value));

    if (mentionsColor || hasColorAddress) {
      for (const num of input.numbers) {
        if (num.value >= 0 && num.value <= 15) {
          additionalContext.push(`${num.sourceToken} = ${C64_COLORS[num.value]}`);
        }
      }
    }

    // Check query text for color name words
    const words = input.query.match(/\b[A-Za-z]{3,}\b/g) || [];
    for (const word of words) {
      const upper = word.toUpperCase();
      if (COLOR_NAME_TAGS.has(upper)) {
        filterTags.push(upper);
      }
    }

    return { additionalContext, filterTags };
  }
}
