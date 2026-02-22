// ============================================================================
// Enrichment types — optional fields added by the RE pipeline
// ============================================================================

export interface BlockEnrichment {
  // Purpose & classification
  purpose?: string;             // "Initialize all 8 sprite positions from lookup table"
  category?: string;            // "graphics" | "sound" | "init" | "input" | etc.
  module?: string;              // Module assignment: "sprites" | "game" | "entry" | etc.
  certainty?: "HIGH" | "MEDIUM" | "LOW";

  // Documentation
  headerComment?: string;       // Multi-line block/subroutine header comment
  inlineComments?: Record<string, string>;  // address (hex) → comment
  sectionHeader?: string;       // Section separator: "--- Animation state ---"

  // Naming
  semanticLabels?: Record<string, string>;  // address (hex) → label name
  variableNames?: Record<string, string>;   // address (hex) → variable name

  // Data format (richer than DataCandidate for enriched data blocks)
  dataFormat?: {
    type: string;
    subtype?: string;
    elementSize?: number;
    count?: number;
    decodedValue?: string;      // e.g. decoded string content
  };

  // Structured data layout (from Stage 5 Polish — tells builder how to render data)
  dataLayout?: DataLayoutEntry[];

  // Alignment padding target: emit `.fill $XXXX - *, $00` instead of `.fill N, $00`
  alignmentTarget?: number;

  // Pointer table metadata (from Stage 1 pointer pair enrichment)
  pointerTable?: {
    role: "lo" | "hi";
    pairAddress: number;
    resolvedAddresses: number[];
    entryCount: number;
  };

  // Structured enrichment annotations from deterministic plugins
  annotations?: Array<{
    source: string;
    type: string;
    annotation: string;
    data?: Record<string, unknown>;
  }>;
}

/** Per-group rendering spec for structured data blocks */
export interface DataLayoutEntry {
  bytes: number;                   // How many bytes in this group
  comment?: string;                // Per-group inline comment
  format?: "hex" | "decimal" | "binary" | "text";
  encoding?: string;               // For text: "screencode_mixed" | "petscii_upper"
  subLabel?: string;               // Label to emit before this group
  subHeader?: string;              // Header comment before this group
}
