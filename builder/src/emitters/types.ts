// ============================================================================
// Emitter plugin interface
// ============================================================================

import type { AnalysisOutput, Block } from "@c64/shared";

export interface BinaryAsset {
  filename: string;
  data: Uint8Array;
}

export interface EmittedBlock {
  lines: string[];              // KickAssembler source lines
  skipOrigin?: boolean;         // Don't emit origin directive (e.g. BasicUpstart2 sets its own)
  consumedEndAddress?: number;  // Skip subsequent blocks up to this address (e.g. BasicUpstart2 padding)
  module?: string;              // For multi-file: which module file
  segment?: string;             // Segment directive
  assets?: BinaryAsset[];       // Files to extract to assets/
  imports?: string[];           // #import directives needed
}

export interface BuilderContext {
  allBlocks: readonly Block[];
  labelMap: ReadonlyMap<number, string>;
  metadata: AnalysisOutput["metadata"];
  memory?: Uint8Array;
  loadAddress: number;
  endAddress: number;
  includeJunk: boolean;
  resolveLabel(address: number): string | null;
  getBytes(start: number, length: number): Uint8Array | null;
  formatHex(value: number, width?: number): string;
}

export interface EmitterPlugin {
  name: string;
  description: string;
  priority: number;
  handles(block: Block, context: BuilderContext): boolean;
  emit(block: Block, context: BuilderContext): EmittedBlock;
}
