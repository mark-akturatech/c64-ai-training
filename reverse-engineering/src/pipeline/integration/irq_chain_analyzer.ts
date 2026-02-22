// ============================================================================
// IRQ Chain Analyzer (pri 30) — model interrupt chain structure
// ============================================================================

import type { IntegrationAnalyzer, IntegrationAnalyzerInput, IntegrationContribution } from "./types.js";

export class IrqChainAnalyzer implements IntegrationAnalyzer {
  name = "irq_chain";
  priority = 30;

  analyze(input: IntegrationAnalyzerInput): IntegrationContribution {
    const { graph, allBlocks, enrichments } = input;

    const irqIds = graph.getIrqHandlers();
    const chains: Array<{
      entryHandler: string;
      chain: string[];
      purpose: string;
      rasterLine?: number;
    }> = [];

    const interruptEnrichments = enrichments.get("interrupt_chain") ?? [];

    for (const irqId of irqIds) {
      const chain: string[] = [irqId];
      const visited = new Set<string>([irqId]);

      // Follow the chain — IRQ handlers that vector to each other
      let current = irqId;
      while (true) {
        const children = graph.getChildren(current, "control_flow");
        const next = children.find(c =>
          !visited.has(c.id) && c.type === "code"
        );
        if (!next) break;
        chain.push(next.id);
        visited.add(next.id);
        current = next.id;
      }

      const block = allBlocks.find(b => b.blockId === irqId);
      const enrichment = interruptEnrichments.find(e =>
        e.blockAddress === (block ? parseInt(block.blockId.replace(/^code_/, ""), 16) : 0)
      );

      chains.push({
        entryHandler: irqId,
        chain,
        purpose: block?.purpose ?? "IRQ handler",
        rasterLine: enrichment?.data?.rasterLine as number | undefined,
      });
    }

    return {
      section: "irqChains",
      data: { chains, totalHandlers: irqIds.length },
    };
  }
}
