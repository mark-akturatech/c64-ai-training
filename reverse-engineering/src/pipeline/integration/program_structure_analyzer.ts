// ============================================================================
// Program Structure Analyzer (pri 10) — program type, main loop, init chain
// ============================================================================

import type { IntegrationAnalyzer, IntegrationAnalyzerInput, IntegrationContribution } from "./types.js";

export class ProgramStructureAnalyzer implements IntegrationAnalyzer {
  name = "program_structure";
  priority = 10;

  analyze(input: IntegrationAnalyzerInput): IntegrationContribution {
    const { graph, allBlocks, enrichments } = input;

    // Detect entry point
    const entryPoints = graph.getEntryPoints();
    const entryPoint = entryPoints[0] ?? "unknown";

    // Detect main loop — look for blocks with self-loops or SCC membership
    let mainLoop: { block: string; description: string } | null = null;
    const scc = graph.getSCCDecomposition("control_flow");
    for (const [, members] of scc.sccMembers) {
      const first = [...members][0];
      if (members.size > 1 || (members.size === 1 && first && graph.hasSelfLoop(first))) {
        const loopBlock = allBlocks.find(b => members.has(b.blockId));
        if (loopBlock) {
          mainLoop = { block: loopBlock.blockId, description: loopBlock.purpose };
          break;
        }
      }
    }

    // Detect init chain — blocks reachable from entry before first loop
    const initChain: { block: string; purpose: string }[] = [];
    if (entryPoint !== "unknown") {
      const children = graph.getChildren(entryPoint, "control_flow");
      for (const child of children) {
        const block = allBlocks.find(b => b.blockId === child.id);
        if (block && block.category === "init") {
          initChain.push({ block: block.blockId, purpose: block.purpose });
        }
      }
    }

    // Detect IRQ handlers
    const irqHandlers: { address: string; purpose: string }[] = [];
    const irqIds = graph.getIrqHandlers();
    for (const id of irqIds) {
      const block = allBlocks.find(b => b.blockId === id);
      irqHandlers.push({
        address: id,
        purpose: block?.purpose ?? "IRQ handler",
      });
    }

    // Detect state machines
    const stateMachines: { block: string; stateVariable: string; states: Record<string, string> }[] = [];
    const smEnrichments = enrichments.get("state_machine") ?? [];
    for (const sm of smEnrichments) {
      if (sm.data?.stateVariable) {
        stateMachines.push({
          block: sm.blockAddress.toString(16).padStart(4, "0"),
          stateVariable: String(sm.data.stateVariable),
          states: (sm.data.states as Record<string, string>) ?? {},
        });
      }
    }

    // Classify program type
    const hasSprites = enrichments.has("vic_annotation");
    const hasSound = enrichments.has("sid_annotation");
    const hasIrq = irqHandlers.length > 0;
    const programType = classifyProgramType(hasSprites, hasSound, hasIrq, allBlocks.length);

    return {
      section: "program",
      data: {
        type: programType,
        name: `program_${entryPoint}`,
        description: `${programType} starting at ${entryPoint}`,
        entryPoint,
        mainLoop,
        initChain,
        irqHandlers,
        stateMachines,
      },
    };
  }
}

function classifyProgramType(
  hasSprites: boolean,
  hasSound: boolean,
  hasIrq: boolean,
  blockCount: number,
): string {
  if (hasSprites && hasSound && hasIrq) return "game";
  if (hasIrq && !hasSprites && !hasSound) return "demo";
  if (hasSprites && hasIrq) return "game";
  if (blockCount < 10) return "utility";
  return "program";
}
