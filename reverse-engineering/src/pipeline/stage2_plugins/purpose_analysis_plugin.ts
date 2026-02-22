// ============================================================================
// AI Purpose Analysis Plugin (Priority 20)
//
// Determines block purpose, category, algorithm using AI.
// Banking-aware: explicitly tells AI what ROM/RAM is mapped.
// Supports tool calls for interactive analysis.
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

export class PurposeAnalysisPlugin implements Stage2Plugin {
  name = "ai_purpose_analysis";
  priority = 20;
  private ai?: AIClient;

  constructor(ai?: AIClient) {
    this.ai = ai;
  }

  async run(input: Stage2PluginInput): Promise<Stage2PluginResult> {
    const enrichments: REBlockEnrichment[] = [];
    const block = input.block;

    if (!block.instructions || block.instructions.length === 0) {
      return { enrichments, confidence: 0.3 };
    }

    // If no AI client, use heuristic analysis
    if (!this.ai) {
      return this.heuristicAnalysis(input);
    }

    // Build AI prompt with context
    const prompt = this.buildPrompt(input);
    const response = await this.ai.jsonCall(prompt, {
      reasoning_effort: "low",
    });

    const purpose = String(response.purpose ?? "Unknown purpose");
    const category = String(response.category ?? "unknown");
    const algorithm = response.algorithm_summary ? String(response.algorithm_summary) : undefined;
    const confidence = Number(response.confidence ?? 0.5);

    enrichments.push({
      blockAddress: block.address,
      source: this.name,
      type: "annotation",
      annotation: `Purpose: ${purpose}`,
      data: { purpose, category, algorithm, confidence },
    });

    return {
      enrichments,
      confidence,
      reclassifications: response.reclassify ? [{
        blockAddress: block.address,
        newType: String(response.reclassify) as any,
        reason: `AI purpose analysis: ${purpose}`,
      }] : undefined,
    };
  }

  private heuristicAnalysis(input: Stage2PluginInput): Stage2PluginResult {
    const block = input.block;
    const enrichments: REBlockEnrichment[] = [];

    // Simple pattern-based purpose detection
    let purpose = "Unknown purpose";
    let category = "unknown";
    let confidence = 0.4;

    if (block.instructions) {
      const mnemonics = block.instructions.map(i => i.mnemonic.toLowerCase());
      const operands = block.instructions.map(i => i.operand);

      // Check for initialization patterns (many STA to hardware)
      const staCount = mnemonics.filter(m => m === "sta").length;
      const hwStores = operands.filter(o => o.match(/^\$D[0-9A-Fa-f]{3}$/)).length;
      if (hwStores > 3) {
        purpose = "Hardware initialization";
        category = "initialization";
        confidence = 0.6;
      }

      // Check for loop patterns
      const hasBranch = mnemonics.some(m => ["bne", "beq", "bcc", "bcs", "bpl", "bmi"].includes(m));
      const hasIndex = mnemonics.some(m => ["inx", "iny", "dex", "dey"].includes(m));
      if (hasBranch && hasIndex) {
        if (purpose === "Unknown purpose") {
          purpose = "Loop processing";
          category = "processing";
          confidence = 0.5;
        }
      }

      // Check for KERNAL calls
      const jsrTargets = block.instructions
        .filter(i => i.mnemonic.toLowerCase() === "jsr")
        .map(i => i.operand);
      const kernalCalls = jsrTargets.filter(o => o.match(/^\$FF[89A-F][0-9A-F]$/));
      if (kernalCalls.length > 0) {
        purpose = "KERNAL API usage";
        category = "system";
        confidence = 0.5;
      }

      // Check for RTS at end → subroutine
      if (mnemonics[mnemonics.length - 1] === "rts") {
        if (category === "unknown") category = "subroutine";
      }

      // Check for RTI → interrupt handler
      if (mnemonics.some(m => m === "rti")) {
        purpose = "Interrupt handler";
        category = "interrupt";
        confidence = 0.7;
      }

      // Check for SEI/CLI → interrupt management
      if (mnemonics.includes("sei")) {
        if (purpose === "Unknown purpose") {
          purpose = "Critical section (interrupts disabled)";
          category = "system";
          confidence = 0.5;
        }
      }
    }

    enrichments.push({
      blockAddress: block.address,
      source: this.name,
      type: "annotation",
      annotation: `Purpose: ${purpose}`,
      data: { purpose, category, confidence },
    });

    return { enrichments, confidence };
  }

  private buildPrompt(input: Stage2PluginInput): string {
    const block = input.block;
    const lines: string[] = [];
    const banking = getBankingState(block, input);

    lines.push(`Analyze this 6502 subroutine at $${hex(block.address)}:`);
    lines.push("");

    // Include disassembly with resolved symbol names
    if (block.instructions) {
      for (const inst of block.instructions.slice(0, 50)) {
        const resolvedOperand = input.symbolDb.resolveOperandForAI(inst.operand, banking);
        lines.push(`  $${hex(inst.address)}: ${inst.mnemonic} ${resolvedOperand}`);
      }
      if (block.instructions.length > 50) {
        lines.push(`  ... (${block.instructions.length - 50} more instructions)`);
      }
    }

    lines.push("");
    lines.push("Return JSON: { purpose, category, algorithm_summary, confidence, research_needed }");

    return lines.join("\n");
  }
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
