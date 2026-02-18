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

  // Structured enrichment annotations from deterministic plugins
  annotations?: Array<{
    source: string;
    type: string;
    annotation: string;
    data?: Record<string, unknown>;
  }>;
}
