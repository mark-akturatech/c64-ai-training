/**
 * Number extraction and base conversion utility.
 *
 * Scans query text for numeric tokens ($hex, %binary, bare decimals)
 * and converts each to all useful bases. This is a pre-processing step
 * that runs before enrichment plugins — plugins receive the parsed
 * numbers as read-only input.
 */

import type { ParsedNumber } from "./types.js";

/**
 * Matches numeric tokens in query text:
 *   $XXXX      — hex (1-4 digits)
 *   %01010101  — binary (4-8 digits)
 *   0-65535    — bare decimal (1-5 digits)
 *
 * Post-comma values are captured separately (POKE addr,val pattern).
 */
const NUM_PATTERN =
  /(?<!\w)(\$[0-9A-Fa-f]{1,4}|%[01]{4,8}|[0-9]{1,5})(?!\w)|(?<=,)\s*([0-9]{1,5})(?!\w)/g;

/** Convert a numeric value to a hex string with $ prefix */
export function toHex(value: number): string {
  return value > 255 ? `$${value.toString(16).toUpperCase().padStart(4, "0")}` : `$${value.toString(16).toUpperCase().padStart(2, "0")}`;
}

/** Convert a numeric value to a binary string with % prefix (only useful for <= 255) */
export function toBinary(value: number): string {
  return `%${value.toString(2).padStart(8, "0")}`;
}

/** Parse a single token string into its numeric value, or null if invalid */
function parseToken(token: string): number | null {
  try {
    if (token.startsWith("$")) return parseInt(token.slice(1), 16);
    if (token.startsWith("%")) return parseInt(token.slice(1), 2);
    return parseInt(token, 10);
  } catch {
    return null;
  }
}

/**
 * Extract all numeric tokens from a query string and convert to ParsedNumber[].
 *
 * Each ParsedNumber contains the original token plus all useful base representations.
 * The returned array is meant to be read-only input for enrichment plugins.
 */
export function extractNumbers(query: string): ParsedNumber[] {
  const results: ParsedNumber[] = [];
  const seen = new Set<number>();

  for (const match of query.matchAll(NUM_PATTERN)) {
    const token = (match[1] || match[2] || "").trim();
    if (!token) continue;

    const value = parseToken(token);
    if (value === null || isNaN(value)) continue;
    if (seen.has(value)) continue;
    seen.add(value);

    const parsed: ParsedNumber = {
      sourceToken: token,
      value,
      decimal: value.toString(10),
      hex: toHex(value),
    };

    if (value <= 255) {
      parsed.binary = toBinary(value);
    }

    results.push(parsed);
  }

  return results;
}
