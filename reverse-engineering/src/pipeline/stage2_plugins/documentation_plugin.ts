// ============================================================================
// AI Documentation Plugin (Priority 40)
//
// Generates header comment, inline comments via AI.
// Banking state prominently documented.
// Falls back to heuristic comments when no AI available.
// ============================================================================

import type {
  Stage2Plugin,
  Stage2PluginInput,
  Stage2PluginResult,
  REBlockEnrichment,
  BankingSnapshot,
  RegisterValue,
} from "../../types.js";
import type { AIClient } from "../../shared/ai_client.js";

export class DocumentationPlugin implements Stage2Plugin {
  name = "ai_documentation";
  priority = 40;
  private ai?: AIClient;

  constructor(ai?: AIClient) {
    this.ai = ai;
  }

  async run(input: Stage2PluginInput): Promise<Stage2PluginResult> {
    const enrichments: REBlockEnrichment[] = [];
    const block = input.block;

    if (!block.instructions || block.instructions.length === 0) {
      return { enrichments, confidence: 0.5 };
    }

    // Get purpose from prior analysis
    const purposeResult = input.priorStage2Results.get("ai_purpose_analysis");
    const purpose = getField(purposeResult, "purpose") ?? "Unknown purpose";
    const category = getField(purposeResult, "category") ?? "unknown";
    const confidence = purposeResult?.confidence ?? 0.5;

    // Get variable names
    const varResult = input.priorStage2Results.get("ai_variable_naming");
    const variables = getField(varResult, "variables") ?? {};

    // Banking state context
    const nodeId = blockToNodeId(block);
    const node = input.graph.getNode(nodeId);
    const bankingNotes: string[] = [];
    if (node?.bankingState) {
      const entry = node.bankingState.onEntry;
      if (entry.kernalMapped === "no") bankingNotes.push("KERNAL ROM is banked out — $E000-$FFFF = RAM");
      if (entry.ioMapped === "no") bankingNotes.push("I/O is banked out — $D000-$DFFF = RAM");
    }

    let headerComment: string;
    let inlineComments: Record<string, string>;
    let internalLabels: Record<string, string> = {};

    if (this.ai) {
      const result = await this.aiDocumentation(block, purpose, category, variables, bankingNotes, input);
      headerComment = result.headerComment;
      inlineComments = result.inlineComments;
      internalLabels = result.internalLabels;
    } else {
      headerComment = this.heuristicHeader(purpose, category, bankingNotes, confidence);
      inlineComments = this.heuristicInlineComments(block, input);
    }

    enrichments.push({
      blockAddress: block.address,
      source: this.name,
      type: "annotation",
      annotation: `Documentation generated (${Object.keys(inlineComments).length} inline comments)`,
      data: { headerComment, inlineComments, internalLabels },
    });

    return { enrichments, confidence };
  }

  private async aiDocumentation(
    block: import("@c64/shared").Block,
    purpose: string,
    category: string,
    variables: Record<string, string>,
    bankingNotes: string[],
    input: Stage2PluginInput,
  ): Promise<{ headerComment: string; inlineComments: Record<string, string>; internalLabels: Record<string, string> }> {
    const banking = getBankingState(block, input);
    const lines: string[] = [];
    lines.push(`Subroutine at $${hex(block.address)} — Purpose: ${purpose} (Category: ${category})`);
    if (bankingNotes.length > 0) lines.push(`Banking: ${bankingNotes.join("; ")}`);
    if (Object.keys(variables).length > 0) {
      lines.push(`Variables: ${Object.entries(variables).map(([k, v]) => `$${k}=${v}`).join(", ")}`);
    }

    // Identify branch/jump targets within this block for labeling
    const branchTargets = new Set<number>();
    if (block.instructions) {
      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();
        if (["bne", "beq", "bcc", "bcs", "bpl", "bmi", "bvc", "bvs", "jmp"].includes(mn)) {
          const m = inst.operand.match(/\$([0-9A-Fa-f]{4})/);
          if (m) {
            const target = parseInt(m[1], 16);
            if (target >= block.address && target < block.endAddress && target !== block.address) {
              branchTargets.add(target);
            }
          }
        }
      }
    }

    lines.push("");
    lines.push("Disassembly:");
    for (const inst of (block.instructions ?? []).slice(0, 50)) {
      const marker = branchTargets.has(inst.address) ? " <<< BRANCH TARGET" : "";
      const resolvedOperand = input.symbolDb.resolveOperandForAI(inst.operand, banking);
      lines.push(`  $${hex(inst.address)}: ${inst.mnemonic} ${resolvedOperand}${marker}`);
    }
    lines.push("");
    lines.push("Return JSON with:");
    lines.push("  \"headerComment\": a multi-line comment block describing this subroutine (plain text, no // prefix)");
    lines.push("  \"inlineComments\": object mapping hex address (no $) to short comment for KEY instructions ONLY");
    if (branchTargets.size > 0) {
      lines.push(`  "internalLabels": object mapping hex address (no $) to a short snake_case label for each branch target`);
      lines.push(`    Branch targets: ${[...branchTargets].map(a => "$" + hex(a)).join(", ")}`);
      lines.push("    Use descriptive names like: copy_sprite_colors, check_frame_done, update_next_entry");
    }
    lines.push("");
    lines.push("CRITICAL inline comment rules:");
    lines.push("1. Be SPARSE — only comment instructions where the purpose is not obvious from the label/operand.");
    lines.push("2. Do NOT comment trivial instructions: rts, sei, cli, inx, iny, dex, dey, tax, tay, etc.");
    lines.push("3. Do NOT comment instructions whose meaning is clear from the label (e.g. 'sta EXTCOL' already says border color).");
    lines.push("4. DO comment: loop purpose on the branch, what a data table means, why a magic constant is used.");
    lines.push("5. Do NOT repeat the mnemonic or operand in the comment.");
    lines.push("6. Do NOT reference raw hex addresses — the output uses labels.");
    lines.push("7. Aim for roughly 20-40% of instructions commented, not 100%.");
    lines.push("BAD: \"rts — return to caller\" (obvious)");
    lines.push("BAD: \"sta EXTCOL — set border color\" (label says it)");
    lines.push("GOOD: \"loop until all 40 bytes copied\" (on a bne)");
    lines.push("GOOD: \"acknowledge the VIC interrupt\" (on inc VICIRQ — non-obvious)");
    lines.push("Focus on WHAT the code does semantically. Use variable names where available.");

    const response = await this.ai!.jsonCall(lines.join("\n"), {
      reasoning_effort: "low",
    });

    return {
      headerComment: typeof response.headerComment === "string" ? response.headerComment : `// ${purpose}`,
      inlineComments: (response.inlineComments && typeof response.inlineComments === "object")
        ? response.inlineComments as Record<string, string>
        : {},
      internalLabels: (response.internalLabels && typeof response.internalLabels === "object")
        ? response.internalLabels as Record<string, string>
        : {},
    };
  }

  private heuristicHeader(purpose: string, category: string, bankingNotes: string[], confidence: number): string {
    const headerLines: string[] = [];
    headerLines.push(`// ${purpose}`);
    if (category !== "unknown") headerLines.push(`// Category: ${category}`);
    for (const note of bankingNotes) headerLines.push(`// NOTE: ${note}`);
    if (confidence < 0.5) headerLines.push("// LOW CONFIDENCE — needs human review");
    return headerLines.join("\n");
  }

  private heuristicInlineComments(
    block: import("@c64/shared").Block,
    input: Stage2PluginInput,
  ): Record<string, string> {
    const inlineComments: Record<string, string> = {};
    if (block.instructions) {
      for (const inst of block.instructions) {
        const sym = input.symbolDb.lookup(parseAbsoluteTarget(inst.operand) ?? -1);
        if (sym && sym.category === "hardware") {
          inlineComments[inst.address.toString(16)] = sym.description;
        }
      }
    }
    return inlineComments;
  }
}

function getField(result: any, field: string): any {
  if (!result?.enrichments) return undefined;
  for (const e of result.enrichments) {
    if (e.data?.[field] !== undefined) return e.data[field];
  }
  return undefined;
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}

function parseAbsoluteTarget(operand: string): number | null {
  const match = operand.match(/^\$([0-9a-fA-F]{4})$/);
  if (match) return parseInt(match[1], 16);
  return null;
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
