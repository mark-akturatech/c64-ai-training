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
 * Falls back to hex format for unknown addresses.
 *
 * Handles both:
 * - 16-bit addresses ($XXXX): rewritten unless $00XX (ZP via absolute mode)
 * - 2-digit ZP addresses ($XX): rewritten when a label exists in the map.
 *   This is safe because KickAssembler uses ZP encoding for values < $100
 *   regardless of whether the operand is a literal or a .const label.
 *
 * Absolute references to zero-page ($00XX) are NOT rewritten because
 * KickAssembler will optimize them from absolute (3 bytes) to zero page
 * (2 bytes), causing PC drift.
 */
export function rewriteOperand(
  operand: string,
  context: BuilderContext
): string {
  // First pass: 16-bit addresses ($XXXX, exactly 4 hex digits)
  let result = operand.replace(/\$([0-9A-Fa-f]{4})/g, (match, hex) => {
    const addr = parseInt(hex, 16);
    // Don't rewrite zero-page addresses via absolute mode ($00XX)
    if (addr < 0x0100) return match;
    const label = context.resolveLabel(addr);
    if (label) return label;
    return match;
  });

  // Second pass: 2-digit ZP addresses ($XX) — only when a label exists
  // Skip immediates (#$XX) via negative lookbehind
  result = result.replace(/(?<!#)\$([0-9A-Fa-f]{2})(?=[,)\s]|$)/g, (match, hex) => {
    const addr = parseInt(hex, 16);
    const label = context.resolveLabel(addr);
    if (label) return label;
    return match;
  });

  return result;
}
