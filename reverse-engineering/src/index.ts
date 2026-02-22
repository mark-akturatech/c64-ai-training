#!/usr/bin/env node
// ============================================================================
// C64 Reverse Engineering Pipeline — CLI Entry Point
// ============================================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { Block, LoadedRegion } from "@c64/shared";
import type { EnrichmentMap } from "./types.js";
import { BlockStore } from "./block_store.js";
import { MutableGraph } from "./mutable_graph.js";
import { SymbolDB } from "./shared/symbol_db.js";
import { runStage1Enrichment } from "./enrichment/index.js";
import { runStage2 } from "./pipeline/stage2_orchestrator.js";
import { runStage3 } from "./pipeline/stage3_orchestrator.js";
import { runStage4 } from "./pipeline/stage4_integration.js";
import { runStage5 } from "./pipeline/polish/stage5_polish.js";
import { AIClient } from "./shared/ai_client.js";
import { PipelineLogger } from "./shared/pipeline_logger.js";

const USAGE = `
c64-reverse-engineering — AI-powered reverse engineering pipeline for C64/6502 binaries

Usage:
  npx tsx src/index.ts <blocks.json|input.prg> [options]

Input:
  blocks.json              Pre-analyzed blocks from static analysis
  input.prg                Raw .prg file (runs static analysis first)

Options:
  --output-dir, -o <dir>   Output directory (default: current directory)
  --from <stage>           Resume from stage: stage1, stage2, stage3, stage4, stage5
  --to <stage>             Stop after stage: stage1, stage2, stage3, stage4, stage5
  --force                  Ignore saved pipeline state, rerun from scratch
  --model <name>           OpenAI model (default: gpt-5-mini)
  --max-outer-passes <n>   Max Stage 3 outer loop passes (default: 10)
  --max-iterations <n>     Max per-block Stage 3 iterations (default: 3)
  --confidence-threshold <n> Min confidence for Stage 3 (default: 0.6)
  --cost-budget <n>        Max cost in USD (default: 1.00)
  --entry <addr>           Entry address for .prg files (hex, e.g. 0x0810)
  --verbose, -v            Show per-plugin, per-block progress
  --help, -h               Show this help

Stages:
  stage1  Static Enrichment — deterministic plugins, banking propagation
  stage2  AI Enrichment — purpose analysis, variable naming, documentation
  stage3  AI Reverse Engineering — iterative per-block RE with outer loop
  stage4  Integration — module assignment, file splitting, dead code analysis
  stage5  Polish — holistic label/comment/data quality improvement (3 AI passes)

Output:
  blocks.json              Enriched blocks with pipeline state
  dependency_tree.json     Enriched dependency tree (from static analysis)
  variable_map.json        Global variable naming map
  integration.json         Module assignments, file structure, dead code
  pipeline_state.json      Cost tracking, stage progress

Examples:
  npx tsx src/index.ts test/spriteintro-output/blocks.json -o test/re-output/
  npx tsx src/index.ts input.prg --entry 0x0810 -o output/
  npx tsx src/index.ts blocks.json --from stage3 --to stage3
  npx tsx src/index.ts blocks.json --force --cost-budget 0.50
`.trim();

interface PipelineOptions {
  inputFile: string;
  outputDir: string;
  from: string;
  to: string;
  force: boolean;
  model: string;
  maxOuterPasses: number;
  maxIterations: number;
  confidenceThreshold: number;
  costBudget: number;
  entry?: number;
  verbose: boolean;
}

const STAGE_ORDER = ["stage1", "stage2", "stage3", "stage4", "stage5"];

function parseArgs(args: string[]): PipelineOptions {
  const options: PipelineOptions = {
    inputFile: "",
    outputDir: ".",
    from: "stage1",
    to: "stage5",
    force: false,
    model: "gpt-5-mini",
    maxOuterPasses: 10,
    maxIterations: 3,
    confidenceThreshold: 0.6,
    costBudget: 1.0,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else if (arg === "--output-dir" || arg === "-o") {
      options.outputDir = args[++i] ?? ".";
    } else if (arg === "--from") {
      options.from = args[++i] ?? "stage1";
    } else if (arg === "--to") {
      options.to = args[++i] ?? "stage4";
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--model") {
      options.model = args[++i] ?? "gpt-5-mini";
    } else if (arg === "--max-outer-passes") {
      options.maxOuterPasses = parseInt(args[++i] ?? "10", 10);
    } else if (arg === "--max-iterations") {
      options.maxIterations = parseInt(args[++i] ?? "3", 10);
    } else if (arg === "--confidence-threshold") {
      options.confidenceThreshold = parseFloat(args[++i] ?? "0.6");
    } else if (arg === "--cost-budget") {
      options.costBudget = parseFloat(args[++i] ?? "1.0");
    } else if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--entry") {
      options.entry = parseInt(args[++i] ?? "0", 16);
    } else if (!arg.startsWith("-") && !options.inputFile) {
      options.inputFile = arg;
    }
  }

  return options;
}

function shouldRunStage(stage: string, from: string, to: string): boolean {
  const stageIdx = STAGE_ORDER.indexOf(stage);
  const fromIdx = STAGE_ORDER.indexOf(from);
  const toIdx = STAGE_ORDER.indexOf(to);
  return stageIdx >= fromIdx && stageIdx <= toIdx;
}

interface PipelineState {
  stages: Record<string, { status: string; [key: string]: unknown }>;
  cost: {
    totalApiCalls: number;
    totalTokens: number;
    estimatedCostUsd: number;
    perStage: Record<string, { calls: number; tokens: number; cost: number }>;
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(USAGE);
    process.exit(0);
  }

  const opts = parseArgs(args);
  if (!opts.inputFile) {
    console.error("Error: input file required. Use --help for usage.");
    process.exit(1);
  }

  // Resolve input
  const inputPath = resolve(opts.inputFile);
  if (!existsSync(inputPath)) {
    console.error(`Error: input file not found: ${inputPath}`);
    process.exit(1);
  }

  // Ensure output directory
  const outputDir = resolve(opts.outputDir);
  mkdirSync(outputDir, { recursive: true });

  console.error(`RE Pipeline: ${inputPath}`);
  console.error(`Output: ${outputDir}`);
  console.error(`Stages: ${opts.from} → ${opts.to}`);

  // Load input
  let blocksJsonPath: string;
  let treeJsonPath: string;

  if (inputPath.endsWith(".prg")) {
    console.error("Error: .prg input not yet supported. Run static analysis first to produce blocks.json.");
    process.exit(1);
  }

  blocksJsonPath = inputPath;
  treeJsonPath = resolve(dirname(inputPath), "dependency_tree.json");

  if (!existsSync(treeJsonPath)) {
    console.error(`Error: dependency_tree.json not found at ${treeJsonPath}`);
    process.exit(1);
  }

  const blocksJson = JSON.parse(readFileSync(blocksJsonPath, "utf8"));
  const treeJson = JSON.parse(readFileSync(treeJsonPath, "utf8"));

  const blocks: Block[] = blocksJson.blocks;
  const blockStore = new BlockStore(blocks);
  const graph = MutableGraph.fromDependencyTree(treeJson);
  const symbolDb = new SymbolDB();

  // Build memory from block data
  const memory = new Uint8Array(65536);
  for (const block of blocks) {
    if (block.raw) {
      const bytes = Buffer.from(block.raw, "base64");
      for (let i = 0; i < bytes.length && block.address + i < 65536; i++) {
        memory[block.address + i] = bytes[i];
      }
    }
  }

  const loadedRegions: LoadedRegion[] = blocksJson.metadata?.loadedRegions ?? [{
    start: blocks[0]?.address ?? 0x0800,
    end: Math.max(...blocks.map((b: Block) => b.endAddress)),
    source: "prg",
  }];

  // Create AI client if API key available
  let aiClient: AIClient | undefined;
  if (process.env.OPENAI_API_KEY) {
    aiClient = new AIClient({ model: opts.model });
    console.error(`AI: ${opts.model} (OpenAI key detected)`);
  } else {
    console.error("AI: disabled (no OPENAI_API_KEY — using heuristics only)");
  }

  const logger = new PipelineLogger(opts.verbose);

  // Pipeline state tracking
  const pipelineState: PipelineState = {
    stages: {},
    cost: {
      totalApiCalls: 0,
      totalTokens: 0,
      estimatedCostUsd: 0,
      perStage: {},
    },
  };

  // ── Stage 1: Static Enrichment ──
  let enrichments = new Map() as import("./types.js").EnrichmentMap;
  if (shouldRunStage("stage1", opts.from, opts.to)) {
    console.error("\n=== Stage 1: Static Enrichment ===");
    const stage1Result = await runStage1Enrichment({
      blockStore, graph, memory, loadedRegions, logger,
    });
    enrichments = stage1Result.enrichments;
    pipelineState.stages.stage1_enrichment = {
      status: "completed",
      passes: stage1Result.stats.passes,
      reclassifications: stage1Result.stats.reclassifications,
      newGraphEdges: stage1Result.stats.newGraphEdges,
      bankingNodesAnnotated: stage1Result.stats.bankingNodesAnnotated,
      totalEnrichments: stage1Result.stats.totalEnrichments,
    };
    console.error(`  Passes: ${stage1Result.stats.passes}`);
    console.error(`  Enrichments: ${stage1Result.stats.totalEnrichments}`);
    console.error(`  Banking nodes: ${stage1Result.stats.bankingNodesAnnotated}`);
    console.error(`  New edges: ${stage1Result.stats.newGraphEdges}`);
  }

  // ── Stage 2: AI Enrichment ──
  let variableMap: import("./types.js").VariableMapData = {
    metadata: { source: "stage2", timestamp: new Date().toISOString(), totalVariables: 0 },
    variables: {},
  };
  if (shouldRunStage("stage2", opts.from, opts.to)) {
    console.error("\n=== Stage 2: AI Enrichment ===");
    const stage2Result = await runStage2({
      blockStore, graph, memory, loadedRegions,
      enrichments, symbolDb, aiClient, logger,
    });
    variableMap = stage2Result.variableMap;
    enrichments = stage2Result.enrichments;
    const s2ai = aiClient?.stats;
    pipelineState.stages.stage2_ai_enrichment = {
      status: "completed",
      blocksProcessed: stage2Result.stats.totalBlocks,
      variableMapEntries: Object.keys(variableMap.variables).length,
      aiCalls: s2ai?.calls ?? 0,
      aiTokens: s2ai?.tokens ?? 0,
    };
    console.error(`  Blocks processed: ${stage2Result.stats.totalBlocks}`);
    console.error(`  Variables: ${Object.keys(variableMap.variables).length}`);
    if (s2ai) console.error(`  AI calls: ${s2ai.calls}, tokens: ${s2ai.tokens}`);
  }

  // ── Stage 3: AI Reverse Engineering ──
  let analyses = new Map<string, import("./types.js").BlockAnalysis>();
  if (shouldRunStage("stage3", opts.from, opts.to)) {
    console.error("\n=== Stage 3: AI Reverse Engineering ===");
    const s3aiStart = aiClient?.stats;
    const stage3Result = await runStage3({
      blockStore, graph, memory, loadedRegions,
      enrichments, variableMap, symbolDb,
      maxOuterPasses: opts.maxOuterPasses,
      confidenceThreshold: opts.confidenceThreshold,
      maxIterationsPerBlock: opts.maxIterations,
      aiClient, logger,
    });
    variableMap = stage3Result.variableMap;
    enrichments = stage3Result.enrichments;
    analyses = new Map(stage3Result.analyses);
    const s3ai = aiClient?.stats;
    const s3aiCalls = (s3ai?.calls ?? 0) - (s3aiStart?.calls ?? 0);
    const s3aiTokens = (s3ai?.tokens ?? 0) - (s3aiStart?.tokens ?? 0);
    pipelineState.stages.stage3_reverse_engineering = {
      status: "completed",
      outerPasses: stage3Result.stats.outerPasses,
      blocksReverseEngineered: stage3Result.stats.blocksReverseEngineered,
      blocksBailed: stage3Result.stats.blocksBailed,
      forcePicks: stage3Result.stats.forcePicks,
      aiCalls: s3aiCalls,
      aiTokens: s3aiTokens,
    };
    console.error(`  Outer passes: ${stage3Result.stats.outerPasses}`);
    console.error(`  Blocks RE'd: ${stage3Result.stats.blocksReverseEngineered}`);
    console.error(`  Force picks: ${stage3Result.stats.forcePicks}`);
    if (s3aiCalls > 0) console.error(`  AI calls: ${s3aiCalls}, tokens: ${s3aiTokens}`);
  }

  // ── Stage 4: Integration Analysis ──
  let integration: import("./types.js").IntegrationJson | undefined;
  if (shouldRunStage("stage4", opts.from, opts.to)) {
    console.error("\n=== Stage 4: Integration Analysis ===");
    const stage4Result = runStage4({
      blockStore, graph, memory, loadedRegions,
      enrichments, variableMap, logger,
    });
    integration = stage4Result.integration;
    pipelineState.stages.stage4_integration = { status: "completed" };
    console.error(`  Files: ${integration.files.length}`);
    console.error(`  Dead code: ${integration.deadCode.totalDeadBytes} bytes (${integration.deadCode.percentOfProgram}%)`);
  }

  // Load integration.json from disk if Stage 4 was skipped but Stage 5 needs it
  if (!integration && shouldRunStage("stage5", opts.from, opts.to)) {
    const intPath = resolve(outputDir, "integration.json");
    if (existsSync(intPath)) {
      integration = JSON.parse(readFileSync(intPath, "utf8"));
      console.error(`  Loaded existing integration.json for Stage 5`);
    }
  }

  // ── Save outputs ──
  console.error("\n=== Saving outputs ===");

  // Apply merges from Stage 1 to the original blocks array.
  // Merges are safe (combining adjacent blocks preserves binary layout).
  // Splits are NOT applied — they stay in blockStore only for AI processing.
  const mergedBlocks = applyMergesToOriginalBlocks(blocks, blockStore.getChanges());
  if (mergedBlocks.length !== blocks.length) {
    console.error(`  Merged blocks: ${blocks.length} → ${mergedBlocks.length}`);
  }

  // Build set of all block start addresses + instruction addresses (where the builder defines labels)
  // Use BOTH merged blocks (for binary structure) and blockStore (for split block addresses)
  const blockAddresses = new Set<number>();
  for (const b of mergedBlocks) {
    blockAddresses.add(b.address);
    if (b.instructions) {
      for (const inst of b.instructions) blockAddresses.add(inst.address);
    }
  }
  // Also include split block addresses so their labels resolve
  for (const b of blockStore.getAllBlocks()) {
    blockAddresses.add(b.address);
  }

  // Build address-range lookup for analyses: maps any address within a block's
  // range to the analysis for that block. This lets us find enrichments for
  // split blocks (e.g., $088C split from $0874) when iterating original blocks.
  const analysisRanges: Array<{ start: number; end: number; analysis: import("./types.js").BlockAnalysis }> = [];
  for (const [, analysis] of analyses) {
    // Find the blockStore block for this analysis
    const addrMatch = analysis.blockId.match(/[_]([0-9a-fA-F]+)$/);
    if (addrMatch) {
      const addr = parseInt(addrMatch[1], 16);
      const blk = blockStore.getBlock(addr) ?? blockStore.findBlockContaining(addr);
      if (blk) {
        analysisRanges.push({ start: blk.address, end: blk.endAddress, analysis });
      }
    }
  }

  // Enriched blocks.json — merge pipelineState + AI enrichments into blocks
  // Uses merged blocks for structure (binary correctness) with enrichments from all stages
  const enrichedBlocks = mergedBlocks.map(b => {
    const addr = b.address.toString(16).padStart(4, "0");
    const node = graph.getNode(`code_${addr}`) ?? graph.getNode(`data_${addr}`);
    const ps = node?.pipelineState ?? {
      staticEnrichmentComplete: true,
      aiEnrichmentComplete: true,
      reverseEngineered: true,
      confidence: 0.5,
      stage3Iterations: 0,
      bailCount: 0,
    };

    // Build enrichment from all pipeline sources
    const enrichment: Record<string, unknown> = { ...(b.enrichment ?? {}) };

    // Find ALL enrichment entries within this block's address range.
    // After Stage 1 splits, a single original block may have multiple split
    // blocks with separate AI enrichments — we need to collect them all.
    const inRange = (addr: number) => addr >= b.address && addr < b.endAddress;

    // Stage 2: purpose analysis — use first matching entry (block start gets priority)
    const purposeEntries = enrichments.get("ai_purpose_analysis") ?? [];
    const purposeEntry = purposeEntries.find(e => e.blockAddress === b.address)
      ?? purposeEntries.find(e => inRange(e.blockAddress));
    if (purposeEntry?.data) {
      if (purposeEntry.data.purpose) enrichment.purpose = purposeEntry.data.purpose;
      if (purposeEntry.data.category) enrichment.category = purposeEntry.data.category;
    }

    // Stage 2: documentation — merge from ALL split blocks within range
    const docEntries = enrichments.get("ai_documentation") ?? [];
    const blockDocEntries = docEntries.filter(e => inRange(e.blockAddress));
    const mergedInlineComments: Record<string, string> = {};
    const headerParts: string[] = [];
    for (const docEntry of blockDocEntries) {
      if (docEntry.data?.headerComment) headerParts.push(docEntry.data.headerComment as string);
      if (docEntry.data?.inlineComments) {
        Object.assign(mergedInlineComments, docEntry.data.inlineComments as Record<string, string>);
      }
    }
    if (headerParts.length > 0) enrichment.headerComment = headerParts.join("\n\n");
    if (Object.keys(mergedInlineComments).length > 0) enrichment.inlineComments = mergedInlineComments;

    // Stage 3: RE analyses — collect all that fall within this block's range
    const blockAnalyses = analysisRanges
      .filter(ar => ar.start >= b.address && ar.start < b.endAddress)
      .sort((a, b2) => a.start - b2.start);

    if (blockAnalyses.length > 0) {
      // First analysis provides purpose/category
      const first = blockAnalyses[0].analysis;
      enrichment.purpose = first.purpose;
      enrichment.category = first.category;
      if (first.algorithm) enrichment.algorithm = first.algorithm;

      // Merge header comments from all split analyses
      const reHeaders = blockAnalyses.map(a => a.analysis.headerComment).filter(Boolean);
      if (reHeaders.length > 0) enrichment.headerComment = reHeaders.join("\n\n");

      // Merge inline comments from all split analyses
      const reInline: Record<string, string> = {};
      for (const { analysis: a } of blockAnalyses) {
        if (a.inlineComments && Object.keys(a.inlineComments).length > 0) {
          Object.assign(reInline, a.inlineComments);
        }
      }
      if (Object.keys(reInline).length > 0) enrichment.inlineComments = reInline;

      // Confidence from highest-confidence analysis
      const maxConf = Math.max(...blockAnalyses.map(a => a.analysis.confidence));
      enrichment.certainty = maxConf >= 0.8 ? "HIGH" : maxConf >= 0.6 ? "MEDIUM" : "LOW";
    }

    // ── Normalize AI output ──
    // Strip // prefix from headerComment lines (AI sometimes includes these)
    if (typeof enrichment.headerComment === "string") {
      enrichment.headerComment = (enrichment.headerComment as string)
        .split("\n")
        .map(line => line.replace(/^\/\/\s?/, ""))
        .join("\n");
    }
    // Normalize inlineComments: strip $ prefix from keys
    if (enrichment.inlineComments && typeof enrichment.inlineComments === "object") {
      const raw = enrichment.inlineComments as Record<string, string>;
      const normalized: Record<string, string> = {};
      for (const [key, val] of Object.entries(raw)) {
        const cleanKey = key.replace(/^\$/, "").toUpperCase().padStart(4, "0");
        normalized[cleanKey] = val;
      }
      enrichment.inlineComments = normalized;
    }

    // Semantic labels: for addresses within the program + external hardware/KERNAL
    const semanticLabels: Record<string, string> = { ...(b.enrichment?.semanticLabels ?? {}) };
    const variableNames: Record<string, string> = { ...(b.enrichment?.variableNames ?? {}) };

    // Add block's own label from purpose (or data format enrichment for data blocks)
    let purposeLabel = deriveLabelFromPurpose(enrichment.purpose as string | undefined, b.address, b.type);
    if (!purposeLabel && (b.type === "data" || b.type === "unknown")) {
      purposeLabel = deriveDataBlockLabel(b, enrichments);
    }
    if (purposeLabel) {
      semanticLabels[addr.toUpperCase()] = purposeLabel;
    }

    // Sprite sub-labels: add a label for each sprite frame beyond the first
    if (purposeLabel && /sprite/.test(purposeLabel) && b.type === "data") {
      const blockSize = b.endAddress - b.address;
      const spriteCount = Math.floor(blockSize / 64);
      for (let s = 1; s < spriteCount; s++) {
        const subAddr = b.address + s * 64;
        const subHex = subAddr.toString(16).toUpperCase().padStart(4, "0");
        semanticLabels[subHex] = `${purposeLabel}_${s}`;
      }
    }

    // Collect all variable names — put them in variableNames (for documentation),
    // and only promote to semanticLabels if the address is a block start
    const allVarNames: Record<string, string> = {};
    const varEntries = enrichments.get("ai_variable_naming") ?? [];
    // Find variable entries for all split blocks within this original block's range
    const blockVarEntries = varEntries.filter(e => inRange(e.blockAddress));
    for (const varEntry of blockVarEntries) {
      if (varEntry?.data?.variables) {
        const vars = varEntry.data.variables as Record<string, string>;
        for (const [hexAddr, name] of Object.entries(vars)) {
          if (name && typeof name === "string") {
            allVarNames[hexAddr.replace(/^\$/, "").toUpperCase().padStart(4, "0")] = name;
          }
        }
      }
    }
    // Also check variableMap — collect IDs of all split blocks in range
    const blockId = b.id ?? `block_${b.address.toString(16)}`;
    const splitBlockIds = new Set<string>([blockId]);
    for (const sb of blockStore.getAllBlocks()) {
      if (sb.address >= b.address && sb.address < b.endAddress) {
        splitBlockIds.add(sb.id ?? `block_${sb.address.toString(16)}`);
      }
    }
    for (const [hexKey, entry] of Object.entries(variableMap.variables)) {
      if (entry.usedBy.some(id => splitBlockIds.has(id)) && entry.currentName) {
        allVarNames[hexKey.replace(/^\$/, "").toUpperCase().padStart(4, "0")] = entry.currentName;
      }
    }

    // Split: block addresses → semanticLabels, others → variableNames only
    for (const [hexAddr, name] of Object.entries(allVarNames)) {
      if (blockAddresses.has(parseInt(hexAddr, 16))) {
        semanticLabels[hexAddr] = name;
      }
      variableNames[hexAddr] = name;
    }

    // ── Hardware / KERNAL / system labels from symbol_db (banking-aware) ──
    // For each instruction in this block, resolve operand addresses to known symbol names.
    // The banking state from the graph determines whether ROM/IO is accessible.
    const mkReg = (val: number): import("./types.js").RegisterValue => ({
      bitmask: { knownMask: 0xFF, knownValue: val }, possibleValues: new Set([val]),
      isDynamic: false, source: "default",
    });
    const defaultBanking: import("./types.js").BankingSnapshot = {
      cpuPort: mkReg(0x37), vicBank: mkReg(0x03), vicMemPtr: mkReg(0x14),
      kernalMapped: "yes", basicMapped: "yes", ioMapped: "yes", chargenMapped: "no",
    };
    const banking = node?.bankingState?.onEntry ?? defaultBanking;
    if (b.instructions) {
      for (const inst of b.instructions) {
        if (!inst.operand) continue;
        // Match absolute addresses ($XXXX) in operand
        const matches = inst.operand.matchAll(/\$([0-9A-Fa-f]{4})/g);
        for (const match of matches) {
          const targetAddr = parseInt(match[1], 16);
          const hexKey = match[1].toUpperCase();
          // Skip if already named by AI
          if (semanticLabels[hexKey]) continue;
          // Look up symbol with banking awareness
          const sym = symbolDb.lookupWithBanking(targetAddr, banking);
          if (sym && sym.category !== "zeropage") {
            semanticLabels[hexKey] = sym.name;
          }
          // Range-based fallback (COLOR_RAM+$offset, KERNAL_ROM+$offset, etc.)
          if (!semanticLabels[hexKey] && targetAddr >= 0x0100) {
            const range = symbolDb.lookupRangeWithBanking(targetAddr, banking);
            if (range) {
              if (range.offset === 0) {
                // Exact base address — use the base name directly
                semanticLabels[hexKey] = range.baseName;
              } else {
                const offsetHex = range.offset.toString(16).toUpperCase();
                semanticLabels[hexKey] = `${range.baseName}+$${offsetHex}`;
                // Ensure base address is also in labels so builder can emit .const for it
                const baseHex = range.baseAddress.toString(16).toUpperCase().padStart(4, "0");
                if (!semanticLabels[baseHex]) {
                  semanticLabels[baseHex] = range.baseName;
                }
              }
            }
          }
        }
      }
    }

    // Internal labels from AI documentation (branch targets within block → semantic names)
    for (const docEntry of blockDocEntries) {
      if (docEntry?.data?.internalLabels && typeof docEntry.data.internalLabels === "object") {
        const labels = docEntry.data.internalLabels as Record<string, string>;
        for (const [hexAddr, name] of Object.entries(labels)) {
          if (name && typeof name === "string") {
            const cleanKey = hexAddr.replace(/^\$/, "").toUpperCase().padStart(4, "0");
            if (!semanticLabels[cleanKey]) {
              semanticLabels[cleanKey] = name;
            }
          }
        }
      }
    }

    if (Object.keys(semanticLabels).length > 0) {
      enrichment.semanticLabels = semanticLabels;
    }
    if (Object.keys(variableNames).length > 0) {
      enrichment.variableNames = variableNames;
    }

    // Stage 2: concept annotations
    const conceptEntries = enrichments.get("ai_concept_extraction") ?? [];
    const blockConcepts = conceptEntries.filter(e => e.blockAddress === b.address);
    if (blockConcepts.length > 0) {
      const existing = (enrichment.annotations as Array<Record<string, unknown>>) ?? [];
      for (const ce of blockConcepts) {
        existing.push({ source: ce.source, type: ce.type, annotation: ce.annotation, data: ce.data });
      }
      enrichment.annotations = existing;
    }

    // Pointer pair enrichment: store lo/hi table role + resolved addresses
    const ptrEntries = enrichments.get("pointer_pair") ?? [];
    const ptrEntry = ptrEntries.find(e =>
      e.data?.loTableAddress === b.address || e.data?.hiTableAddress === b.address
    );
    if (ptrEntry?.data) {
      enrichment.pointerTable = {
        role: ptrEntry.data.loTableAddress === b.address ? "lo" : "hi",
        pairAddress: ptrEntry.data.loTableAddress === b.address
          ? ptrEntry.data.hiTableAddress : ptrEntry.data.loTableAddress,
        resolvedAddresses: ptrEntry.data.resolvedAddresses,
        entryCount: ptrEntry.data.entryCount,
      };
    }

    return { ...b, pipelineState: ps, enrichment };
  });

  // Deduplicate block labels — append _2, _3 etc. on collision
  deduplicateBlockLabels(enrichedBlocks);

  // ── Stage 5: Post-RE Polish ──
  // Runs AFTER enrichment application so the AI sees the full enriched blocks
  // (labels, comments, purposes from Stages 2-3).
  let finalBlocks: Block[] = enrichedBlocks;
  let programDescription: string | undefined;
  if (shouldRunStage("stage5", opts.from, opts.to) && integration && aiClient) {
    console.error("\n=== Stage 5: Post-RE Polish ===");
    const stage5Result = await runStage5({
      blocks: enrichedBlocks,
      integration,
      graph,
      aiClient,
    });
    finalBlocks = stage5Result.blocks;
    programDescription = stage5Result.programDescription;
    pipelineState.stages.stage5_polish = {
      status: "completed",
      ...stage5Result.stats,
    };
    // Re-deduplicate after label refinement
    deduplicateBlockLabels(finalBlocks as Array<{ address: number; enrichment?: Record<string, unknown> }>);
    console.error(`  Program description: ${programDescription ? "yes" : "no"}`);
  }

  // Track total AI usage (after all stages including Stage 5)
  if (aiClient) {
    const totalStats = aiClient.stats;
    pipelineState.cost.totalApiCalls = totalStats.calls;
    pipelineState.cost.totalTokens = totalStats.tokens;
    pipelineState.cost.estimatedCostUsd = totalStats.tokens * 0.0000004;
    console.error(`\nAI Total: ${totalStats.calls} calls, ${totalStats.tokens} tokens (~$${pipelineState.cost.estimatedCostUsd.toFixed(4)})`);
  }

  // Store program description in metadata
  const outputJson = { ...blocksJson, blocks: finalBlocks };
  if (programDescription) {
    outputJson.metadata = { ...(outputJson.metadata ?? {}), programDescription };
  }

  writeFileSync(
    resolve(outputDir, "blocks.json"),
    JSON.stringify(outputJson, null, 2),
  );
  console.error(`  blocks.json`);

  // dependency_tree.json (enriched version of input tree)
  writeFileSync(
    resolve(outputDir, "dependency_tree.json"),
    JSON.stringify(graph.toJSON(), null, 2),
  );
  console.error(`  dependency_tree.json`);

  // variable_map.json
  writeFileSync(
    resolve(outputDir, "variable_map.json"),
    JSON.stringify(variableMap, null, 2),
  );
  console.error(`  variable_map.json`);

  // integration.json
  if (integration) {
    writeFileSync(
      resolve(outputDir, "integration.json"),
      JSON.stringify(integration, null, 2),
    );
    console.error(`  integration.json`);
  }

  // pipeline_state.json
  writeFileSync(
    resolve(outputDir, "pipeline_state.json"),
    JSON.stringify(pipelineState, null, 2),
  );
  console.error(`  pipeline_state.json`);

  console.error("\nDone.");
}

/**
 * Derive a KickAssembler-safe label from an AI-generated purpose string.
 * Returns null if purpose is generic or can't be converted.
 */
function deriveLabelFromPurpose(purpose: string | undefined, address: number, blockType: string): string | null {
  if (!purpose || purpose === "Unknown purpose" || purpose.startsWith("Subroutine at")) return null;

  // Convert to snake_case label
  let label = purpose
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")       // strip non-alphanumeric
    .replace(/\s+/g, "_")               // spaces to underscores
    .replace(/_+/g, "_")                // collapse multiple underscores
    .replace(/^_|_$/g, "");             // trim leading/trailing underscores

  // Truncate to reasonable length
  if (label.length > 40) label = label.substring(0, 40).replace(/_[^_]*$/, "");

  // Must start with a letter for KickAssembler
  if (!/^[a-z]/.test(label)) label = "sub_" + label;

  // Avoid collisions — append address suffix if too generic
  if (label.length < 4) return null;

  return label;
}

/**
 * Deduplicate block labels — when two blocks get the same label from
 * deriveDataBlockLabel, append _2, _3 etc. to the duplicates.
 */
function deduplicateBlockLabels(blocks: Array<{ address: number; enrichment?: Record<string, unknown> }>): void {
  const labelCounts = new Map<string, number>();
  const blockLabels: Array<{ block: typeof blocks[0]; addrKey: string; label: string }> = [];

  // Collect all block-address labels
  for (const block of blocks) {
    if (!block.enrichment?.semanticLabels) continue;
    const sl = block.enrichment.semanticLabels as Record<string, string>;
    const addrKey = block.address.toString(16).toUpperCase().padStart(4, "0");
    const label = sl[addrKey];
    if (label) {
      blockLabels.push({ block, addrKey, label });
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
    }
  }

  // Fix duplicates
  const usedCounters = new Map<string, number>();
  for (const entry of blockLabels) {
    const count = labelCounts.get(entry.label) ?? 1;
    if (count <= 1) continue;
    const n = (usedCounters.get(entry.label) ?? 0) + 1;
    usedCounters.set(entry.label, n);
    const sl = entry.block.enrichment!.semanticLabels as Record<string, string>;
    sl[entry.addrKey] = n === 1 ? entry.label : `${entry.label}_${n}`;
  }
}

/**
 * Derive a label for a data block from format enrichment and semantic enrichment.
 * Falls back to format-based name when no AI purpose is available.
 */
function deriveDataBlockLabel(
  block: import("@c64/shared").Block,
  enrichments: EnrichmentMap,
): string | null {
  // Check variable naming first — AI may have given a good semantic name
  const varEntries = enrichments.get("ai_variable_naming") ?? [];
  for (const ve of varEntries) {
    if (!ve.data?.variables) continue;
    const vars = ve.data.variables as Record<string, string>;
    const addrKey = block.address.toString(16).toUpperCase().padStart(4, "0");
    const addrKeyShort = block.address.toString(16).toUpperCase();
    const name = vars[addrKey] ?? vars[addrKeyShort];
    if (name && typeof name === "string" && name.length >= 4) return name;
  }

  // Check data_table_semantics (e.g., "Table of sprite 0 colors")
  const semEntries = enrichments.get("data_table_semantics") ?? [];
  const sem = semEntries.find(e => e.blockAddress === block.address);
  if (sem?.data?.meaning) {
    const meaning = String(sem.data.meaning);
    const label = meaning.replace(/[^a-z0-9\s]/gi, "").trim().toLowerCase()
      .replace(/\s+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
    if (label.length >= 4) return label;
  }

  // Check data_format enrichment (e.g., "sprite", "text", "color_data")
  const fmtEntries = enrichments.get("data_format") ?? [];
  const fmt = fmtEntries.find(e => e.blockAddress === block.address);
  if (fmt?.data?.format) {
    const format = String(fmt.data.format);
    // Derive name from format + subtype if available
    const subtype = fmt.data.subtype ? `_${String(fmt.data.subtype)}` : "";
    switch (format) {
      case "sprite":
      case "sprite_compact": return `sprite_data${subtype}`;
      case "charset": return `charset_data${subtype}`;
      case "screen_data": return `screen_data${subtype}`;
      case "text": return `text_data${subtype}`;
      case "color_data": {
        // Use annotation for more detail (e.g. "Color data, 40 bytes (written to Color RAM)")
        const desc = fmt.annotation ? String(fmt.annotation) : "";
        const match = desc.match(/(\d+)\s+bytes/);
        const size = match ? `_${match[1]}b` : "";
        return `color_table${subtype}${size}`;
      }
      case "bitmap": return `bitmap_data${subtype}`;
      default: return `data_${format}${subtype}`;
    }
  }

  // Fallback: use static analysis candidate type
  if (block.candidates && block.bestCandidate !== undefined) {
    const best = block.candidates[block.bestCandidate];
    if (best?.type === "sprite_data") return "sprite_data";
    if (best?.type === "lookup_table") return best.label ?? "lookup_table";
    if (best?.type === "byte_table") return best.label ?? "byte_table";
    if (best?.type === "word_table") return best.label ?? "word_table";
  }

  return null;
}

/**
 * Apply merge operations from blockStore's change log to the original blocks
 * array. Merges are safe (combining adjacent blocks preserves binary layout).
 * Splits are NOT applied — they stay in blockStore only for AI processing.
 */
function applyMergesToOriginalBlocks(
  blocks: Block[],
  changes: readonly import("./types.js").BlockChange[],
): Block[] {
  const result = blocks.map(b => ({ ...b }));
  for (const change of changes) {
    if (change.action !== "merge") continue;
    const addr1 = change.blockAddress;
    const addr2 = (change.details as { mergedWith: number }).mergedWith;
    const idx1 = result.findIndex(b => b.address === addr1);
    const idx2 = result.findIndex(b => b.address === addr2);
    if (idx1 === -1 || idx2 === -1) continue; // already merged in a prior step
    const [first, second] = result[idx1].address < result[idx2].address
      ? [result[idx1], result[idx2]]
      : [result[idx2], result[idx1]];
    if (first.endAddress !== second.address) continue; // not adjacent
    const merged: Block = {
      ...first,
      endAddress: second.endAddress,
      instructions: [
        ...(first.instructions ?? []),
        ...(second.instructions ?? []),
      ],
    };
    // Concatenate raw (base64) fields
    if (first.raw || second.raw) {
      const buf1 = first.raw
        ? Buffer.from(first.raw, "base64")
        : Buffer.alloc(first.endAddress - first.address);
      const buf2 = second.raw
        ? Buffer.from(second.raw, "base64")
        : Buffer.alloc(second.endAddress - second.address);
      merged.raw = Buffer.concat([buf1, buf2]).toString("base64");
    }
    // Merge candidates — keep first block's candidates if present
    if (!merged.candidates && second.candidates) {
      merged.candidates = second.candidates;
      merged.bestCandidate = second.bestCandidate;
    }
    // Replace first with merged, remove second
    const keepIdx = Math.min(idx1, idx2);
    const removeIdx = Math.max(idx1, idx2);
    result[keepIdx] = merged;
    result.splice(removeIdx, 1);
  }
  return result;
}

main().catch(err => {
  console.error(`Pipeline error: ${err.message}`);
  process.exit(1);
});
