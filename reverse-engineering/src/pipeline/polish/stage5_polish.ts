// ============================================================================
// Stage 5: Post-RE Polish — holistic output quality improvement
//
// Operates on blocks.json enrichment data (not raw ASM). Three AI passes:
//   Pass 1: Program overview (description, sections, data groupings)
//   Pass 2: Label refinement (short, purposeful names)
//   Pass 3: Comment + data refinement (per-module, intent-level docs)
//
// The existing builder then re-emits using the polished enrichment.
// ============================================================================

import type { Block } from "@c64/shared";
import type { AIClient } from "../../shared/ai_client.js";
import type { IntegrationJson, MutableGraphInterface } from "../../types.js";
import { runPass1 } from "./pass1_program_overview.js";
import { runPass2 } from "./pass2_label_refinement.js";
import { runPass3 } from "./pass3_comment_data.js";
import { applyPolish } from "./polish_applicator.js";

export interface Stage5Input {
  blocks: Block[];
  integration: IntegrationJson;
  graph: MutableGraphInterface;
  aiClient: AIClient;
}

export interface Stage5Output {
  blocks: Block[];
  programDescription: string;
  stats: {
    pass1Calls: number;
    pass2Calls: number;
    pass3Calls: number;
    totalTokens: number;
  };
}

export async function runStage5(input: Stage5Input): Promise<Stage5Output> {
  const { blocks, integration, graph, aiClient } = input;

  const tokensBefore = aiClient.stats.tokens;
  const callsBefore = aiClient.stats.calls;

  // ── Pass 2: Label Refinement (runs FIRST so Pass 1 can use refined labels) ──
  console.error("  Pass 2: Label refinement...");
  const callsBeforeP2 = aiClient.stats.calls;
  const pass2 = await runPass2({ blocks, aiClient });
  const pass2Calls = aiClient.stats.calls - callsBeforeP2;
  console.error(`    → labels refined: ${Object.keys(pass2.refinements).length}`);

  // ── Pass 1: Program Overview (uses refined labels in header) ──
  console.error("  Pass 1: Program overview...");
  const callsBeforeP1 = aiClient.stats.calls;
  const pass1 = await runPass1({ blocks, integration, graph, aiClient, refinedLabels: pass2.refinements });
  const pass1Calls = aiClient.stats.calls - callsBeforeP1;
  console.error(`    → description: ${pass1.programDescription.split("\n").length} lines`);
  console.error(`    → sections: ${Object.keys(pass1.sectionHeaders).length}`);
  console.error(`    → data groups: ${pass1.dataGroupings.length}`);

  // ── Pass 3: Comment + Data Refinement ──
  console.error("  Pass 3: Comment + data refinement...");
  const callsBeforeP3 = aiClient.stats.calls;
  const pass3 = await runPass3({ blocks, integration, graph, aiClient });
  const pass3Calls = aiClient.stats.calls - callsBeforeP3;
  console.error(`    → blocks refined: ${Object.keys(pass3.blockResults).length}`);

  // ── Apply all results ──
  const { blocks: polishedBlocks, programDescription } = applyPolish({
    blocks,
    pass1,
    pass2,
    pass3,
  });

  const totalTokens = aiClient.stats.tokens - tokensBefore;
  const totalCalls = aiClient.stats.calls - callsBefore;
  console.error(`  Total: ${totalCalls} AI calls, ${totalTokens} tokens`);

  return {
    blocks: polishedBlocks,
    programDescription,
    stats: {
      pass1Calls,
      pass2Calls,
      pass3Calls,
      totalTokens,
    },
  };
}
