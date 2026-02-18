// ============================================================================
// Core block types — shared between static-analysis, builder, and verify
// ============================================================================

import type { DataCandidate } from "./data.js";
import type { BlockEnrichment } from "./enrichment.js";

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

  /** Base64-encoded raw bytes for this block's address range */
  raw?: string;

  /** Mark block as junk — builder skips, verify ignores.
   *  Set by static analysis (padding detector) or RE pipeline enrichment. */
  junk?: boolean;

  /** Optional enrichment from RE pipeline */
  enrichment?: BlockEnrichment;
}
