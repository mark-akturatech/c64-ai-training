// ============================================================================
// Types for the C64 static analysis pipeline
//
// Shared types (Block, BlockInstruction, etc.) are defined in @c64/shared
// and re-exported here so existing imports remain unchanged.
// ============================================================================

// --- Import shared types for local use ---
import type {
  AddressingMode as _AddressingMode,
  EdgeCategory as _EdgeCategory,
  LoadedRegion as _LoadedRegion,
} from "@c64/shared";

// Re-export all shared types so existing imports remain unchanged
export type {
  AddressingMode,
  AnalysisOutput,
  BasicBlock,
  Block,
  BlockEnrichment,
  BlockInstruction,
  BlockType,
  CoverageReport,
  DataCandidate,
  EdgeCategory,
  EdgeType as SharedEdgeType,
  LoadedRegion,
  Reachability,
} from "@c64/shared";

export {
  CONTROL_FLOW_EDGES,
  DATA_EDGES,
  edgeCategory,
} from "@c64/shared";

// Local aliases for use within this file
type AddressingMode = _AddressingMode;
type EdgeCategory = _EdgeCategory;
type LoadedRegion = _LoadedRegion;

// --- Step 1: Binary Loader (private to static-analysis) ---

export interface MemoryImage {
  bytes: Uint8Array;       // 65536 bytes, initialized to 0
  loaded: LoadedRegion[];  // which ranges contain actual data
  loadAddress: number;     // from PRG header or user
  endAddress: number;      // last loaded byte + 1
  parserEntryPoints?: EntryPointHint[];
  parserBankingHints?: BankingHints;
}

export interface EntryPointHint {
  address: number;
  source: string;        // e.g. "snapshot_pc", "snapshot_vector"
  description: string;
}

export interface BankingHints {
  cpuPort: number;
  basicRomVisible: boolean;
  kernalRomVisible: boolean;
  ioVisible: boolean;
  charRomVisible: boolean;
  vicBank: number;
  vicBankBase: number;
}

export interface ParsedRegion {
  address: number;
  bytes: Uint8Array;
  entryPointHints?: EntryPointHint[];
  bankingHints?: BankingHints;
  metadata?: {
    labels?: Map<number, string>;
    comments?: Map<number, string>;
    directives?: Map<number, string>;
  };
}

// --- Opcode Decoder (private to static-analysis) ---

export type FlowType =
  | "sequential"    // normal instruction, continues to next
  | "branch"        // conditional branch (BNE, BEQ, etc.)
  | "jump"          // unconditional jump (JMP)
  | "call"          // subroutine call (JSR)
  | "return"        // return (RTS, RTI)
  | "halt";         // stop execution (BRK, JAM/KIL)

export interface OpcodeInfo {
  opcode: number;
  mnemonic: string;
  addressingMode: AddressingMode;
  bytes: number;           // instruction length (1-3)
  cycles: number;
  flowType: FlowType;
  undocumented: boolean;
  readTarget: boolean;     // instruction reads from effective address
  writeTarget: boolean;    // instruction writes to effective address
}

export interface DecodedInstruction {
  address: number;
  opcode: number;
  info: OpcodeInfo;
  rawBytes: Uint8Array;    // 1-3 bytes
  operandValue?: number;   // raw operand value from bytes
  operandAddress?: number; // resolved effective address (for absolute, relative, etc.)
}

// --- Step 2: Entry Point Detection ---

export type EntryPointSource =
  | "basic_stub"
  | "irq_vector"
  | "nmi_vector"
  | "brk_vector"
  | "sid_header"
  | "user_specified"
  | "reset_vector"
  | "snapshot_pc"
  | "snapshot_vector"
  | "code_discoverer";

export type EntryPointConfidence = "high" | "medium" | "low";

export interface EntryPoint {
  address: number;
  source: EntryPointSource;
  confidence: EntryPointConfidence;
  description: string;
}

export interface BankingState {
  cpuPort: number;           // $01 value: controls ROM/RAM banking
  basicRomVisible: boolean;  // $A000-$BFFF
  kernalRomVisible: boolean; // $E000-$FFFF
  ioVisible: boolean;        // $D000-$DFFF (IO vs char ROM vs RAM)
  charRomVisible: boolean;
  vicBank: number;           // 0-3 from CIA2 $DD00 bits 0-1 (inverted)
  vicBankBase: number;       // $0000, $4000, $8000, $C000
  screenBase: number;        // from $D018 bits 4-7 + VIC bank
  charsetBase: number;       // from $D018 bits 1-3 + VIC bank
}

// --- Step 3: Dependency Tree ---

export type EdgeType =
  | "branch"          // conditional branch (BNE, BEQ, etc.)
  | "fallthrough"     // next instruction after a branch
  | "jump"            // JMP absolute
  | "indirect_jump"   // JMP ($xxxx)
  | "call"            // JSR
  | "data_read"       // LDA/LDX/LDY from address
  | "data_write"      // STA/STX/STY to address
  | "pointer_ref"     // 16-bit pointer reference (LDA #<lo / STA $FB pattern)
  | "hardware_read"   // read from $D000-$DFFF
  | "hardware_write"  // write to $D000-$DFFF
  | "smc_write";      // self-modifying code: write into code region

export interface TreeEdge {
  target: number;
  type: EdgeType;
  category?: EdgeCategory;   // "control_flow" or "data" — auto-computed from type by DependencyTree
  sourceInstruction: number;
  confidence: number;        // 0-100
  discoveredBy: string;      // plugin name
  metadata?: Record<string, unknown>;
}

export interface TreeNode {
  id: string;
  type: "code" | "data";
  start: number;
  end: number;               // exclusive
  endConfidence: number;     // 0-100
  discoveredBy: string;
  refinedBy: string[];
  instructions?: DecodedInstruction[];
  edges: TreeEdge[];
  subroutineId?: string;
  blockId?: string;          // set by block_assembler: which block this node belongs to
  metadata: Record<string, unknown>;
}

// --- ID Change Events (emitted by DependencyTree on split/merge) ---

export interface IDChangeEvent {
  type: "split" | "merge" | "remove";
  oldIds: string[];
  newIds: string[];
  mapping: Map<string, string>;  // old → new (best-effort)
}

// --- Overlap Conflict (returned by addNode on address conflicts) ---

export interface OverlapConflict {
  existingNode: TreeNode;
  newNode: TreeNode;
  overlapStart: number;
  overlapEnd: number;
}
