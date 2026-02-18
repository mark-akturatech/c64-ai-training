// ============================================================================
// Color Data Detector
// Detects color table data by tracing code edges: if code reads from a region
// and writes to Color RAM ($D800-$DBFF), the region contains color data.
// Color values are $00-$0F (16 C64 colors) but may be stored in the full
// $00-$3F range which overlaps with screen codes — this detector uses code
// context to disambiguate.
//
// Architecture: code-pattern driven. On first call, scans all code nodes for
// Color RAM write patterns and builds a cache of source data regions. Each
// subsequent call checks if the incoming region overlaps a known color source.
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";
import type { DependencyTree } from "../dependency_tree.js";

const COLOR_RAM_START = 0xd800;
const COLOR_RAM_END = 0xdc00;

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

interface ColorDataRegion {
  start: number;
  end: number;          // exclusive
  colorRamAddr: number;
  isIndexed: boolean;
}

export class ColorDataDetector implements DataDetector {
  name = "color_data";
  description = "Detects color tables by tracing code reads → Color RAM writes";

  // Cache color data regions per tree instance
  private colorRegionCache = new WeakMap<DependencyTree, ColorDataRegion[]>();

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    // Check if any byte is proven code
    for (let i = region.start; i < region.end; i++) {
      if (context.byteRole[i] === ROLE_OPCODE || context.byteRole[i] === ROLE_OPERAND) {
        return [];
      }
    }

    // Get or build the color data region cache
    const colorRegions = this.getColorDataRegions(memory, context);

    // Check if this region overlaps any color data region
    for (const colorReg of colorRegions) {
      const overlapStart = Math.max(region.start, colorReg.start);
      const overlapEnd = Math.min(region.end, colorReg.end);
      if (overlapStart >= overlapEnd) continue;

      // Verify bytes in the region are valid color values
      const regionSize = region.end - region.start;
      let colorValueCount = 0;
      for (let i = region.start; i < region.end; i++) {
        if (memory[i] <= 0x0f) colorValueCount++;
      }
      const colorRatio = colorValueCount / regionSize;
      if (colorRatio < 0.5) continue;

      // Build confidence
      let confidence = 75; // base: code trace evidence
      const evidence: string[] = [];

      if (colorRatio >= 0.9) confidence += 10;
      evidence.push(`${(colorRatio * 100).toFixed(0)}% of bytes are color values ($00-$0F)`);
      evidence.push(
        `Code reads from $${colorReg.start.toString(16).toUpperCase()} and writes to Color RAM ($${colorReg.colorRamAddr.toString(16).toUpperCase()})`
      );

      if (colorReg.isIndexed) {
        confidence += 5;
        evidence.push("Indexed access pattern (LDA addr,X → STA $D800,X)");
      }

      return [{
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "color_data",
        subtype: regionSize <= 8 ? "color_values" : "color_table",
        confidence: Math.min(confidence, 95),
        evidence,
        label: regionSize <= 8
          ? `colors_${regionSize}`
          : `color_table_${regionSize}`,
        comment: `Color data, ${regionSize} bytes (written to Color RAM)`,
      }];
    }

    return [];
  }

  private getColorDataRegions(memory: Uint8Array, context: DetectorContext): ColorDataRegion[] {
    const tree = context.tree;
    if (this.colorRegionCache.has(tree)) {
      return this.colorRegionCache.get(tree)!;
    }

    const regions = this.scanCodeForColorRamPatterns(memory, context);
    this.colorRegionCache.set(tree, regions);
    return regions;
  }

  /**
   * Scan all code nodes to find patterns where code reads from data
   * and writes to Color RAM. For each pattern, determine the data source
   * address and size (from loop analysis or byte scanning).
   */
  private scanCodeForColorRamPatterns(
    memory: Uint8Array,
    context: DetectorContext
  ): ColorDataRegion[] {
    const regions: ColorDataRegion[] = [];

    for (const [, node] of context.tree.nodes) {
      if (node.type !== "code") continue;
      if (!node.instructions) continue;

      // Collect edges
      const dataReadAddrs = new Set<number>();
      let colorRamWriteAddr = 0;

      for (const edge of node.edges) {
        if (edge.type === "data_read") {
          dataReadAddrs.add(edge.target);
        }
        if (
          (edge.type === "hardware_write" || edge.type === "data_write") &&
          edge.target >= COLOR_RAM_START &&
          edge.target < COLOR_RAM_END
        ) {
          colorRamWriteAddr = edge.target;
        }
      }

      if (dataReadAddrs.size === 0 || colorRamWriteAddr === 0) continue;

      // Analyze instructions for indexed access and loop count
      let isIndexed = false;
      let loopCount: number | null = null;
      const indexedDataAddrs = new Set<number>();

      for (const inst of node.instructions) {
        // Detect indexed LDA from data
        if (
          inst.info.mnemonic === "lda" &&
          inst.operandAddress !== undefined &&
          dataReadAddrs.has(inst.operandAddress) &&
          (inst.info.addressingMode === "absolute_x" || inst.info.addressingMode === "absolute_y")
        ) {
          isIndexed = true;
          indexedDataAddrs.add(inst.operandAddress);
        }

        // Detect loop count from CPX/CPY #imm
        if (
          (inst.info.mnemonic === "cpx" || inst.info.mnemonic === "cpy") &&
          inst.info.addressingMode === "immediate" &&
          inst.operandValue !== undefined
        ) {
          loopCount = inst.operandValue;
        }
      }

      // Only indexed access patterns are reliable evidence of data→Color RAM
      // transfer. Non-indexed data reads co-occurring with Color RAM writes
      // may be unrelated (e.g. counter variables in a Color RAM scroll loop).
      if (!isIndexed) continue;

      for (const dataAddr of indexedDataAddrs) {
        // Skip I/O and ROM ranges
        if (dataAddr >= 0xd000 && dataAddr < 0xe000) continue;
        if (dataAddr >= 0xe000) continue;

        // Determine region size
        let regionEnd: number;
        if (isIndexed && loopCount !== null && loopCount > 0) {
          regionEnd = dataAddr + loopCount;
        } else {
          // Scan forward for valid color values, stop at code or non-color byte
          regionEnd = dataAddr;
          while (
            regionEnd < memory.length &&
            memory[regionEnd] <= 0x0f &&
            context.byteRole[regionEnd] !== ROLE_OPCODE &&
            context.byteRole[regionEnd] !== ROLE_OPERAND
          ) {
            regionEnd++;
            if (regionEnd - dataAddr > 1000) break; // safety
          }
          if (regionEnd <= dataAddr) regionEnd = dataAddr + 1;
        }

        // Avoid duplicates
        if (!regions.some((r) => r.start === dataAddr && r.end === regionEnd)) {
          regions.push({
            start: dataAddr,
            end: regionEnd,
            colorRamAddr: colorRamWriteAddr,
            isIndexed,
          });
        }
      }
    }

    return regions;
  }
}
