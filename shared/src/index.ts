// ============================================================================
// @c64/shared — re-export all shared types
// ============================================================================

export type {
  AddressingMode,
  BasicBlock,
  Block,
  BlockInstruction,
  BlockType,
  Reachability,
} from "./block.js";

export type { DataCandidate } from "./data.js";

export type { BlockEnrichment } from "./enrichment.js";

export type {
  AnalysisOutput,
  CoverageReport,
  LoadedRegion,
} from "./analysis.js";
