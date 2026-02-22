// Embedding Processor (Stages 2,3)
// Embed analysis into project Qdrant collection.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class EmbeddingProcessor implements ResponseProcessor {
  name = "embedding";
  priority = 30;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const purpose = input.aiResponse.purpose as string | undefined;
    const category = input.aiResponse.category as string | undefined;

    if (!purpose) return {};

    const blockId = `block_${input.block.address.toString(16)}`;
    const text = [
      purpose,
      category ? `Category: ${category}` : "",
      input.aiResponse.algorithm ? `Algorithm: ${input.aiResponse.algorithm}` : "",
    ].filter(Boolean).join("\n");

    return {
      embeddings: [{
        blockId,
        text,
        collection: "project",
      }],
    };
  }
}
