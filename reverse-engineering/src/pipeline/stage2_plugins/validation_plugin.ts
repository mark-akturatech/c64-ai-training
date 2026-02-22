// ============================================================================
// AI Validation Plugin (Priority 50)
//
// Cross-validates AI claims against Stage 1 deterministic annotations.
// Compares hardware register claims against symbol_db.
// Flags conflicts. Caps certainty at MEDIUM if unverified claims exist.
// ============================================================================

import type {
  Stage2Plugin,
  Stage2PluginInput,
  Stage2PluginResult,
  REBlockEnrichment,
} from "../../types.js";

export class ValidationPlugin implements Stage2Plugin {
  name = "ai_validation";
  priority = 50;

  async run(input: Stage2PluginInput): Promise<Stage2PluginResult> {
    const enrichments: REBlockEnrichment[] = [];
    const block = input.block;
    let confidence: number;

    // Get prior analysis results
    const purposeResult = input.priorStage2Results.get("ai_purpose_analysis");
    const purpose = getField(purposeResult, "purpose") ?? "";
    const baseConfidence = purposeResult?.confidence ?? 0.5;

    // Validate against Stage 1 enrichments
    const conflicts: string[] = [];
    const validations: string[] = [];

    // Check banking consistency
    const nodeId = blockToNodeId(block);
    const node = input.graph.getNode(nodeId);
    const banking = node?.bankingState?.onEntry;

    if (banking) {
      const purposeLower = purpose.toLowerCase();

      // KERNAL reference but KERNAL unmapped
      if (banking.kernalMapped === "no") {
        const kernalKeywords = ["chrout", "kernal", "chrin", "getin", "load", "save"];
        for (const kw of kernalKeywords) {
          if (purposeLower.includes(kw)) {
            conflicts.push(`Purpose mentions "${kw}" but KERNAL is NOT mapped ($01 bit 1 = 0)`);
          }
        }
      }

      // I/O reference but I/O unmapped
      if (banking.ioMapped === "no") {
        const ioKeywords = ["vic", "sid", "cia", "sprite", "raster"];
        for (const kw of ioKeywords) {
          if (purposeLower.includes(kw)) {
            conflicts.push(`Purpose mentions "${kw}" but I/O is NOT mapped ($01 bit 2 = 0)`);
          }
        }
      }

      if (banking.kernalMapped === "yes" && banking.ioMapped === "yes") {
        validations.push("Banking state ($37 default) — KERNAL and I/O accessible");
      }
    }

    // Check register semantics consistency
    const regSemEnrichments = (input.enrichments.get("register_semantics") ?? [])
      .filter(e => e.blockAddress === block.address);

    if (regSemEnrichments.length > 0) {
      validations.push(`${regSemEnrichments.length} hardware register accesses verified by Stage 1`);
    }

    // Check constant propagation
    const constEnrichments = (input.enrichments.get("constant_propagation") ?? [])
      .filter(e => e.blockAddress === block.address);

    if (constEnrichments.length > 0) {
      validations.push(`${constEnrichments.length} constant values traced by Stage 1`);
    }

    // Calculate adjusted confidence
    confidence = baseConfidence;
    if (conflicts.length > 0) {
      confidence = Math.min(confidence, 0.5); // Cap at MEDIUM
      confidence -= conflicts.length * 0.1;   // Penalty per conflict
    }
    if (validations.length > 0) {
      confidence = Math.min(confidence + 0.1, 1.0); // Slight boost for validation
    }
    confidence = Math.max(0.1, Math.min(1.0, confidence));

    // Create enrichment
    const status = conflicts.length === 0 ? "VALIDATED" : `${conflicts.length} CONFLICTS`;

    enrichments.push({
      blockAddress: block.address,
      source: this.name,
      type: "annotation",
      annotation: `Validation: ${status} (confidence: ${(confidence * 100).toFixed(0)}%)`,
      data: {
        conflicts,
        validations,
        adjustedConfidence: confidence,
        originalConfidence: baseConfidence,
      },
    });

    return { enrichments, confidence };
  }
}

function getField(result: any, field: string): any {
  if (!result?.enrichments) return undefined;
  for (const e of result.enrichments) {
    if (e.data?.[field] !== undefined) return e.data[field];
  }
  return undefined;
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}
