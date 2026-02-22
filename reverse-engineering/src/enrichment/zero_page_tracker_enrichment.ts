// ============================================================================
// Zero Page Tracker Enrichment (Priority 12)
//
// Track ZP writes/reads across blocks. Identify ZP locations used as pointers
// (consecutive byte pairs like $FA/$FB). Map which blocks set vs read each
// ZP location.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

interface ZPUsage {
  address: number;
  readers: Set<number>;  // block addresses that read this ZP
  writers: Set<number>;  // block addresses that write this ZP
}

export class ZeroPageTrackerEnrichment implements EnrichmentPlugin {
  name = "zero_page_tracker";
  priority = 12;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const zpUsage = new Map<number, ZPUsage>();

    // Scan all code blocks for ZP access
    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      for (const inst of block.instructions) {
        const zpAddr = this.getZPAddress(inst);
        if (zpAddr === null) continue;

        if (!zpUsage.has(zpAddr)) {
          zpUsage.set(zpAddr, { address: zpAddr, readers: new Set(), writers: new Set() });
        }
        const usage = zpUsage.get(zpAddr)!;

        if (this.isWrite(inst)) {
          usage.writers.add(block.address);
        }
        if (this.isRead(inst)) {
          usage.readers.add(block.address);
        }
      }
    }

    // Detect pointer pairs (consecutive ZP bytes used together)
    const enrichments: REBlockEnrichment[] = [];
    const pointerPairs: Array<{ lo: number; hi: number }> = [];

    for (const [addr, usage] of zpUsage) {
      const nextAddr = addr + 1;
      const nextUsage = zpUsage.get(nextAddr);
      if (!nextUsage) continue;
      if (addr >= 0xFE) continue; // $FE+$FF is boundary

      // Both bytes used by overlapping blocks → likely a pointer pair
      const sharedBlocks = new Set(
        [...usage.readers, ...usage.writers].filter(
          b => nextUsage.readers.has(b) || nextUsage.writers.has(b),
        ),
      );
      if (sharedBlocks.size > 0) {
        pointerPairs.push({ lo: addr, hi: nextAddr });
      }
    }

    // Emit enrichments for ZP usage
    for (const [addr, usage] of zpUsage) {
      if (usage.readers.size + usage.writers.size > 0) {
        enrichments.push({
          blockAddress: 0, // global enrichment, not block-specific
          source: this.name,
          type: "annotation",
          annotation: `ZP $${hex(addr)}: ${usage.writers.size} writer(s), ${usage.readers.size} reader(s)`,
          data: {
            zpAddress: addr,
            readers: [...usage.readers],
            writers: [...usage.writers],
          },
        });
      }
    }

    // Emit enrichments for detected pointer pairs
    for (const pair of pointerPairs) {
      enrichments.push({
        blockAddress: 0,
        source: this.name,
        type: "pointer_pair",
        annotation: `Pointer pair: $${hex(pair.lo)}/$${hex(pair.hi)}`,
        data: {
          lowByte: pair.lo,
          highByte: pair.hi,
        },
      });
    }

    return { enrichments };
  }

  private getZPAddress(inst: BlockInstruction): number | null {
    const mode = inst.addressingMode;
    if (
      mode !== "zero_page" &&
      mode !== "zero_page_x" &&
      mode !== "zero_page_y" &&
      mode !== "indirect_x" &&
      mode !== "indirect_y"
    ) {
      return null;
    }

    const match = inst.operand.match(/\$([0-9a-fA-F]{1,2})/);
    if (!match) return null;
    const addr = parseInt(match[1], 16);
    return addr <= 0xFF ? addr : null;
  }

  private isWrite(inst: BlockInstruction): boolean {
    const mn = inst.mnemonic.toLowerCase();
    return mn === "sta" || mn === "stx" || mn === "sty" ||
           mn === "inc" || mn === "dec" ||
           mn === "asl" || mn === "lsr" || mn === "rol" || mn === "ror";
  }

  private isRead(inst: BlockInstruction): boolean {
    const mn = inst.mnemonic.toLowerCase();
    return mn === "lda" || mn === "ldx" || mn === "ldy" ||
           mn === "cmp" || mn === "cpx" || mn === "cpy" ||
           mn === "bit" || mn === "adc" || mn === "sbc" ||
           mn === "and" || mn === "ora" || mn === "eor" ||
           mn === "inc" || mn === "dec" || // read-modify-write
           mn === "asl" || mn === "lsr" || mn === "rol" || mn === "ror";
  }
}

function hex(v: number): string {
  return v.toString(16).toUpperCase().padStart(2, "0");
}
