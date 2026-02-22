// Bail Reason Processor (Stage 3 only)
// Record structured bail reasons and confidence scores.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class BailReasonProcessor implements ResponseProcessor {
  name = "bail_reason";
  priority = 55;
  appliesTo: (2 | 3)[] = [3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const bail = input.aiResponse.bail_reason as {
      type: string;
      details?: string;
      dependencies?: string[];
      complexity_factors?: string[];
    } | undefined;

    if (!bail) return {};

    const result: ProcessorResult = { reviewFlags: [] };
    const blockId = `block_${input.block.address.toString(16)}`;

    let reason: string;
    let severity: "info" | "warning" | "error" = "warning";

    switch (bail.type) {
      case "needs_dependency":
        reason = `Bailed: needs dependencies ${(bail.dependencies ?? []).join(", ")}`;
        break;
      case "insufficient_context":
        reason = `Bailed: insufficient context — ${bail.details ?? "no details"}`;
        break;
      case "block_too_complex":
        reason = `Bailed: too complex — factors: ${(bail.complexity_factors ?? []).join(", ")}`;
        severity = "error";
        break;
      case "hit_iteration_limit":
        reason = `Bailed: hit iteration limit`;
        severity = "error";
        break;
      default:
        reason = `Bailed: ${bail.type} — ${bail.details ?? ""}`;
    }

    result.reviewFlags!.push({
      blockId,
      field: "bail_reason",
      reason,
      severity,
    });

    return result;
  }
}
