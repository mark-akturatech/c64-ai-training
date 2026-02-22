// ============================================================================
// Interrupt Chain Enrichment (Priority 45)
//
// Detects linked interrupt handler patterns by following vector writes.
// Builds the raster split model: chain of handlers, raster line assignments,
// and registers managed per screen section.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

interface HandlerLink {
  handlerAddress: number;
  rasterLine: number | null; // $D012 value set by this handler
  nextHandler: number | null; // address of next handler in chain
  registersWritten: number[]; // hardware registers written by this handler
}

export class InterruptChainEnrichment implements EnrichmentPlugin {
  name = "interrupt_chain";
  priority = 45;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Step 1: Find IRQ handler blocks (from isIrqHandler flag or vector_write edges)
    const irqHandlerAddresses = new Set<number>();
    for (const block of input.blocks) {
      if (block.isIrqHandler) irqHandlerAddresses.add(block.address);
    }
    for (const edge of input.graph.getEdges()) {
      if (edge.type === "vector_write") {
        irqHandlerAddresses.add(edge.target);
      }
    }

    if (irqHandlerAddresses.size === 0) return { enrichments };

    // Step 2: Analyze each handler for chain links
    const handlers = new Map<number, HandlerLink>();

    for (const addr of irqHandlerAddresses) {
      const block = input.blocks.find(b => b.address === addr);
      if (!block?.instructions) continue;

      const link = this.analyzeHandler(block, input);
      handlers.set(addr, link);
    }

    // Step 3: Build chains
    const chains = this.buildChains(handlers);

    // Step 4: Emit enrichments
    for (const chain of chains) {
      if (chain.length < 2) continue;

      const chainDesc = chain
        .map(h => `$${hex(h.handlerAddress)}${h.rasterLine !== null ? `@line ${h.rasterLine}` : ""}`)
        .join(" → ");

      const isCyclic = chain[chain.length - 1].nextHandler === chain[0].handlerAddress;

      enrichments.push({
        blockAddress: chain[0].handlerAddress,
        source: this.name,
        type: "pattern",
        annotation: `IRQ chain: ${chainDesc}${isCyclic ? " (cyclic raster multiplexer)" : ""}`,
        data: {
          chainLength: chain.length,
          cyclic: isCyclic,
          handlers: chain.map(h => ({
            address: h.handlerAddress,
            rasterLine: h.rasterLine,
            registersWritten: h.registersWritten,
          })),
        },
      });

      // Also annotate each handler in the chain
      for (let i = 0; i < chain.length; i++) {
        const h = chain[i];
        const position = i === 0 ? "first" : i === chain.length - 1 ? "last" : `#${i + 1}`;

        enrichments.push({
          blockAddress: h.handlerAddress,
          source: this.name,
          type: "annotation",
          annotation: `IRQ handler (${position} in chain of ${chain.length})${h.rasterLine !== null ? `, raster line ${h.rasterLine}` : ""}`,
          data: {
            chainPosition: i,
            chainLength: chain.length,
            rasterLine: h.rasterLine,
            nextHandler: h.nextHandler,
          },
        });
      }
    }

    // Single handlers (not in a chain)
    for (const [addr, handler] of handlers) {
      const isInChain = chains.some(chain =>
        chain.some(h => h.handlerAddress === addr)
      );
      if (isInChain) continue;

      enrichments.push({
        blockAddress: addr,
        source: this.name,
        type: "annotation",
        annotation: `Standalone IRQ handler${handler.rasterLine !== null ? ` at raster line ${handler.rasterLine}` : ""}`,
        data: {
          rasterLine: handler.rasterLine,
          registersWritten: handler.registersWritten,
        },
      });
    }

    return { enrichments };
  }

  private analyzeHandler(block: Block, input: EnrichmentInput): HandlerLink {
    const link: HandlerLink = {
      handlerAddress: block.address,
      rasterLine: null,
      nextHandler: null,
      registersWritten: [],
    };

    if (!block.instructions) return link;

    let aValue: number | null = null;
    const hwRegsWritten = new Set<number>();

    for (const inst of block.instructions) {
      const mn = inst.mnemonic.toLowerCase();

      if (mn === "lda" && inst.addressingMode === "immediate") {
        aValue = this.parseImmediate(inst);
      }

      if (mn === "sta") {
        const target = this.parseAbsoluteTarget(inst);
        if (target === null) continue;

        // Track hardware register writes
        if (target >= 0xD000 && target <= 0xDDFF) {
          hwRegsWritten.add(target);
        }

        // $D012: raster line setting
        if (target === 0xD012 && aValue !== null) {
          link.rasterLine = aValue;
        }

        // $0314/$0315: IRQ vector change (next handler in chain)
        if (target === 0x0314 && aValue !== null) {
          // Low byte of next handler — look for high byte
          const hiValue = this.findPairedVectorWrite(block.instructions, inst, 0x0315);
          if (hiValue !== null) {
            link.nextHandler = (hiValue << 8) | aValue;
          }
        }
        if (target === 0x0315 && aValue !== null) {
          const loValue = this.findPairedVectorWrite(block.instructions, inst, 0x0314);
          if (loValue !== null) {
            link.nextHandler = (aValue << 8) | loValue;
          }
        }

        // Don't reset aValue on stores (common to store same value multiple places)
      }

      // Reset A on non-immediate loads
      if (mn === "lda" && inst.addressingMode !== "immediate") {
        aValue = null;
      }
    }

    link.registersWritten = [...hwRegsWritten];
    return link;
  }

  private findPairedVectorWrite(
    insts: BlockInstruction[],
    current: BlockInstruction,
    targetAddr: number,
  ): number | null {
    // Look nearby for the paired vector byte write
    const idx = insts.indexOf(current);
    let aValue: number | null = null;

    for (let i = Math.max(0, idx - 6); i < Math.min(insts.length, idx + 6); i++) {
      if (i === idx) continue;
      const mn = insts[i].mnemonic.toLowerCase();

      if (mn === "lda" && insts[i].addressingMode === "immediate") {
        aValue = this.parseImmediate(insts[i]);
      }
      if (mn === "sta" && aValue !== null) {
        const target = this.parseAbsoluteTarget(insts[i]);
        if (target === targetAddr) return aValue;
      }
    }
    return null;
  }

  private buildChains(handlers: Map<number, HandlerLink>): HandlerLink[][] {
    const chains: HandlerLink[][] = [];
    const visited = new Set<number>();

    for (const [addr, handler] of handlers) {
      if (visited.has(addr)) continue;

      const chain: HandlerLink[] = [handler];
      visited.add(addr);

      let current = handler;
      while (current.nextHandler !== null && !visited.has(current.nextHandler)) {
        const next = handlers.get(current.nextHandler);
        if (!next) break;
        chain.push(next);
        visited.add(current.nextHandler);
        current = next;
      }

      if (chain.length >= 2 || current.nextHandler === chain[0].handlerAddress) {
        chains.push(chain);
      }
    }

    return chains;
  }

  private parseImmediate(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "immediate") return null;
    const match = inst.operand.match(/^#\$([0-9a-fA-F]{1,2})$/);
    if (match) return parseInt(match[1], 16);
    const decMatch = inst.operand.match(/^#(\d+)$/);
    if (decMatch) return parseInt(decMatch[1], 10);
    return null;
  }

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
