// ============================================================================
// Banking State Enrichment (Priority 80)
//
// Higher-level banking annotations beyond basic propagation (pri 18).
// Detects: bank-switch sequences, ROM shadowing, under-ROM data access
// patterns. Flags blocks that execute with non-default banking.
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

export class BankingStateEnrichment implements EnrichmentPlugin {
  name = "banking_state";
  priority = 80;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const node of input.graph.getNodes().values()) {
      if (node.type !== "code") continue;
      if (!node.bankingState) continue;

      const entry = node.bankingState.onEntry;
      const exit = node.bankingState.onExit;

      // Detect non-default banking
      const isDefault = entry.kernalMapped === "yes" &&
                        entry.basicMapped === "yes" &&
                        entry.ioMapped === "yes";

      if (isDefault) continue; // Skip default — not interesting

      const parts: string[] = [];

      // Classify the banking configuration
      if (entry.kernalMapped === "no" && entry.basicMapped === "no" && entry.ioMapped === "yes") {
        parts.push("RAM under ROM ($01=$35): BASIC+KERNAL banked out, I/O visible");
      } else if (entry.kernalMapped === "no" && entry.basicMapped === "no" && entry.ioMapped === "no") {
        parts.push("All RAM ($01=$30-$34): ROMs + I/O banked out");
      } else if (entry.kernalMapped === "yes" && entry.basicMapped === "no") {
        parts.push("BASIC banked out, KERNAL visible ($01=$36)");
      } else if (entry.ioMapped === "no" && entry.chargenMapped === "yes") {
        parts.push("Character ROM visible ($01 bit2=0): reading char patterns");
      } else if (entry.kernalMapped === "unknown" || entry.ioMapped === "unknown") {
        parts.push("Banking state unknown — may vary at runtime");
      } else {
        parts.push("Non-default banking configuration");
      }

      // Detect banking change within the block
      const entryKernal = entry.kernalMapped;
      const exitKernal = exit.kernalMapped;
      if (entryKernal !== exitKernal) {
        parts.push(`KERNAL changes: ${entryKernal} → ${exitKernal}`);
      }

      const entryIO = entry.ioMapped;
      const exitIO = exit.ioMapped;
      if (entryIO !== exitIO) {
        parts.push(`I/O changes: ${entryIO} → ${exitIO}`);
      }

      // Check for banking scope
      if (node.bankingScope === "local") {
        parts.push("banking change is local (save/restore detected)");
      } else if (node.bankingScope === "leaked") {
        parts.push("banking change LEAKED to callers");
      }

      enrichments.push({
        blockAddress: node.start,
        source: this.name,
        type: "banking",
        annotation: parts.join("; "),
        data: {
          nodeId: node.id,
          entryKernal: entry.kernalMapped,
          entryBasic: entry.basicMapped,
          entryIO: entry.ioMapped,
          exitKernal: exit.kernalMapped,
          exitBasic: exit.basicMapped,
          exitIO: exit.ioMapped,
          bankingScope: node.bankingScope,
          isDefault: false,
        },
      });
    }

    return { enrichments };
  }
}
