// Hardware Context (Priority 40, Stages 2,3)
// Provides hardware register usage summary (banking-aware).

import type { ContextProvider, ContextProviderInput, ContextContribution } from "./types.js";

export class HardwareContext implements ContextProvider {
  name = "hardware";
  priority = 40;
  appliesTo: (2 | 3)[] = [2, 3];

  provide(input: ContextProviderInput): ContextContribution | null {
    const regSemEnrichments = input.enrichments.get("register_semantics") ?? [];
    const relevant = regSemEnrichments.filter(e => e.blockAddress === input.block.address);

    if (relevant.length === 0) return null;

    const lines: string[] = [];
    const seen = new Set<number>();

    for (const e of relevant) {
      const addr = e.data?.registerAddress as number | undefined;
      if (addr === undefined || seen.has(addr)) continue;
      seen.add(addr);

      const sym = input.symbolDb.lookupWithBanking(addr, getEntryBanking(input));
      const name = sym ? sym.name : `$${hex(addr)}`;
      const chip = sym?.chip ? ` (${sym.chip})` : "";
      lines.push(`${name}${chip}: ${e.annotation}`);
    }

    if (lines.length === 0) return null;

    return {
      section: "Hardware Register Usage",
      content: lines.join("\n"),
      priority: this.priority,
      tokenEstimate: lines.length * 12,
    };
  }
}

function getEntryBanking(input: { block: { address: number; type: string }; graph: { getNode(id: string): any } }) {
  const nodeId = blockToNodeId(input.block);
  const node = input.graph.getNode(nodeId);
  if (node?.bankingState?.onEntry) return node.bankingState.onEntry;
  // Default banking ($37)
  return {
    cpuPort: { bitmask: { knownMask: 0xFF, knownValue: 0x37 }, possibleValues: new Set([0x37]), isDynamic: false, source: "default" },
    vicBank: { bitmask: { knownMask: 0x03, knownValue: 0x03 }, possibleValues: new Set([0x03]), isDynamic: false, source: "default" },
    vicMemPtr: { bitmask: { knownMask: 0, knownValue: 0 }, possibleValues: null, isDynamic: false, source: "default" },
    kernalMapped: "yes" as const,
    basicMapped: "yes" as const,
    ioMapped: "yes" as const,
    chargenMapped: "no" as const,
  };
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
