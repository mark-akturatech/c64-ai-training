// Review Flag Processor (Stages 2,3)
// Collect low-confidence/conflicting items needing human review.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class ReviewFlagProcessor implements ResponseProcessor {
  name = "review_flag";
  priority = 50;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const result: ProcessorResult = { reviewFlags: [] };
    const blockId = `block_${input.block.address.toString(16)}`;

    const confidence = Number(input.aiResponse.confidence ?? 0);

    // Flag low-confidence analyses
    if (confidence > 0 && confidence < 0.5) {
      result.reviewFlags!.push({
        blockId,
        field: "confidence",
        reason: `Low confidence analysis (${(confidence * 100).toFixed(0)}%) — may need manual review`,
        severity: "warning",
      });
    }

    // Flag if AI couldn't determine purpose
    const purpose = String(input.aiResponse.purpose ?? "");
    if (purpose.toLowerCase().includes("unknown") || purpose.toLowerCase().includes("unclear")) {
      result.reviewFlags!.push({
        blockId,
        field: "purpose",
        reason: `AI uncertain about block purpose: "${purpose}"`,
        severity: "warning",
      });
    }

    // Flag if AI mentions self-modifying code
    if (purpose.toLowerCase().includes("self-modif") || purpose.toLowerCase().includes("smc")) {
      result.reviewFlags!.push({
        blockId,
        field: "smc",
        reason: "Block involves self-modifying code — analysis may be incomplete",
        severity: "info",
      });
    }

    return result;
  }
}
