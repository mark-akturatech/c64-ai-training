// ============================================================================
// Module Assignment Analyzer (pri 20) — group blocks into modules/files
// ============================================================================

import type { IntegrationAnalyzer, IntegrationAnalyzerInput, IntegrationContribution } from "./types.js";

export class ModuleAssignmentAnalyzer implements IntegrationAnalyzer {
  name = "module_assignment";
  priority = 20;

  analyze(input: IntegrationAnalyzerInput): IntegrationContribution {
    const { allBlocks, graph } = input;

    // Group blocks by category → module
    const modules = new Map<string, string[]>();
    for (const block of allBlocks) {
      const mod = categoryToModule(block.category);
      const existing = modules.get(mod) ?? [];
      existing.push(block.blockId);
      modules.set(mod, existing);
    }

    // Build files from modules
    const files: Array<{
      filename: string;
      module: string;
      description: string;
      blocks: string[];
      importsFrom: string[];
    }> = [];

    const blockToFile = new Map<string, string>();
    for (const [mod, blockIds] of modules) {
      const filename = `${mod}.asm`;
      files.push({
        filename,
        module: mod,
        description: `${mod} module (${blockIds.length} blocks)`,
        blocks: blockIds,
        importsFrom: [],
      });
      for (const id of blockIds) {
        blockToFile.set(id, filename);
      }
    }

    // Compute import dependencies between files
    for (const file of files) {
      const deps = new Set<string>();
      for (const blockId of file.blocks) {
        const node = graph.getNode(blockId);
        if (!node) continue;
        const children = graph.getChildren(blockId, "control_flow");
        for (const child of children) {
          const childFile = blockToFile.get(child.id);
          if (childFile && childFile !== file.filename) {
            deps.add(childFile);
          }
        }
      }
      file.importsFrom = [...deps].sort();
    }

    // Topological sort of files by dependencies
    const fileBuildOrder = topSortFiles(files);

    // blockToFileMap as Record
    const blockToFileMap: Record<string, string> = {};
    for (const [id, fname] of blockToFile) {
      blockToFileMap[id] = fname;
    }

    return {
      section: "files",
      data: {
        files,
        fileBuildOrder,
        blockToFileMap,
      },
    };
  }
}

function categoryToModule(category: string): string {
  switch (category) {
    case "init": return "init";
    case "irq": case "interrupt": return "irq";
    case "graphics": case "sprite": return "graphics";
    case "sound": case "music": return "sound";
    case "input": return "input";
    case "data": return "data";
    case "math": return "math";
    default: return "main";
  }
}

function topSortFiles(files: Array<{ filename: string; importsFrom: string[] }>): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const fileMap = new Map(files.map(f => [f.filename, f]));

  function visit(name: string) {
    if (visited.has(name)) return;
    visited.add(name);
    const file = fileMap.get(name);
    if (file) {
      for (const dep of file.importsFrom) visit(dep);
    }
    order.push(name);
  }

  for (const file of files) visit(file.filename);
  return order;
}
