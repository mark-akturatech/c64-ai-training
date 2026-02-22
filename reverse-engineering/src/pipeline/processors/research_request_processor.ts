// Research Request Processor (Stages 2,3)
// Queue Qdrant lookups for research_needed items.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class ResearchRequestProcessor implements ResponseProcessor {
  name = "research_request";
  priority = 20;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const researchNeeded = input.aiResponse.research_needed as string[] | undefined;

    if (!researchNeeded || researchNeeded.length === 0) return {};

    const result: ProcessorResult = { reviewFlags: [] };

    for (const topic of researchNeeded) {
      result.reviewFlags!.push({
        blockId: `block_${input.block.address.toString(16)}`,
        field: "research",
        reason: `AI requests research: ${topic}`,
        severity: "info",
      });
    }

    return result;
  }
}
