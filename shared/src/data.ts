// ============================================================================
// Data classification types
// ============================================================================

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

  /** Detector-specific structured data (e.g. sprite colorMode, table element count) */
  metadata?: Record<string, unknown>;
}
