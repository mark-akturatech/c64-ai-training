// ============================================================================
// Pointer Table Emitter — lo/hi byte pointer tables → <label, >label syntax
//
// Matches blocks with either:
// 1. enrichment.pointerTable (from Stage 1 pointer pair detection)
// 2. enrichment.dataFormat.type === "pointer_table_lo"/"pointer_table_hi"
//    (from Stage 5 AI identification)
// 3. enrichment.dataFormat.subtype === "low_bytes"/"high_bytes"
//    (e.g., raster_params or IRQ vector tables)
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

export class PointerTableEmitter implements EmitterPlugin {
  name = "pointer_table";
  description = "Emit lo/hi pointer table entries using <label/>label syntax";
  priority = 22; // Between sprite (20) and lookup_table (25)

  handles(block: Block): boolean {
    if (block.enrichment?.pointerTable != null) return true;
    const dfType = block.enrichment?.dataFormat?.type ?? "";
    const dfSub = block.enrichment?.dataFormat?.subtype ?? "";
    // Direct pointer table type
    if (dfType === "pointer_table_lo" || dfType === "pointer_table_hi") return true;
    // Subtype indicates lo/hi bytes (e.g., raster_params with "low_bytes"/"high_bytes")
    if (dfSub === "low_bytes" || dfSub === "high_bytes") return true;
    return false;
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    // If no pointerTable enrichment, use dataFormat-based resolution
    if (!block.enrichment?.pointerTable) {
      return this.emitFromDataFormat(block, context);
    }

    const lines: string[] = [];
    const pt = block.enrichment!.pointerTable as {
      role: "lo" | "hi";
      pairAddress: number;
      resolvedAddresses: number[];
      entryCount: number;
    };
    const bytes = this.getBlockBytes(block, context);

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    const prefix = pt.role === "lo" ? "<" : ">";

    if (!bytes) {
      const size = block.endAddress - block.address;
      lines.push(ka.fillDirective(size, 0));
      return { lines };
    }

    // Emit each byte as <label or >label (or raw hex fallback)
    const entries: string[] = [];
    for (let i = 0; i < bytes.length; i++) {
      const targetAddr = pt.resolvedAddresses?.[i];
      if (targetAddr != null) {
        const targetLabel = context.resolveLabel(targetAddr);
        if (targetLabel) {
          entries.push(`${prefix}${targetLabel}`);
          continue;
        }
      }
      entries.push(`$${bytes[i].toString(16).toUpperCase().padStart(2, "0")}`);
    }

    // Emit in groups of 8
    for (let i = 0; i < entries.length; i += 8) {
      const chunk = entries.slice(i, i + 8);
      lines.push(`${ka.INDENT}.byte ${chunk.join(", ")}`);
    }

    return { lines };
  }

  /** Emit pointer table using dataFormat to determine role, resolving via paired block */
  private emitFromDataFormat(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const dfType = block.enrichment?.dataFormat?.type ?? "";
    const dfSub = block.enrichment?.dataFormat?.subtype ?? "";

    // Determine role from type or subtype
    const role: "lo" | "hi" =
      (dfType.includes("_lo") || dfSub.includes("low")) ? "lo" : "hi";
    const prefix = role === "lo" ? "<" : ">";

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    // Find the paired lo/hi table
    const pairBlock = this.findPairBlock(block, context, dfType, dfSub, role);

    // Use the longer table's size — handles mismatched splits (e.g. hi=1 byte, lo=2 bytes)
    const blockSize = block.endAddress - block.address;
    const pairSize = pairBlock ? (pairBlock.endAddress - pairBlock.address) : 0;
    const tableSize = Math.max(blockSize, pairSize);

    // Read bytes — context.getBytes spans block boundaries for extended reads
    const bytes = context.getBytes(block.address, tableSize);
    const pairBytes = pairBlock ? context.getBytes(pairBlock.address, tableSize) : null;

    if (!bytes) {
      lines.push(ka.fillDirective(blockSize, 0));
      return { lines };
    }

    const entries: string[] = [];
    for (let i = 0; i < bytes.length; i++) {
      let resolved = false;
      if (pairBytes && i < pairBytes.length) {
        const lo = role === "lo" ? bytes[i] : pairBytes[i];
        const hi = role === "hi" ? bytes[i] : pairBytes[i];
        const addr = (hi << 8) | lo;
        const targetLabel = context.resolveLabel(addr);
        if (targetLabel) {
          entries.push(`${prefix}${targetLabel}`);
          resolved = true;
        }
      }
      if (!resolved) {
        entries.push(`$${bytes[i].toString(16).toUpperCase().padStart(2, "0")}`);
      }
    }

    lines.push(`${ka.INDENT}.byte ${entries.join(", ")}`);

    // If we extended beyond the block boundary, signal consumed end address
    // so subsequent blocks don't re-emit those bytes
    const consumedEnd = block.address + tableSize;
    if (consumedEnd > block.endAddress) {
      return { lines, consumedEndAddress: consumedEnd };
    }
    return { lines };
  }

  /** Find the paired lo/hi block for pointer table resolution.
   *  When multiple candidates exist, pick the one nearest by address. */
  private findPairBlock(
    block: Block,
    context: BuilderContext,
    dfType: string,
    dfSub: string,
    role: "lo" | "hi",
  ): Block | undefined {
    // For pointer_table_lo/pointer_table_hi — find the nearest opposite type
    if (dfType.startsWith("pointer_table_")) {
      const pairType = role === "lo" ? "pointer_table_hi" : "pointer_table_lo";
      return this.findNearest(block, context.allBlocks, b => {
        const dt = b.enrichment?.dataFormat?.type ?? "";
        return dt === pairType;
      });
    }

    // For subtype-based (e.g., raster_params with low_bytes/high_bytes)
    // Find nearest same type with opposite subtype
    const pairSub = role === "lo" ? "high_bytes" : "low_bytes";
    return this.findNearest(block, context.allBlocks, b => {
      const dt = b.enrichment?.dataFormat?.type ?? "";
      const ds = b.enrichment?.dataFormat?.subtype ?? "";
      return dt === dfType && ds === pairSub;
    });
  }

  /** Find the nearest block matching a predicate, by address distance. */
  private findNearest(
    block: Block,
    allBlocks: readonly Block[],
    predicate: (b: Block) => boolean,
  ): Block | undefined {
    let best: Block | undefined;
    let bestDist = Infinity;
    for (const b of allBlocks) {
      if (b.address === block.address) continue;
      if (!predicate(b)) continue;
      const dist = Math.abs(b.address - block.address);
      if (dist < bestDist) {
        bestDist = dist;
        best = b;
      }
    }
    return best;
  }

  private getBlockBytes(block: Block, context: BuilderContext): Uint8Array | null {
    if (block.raw) {
      return decodeRaw(block.raw);
    }
    return context.getBytes(block.address, block.endAddress - block.address);
  }
}
