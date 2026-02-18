// ============================================================================
// Analysis output types — the blocks.json schema
// ============================================================================

import type { Block, BlockType } from "./block.js";

export interface LoadedRegion {
  start: number;
  end: number;             // exclusive
  source: string;          // plugin name or filename
}

export interface CoverageReport {
  loadedRegions: LoadedRegion[];
  classified: {
    code: { bytes: number; pct: number };
    data: { bytes: number; pct: number };
    unknown: { bytes: number; pct: number };
  };
  gaps: Array<{ start: number; end: number }>;
  conflicts: Array<{ address: number; block1: string; block2: string }>;
}

export interface AnalysisOutput {
  metadata: {
    source: string;
    loadAddress: string;
    endAddress: string;
    entryPoints: string[];
    totalBytesLoaded: number;
    totalBlocks: number;
    blockCounts: Record<BlockType, number>;
  };
  coverage: {
    loadedRegions: Array<{ start: string; end: string }>;
    classified: {
      code: { bytes: number; pct: number };
      data: { bytes: number; pct: number };
      unknown: { bytes: number; pct: number };
    };
    gaps: Array<{ start: string; end: string }>;
  };
  blocks: Block[];
}
