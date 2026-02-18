// ============================================================================
// Label Resolver — build global label map from all blocks
// ============================================================================

import type { Block } from "@c64/shared";

/**
 * Build a global label map: address → label name.
 * Priority: enrichment semanticLabels > block labels > auto-generated labels.
 */
export function buildLabelMap(blocks: Block[]): Map<number, string> {
  const labels = new Map<number, string>();

  for (const block of blocks) {
    // Auto-generated label from block type + address (always unique)
    const addrHex = block.address.toString(16).toUpperCase().padStart(4, "0");
    const prefix = block.type === "subroutine" ? "sub"
      : block.type === "irq_handler" ? "irq"
      : block.type === "fragment" ? "frag"
      : block.type === "data" ? "dat"
      : "unk";
    labels.set(block.address, `${prefix}_${addrHex}`);

    // Block-level labels from static analysis
    if (block.labels) {
      for (const label of block.labels) {
        // Labels are stored as strings like "label_XXXX" — parse address from block context
        labels.set(block.address, label);
      }
    }

    // Entry points for code blocks
    if (block.entryPoints) {
      for (const ep of block.entryPoints) {
        if (!labels.has(ep)) {
          labels.set(ep, block.id);
        }
      }
    }

    // Instruction-level labels
    if (block.instructions) {
      for (const inst of block.instructions) {
        if (inst.label && !labels.has(inst.address)) {
          labels.set(inst.address, inst.label);
        }
      }
    }

    // Enrichment semantic labels (highest priority — override everything)
    if (block.enrichment?.semanticLabels) {
      for (const [addrHex, name] of Object.entries(block.enrichment.semanticLabels)) {
        const addr = parseInt(addrHex, 16);
        labels.set(addr, name);
      }
    }
  }

  // Second pass: add labels for addresses referenced by code instructions
  // (branch targets, JMP/JSR targets that land mid-block, etc.)
  // Only add if the address is an actual instruction start within a code block.
  const instructionAddrs = buildInstructionSet(blocks);

  for (const block of blocks) {
    if (!block.instructions) continue;
    for (const inst of block.instructions) {
      if (!inst.operand) continue;
      const matches = inst.operand.matchAll(/\$([0-9A-Fa-f]{4})/g);
      for (const match of matches) {
        const targetAddr = parseInt(match[1], 16);
        if (!labels.has(targetAddr) && instructionAddrs.has(targetAddr)) {
          labels.set(targetAddr, `addr_${match[1].toUpperCase()}`);
        }
      }
    }
  }

  return labels;
}

/** Build a set of all instruction start addresses across all code blocks. */
function buildInstructionSet(blocks: Block[]): Set<number> {
  const addrs = new Set<number>();
  for (const block of blocks) {
    if (!block.instructions) continue;
    for (const inst of block.instructions) {
      addrs.add(inst.address);
    }
  }
  return addrs;
}
