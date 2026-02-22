// Reclassification Processor (Stages 2,3)
// Apply AI-requested block reclassifications.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class ReclassificationProcessor implements ResponseProcessor {
  name = "reclassification";
  priority = 15;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const reclassifications = input.aiResponse.reclassifications as Array<{
      address: number | string;
      new_type: string;
      reason: string;
    }> | undefined;

    if (!reclassifications || reclassifications.length === 0) return {};

    const result: ProcessorResult = { mutations: [] };

    for (const r of reclassifications) {
      const addr = typeof r.address === "string" ? parseInt(r.address.replace(/^\$/, ""), 16) : r.address;
      result.mutations!.push({
        blockAddress: addr,
        field: "type",
        value: r.new_type,
        reason: r.reason,
      });
    }

    return result;
  }
}
