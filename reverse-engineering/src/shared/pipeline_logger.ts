// ============================================================================
// Pipeline Logger — structured output with optional verbose mode
//
// Default mode: stage summaries only
// Verbose mode: per-plugin, per-block detail
// ============================================================================

export class PipelineLogger {
  private verbose: boolean;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  get isVerbose(): boolean {
    return this.verbose;
  }

  /** Stage header: "=== Stage 1: Static Enrichment ===" */
  stage(name: string): void {
    process.stderr.write(`\n=== ${name} ===\n`);
  }

  /** Plugin name during processing (verbose only) */
  plugin(name: string): void {
    if (this.verbose) {
      process.stderr.write(`    [${name}] `);
    }
  }

  /** Plugin result stats (verbose only) */
  pluginResult(name: string, stats: Record<string, number>): void {
    if (this.verbose) {
      const parts = Object.entries(stats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${k}`);
      process.stderr.write(`${parts.join(", ") || "no changes"}\n`);
    }
  }

  /** Block being processed: "[1/12] $080E purpose_analysis" */
  block(index: number, total: number, address: number, detail?: string): void {
    const addr = address.toString(16).toUpperCase().padStart(4, "0");
    if (this.verbose) {
      const d = detail ? ` ${detail}` : "";
      process.stderr.write(`  [${index}/${total}] $${addr}${d}\n`);
    } else {
      process.stderr.write(`\r  Block ${index}/${total}: $${addr}  `);
    }
  }

  /** General info line */
  info(msg: string): void {
    process.stderr.write(`  ${msg}\n`);
  }

  /** Detail line (verbose only) */
  detail(msg: string): void {
    if (this.verbose) {
      process.stderr.write(`    ${msg}\n`);
    }
  }

  /** Warning */
  warn(msg: string): void {
    process.stderr.write(`  WARNING: ${msg}\n`);
  }

  /** Summary stats: "  Enrichments: 144, Banking: 31, Edges: 66" */
  summary(stats: Record<string, number | string>): void {
    for (const [key, val] of Object.entries(stats)) {
      process.stderr.write(`  ${key}: ${val}\n`);
    }
  }

  /** Pass detail for fixpoint loops */
  pass(n: number, stats?: Record<string, number>): void {
    if (this.verbose && stats) {
      const parts = Object.entries(stats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${k}`);
      process.stderr.write(`  Pass ${n}: ${parts.join(", ") || "no changes"}\n`);
    }
  }

  /** Clear inline progress (newline after \r-style output) */
  clearProgress(): void {
    if (!this.verbose) {
      process.stderr.write("\n");
    }
  }
}
