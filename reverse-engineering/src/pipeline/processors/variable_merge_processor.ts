// Variable Merge Processor (Stages 2,3)
// Merge proposed variable names into variable map.

import type { ResponseProcessor, ProcessorInput, ProcessorResult, VariableEntry } from "./types.js";

export class VariableMergeProcessor implements ResponseProcessor {
  name = "variable_merge";
  priority = 40;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const variables = input.aiResponse.variables as Record<string, string> | undefined;

    if (!variables || Object.keys(variables).length === 0) return {};

    const result: ProcessorResult = { variableEntries: [] };
    const blockId = `block_${input.block.address.toString(16)}`;
    const source = `stage${input.stage}` as "stage2" | "stage3";

    for (const [addrHex, name] of Object.entries(variables)) {
      const addr = parseInt(addrHex.replace(/^\$/, ""), 16);
      if (isNaN(addr)) continue;

      const entry: VariableEntry = {
        address: addr,
        currentName: name,
        nameHistory: [],
        usedBy: [blockId],
        usageContexts: [{
          blockId,
          name,
          usage: "read_write",
          confidence: input.stage === 2 ? 0.6 : 0.8,
          source,
        }],
        scope: addr < 0x100 ? "local" : "global",
        type: "unknown",
      };

      result.variableEntries!.push(entry);
    }

    return result;
  }
}
