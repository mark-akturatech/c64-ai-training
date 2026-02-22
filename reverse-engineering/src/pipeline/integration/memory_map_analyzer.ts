// ============================================================================
// Memory Map Analyzer (pri 50) — document memory layout and banking
// ============================================================================

import type { IntegrationAnalyzer, IntegrationAnalyzerInput, IntegrationContribution } from "./types.js";

export class MemoryMapAnalyzer implements IntegrationAnalyzer {
  name = "memory_map";
  priority = 50;

  analyze(input: IntegrationAnalyzerInput): IntegrationContribution {
    const { graph, allBlocks, variableMap } = input;

    // Build memory regions from blocks
    const regions: Array<{
      start: string;
      end: string;
      type: string;
      description: string;
    }> = [];

    // Sort blocks by address
    const sorted = [...allBlocks].sort((a, b) => {
      const addrA = parseInt(a.blockId.replace(/^(code|data)_/, ""), 16);
      const addrB = parseInt(b.blockId.replace(/^(code|data)_/, ""), 16);
      return addrA - addrB;
    });

    for (const block of sorted) {
      const addr = parseInt(block.blockId.replace(/^(code|data)_/, ""), 16);
      regions.push({
        start: `$${addr.toString(16).toUpperCase().padStart(4, "0")}`,
        end: block.blockId, // Use blockId as end marker
        type: block.category,
        description: block.purpose,
      });
    }

    // Banking configurations used
    const bankingConfigs = new Set<string>();
    for (const node of graph.getNodes().values()) {
      if (node.bankingState) {
        const { kernalMapped, basicMapped, ioMapped } = node.bankingState.onEntry;
        bankingConfigs.add(`kernal=${kernalMapped},basic=${basicMapped},io=${ioMapped}`);
      }
    }

    // Zero-page variable summary
    const zpVars: Array<{ address: string; name: string; usedBy: number }> = [];
    for (const [key, entry] of Object.entries(variableMap.variables)) {
      if (entry.address < 0x100) {
        zpVars.push({
          address: `$${key}`,
          name: entry.currentName,
          usedBy: entry.usedBy.length,
        });
      }
    }

    // Build memory map text
    const mapLines: string[] = [
      "; Memory Map",
      "; ==========",
    ];
    for (const region of regions) {
      mapLines.push(`; ${region.start}  ${region.type.padEnd(8)} ${region.description}`);
    }
    if (zpVars.length > 0) {
      mapLines.push(";");
      mapLines.push("; Zero Page Variables:");
      for (const v of zpVars) {
        mapLines.push(`;   ${v.address}  ${v.name} (used by ${v.usedBy} blocks)`);
      }
    }

    return {
      section: "memoryMap",
      data: {
        regions,
        bankingConfigs: [...bankingConfigs],
        zpVariables: zpVars,
        memoryMapText: mapLines.join("\n"),
      },
    };
  }
}
