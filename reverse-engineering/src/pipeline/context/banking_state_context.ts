// Banking State Context (Priority 5, Stages 2,3)
// THE most important context — prevents AI errors about KERNAL/hardware assumptions.

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class BankingStateContext implements ContextProvider {
  name = "banking_state";
  priority = 5;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const nodeId = blockToNodeId(input.block);
    const node = input.graph.getNode(nodeId);
    if (!node?.bankingState) return null;

    const entry = node.bankingState.onEntry;
    const lines: string[] = [];

    lines.push(`Banking state on entry to this block:`);
    lines.push(`- KERNAL ROM ($E000-$FFFF): ${mapState(entry.kernalMapped)}`);
    lines.push(`- BASIC ROM ($A000-$BFFF): ${mapState(entry.basicMapped)}`);
    lines.push(`- I/O area ($D000-$DFFF): ${mapState(entry.ioMapped)}`);
    lines.push(`- Character ROM: ${mapState(entry.chargenMapped)}`);

    if (entry.kernalMapped === "no") {
      lines.push(`\n**WARNING**: KERNAL is NOT mapped. JSR targets in $E000-$FFFF hit RAM, not ROM routines.`);
    }
    if (entry.ioMapped === "no") {
      lines.push(`\n**WARNING**: I/O is NOT mapped. Addresses $D000-$DFFF access RAM, not hardware registers.`);
    }

    if (node.bankingScope) {
      lines.push(`\nBanking scope: ${node.bankingScope} (${node.bankingScope === "local" ? "saves/restores $01" : "changes $01 persistently"})`);
    }

    return {
      section: "Banking State",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 15,
    };
  }
}

function mapState(state: string): string {
  if (state === "yes") return "MAPPED (visible)";
  if (state === "no") return "NOT MAPPED (RAM visible instead)";
  return "UNKNOWN (may vary at runtime)";
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}
