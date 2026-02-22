// ============================================================================
// Save/Restore Detector Enrichment (Priority 44)
//
// Tracks PHA/PLA stack balance per subroutine to detect save/restore patterns:
//   LDA $01 / PHA ... PLA / STA $01 → bankingScope = "local"
//   Register-transfer variants: LDA $01 / TAX ... TXA / STA $01
// Identifies stack imbalances as potential bugs or intentional banking leaks.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  DependencyGraphNode,
} from "../types.js";

export class SaveRestoreDetectorEnrichment implements EnrichmentPlugin {
  name = "save_restore_detector";
  priority = 44;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const result = this.analyzeBlock(block);
      if (!result) continue;

      const nodeId = this.blockToNodeId(block);
      const node = input.graph.getNode(nodeId);

      if (result.bankingScope) {
        // Set on graph node
        if (node) {
          (node as DependencyGraphNode).bankingScope = result.bankingScope;
        }

        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "pattern",
          annotation: result.annotation,
          data: {
            bankingScope: result.bankingScope,
            stackBalance: result.stackBalance,
            savePattern: result.savePattern,
            restorePattern: result.restorePattern,
          },
        });
      }

      if (result.stackImbalance) {
        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "annotation",
          annotation: `Stack imbalance: ${result.stackBalance} (PHA=${result.pushCount}, PLA=${result.pullCount})`,
          data: {
            stackBalance: result.stackBalance,
            pushCount: result.pushCount,
            pullCount: result.pullCount,
          },
        });
      }
    }

    return { enrichments };
  }

  private analyzeBlock(block: Block): {
    bankingScope?: "local" | "leaked";
    annotation: string;
    stackBalance: number;
    pushCount: number;
    pullCount: number;
    savePattern?: string;
    restorePattern?: string;
    stackImbalance?: boolean;
  } | null {
    const insts = block.instructions!;

    // Track stack operations
    let pushCount = 0;
    let pullCount = 0;

    // Track $01 save/restore patterns
    let savedPort01Stack = false;
    let restoredPort01Stack = false;
    let savedPort01Reg: "X" | "Y" | null = null;
    let restoredPort01Reg = false;

    for (let i = 0; i < insts.length; i++) {
      const mn = insts[i].mnemonic.toLowerCase();
      const target = this.parseTarget(insts[i]);

      // LDA $01 / PHA pattern
      if (mn === "lda" && target === 0x01 && i + 1 < insts.length) {
        const next = insts[i + 1].mnemonic.toLowerCase();
        if (next === "pha") {
          savedPort01Stack = true;
        } else if (next === "tax") {
          savedPort01Reg = "X";
        } else if (next === "tay") {
          savedPort01Reg = "Y";
        }
      }

      // PLA / STA $01 pattern
      if (mn === "pla" && i + 1 < insts.length) {
        const nextMn = insts[i + 1].mnemonic.toLowerCase();
        const nextTarget = this.parseTarget(insts[i + 1]);
        if (nextMn === "sta" && nextTarget === 0x01) {
          restoredPort01Stack = true;
        }
      }

      // TXA / STA $01 or TYA / STA $01 restore via register
      if ((mn === "txa" || mn === "tya") && i + 1 < insts.length) {
        const nextMn = insts[i + 1].mnemonic.toLowerCase();
        const nextTarget = this.parseTarget(insts[i + 1]);
        if (nextMn === "sta" && nextTarget === 0x01) {
          const regUsed = mn === "txa" ? "X" : "Y";
          if (savedPort01Reg === regUsed) {
            restoredPort01Reg = true;
          }
        }
      }

      // Count stack operations
      if (mn === "pha" || mn === "php") pushCount++;
      if (mn === "pla" || mn === "plp") pullCount++;
    }

    const stackBalance = pushCount - pullCount;
    const hasSaveRestore = (savedPort01Stack && restoredPort01Stack) ||
                           (savedPort01Reg !== null && restoredPort01Reg);
    const hasLeakedSave = (savedPort01Stack && !restoredPort01Stack) ||
                          (savedPort01Reg !== null && !restoredPort01Reg);

    if (hasSaveRestore) {
      const saveType = savedPort01Stack ? "PHA/PLA" : `T${savedPort01Reg}A/TA${savedPort01Reg}`;
      return {
        bankingScope: "local",
        annotation: `Banking save/restore: $01 saved via ${saveType} — scope is local`,
        stackBalance,
        pushCount,
        pullCount,
        savePattern: savedPort01Stack ? "LDA $01 / PHA" : `LDA $01 / TA${savedPort01Reg}`,
        restorePattern: savedPort01Stack ? "PLA / STA $01" : `T${savedPort01Reg}A / STA $01`,
      };
    }

    if (hasLeakedSave) {
      return {
        bankingScope: "leaked",
        annotation: `Banking change leaked: $01 saved but not restored`,
        stackBalance,
        pushCount,
        pullCount,
        savePattern: savedPort01Stack ? "LDA $01 / PHA" : `LDA $01 / TA${savedPort01Reg}`,
      };
    }

    // Report stack imbalances (potential issues)
    if (stackBalance !== 0 && (pushCount > 0 || pullCount > 0)) {
      return {
        annotation: `Stack imbalance detected`,
        stackBalance,
        pushCount,
        pullCount,
        stackImbalance: true,
      };
    }

    return null;
  }

  private parseTarget(inst: BlockInstruction): number | null {
    const match = inst.operand.match(/^\$([0-9a-fA-F]+)$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }
}
