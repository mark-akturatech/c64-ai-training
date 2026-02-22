// Conflict Processor (Stages 2,3)
// Detect and flag naming conflicts across scopes.

import type { ResponseProcessor, ProcessorInput, ProcessorResult } from "./types.js";

export class ConflictProcessor implements ResponseProcessor {
  name = "conflict";
  priority = 45;
  appliesTo: (2 | 3)[] = [2, 3];

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    const variables = input.aiResponse.variables as Record<string, string> | undefined;
    if (!variables || Object.keys(variables).length === 0) return {};

    const result: ProcessorResult = { reviewFlags: [] };
    const blockId = `block_${input.block.address.toString(16)}`;

    for (const [addrHex, proposedName] of Object.entries(variables)) {
      const existing = input.variableMap?.variables?.[addrHex.replace(/^\$/, "").toUpperCase()];
      if (!existing) continue;

      // Check for naming conflict
      if (existing.currentName !== proposedName && existing.currentName !== `zp_${addrHex}`) {
        result.reviewFlags!.push({
          blockId,
          field: `variable_${addrHex}`,
          reason: `Naming conflict for $${addrHex}: existing "${existing.currentName}" vs proposed "${proposedName}"`,
          severity: "warning",
        });
      }
    }

    return result;
  }
}
