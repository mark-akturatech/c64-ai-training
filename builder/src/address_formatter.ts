// ============================================================================
// Address Formatter — rewrite operand addresses to labels or $XXXX format
// ============================================================================

import type { BuilderContext } from "./emitters/types.js";

/** Format a hex value with $ prefix: $XX, $XXXX, etc. */
export function formatHex(value: number, width: number = 4): string {
  return `$${value.toString(16).toUpperCase().padStart(width, "0")}`;
}

/**
 * Rewrite an instruction operand, replacing known addresses with labels.
 * Falls back to $XXXX hex format for unknown addresses.
 *
 * Zero-page addresses ($XX, 2 hex digits) are NOT rewritten to labels
 * because KickAssembler might re-encode them as absolute (3 bytes)
 * instead of zero page (2 bytes), breaking byte-identical output.
 *
 * Absolute references to zero-page ($00XX) are also NOT rewritten because
 * KickAssembler will optimize them from absolute (3 bytes) to zero page
 * (2 bytes), causing PC drift.
 */
export function rewriteOperand(
  operand: string,
  context: BuilderContext
): string {
  // Only match 16-bit addresses ($XXXX, exactly 4 hex digits)
  // Skip zero-page addresses ($00XX) to prevent KickAssembler optimization
  return operand.replace(/\$([0-9A-Fa-f]{4})/g, (match, hex) => {
    const addr = parseInt(hex, 16);
    // Don't rewrite zero-page addresses — KickAssembler would optimize
    // the encoding from absolute (3 bytes) to zero page (2 bytes)
    if (addr < 0x0100) return match;
    const label = context.resolveLabel(addr);
    if (label) return label;
    return match; // keep original hex
  });
}
