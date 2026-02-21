// ============================================================================
// Edge Category Classification — shared between static-analysis and RE pipeline
//
// Every edge in the dependency graph carries a `category` field:
// "control_flow" or "data". This classification is critical for SCC
// decomposition and analysis scheduling — only control-flow edges participate
// in scheduling and cycle detection.
// ============================================================================

/** All edge types in the dependency graph */
export type EdgeType =
  | "branch"          // conditional branch (BNE, BEQ, etc.)
  | "fallthrough"     // next instruction after a branch
  | "jump"            // JMP absolute
  | "indirect_jump"   // JMP ($xxxx)
  | "call"            // JSR
  | "rts_dispatch"    // RTS used as computed jump (push addr, RTS)
  | "data_read"       // LDA/LDX/LDY from address
  | "data_write"      // STA/STX/STY to address
  | "pointer_ref"     // 16-bit pointer reference (LDA #<lo / STA $FB pattern)
  | "hardware_read"   // read from $D000-$DFFF
  | "hardware_write"  // write to $D000-$DFFF
  | "smc_write"       // self-modifying code: write into code region
  | "vector_write";   // write to IRQ/NMI vector

export type EdgeCategory = "control_flow" | "data";

/** Edges that affect control flow — used for SCC decomposition and analysis scheduling */
export const CONTROL_FLOW_EDGES: EdgeType[] = [
  "branch", "fallthrough", "jump", "indirect_jump", "call", "rts_dispatch",
];

/** Edges that represent data dependencies — do NOT block analysis scheduling */
export const DATA_EDGES: EdgeType[] = [
  "data_read", "data_write", "pointer_ref", "hardware_read", "hardware_write",
  "smc_write", "vector_write",
];

export function edgeCategory(type: EdgeType): EdgeCategory {
  if ((CONTROL_FLOW_EDGES as string[]).includes(type)) return "control_flow";
  return "data";
}
