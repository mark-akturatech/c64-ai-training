// ============================================================================
// KickAssembler formatting conventions
// ============================================================================

/** Standard indentation for instructions (8 spaces). */
export const INDENT = "        ";

/** Format a KickAssembler comment line. */
export function comment(text: string): string {
  return `// ${text}`;
}

/** Format a section header comment block. */
export function sectionHeader(title: string): string {
  const line = "=".repeat(60);
  return [
    `// ${line}`,
    `// ${title}`,
    `// ${line}`,
  ].join("\n");
}

/** Format an origin directive. */
export function origin(address: number, name?: string): string {
  const hex = `$${address.toString(16).toUpperCase().padStart(4, "0")}`;
  if (name) return `*=${hex} "${name}"`;
  return `*=${hex}`;
}

/** Format a label line. */
export function label(name: string): string {
  return `${name}:`;
}

/** Format an instruction line with optional inline comment. */
export function instruction(mnemonic: string, operand: string, inlineComment?: string): string {
  const inst = operand ? `${INDENT}${mnemonic} ${operand}` : `${INDENT}${mnemonic}`;
  if (inlineComment) {
    return `${inst.padEnd(40)}// ${inlineComment}`;
  }
  return inst;
}

/** Format .byte directive with hex values. */
export function byteDirective(bytes: Uint8Array, perLine: number = 16): string[] {
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += perLine) {
    const chunk = bytes.slice(i, Math.min(i + perLine, bytes.length));
    const hex = Array.from(chunk)
      .map((b) => `$${b.toString(16).toUpperCase().padStart(2, "0")}`)
      .join(", ");
    lines.push(`${INDENT}.byte ${hex}`);
  }
  return lines;
}

/** Format .fill directive. */
export function fillDirective(count: number, value: number): string {
  return `${INDENT}.fill ${count}, $${value.toString(16).toUpperCase().padStart(2, "0")}`;
}

/** Format .word directive with hex values. */
export function wordDirective(words: number[]): string {
  const hex = words
    .map((w) => `$${w.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(", ");
  return `${INDENT}.word ${hex}`;
}

/** Format .text directive. */
export function textDirective(text: string): string {
  return `${INDENT}.text "${text}"`;
}

/**
 * Emit bytes as a mix of .byte and .fill directives.
 * Runs of > 4 identical bytes become .fill; the rest is .byte rows.
 */
export function smartByteDirective(bytes: Uint8Array, perLine: number = 16): string[] {
  const MIN_FILL_RUN = 5;
  const lines: string[] = [];

  let i = 0;
  while (i < bytes.length) {
    // Check for a run of identical bytes
    const val = bytes[i];
    let runLen = 1;
    while (i + runLen < bytes.length && bytes[i + runLen] === val) runLen++;

    if (runLen >= MIN_FILL_RUN) {
      lines.push(fillDirective(runLen, val));
      i += runLen;
    } else {
      // Collect non-run bytes up to the next long run (or end)
      const start = i;
      while (i < bytes.length) {
        // Peek ahead: is there a run of >= MIN_FILL_RUN starting here?
        const v = bytes[i];
        let ahead = 1;
        while (i + ahead < bytes.length && bytes[i + ahead] === v) ahead++;
        if (ahead >= MIN_FILL_RUN) break;
        i++;
      }
      // Emit the non-run chunk as .byte rows
      const chunk = bytes.slice(start, i);
      lines.push(...byteDirective(chunk, perLine));
    }
  }

  return lines;
}

/** Format .import binary directive. */
export function importBinary(path: string): string {
  return `${INDENT}.import binary "${path}"`;
}

/** Format #import directive (source file include). */
export function importSource(path: string): string {
  return `#import "${path}"`;
}
