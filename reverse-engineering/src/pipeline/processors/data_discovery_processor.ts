// Data Discovery Processor (Stages 2,3)
// Merges AI-discovered data blocks into BlockStore + graph.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class DataDiscoveryProcessor implements ResponseProcessor {
  name = "data_discovery";
  priority = 10;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const discoveries = input.aiResponse.discovered_data as Array<{
      address: number | string;
      size: number;
      format: string;
    }> | undefined;

    if (!discoveries || discoveries.length === 0) return {};

    const result: ProcessorResult = { discoveries: [] };

    for (const d of discoveries) {
      const addr = typeof d.address === "string" ? parseInt(d.address.replace(/^\$/, ""), 16) : d.address;
      if (isNaN(addr) || addr < 0 || addr >= 65536) continue;

      result.discoveries!.push({
        address: addr,
        size: d.size,
        format: d.format,
        discoveredBy: `ai_stage${input.stage}`,
      });
    }

    return result;
  }
}
