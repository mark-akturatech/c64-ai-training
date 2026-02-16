// ============================================================================
// Shared types for the C64 static analysis pipeline
// ============================================================================

// --- Step 1: Binary Loader ---

export interface MemoryImage {
  bytes: Uint8Array;       // 65536 bytes, initialized to 0
  loaded: LoadedRegion[];  // which ranges contain actual data
  loadAddress: number;     // from PRG header or user
  endAddress: number;      // last loaded byte + 1
  parserEntryPoints?: EntryPointHint[];
  parserBankingHints?: BankingHints;
}

export interface LoadedRegion {
  start: number;
  end: number;             // exclusive
  source: string;          // plugin name or filename
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

// --- Opcode Decoder ---

export type AddressingMode =
  | "implied"
  | "accumulator"
  | "immediate"
  | "zero_page"
  | "zero_page_x"
  | "zero_page_y"
  | "absolute"
  | "absolute_x"
  | "absolute_y"
  | "indirect"
  | "indirect_x"
  | "indirect_y"
  | "relative";

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
  | "snapshot_vector";

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
  metadata: Record<string, unknown>;
}

// --- Step 4: Data Classifier ---

export interface DataCandidate {
  start: number;
  end: number;              // exclusive
  detector: string;
  type: string;
  subtype?: string;
  confidence: number;       // 0-100
  evidence: string[];
  label?: string;
  comment: string;
}

// --- Steps 5 & 6: Block Assembly & Enrichment ---

export type BlockType =
  | "subroutine"
  | "irq_handler"
  | "fragment"
  | "data"
  | "unknown";

export type Reachability = "proven" | "indirect" | "unproven";

export interface BasicBlock {
  start: number;
  end: number;              // exclusive
  successors: number[];
}

export interface BlockInstruction {
  address: number;
  rawBytes: string;         // hex string e.g. "A9 00"
  mnemonic: string;
  operand: string;
  addressingMode: AddressingMode;
  label: string | null;
}

export interface Block {
  id: string;
  address: number;
  endAddress: number;       // exclusive
  type: BlockType;
  reachability: Reachability;
  instructions?: BlockInstruction[];
  basicBlocks?: BasicBlock[];
  callsOut?: number[];
  calledBy?: number[];
  loopBackEdges?: Array<{ from: number; to: number }>;
  hardwareRefs?: number[];
  dataRefs?: number[];
  smcTargets?: number[];
  isIrqHandler?: boolean;
  entryPoints?: number[];
  inputNameHint?: string;
  candidates?: DataCandidate[];
  bestCandidate?: number;
  parentBlock?: string | null;
  subBlockIndex?: number | null;
  subBlockCount?: number | null;
  siblings?: string[] | null;
  siblingSummaries?: Record<string, string> | null;
  annotations?: Record<string, string>;
  comments?: string[];
  labels?: string[];
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
