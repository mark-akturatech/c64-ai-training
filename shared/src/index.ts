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

export type { BlockEnrichment, DataLayoutEntry } from "./enrichment.js";

export type {
  AnalysisOutput,
  CoverageReport,
  LoadedRegion,
} from "./analysis.js";

export {
  CONTROL_FLOW_EDGES,
  DATA_EDGES,
  edgeCategory,
} from "./edge_categories.js";

export type {
  EdgeType,
  EdgeCategory,
} from "./edge_categories.js";
