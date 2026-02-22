// ============================================================================
// Label Resolver — build global label map from all blocks
// ============================================================================

import type { Block } from "@c64/shared";

/**
 * Build a global label map: address → label name.
 * Priority: enrichment semanticLabels > block labels > auto-generated labels.
 *
 * Uses two passes: first sets low-priority labels (auto, block, entry, instruction),
 * then applies semantic labels (highest priority) so they always win.
 */
export function buildLabelMap(blocks: Block[]): Map<number, string> {
  const labels = new Map<number, string>();

  // ── Pass 1: Low-priority labels (auto, block, entry, instruction) ──
  for (const block of blocks) {
    // Auto-generated label from block type + address (lowest priority)
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
  }

  // Add labels for code-referenced instruction addresses (branch/JMP/JSR targets)
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

  // ── Pass 2: Semantic labels (highest priority — override everything) ──
  for (const block of blocks) {
    if (block.enrichment?.semanticLabels) {
      for (const [addrHex, name] of Object.entries(block.enrichment.semanticLabels)) {
        const addr = parseInt(addrHex, 16);
        labels.set(addr, name);
      }
    }
  }

  // ── Pass 3: Zero-page pointer labels ──
  // Detect ZP addresses used in indirect addressing ($XX),Y or ($XX,X)
  // and add them to the label map so operands use labels instead of raw hex
  detectZpPointers(blocks, labels);

  // ── Pass 4: Data layout sub-labels ──
  // Add sub-labels from enrichment.dataLayout so pointer tables can resolve them
  addDataLayoutSubLabels(blocks, labels);

  // ── Pass 5: Deduplicate ──
  // Ensure no two addresses share the same label name (would break pointer tables)
  deduplicateLabels(labels);

  return labels;
}

/**
 * Detect zero-page addresses used as indirect pointers and add them to the label map.
 * Scans for ($XX),Y and ($XX,X) addressing modes and uses variableNames for naming.
 */
function detectZpPointers(blocks: Block[], labels: Map<number, string>): void {
  for (const block of blocks) {
    if (!block.instructions) continue;
    for (const inst of block.instructions) {
      if (inst.addressingMode !== "indirect_y" && inst.addressingMode !== "indirect_x") continue;
      const m = inst.operand.match(/\$([0-9A-Fa-f]{2})/);
      if (!m) continue;
      const addr = parseInt(m[1], 16);
      if (labels.has(addr)) continue;

      // Find a variable name from any block's enrichment
      const addrHex4 = addr.toString(16).toUpperCase().padStart(4, "0");
      const addrHex2 = m[1].toUpperCase();
      let name: string | null = null;
      for (const b of blocks) {
        const varName = b.enrichment?.variableNames?.[addrHex4]
          ?? b.enrichment?.variableNames?.[addrHex2];
        if (varName) { name = varName; break; }
      }

      // Use found name (strip _lo/_hi suffix for cleaner .const)
      // or auto-generate from hex address
      if (name) {
        const baseName = name.replace(/_lo$/, "").replace(/_hi$/, "");
        labels.set(addr, baseName);
      } else {
        labels.set(addr, `zp_ptr_${m[1].toLowerCase()}`);
      }

      // Also add label for the high byte (addr+1) — ZP pointers are 16-bit pairs
      const hiAddr = addr + 1;
      if (!labels.has(hiAddr)) {
        const loLabel = labels.get(addr)!;
        labels.set(hiAddr, `${loLabel}_hi`);
      }
    }
  }
}

/** Add sub-labels from dataLayout entries to the global label map. */
function addDataLayoutSubLabels(blocks: Block[], labels: Map<number, string>): void {
  for (const block of blocks) {
    if (!block.enrichment?.dataLayout) continue;
    // Skip padding/fill blocks — their AI-generated sub-labels are noise
    if (block.candidates && block.bestCandidate !== undefined) {
      const best = block.candidates[block.bestCandidate];
      if (best?.type === "padding" || best?.type === "fill") continue;
    }
    let offset = 0;
    for (const entry of block.enrichment.dataLayout) {
      if (entry.subLabel) {
        const addr = block.address + offset;
        // Don't overwrite existing labels (semantic labels have priority)
        if (!labels.has(addr)) {
          labels.set(addr, entry.subLabel);
        }
      }
      offset += entry.bytes;
    }
  }
}

/**
 * Ensure no two different addresses share the same label name.
 * When duplicates are found, append _XXXX hex address suffix to disambiguate.
 * This prevents KickAssembler from silently resolving pointer tables to the wrong address.
 */
function deduplicateLabels(labels: Map<number, string>): void {
  // Build reverse map: name → [addresses]
  const nameToAddrs = new Map<string, number[]>();
  for (const [addr, name] of labels) {
    const existing = nameToAddrs.get(name);
    if (existing) { existing.push(addr); }
    else { nameToAddrs.set(name, [addr]); }
  }

  // Fix duplicates
  for (const [name, addrs] of nameToAddrs) {
    if (addrs.length <= 1) continue;
    // Sort by address, keep first as-is, rename the rest
    addrs.sort((a, b) => a - b);
    for (let i = 1; i < addrs.length; i++) {
      const suffix = addrs[i].toString(16).toLowerCase().padStart(4, "0");
      labels.set(addrs[i], `${name}_${suffix}`);
    }
  }
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
