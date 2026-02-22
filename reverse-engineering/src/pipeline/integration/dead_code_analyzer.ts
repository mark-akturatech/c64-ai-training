// ============================================================================
// Dead Code Analyzer (pri 70) — identify unreachable blocks
// ============================================================================

import type { IntegrationAnalyzer, IntegrationAnalyzerInput, IntegrationContribution } from "./types.js";

export class DeadCodeAnalyzer implements IntegrationAnalyzer {
  name = "dead_code";
  priority = 70;

  analyze(input: IntegrationAnalyzerInput): IntegrationContribution {
    const { graph, blockStore } = input;

    const reachable = graph.getReachableNodes();
    const allNodes = graph.getNodes();
    const deadNodes: Array<{
      nodeId: string;
      address: string;
      type: string;
      classification: string;
      recommendation: string;
      reason: string;
      sizeBytes: number;
    }> = [];

    let totalDeadBytes = 0;
    let totalBytes = 0;

    for (const [nodeId, node] of allNodes) {
      const block = blockStore.getBlock(node.start);
      const blockSize = block ? (block.endAddress - block.address) : 0;
      totalBytes += blockSize;

      if (!reachable.has(nodeId)) {
        const classification = classifyDeadCode(node, block);
        deadNodes.push({
          nodeId,
          address: `$${node.start.toString(16).toUpperCase().padStart(4, "0")}`,
          type: node.type,
          classification: classification.type,
          recommendation: classification.recommendation,
          reason: classification.reason,
          sizeBytes: blockSize,
        });
        totalDeadBytes += blockSize;
      }
    }

    return {
      section: "deadCode",
      data: {
        nodes: deadNodes,
        totalDeadBytes,
        percentOfProgram: totalBytes > 0 ? Math.round((totalDeadBytes / totalBytes) * 100) : 0,
      },
    };
  }
}

function classifyDeadCode(
  node: { type: string; start: number; end: number },
  block: { type: string; instructions?: unknown[] } | null,
): { type: string; recommendation: string; reason: string } {
  // ROM shadow region ($A000-$BFFF or $E000-$FFFF)
  if (node.start >= 0xA000 && node.start < 0xC000) {
    return { type: "rom_shadow", recommendation: "keep", reason: "In BASIC ROM shadow area" };
  }
  if (node.start >= 0xE000) {
    return { type: "rom_shadow", recommendation: "keep", reason: "In KERNAL ROM shadow area" };
  }

  // Data blocks with no references — likely fill/padding
  if (node.type === "data") {
    return { type: "fill_padding", recommendation: "investigate", reason: "Unreferenced data block" };
  }

  // Small code blocks — likely unused routines
  if (block && block.instructions && (block.instructions as unknown[]).length < 5) {
    return { type: "unused_routine", recommendation: "remove", reason: "Small unreferenced code block" };
  }

  // Larger code blocks — possibly abandoned features
  if (block && block.instructions && (block.instructions as unknown[]).length >= 5) {
    return { type: "abandoned_feature", recommendation: "investigate", reason: "Unreferenced code block — may be unused feature" };
  }

  return { type: "unknown", recommendation: "investigate", reason: "Unreachable node of unknown purpose" };
}
