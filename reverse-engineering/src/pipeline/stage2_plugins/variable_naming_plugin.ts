// ============================================================================
// AI Variable Naming Plugin (Priority 30)
//
// Assigns meaningful variable names for all addresses used in the block.
// Uses AI when available, falls back to heuristic naming.
// ============================================================================

import type {
  Stage2Plugin,
  Stage2PluginInput,
  Stage2PluginResult,
  REBlockEnrichment,
  VariableEntry,
  BankingSnapshot,
  RegisterValue,
} from "../../types.js";
import type { AIClient } from "../../shared/ai_client.js";

export class VariableNamingPlugin implements Stage2Plugin {
  name = "ai_variable_naming";
  priority = 30;
  private ai?: AIClient;

  constructor(ai?: AIClient) {
    this.ai = ai;
  }

  async run(input: Stage2PluginInput): Promise<Stage2PluginResult> {
    const enrichments: REBlockEnrichment[] = [];
    const variableEntries: VariableEntry[] = [];
    const block = input.block;

    if (!block.instructions || block.instructions.length === 0) {
      return { enrichments, confidence: 0.5 };
    }

    // Collect all ZP and memory addresses used
    const addressUsage = new Map<number, { reads: number; writes: number }>();

    for (const inst of block.instructions) {
      const mn = inst.mnemonic.toLowerCase();
      const addr = parseAddress(inst.operand);
      if (addr === null) continue;

      // Skip hardware registers (they have fixed names), but allow color RAM ($D800-$DBE7)
      if (addr >= 0xD000 && addr <= 0xD7FF) continue;
      if (addr >= 0xDC00 && addr <= 0xDFFF) continue;
      // Skip KERNAL/ROM range
      if (addr >= 0xA000 && addr <= 0xBFFF) continue;
      if (addr >= 0xE000) continue;

      const usage = addressUsage.get(addr) ?? { reads: 0, writes: 0 };
      if (isRead(mn)) usage.reads++;
      if (isWrite(mn)) usage.writes++;
      addressUsage.set(addr, usage);
    }

    if (addressUsage.size === 0) {
      return { enrichments, confidence: 0.5 };
    }

    // Get purpose from prior plugins
    const purposeResult = input.priorStage2Results.get("ai_purpose_analysis");
    const purpose = getEnrichmentField(purposeResult, "purpose") ?? "unknown";

    const blockId = block.id ?? `block_${block.address.toString(16)}`;
    let variables: Record<string, string>;

    if (this.ai) {
      variables = await this.aiNaming(block, addressUsage, purpose, input);
    } else {
      variables = this.heuristicNaming(addressUsage, input);
    }

    // Build variable entries for the variable map
    for (const [hexKey, name] of Object.entries(variables)) {
      const addr = parseInt(hexKey, 16);
      const usage = addressUsage.get(addr) ?? { reads: 0, writes: 0 };

      variableEntries.push({
        address: addr,
        currentName: name,
        nameHistory: [],
        usedBy: [blockId],
        usageContexts: [{
          blockId,
          name,
          usage: usage.reads > 0 && usage.writes > 0 ? "read_write" : usage.reads > 0 ? "read" : "write",
          confidence: this.ai ? 0.7 : 0.5,
          source: "stage2",
        }],
        scope: addr < 0x100 ? "local" : "global",
        type: "unknown",
      });
    }

    enrichments.push({
      blockAddress: block.address,
      source: this.name,
      type: "annotation",
      annotation: `Variables: ${Object.entries(variables).map(([k, v]) => `$${k}=${v}`).join(", ")}`,
      data: { variables },
    });

    return { enrichments, confidence: this.ai ? 0.7 : 0.5, variableEntries };
  }

  private async aiNaming(
    block: import("@c64/shared").Block,
    addressUsage: Map<number, { reads: number; writes: number }>,
    purpose: string,
    input: Stage2PluginInput,
  ): Promise<Record<string, string>> {
    const banking = getBankingState(block, input);
    const lines: string[] = [];
    lines.push(`This subroutine's purpose: ${purpose}`);
    lines.push(`Disassembly at $${hex(block.address)}:`);
    lines.push("");
    for (const inst of (block.instructions ?? []).slice(0, 40)) {
      const resolvedOperand = input.symbolDb.resolveOperandForAI(inst.operand, banking);
      lines.push(`  $${hex(inst.address)}: ${inst.mnemonic} ${resolvedOperand}`);
    }
    lines.push("");
    lines.push("Addresses used (not hardware registers):");
    for (const [addr, usage] of addressUsage) {
      const rw = usage.reads > 0 && usage.writes > 0 ? "read+write" : usage.reads > 0 ? "read" : "write";
      const loc = addr < 0x100 ? "zero page"
        : addr >= 0x0400 && addr <= 0x07E7 ? "screen RAM"
        : addr >= 0x07F8 && addr <= 0x07FF ? "sprite pointers"
        : addr >= 0xD800 && addr <= 0xDBE7 ? "color RAM"
        : "memory";
      // Include data format info if this address is a known data block
      const fmtInfo = this.getDataFormatInfo(addr, input);
      const extra = fmtInfo ? ` — ${fmtInfo}` : "";
      lines.push(`  $${hex(addr)}: ${rw} (${loc})${extra}`);
    }
    lines.push("");
    lines.push("Return JSON with a single \"variables\" object mapping hex address (uppercase, no $) to a short snake_case name.");
    lines.push("Names should reflect the variable's role in this subroutine (e.g. sprite_frame, scroll_pos, color_index).");
    lines.push("For data block addresses, name based on what the DATA CONTAINS (text, sprites, colors), not just how it's used.");
    lines.push("For screen/color RAM offsets, use descriptive names (e.g. screen_row_11, color_row_11).");
    lines.push("Example: { \"variables\": { \"FB\": \"src_ptr_lo\", \"FC\": \"src_ptr_hi\", \"09A4\": \"title_text\" } }");

    const response = await this.ai!.jsonCall(lines.join("\n"), {
      reasoning_effort: "low",
    });

    const vars = response.variables;
    if (vars && typeof vars === "object") {
      return vars as Record<string, string>;
    }
    return {};
  }

  private getDataFormatInfo(addr: number, input: Stage2PluginInput): string | null {
    const fmtEntries = input.enrichments.get("data_format") ?? [];
    const fmt = fmtEntries.find(e => e.blockAddress === addr);
    if (fmt?.data?.format) {
      const format = String(fmt.data.format);
      const desc = fmt.annotation ?? format;
      return desc;
    }
    // Check data_table_semantics
    const semEntries = input.enrichments.get("data_table_semantics") ?? [];
    const sem = semEntries.find(e => e.blockAddress === addr);
    if (sem?.annotation) return sem.annotation;
    return null;
  }

  private heuristicNaming(
    addressUsage: Map<number, { reads: number; writes: number }>,
    input: Stage2PluginInput,
  ): Record<string, string> {
    const variables: Record<string, string> = {};

    for (const [addr, usage] of addressUsage) {
      const hexKey = addr.toString(16).toUpperCase().padStart(2, "0");
      const existing = input.variableMap.variables[hexKey];
      if (existing && existing.currentName !== `zp_${hexKey.toLowerCase()}`) {
        variables[hexKey] = existing.currentName;
        continue;
      }

      const sym = input.symbolDb.lookup(addr);
      if (sym) {
        variables[hexKey] = sym.name.toLowerCase();
        continue;
      }

      let name: string;
      if (addr < 0x100) {
        if (addr === 0xFB || addr === 0xFC) name = "ptr_lo";
        else if (addr === 0xFD || addr === 0xFE) name = "ptr_hi";
        else if (usage.writes > 0 && usage.reads > 0) name = `zp_${hexKey.toLowerCase()}`;
        else if (usage.reads > 0) name = `zp_${hexKey.toLowerCase()}_val`;
        else name = `zp_${hexKey.toLowerCase()}`;
      } else {
        name = `mem_${hexKey.toLowerCase()}`;
      }

      variables[hexKey] = name;
    }

    return variables;
  }
}

function parseAddress(operand: string): number | null {
  const match = operand.match(/^\$([0-9a-fA-F]+)/);
  if (match) return parseInt(match[1], 16);
  return null;
}

function isRead(mn: string): boolean {
  return ["lda", "ldx", "ldy", "cmp", "cpx", "cpy", "bit"].includes(mn);
}

function isWrite(mn: string): boolean {
  return ["sta", "stx", "sty", "inc", "dec", "asl", "lsr", "rol", "ror"].includes(mn);
}

function getEnrichmentField(result: any, field: string): string | undefined {
  if (!result?.enrichments) return undefined;
  for (const e of result.enrichments) {
    if (e.data?.[field]) return String(e.data[field]);
  }
  return undefined;
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}

function getBankingState(block: import("@c64/shared").Block, input: Stage2PluginInput): BankingSnapshot {
  const addr = block.address.toString(16).padStart(4, "0");
  const nodeId = (block.type === "data" || block.type === "unknown" ? "data_" : "code_") + addr;
  const node = input.graph.getNode(nodeId);
  if (node?.bankingState?.onEntry) return node.bankingState.onEntry;
  const mkReg = (val: number): RegisterValue => ({
    bitmask: { knownMask: 0xFF, knownValue: val }, possibleValues: new Set([val]),
    isDynamic: false, source: "default",
  });
  return {
    cpuPort: mkReg(0x37), vicBank: mkReg(0x03), vicMemPtr: mkReg(0x14),
    kernalMapped: "yes", basicMapped: "yes", ioMapped: "yes", chargenMapped: "no",
  };
}
