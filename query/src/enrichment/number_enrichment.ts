/**
 * Number enrichment plugin — priority 10.
 *
 * Builds multi-base context strings from pre-extracted numbers.
 * Adds 4-digit hex addresses as filter tags for Qdrant keyword search.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

export class NumberEnrichment implements EnrichmentPlugin {
  name = "number";

  enrich(input: EnrichmentInput): EnrichmentResult {
    const additionalContext: string[] = [];
    const filterTags: string[] = [];

    for (const num of input.numbers) {
      // Single-digit bare decimals: extracted for other plugins (e.g. color)
      // but not worth base-converting — skip noise like "5 = $05 / %00000101"
      const isBareSmall = num.value < 10 && !num.sourceToken.startsWith("$") && !num.sourceToken.startsWith("%");
      if (isBareSmall) continue;

      const parts = [num.sourceToken];

      // Add representations the source doesn't already have
      if (!num.sourceToken.startsWith("$")) parts.push(num.hex);
      if (num.sourceToken.startsWith("$") || num.sourceToken.startsWith("%")) parts.push(num.decimal);
      if (num.binary && !num.sourceToken.startsWith("%")) parts.push(num.binary);

      if (parts.length > 1) {
        additionalContext.push(`${num.sourceToken} = ${parts.slice(1).join(" / ")}`);
      }

      // 4-digit hex addresses become filter tags
      if (num.value > 255) {
        filterTags.push(num.hex);
      }
    }

    return { additionalContext, filterTags };
  }
}
