// ============================================================================
// IRQ Volatility Enrichment (Priority 43)
//
// Builds the IRQ-volatile register set by walking each IRQ/NMI handler and
// collecting hardware register writes. Flags mainline accesses to IRQ-volatile
// registers as potentially asynchronously modified.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";
import {
  defaultIRQSafetyState,
  addIRQVolatileRegisters,
  isVolatileRegister,
} from "../irq_volatility_model.js";

export class IrqVolatilityEnrichment implements EnrichmentPlugin {
  name = "irq_volatility";
  priority = 43;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Step 1: Find IRQ/NMI handler blocks
    const irqHandlerAddresses = new Set<number>();
    for (const block of input.blocks) {
      if (block.isIrqHandler) {
        irqHandlerAddresses.add(block.address);
      }
    }

    // Also check graph for vector_write edges (from vector_write enrichment)
    for (const edge of input.graph.getEdges()) {
      if (edge.type === "vector_write") {
        irqHandlerAddresses.add(edge.target);
      }
    }

    if (irqHandlerAddresses.size === 0) return { enrichments };

    // Step 2: Collect all hardware register writes from IRQ handlers
    const irqState = defaultIRQSafetyState();
    const irqWrittenRegisters = new Set<number>();

    for (const block of input.blocks) {
      if (!irqHandlerAddresses.has(block.address)) continue;
      if (!block.instructions) continue;

      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();
        if (mn === "sta" || mn === "stx" || mn === "sty") {
          const target = this.parseAbsoluteTarget(inst);
          if (target !== null && target >= 0xD000 && target <= 0xDDFF) {
            irqWrittenRegisters.add(target);
          }
        }
      }
    }

    if (irqWrittenRegisters.size === 0) return { enrichments };

    // Add to volatility model
    addIRQVolatileRegisters(irqState, irqWrittenRegisters);

    // Step 3: Walk mainline code and flag accesses to volatile registers
    for (const block of input.blocks) {
      if (irqHandlerAddresses.has(block.address)) continue; // Skip IRQ handlers
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      // Check if this block runs with interrupts disabled (SEI)
      const nodeId = this.blockToNodeId(block);
      const graphNode = input.graph.getNode(nodeId);
      const irqSafe = graphNode?.irqSafety?.irqsDisabled === "yes";

      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();
        const target = this.parseAbsoluteTarget(inst);
        if (target === null) continue;

        if (isVolatileRegister(irqState, target)) {
          const isRead = mn === "lda" || mn === "ldx" || mn === "ldy" ||
                         mn === "cmp" || mn === "cpx" || mn === "cpy" ||
                         mn === "bit";
          const isWrite = mn === "sta" || mn === "stx" || mn === "sty";

          if (isRead || isWrite) {
            const safety = irqSafe ? "irq-safe (SEI)" : "irq-exposed";
            const action = isRead ? "reads" : "writes";

            enrichments.push({
              blockAddress: block.address,
              source: this.name,
              type: "annotation",
              annotation: `${safety}: ${action} IRQ-volatile $${hex(target)}`,
              data: {
                instructionAddress: inst.address,
                registerAddress: target,
                irqSafe,
                action: isRead ? "read" : "write",
                volatileRegister: true,
              },
            });
          }
        }
      }
    }

    return { enrichments };
  }

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
