// Context Request Processor (Stage 3 only)
// Fulfill Phase A context requests, tag with isReverseEngineered.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class ContextRequestProcessor implements ResponseProcessor {
  name = "context_request";
  priority = 25;
  appliesTo: (2 | 3)[] = [3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const contextRequests = input.aiResponse.context_requests as Array<{
      block_address: number | string;
      what: string;
    }> | undefined;

    if (!contextRequests || contextRequests.length === 0) return {};

    const result: ProcessorResult = { reviewFlags: [] };

    for (const req of contextRequests) {
      const addr = typeof req.block_address === "string"
        ? parseInt(req.block_address.replace(/^\$/, ""), 16)
        : req.block_address;

      // Check if the requested block is already reverse engineered
      const nodeId = `code_${addr.toString(16).padStart(4, "0")}`;
      const node = input.graph.getNode(nodeId);
      const isReversed = node?.pipelineState?.reverseEngineered ?? false;

      result.reviewFlags!.push({
        blockId: `block_${input.block.address.toString(16)}`,
        field: "context_request",
        reason: `Needs context from $${addr.toString(16).toUpperCase().padStart(4, "0")} (${req.what}) — ${isReversed ? "AVAILABLE" : "NOT YET REVERSED"}`,
        severity: isReversed ? "info" : "warning",
      });
    }

    return result;
  }
}
