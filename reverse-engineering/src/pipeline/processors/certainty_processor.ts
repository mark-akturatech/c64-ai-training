// Certainty Processor (Stages 2,3)
// Cross-validate AI claims vs deterministic annotations, including banking.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class CertaintyProcessor implements ResponseProcessor {
  name = "certainty";
  priority = 35;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const result: ProcessorResult = { reviewFlags: [] };

    // Check if AI claims KERNAL usage but banking says KERNAL is unmapped
    const aiPurpose = String(input.aiResponse.purpose ?? "").toLowerCase();
    const blockAddr = input.block.address;
    const nodeId = blockToNodeId(input.block);
    const node = input.graph.getNode(nodeId);

    if (node?.bankingState?.onEntry.kernalMapped === "no") {
      const kernalKeywords = ["chrout", "kernal", "chrin", "getin", "open", "close", "load", "save"];
      for (const kw of kernalKeywords) {
        if (aiPurpose.includes(kw)) {
          result.reviewFlags!.push({
            blockId: `block_${blockAddr.toString(16)}`,
            field: "purpose",
            reason: `AI mentions "${kw}" but KERNAL ROM is NOT mapped at this block. The target is RAM, not ROM.`,
            severity: "error",
          });
          break;
        }
      }
    }

    // Check if AI claims I/O register usage but I/O is unmapped
    if (node?.bankingState?.onEntry.ioMapped === "no") {
      const ioKeywords = ["vic", "sid", "cia", "sprite", "raster", "border", "background"];
      for (const kw of ioKeywords) {
        if (aiPurpose.includes(kw)) {
          result.reviewFlags!.push({
            blockId: `block_${blockAddr.toString(16)}`,
            field: "purpose",
            reason: `AI mentions "${kw}" hardware but I/O is NOT mapped at this block. $D000-$DFFF is RAM here.`,
            severity: "error",
          });
          break;
        }
      }
    }

    // Check confidence vs enrichment agreement
    const aiConfidence = Number(input.aiResponse.confidence ?? 0);
    const enrichments = input.enrichments.get("register_semantics") ?? [];
    const blockEnrichments = enrichments.filter(e => e.blockAddress === blockAddr);

    if (aiConfidence > 0.8 && blockEnrichments.length === 0 && aiPurpose.includes("hardware")) {
      result.reviewFlags!.push({
        blockId: `block_${blockAddr.toString(16)}`,
        field: "confidence",
        reason: `AI claims high confidence (${aiConfidence}) for hardware purpose but no register_semantics enrichments found`,
        severity: "warning",
      });
    }

    return result;
  }
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}
