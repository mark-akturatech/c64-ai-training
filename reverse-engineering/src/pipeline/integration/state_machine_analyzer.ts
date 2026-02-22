// ============================================================================
// State Machine Analyzer (pri 40) — identify state dispatch patterns
// ============================================================================

import type { IntegrationAnalyzer, IntegrationAnalyzerInput, IntegrationContribution } from "./types.js";

export class StateMachineAnalyzer implements IntegrationAnalyzer {
  name = "state_machine";
  priority = 40;

  analyze(input: IntegrationAnalyzerInput): IntegrationContribution {
    const { enrichments, allBlocks } = input;

    const smEnrichments = enrichments.get("state_machine") ?? [];
    const stateMachines: Array<{
      block: string;
      stateVariable: string;
      states: Record<string, string>;
      purpose: string;
    }> = [];

    for (const sm of smEnrichments) {
      if (sm.data?.stateVariable) {
        const blockId = `code_${sm.blockAddress.toString(16).padStart(4, "0")}`;
        const block = allBlocks.find(b => b.blockId === blockId);
        stateMachines.push({
          block: blockId,
          stateVariable: String(sm.data.stateVariable),
          states: (sm.data.states as Record<string, string>) ?? {},
          purpose: block?.purpose ?? "State dispatch",
        });
      }
    }

    return {
      section: "stateMachines",
      data: { stateMachines, count: stateMachines.length },
    };
  }
}
