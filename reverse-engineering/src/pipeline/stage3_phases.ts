// ============================================================================
// Stage 3 Per-Block RE Loop — Phases A/B/C/D
//
// Phase A: Request context
// Phase B: Gather context (with isReverseEngineered tags)
// Phase C: Sufficiency check + confidence
// Phase D: Attempt RE or bail
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  MutableGraphInterface,
  BlockStoreInterface,
  EnrichmentMap,
  VariableMapData,
  VariableEntry,
  BailReason,
  SymbolDBInterface,
  SearchHit,
  BlockAnalysis,
  REBlockEnrichment,
} from "../types.js";
import type { AIClient } from "../shared/ai_client.js";

import type { ReasoningEffort } from "../shared/ai_client.js";

export interface PerBlockREInput {
  block: Block;
  graph: MutableGraphInterface;
  blockStore: BlockStoreInterface;
  enrichments: EnrichmentMap;
  variableMap: VariableMapData;
  symbolDb: SymbolDBInterface;
  analyses: ReadonlyMap<string, BlockAnalysis>;
  qdrantSearch: (query: string) => Promise<SearchHit[]>;
  maxIterations: number;
  confidenceThreshold: number;
  forceAttempt: boolean;
  aiClient?: AIClient;
}

export interface PerBlockREResult {
  reverseEngineered: boolean;
  confidence: number;
  bailReason?: BailReason;
  analysis?: BlockAnalysis;
  variableEntries?: VariableEntry[];
  enrichments?: REBlockEnrichment[];
}

/**
 * Run the per-block RE loop: Phases A → B → C → D.
 * Without an aiCall function, uses heuristic analysis (for testing).
 */
export async function runPerBlockRELoop(input: PerBlockREInput): Promise<PerBlockREResult> {
  const { block, graph, enrichments, variableMap, analyses, forceAttempt, maxIterations, confidenceThreshold } = input;

  const nodeId = blockToNodeId(block);
  const node = graph.getNode(nodeId);

  // Phase A+B+C: Context request and evaluation loop
  let confidence = node?.pipelineState?.confidence ?? 0.5;
  let iterations = 0;
  let ready = false;

  while (iterations < maxIterations) {
    iterations++;

    // Phase A: Determine what context we need
    const contextAvailable = evaluateContext(block, graph, analyses);

    // Phase C: Evaluate sufficiency
    confidence = computeConfidence(block, contextAvailable, enrichments);

    if (confidence >= confidenceThreshold || forceAttempt) {
      ready = true;
      break;
    }

    // If we've iterated enough, accept what we have
    if (iterations >= maxIterations) break;
  }

  // Phase D: Attempt RE or bail
  if (ready || forceAttempt) {
    return attemptRE(input, confidence);
  }

  // Bail
  const bailReason = determineBailReason(block, graph, analyses, confidence, confidenceThreshold, iterations);
  return {
    reverseEngineered: false,
    confidence,
    bailReason,
  };
}

interface ContextEvaluation {
  calleeCount: number;
  calleesReversed: number;
  callerCount: number;
  callersReversed: number;
  hasEnrichments: boolean;
  hasBankingState: boolean;
}

function evaluateContext(
  block: Block,
  graph: MutableGraphInterface,
  analyses: ReadonlyMap<string, BlockAnalysis>,
): ContextEvaluation {
  const nodeId = blockToNodeId(block);
  const children = graph.getChildren(nodeId, "control_flow");
  const parents = graph.getParents(nodeId, "control_flow");
  const node = graph.getNode(nodeId);

  return {
    calleeCount: children.length,
    calleesReversed: children.filter(c => c.pipelineState.reverseEngineered).length,
    callerCount: parents.length,
    callersReversed: parents.filter(p => p.pipelineState.reverseEngineered).length,
    hasEnrichments: true, // Stage 1 always runs
    hasBankingState: node?.bankingState !== undefined,
  };
}

function computeConfidence(
  block: Block,
  ctx: ContextEvaluation,
  enrichments: EnrichmentMap,
): number {
  let confidence = 0.4; // Base

  // Boost for banking state known
  if (ctx.hasBankingState) confidence += 0.1;

  // Boost for callees being reverse engineered
  if (ctx.calleeCount > 0) {
    const ratio = ctx.calleesReversed / ctx.calleeCount;
    confidence += ratio * 0.2;
  } else {
    confidence += 0.15; // No callees = simpler
  }

  // Boost for callers being reverse engineered
  if (ctx.callerCount > 0) {
    const ratio = ctx.callersReversed / ctx.callerCount;
    confidence += ratio * 0.1;
  }

  // Boost for enrichments
  let enrichmentCount = 0;
  for (const [, entries] of enrichments) {
    enrichmentCount += entries.filter(e => e.blockAddress === block.address).length;
  }
  if (enrichmentCount > 5) confidence += 0.1;
  else if (enrichmentCount > 0) confidence += 0.05;

  // Penalty for complex blocks
  if (block.instructions && block.instructions.length > 50) confidence -= 0.1;

  return Math.max(0.1, Math.min(1.0, confidence));
}

async function attemptRE(input: PerBlockREInput, confidence: number): Promise<PerBlockREResult> {
  const { block, enrichments, symbolDb, analyses, graph, aiClient } = input;
  const blockId = block.id ?? `block_${block.address.toString(16)}`;

  if (aiClient) {
    return aiAttemptRE(input, confidence);
  }

  // Heuristic RE fallback
  const purpose = buildPurpose(block, enrichments, symbolDb);
  const category = buildCategory(block, enrichments);

  const analysis: BlockAnalysis = {
    blockId,
    purpose,
    category,
    confidence: Math.max(confidence, 0.5),
    variables: {},
    headerComment: `// ${purpose}`,
    inlineComments: {},
    isReverseEngineered: true,
  };

  const enrichmentsList: REBlockEnrichment[] = [{
    blockAddress: block.address,
    source: "stage3_re",
    type: "annotation",
    annotation: `RE Complete: ${purpose} (confidence: ${(confidence * 100).toFixed(0)}%)`,
    data: { purpose, category, confidence, isReverseEngineered: true },
  }];

  return {
    reverseEngineered: true,
    confidence: analysis.confidence,
    analysis,
    enrichments: enrichmentsList,
  };
}

async function assessComplexity(
  block: Block,
  enrichments: EnrichmentMap,
  aiClient: AIClient,
): Promise<ReasoningEffort> {
  const instCount = block.instructions?.length ?? 0;

  // Trivial blocks don't need AI assessment
  if (instCount <= 10) return "low";
  if (instCount <= 25) return "medium";

  // For larger blocks, ask AI to quickly assess
  const lines: string[] = [];
  lines.push(`Rate the complexity of this 6502 subroutine (${instCount} instructions):`);
  const purposeEnrichments = enrichments.get("ai_purpose_analysis") ?? [];
  const prior = purposeEnrichments.find(e => e.blockAddress === block.address);
  if (prior?.data?.purpose) lines.push(`Purpose: ${prior.data.purpose}`);

  // Show first and last few instructions for a quick overview
  const insts = block.instructions ?? [];
  for (const inst of insts.slice(0, 8)) {
    lines.push(`  ${inst.mnemonic} ${inst.operand}`);
  }
  if (insts.length > 16) lines.push(`  ... (${insts.length - 16} more)`);
  for (const inst of insts.slice(-8)) {
    lines.push(`  ${inst.mnemonic} ${inst.operand}`);
  }

  lines.push("");
  lines.push("Return JSON: { \"complexity\": \"low\" | \"medium\" | \"high\" }");
  lines.push("low = simple linear code, copy loops, trivial init");
  lines.push("medium = standard subroutines, indexed lookups, basic state machines");
  lines.push("high = complex algorithms, nested loops, self-modifying code, intricate hardware interaction");

  const response = await aiClient.jsonCall(lines.join("\n"), {
    reasoning_effort: "minimal",
  });

  const level = String(response.complexity ?? "medium");
  if (level === "low" || level === "medium" || level === "high") return level;
  return "medium";
}

async function aiAttemptRE(input: PerBlockREInput, confidence: number): Promise<PerBlockREResult> {
  const { block, enrichments, symbolDb, analyses, graph, aiClient, forceAttempt } = input;
  const blockId = block.id ?? `block_${block.address.toString(16)}`;
  const nodeId = blockToNodeId(block);

  // Determine reasoning effort: force-picks always use high, otherwise assess complexity
  let reasoningEffort: ReasoningEffort;
  if (forceAttempt) {
    reasoningEffort = "high";
  } else {
    reasoningEffort = await assessComplexity(block, enrichments, aiClient!);
  }

  // Build rich context for the AI
  const lines: string[] = [];
  lines.push(`Reverse engineer this 6502 subroutine at $${hex(block.address)}:`);
  lines.push("");

  // Include Stage 2 purpose if available
  const purposeEnrichments = enrichments.get("ai_purpose_analysis") ?? [];
  const priorPurpose = purposeEnrichments.find(e => e.blockAddress === block.address);
  if (priorPurpose?.data?.purpose) {
    lines.push(`Prior analysis suggests: ${priorPurpose.data.purpose}`);
  }

  // Banking context
  const node = graph.getNode(nodeId);
  if (node?.bankingState) {
    const entry = node.bankingState.onEntry;
    const banking = [];
    if (entry.kernalMapped === "no") banking.push("KERNAL banked out");
    if (entry.ioMapped === "no") banking.push("I/O banked out");
    if (banking.length > 0) lines.push(`Banking: ${banking.join(", ")}`);
  }

  // Callee context
  const children = graph.getChildren(nodeId, "control_flow");
  const reversedCallees = children.filter(c => c.pipelineState.reverseEngineered);
  if (reversedCallees.length > 0) {
    lines.push("");
    lines.push("Known callees:");
    for (const callee of reversedCallees.slice(0, 5)) {
      const calleeAnalysis = analyses.get(callee.id);
      if (calleeAnalysis) {
        lines.push(`  $${hex(callee.start)}: ${calleeAnalysis.purpose}`);
      }
    }
  }

  lines.push("");
  lines.push("Disassembly:");
  for (const inst of (block.instructions ?? []).slice(0, 60)) {
    const sym = symbolDb.lookup(parseAbsoluteTarget(inst.operand) ?? -1);
    const comment = sym ? `  ; ${sym.name}: ${sym.description}` : "";
    lines.push(`  $${hex(inst.address)}: ${inst.mnemonic} ${inst.operand}${comment}`);
  }
  if ((block.instructions?.length ?? 0) > 60) {
    lines.push(`  ... (${block.instructions!.length - 60} more instructions)`);
  }

  lines.push("");
  lines.push("Return JSON with:");
  lines.push("  purpose: one-line description of what this subroutine does");
  lines.push("  category: one of init, main_loop, interrupt, subroutine, graphics, sound, input, system, data_processing");
  lines.push("  algorithm_summary: brief description of the algorithm used");
  lines.push("  confidence: 0.0-1.0 how confident you are");
  lines.push("  headerComment: multi-line comment block for the subroutine header (plain text, no // prefix)");
  lines.push("  inlineComments: object mapping hex address to short comment for key instructions");
  lines.push("IMPORTANT comment rules:");
  lines.push("1. Do NOT repeat the instruction mnemonic/operand. Just the semantic meaning.");
  lines.push("2. Do NOT reference raw hex addresses ($094A, $D020) — describe semantically.");
  lines.push("   The output uses labels, so readers won't see hex addresses.");
  lines.push("BAD: \"LDA $094A,X - load from $094C\" GOOD: \"load entry from lookup table\"");
  lines.push("BAD: \"JSR $E544\" GOOD: \"initialize VIC and clear screen\"");
  lines.push("BAD: \"Copy $094A → $0400\" GOOD: \"copy text to screen RAM\"");

  const response = await aiClient!.jsonCall(lines.join("\n"), {
    reasoning_effort: reasoningEffort,
  });

  const purpose = String(response.purpose ?? buildPurpose(block, enrichments, symbolDb));
  const category = String(response.category ?? buildCategory(block, enrichments));
  const aiConfidence = Number(response.confidence ?? confidence);
  const finalConfidence = Math.max(aiConfidence, confidence, 0.5);

  const analysis: BlockAnalysis = {
    blockId,
    purpose,
    category,
    algorithm: response.algorithm_summary ? String(response.algorithm_summary) : undefined,
    confidence: finalConfidence,
    variables: {},
    headerComment: typeof response.headerComment === "string" ? response.headerComment : `// ${purpose}`,
    inlineComments: (response.inlineComments && typeof response.inlineComments === "object")
      ? response.inlineComments as Record<string, string>
      : {},
    isReverseEngineered: true,
  };

  const enrichmentsList: REBlockEnrichment[] = [{
    blockAddress: block.address,
    source: "stage3_re",
    type: "annotation",
    annotation: `RE Complete (AI): ${purpose} (confidence: ${(finalConfidence * 100).toFixed(0)}%)`,
    data: { purpose, category, confidence: finalConfidence, isReverseEngineered: true, algorithm: analysis.algorithm },
  }];

  return {
    reverseEngineered: true,
    confidence: finalConfidence,
    analysis,
    enrichments: enrichmentsList,
  };
}

function parseAbsoluteTarget(operand: string): number | null {
  const match = operand.match(/^\$([0-9a-fA-F]{4})$/);
  if (match) return parseInt(match[1], 16);
  return null;
}

function buildPurpose(block: Block, enrichments: EnrichmentMap, symbolDb: SymbolDBInterface): string {
  // Check Stage 2 purpose first
  const purposeEnrichments = enrichments.get("ai_purpose_analysis") ?? [];
  const purpose = purposeEnrichments.find(e => e.blockAddress === block.address);
  if (purpose?.data?.purpose && purpose.data.purpose !== "Unknown purpose") {
    return String(purpose.data.purpose);
  }

  // Heuristic
  if (!block.instructions || block.instructions.length === 0) return "Data block";

  const mnemonics = block.instructions.map(i => i.mnemonic.toLowerCase());
  if (mnemonics.some(m => m === "rti")) return "Interrupt handler";
  if (mnemonics.filter(m => m === "sta").length > 5) return "Hardware/memory initialization";

  const jsrTargets = block.instructions
    .filter(i => i.mnemonic.toLowerCase() === "jsr")
    .map(i => {
      const m = i.operand.match(/^\$([0-9a-fA-F]{4})$/);
      return m ? parseInt(m[1], 16) : null;
    })
    .filter((a): a is number => a !== null);

  for (const target of jsrTargets) {
    const sym = symbolDb.lookup(target);
    if (sym?.category === "kernal") return `Calls ${sym.name} (${sym.description})`;
  }

  return `Subroutine at $${hex(block.address)}`;
}

function buildCategory(block: Block, enrichments: EnrichmentMap): string {
  const catEnrichments = enrichments.get("ai_purpose_analysis") ?? [];
  const cat = catEnrichments.find(e => e.blockAddress === block.address);
  if (cat?.data?.category && cat.data.category !== "unknown") {
    return String(cat.data.category);
  }
  return block.type === "data" || block.type === "unknown" ? "data" : "code";
}

function determineBailReason(
  block: Block,
  graph: MutableGraphInterface,
  analyses: ReadonlyMap<string, BlockAnalysis>,
  confidence: number,
  threshold: number,
  iterations: number,
): BailReason {
  const nodeId = blockToNodeId(block);
  const children = graph.getChildren(nodeId, "control_flow");

  // Check for unresolved dependencies
  const unresolvedDeps = children
    .filter(c => !c.pipelineState.reverseEngineered)
    .map(c => c.id);

  if (unresolvedDeps.length > 0) {
    return {
      type: "needs_dependency",
      dependencies: unresolvedDeps,
      details: `${unresolvedDeps.length} callees not yet reverse-engineered`,
    };
  }

  if (iterations >= 3) {
    return { type: "hit_iteration_limit", iterations };
  }

  return { type: "low_confidence", confidence, threshold };
}

function blockToNodeId(block: Block): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
