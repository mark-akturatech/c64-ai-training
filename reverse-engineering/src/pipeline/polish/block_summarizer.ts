// ============================================================================
// Block Summarizer — compact & full block representations for AI prompts
// ============================================================================

import type { Block } from "@c64/shared";

/**
 * Compact summary (~40 tokens): address, type, label, purpose snippet, size, refs.
 * Used for whole-program overviews where every block must fit in context.
 */
export function compactSummary(
  block: Block,
  dataRefs?: number[],
  accessedBy?: Array<{ address: number; via: string }>,
): string {
  const addr = `$${hex(block.address)}`;
  const type = block.type.slice(0, 4).padEnd(4);
  const size = block.endAddress - block.address;
  const label = primaryLabel(block) ?? "";

  const parts = [addr, type, label.padEnd(28)];

  // Size for data blocks
  if (block.type === "data" || block.type === "unknown") {
    parts.push(`${size}B`);
  }

  // Purpose snippet (first 50 chars)
  const purpose = block.enrichment?.purpose;
  if (purpose) {
    const snippet = purpose.length > 50 ? purpose.slice(0, 47) + "..." : purpose;
    parts.push(`"${snippet}"`);
  }

  // Decode screen text for small data blocks (40 bytes = screen row)
  if ((block.type === "data" || block.type === "unknown") && block.raw && size <= 80) {
    const decoded = tryDecodeScreenText(block.raw);
    if (decoded) {
      parts.push(`text: "${decoded}"`);
    }
  }

  // Data references from code blocks
  if (dataRefs && dataRefs.length > 0) {
    const refStrs = dataRefs.slice(0, 6).map(r => `$${hex(r)}`);
    parts.push(`refs:[${refStrs.join(",")}]`);
  }

  // Who accesses this data block
  if (accessedBy && accessedBy.length > 0) {
    const accStrs = accessedBy.slice(0, 3).map(a => `$${hex(a.address)} ${a.via}`);
    parts.push(`accessed by: ${accStrs.join("; ")}`);
  }

  return parts.join("  ");
}

/**
 * Full detail for code blocks (~400 tokens): instructions with current comments.
 */
export function fullCodeSummary(block: Block): string {
  const lines: string[] = [];
  const addr = `$${hex(block.address)}`;
  const label = primaryLabel(block) ?? `unk_${hex(block.address)}`;
  const purpose = block.enrichment?.purpose ?? "(no purpose)";

  lines.push(`Block ${addr} (${label}) — ${block.type}, module: ${block.enrichment?.module ?? "?"}`);
  lines.push(`  Purpose: ${purpose}`);

  if (block.enrichment?.headerComment) {
    lines.push(`  Header: ${block.enrichment.headerComment.split("\n")[0]}`);
  }

  if (block.instructions) {
    lines.push("  Instructions:");
    for (const inst of block.instructions) {
      const iAddr = hex(inst.address);
      const mnemonic = inst.mnemonic.toLowerCase();
      const operand = inst.operand ?? "";
      const comment = block.enrichment?.inlineComments?.[iAddr.toUpperCase()] ?? "";
      const commentStr = comment ? `  → "${comment}"` : "";
      lines.push(`    $${iAddr}: ${mnemonic} ${operand}${commentStr}`);
    }
  }

  return lines.join("\n");
}

/**
 * Full detail for data blocks: raw hex + access context.
 */
export function fullDataSummary(
  block: Block,
  accessedBy?: Array<{ address: number; purpose: string; via: string }>,
): string {
  const lines: string[] = [];
  const addr = `$${hex(block.address)}`;
  const size = block.endAddress - block.address;
  const label = primaryLabel(block) ?? `unk_${hex(block.address)}`;

  lines.push(`Block ${addr} (${label}) — ${block.type}, ${size} bytes`);

  if (block.enrichment?.purpose) {
    lines.push(`  Purpose: ${block.enrichment.purpose}`);
  }

  // Show how code accesses this data
  if (accessedBy && accessedBy.length > 0) {
    lines.push("  Accessed by:");
    for (const a of accessedBy) {
      lines.push(`    $${hex(a.address)} (${a.purpose}): ${a.via}`);
    }
  }

  // Raw hex dump (first 128 bytes)
  if (block.raw) {
    const bytes = Buffer.from(block.raw, "base64");
    const maxBytes = Math.min(bytes.length, 128);
    lines.push("  Raw hex:");
    for (let i = 0; i < maxBytes; i += 16) {
      const chunk = bytes.slice(i, Math.min(i + 16, maxBytes));
      const hexStr = Array.from(chunk).map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
      lines.push(`    +${i.toString(16).padStart(2, "0").toUpperCase()}: ${hexStr}`);
    }
    if (bytes.length > 128) {
      lines.push(`    ... (${bytes.length - 128} more bytes)`);
    }
  }

  return lines.join("\n");
}

/** Get the primary semantic label for a block */
function primaryLabel(block: Block): string | null {
  const addrHex = block.address.toString(16).toUpperCase().padStart(4, "0");
  return block.enrichment?.semanticLabels?.[addrHex] ?? null;
}

function hex(n: number): string {
  return n.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Try to decode base64 raw data as C64 screen codes (mixed case).
 * Returns decoded string if >60% of bytes are printable, null otherwise.
 */
function tryDecodeScreenText(raw: string): string | null {
  const bytes = Buffer.from(raw, "base64");
  let text = "";
  let printable = 0;
  for (const b of bytes) {
    const ch = screenCodeToChar(b);
    text += ch;
    if (ch !== "\uFFFD") printable++;
  }
  if (printable / bytes.length < 0.6) return null;
  return text.replace(/\uFFFD/g, "?").trim();
}

function screenCodeToChar(b: number): string {
  if (b === 0x20) return " ";
  if (b >= 0x01 && b <= 0x1A) return String.fromCharCode(b + 0x60); // a-z
  if (b >= 0x41 && b <= 0x5A) return String.fromCharCode(b);         // A-Z
  if (b === 0x00) return "@";
  if (b >= 0x21 && b <= 0x3F) return String.fromCharCode(b);         // !-?
  return "\uFFFD";
}
