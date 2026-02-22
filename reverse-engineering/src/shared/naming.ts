// ============================================================================
// Naming Conventions — verb-first snake_case rules for RE pipeline
//
// Converts AI-proposed names to consistent snake_case format.
// Also provides well-known constant names.
// ============================================================================

/** Well-known constants that should use symbolic names */
const KNOWN_CONSTANTS: Record<number, string> = {
  0x00: "BLACK",
  0x01: "WHITE",
  0x02: "RED",
  0x03: "CYAN",
  0x04: "PURPLE",
  0x05: "GREEN",
  0x06: "BLUE",
  0x07: "YELLOW",
  0x08: "ORANGE",
  0x09: "BROWN",
  0x0A: "LIGHT_RED",
  0x0B: "DARK_GREY",
  0x0C: "GREY",
  0x0D: "LIGHT_GREEN",
  0x0E: "LIGHT_BLUE",
  0x0F: "LIGHT_GREY",
  40: "SCREEN_WIDTH",
  25: "SCREEN_HEIGHT",
  0x20: "SPACE_CHAR",
};

/**
 * Convert a name to snake_case.
 * "borderColor" → "border_color"
 * "SPRITE_X_POS" → "sprite_x_pos"
 * "update loop counter" → "update_loop_counter"
 */
export function toSnakeCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")  // camelCase → camel_Case
    .replace(/[\s-]+/g, "_")                   // spaces/hyphens → underscores
    .replace(/_+/g, "_")                        // collapse multiple underscores
    .toLowerCase()
    .replace(/^_|_$/g, "");                     // trim leading/trailing
}

/**
 * Get a well-known constant name, or null if not a known constant.
 */
export function getConstantName(value: number): string | null {
  return KNOWN_CONSTANTS[value] ?? null;
}

/**
 * Check if a proposed variable name is acceptable (not a reserved word, etc.)
 */
export function isValidVariableName(name: string): boolean {
  if (!name || name.length === 0) return false;
  if (/^\d/.test(name)) return false; // Can't start with digit
  if (name.length > 40) return false; // Too long
  return /^[a-z][a-z0-9_]*$/.test(name);
}

/**
 * Sanitize a name to be a valid identifier.
 */
export function sanitizeName(name: string): string {
  let clean = toSnakeCase(name);
  if (/^\d/.test(clean)) clean = "var_" + clean;
  clean = clean.replace(/[^a-z0-9_]/g, "");
  if (!clean) clean = "unnamed";
  return clean;
}
