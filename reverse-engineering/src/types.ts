// ============================================================================
// RE Pipeline Types — all pipeline-specific type definitions
//
// Types that already exist in @c64/shared (Block, BlockType, EdgeType, etc.)
// are imported and re-exported where needed. This file defines types specific
// to the reverse engineering pipeline.
// ============================================================================

import type {
  Block,
  BlockType,
  BlockInstruction,
  EdgeType,
  EdgeCategory,
  LoadedRegion,
} from "@c64/shared";

// ── Ternary ─────────────────────────────────────────────────────

export type Ternary = "yes" | "no" | "unknown";

export type Certainty = "HIGH" | "MEDIUM" | "LOW";

// ── Bitmask Abstract Domain ─────────────────────────────────────
// Per-bit known/unknown tracking for register values.
// Inspired by LLVM's KnownBits and Linux kernel's tnum.
// See: "Sound, Precise, and Fast Abstract Interpretation with Tristate Numbers"
//      (CGO 2022 Distinguished Paper, arXiv:2105.05398)

export interface BitmaskValue {
  /** Bitmask where 1 = this bit's value is known */
  knownMask: number;
  /** The value of known bits. Invariant: (knownValue & ~knownMask) === 0 */
  knownValue: number;
}

// ── Register Value (Hybrid Domain) ──────────────────────────────
// Combines bitmask abstract domain with a small set of concrete values.
// C64 programs typically use 2-4 banking configs, so the set stays small.

export const MAX_SET_SIZE = 16;

export interface RegisterValue {
  /** Primary: bitmask abstract domain (always maintained, O(1) operations) */
  bitmask: BitmaskValue;
  /** Secondary: small set of possible concrete values (null = too many, use bitmask only) */
  possibleValues: Set<number> | null;
  /** true if set by SMC, runtime computation, or unresolvable indirect */
  isDynamic: boolean;
  /** "default" | "constant_propagation" | "parent_exit_state" | "dynamic" */
  source: string;
}

// ── Banking Snapshot ────────────────────────────────────────────
// Banking state at a particular point in execution.

export interface BankingSnapshot {
  cpuPort: RegisterValue;    // $01 value(s) — bitmask + optional value set
  vicBank: RegisterValue;    // $DD00 bits 0-1 (CIA2 port A)
  vicMemPtr: RegisterValue;  // $D018 (screen/charset base)

  // Derived convenience flags (computed from cpuPort.bitmask)
  kernalMapped: Ternary;     // Is KERNAL ROM visible at $E000-$FFFF? (bit 1 of $01)
  basicMapped: Ternary;      // Is BASIC ROM visible at $A000-$BFFF? (bit 0 of $01)
  ioMapped: Ternary;         // Is I/O area visible at $D000-$DFFF? (bit 2 of $01)
  chargenMapped: Ternary;    // Is Character ROM visible at $D000-$DFFF?
}

// ── IRQ Volatility ──────────────────────────────────────────────
// Tracks which hardware registers may be modified asynchronously by IRQ handlers.
// Based on three-tier model from Regehr & Cooprider's Interatomic analysis.

export interface IRQSafetyState {
  /** "yes" = between SEI/CLI, "no" = IRQs enabled, "unknown" */
  irqsDisabled: Ternary;
  /** Hardware addresses modified by known IRQ handlers */
  irqVolatileRegisters: Set<number>;
  /** Hardware addresses modified by NMI handler (non-maskable) */
  nmiVolatileRegisters: Set<number>;
}

// ── Pipeline State ──────────────────────────────────────────────
// Persisted in blocks.json for resumability.

export interface BlockPipelineState {
  staticEnrichmentComplete: boolean;   // Stage 1 done
  aiEnrichmentComplete: boolean;       // Stage 2 done
  reverseEngineered: boolean;          // Stage 3 done

  /** Confidence (0.0 - 1.0) — set by Stage 2 (initial) and Stage 3 (refined) */
  confidence: number;

  // Stage 3 tracking
  stage3Iterations: number;
  bailReason?: BailReason;
  bailCount: number;

  // Timestamps for resumability
  lastStage1Timestamp?: string;
  lastStage2Timestamp?: string;
  lastStage3Timestamp?: string;
}

/** Structured bail reasons for traceability */
export type BailReason =
  | { type: "needs_dependency"; dependencies: string[]; details: string }
  | { type: "insufficient_context"; details: string }
  | { type: "block_too_complex"; complexityFactors: string[] }
  | { type: "hit_iteration_limit"; iterations: number }
  | { type: "low_confidence"; confidence: number; threshold: number };

// ── Dependency Graph ────────────────────────────────────────────

export interface DependencyGraphNode {
  id: string;                   // e.g. "code_C000", "data_C800"
  type: "code" | "data";
  start: number;
  end: number;                  // exclusive
  blockId: string;              // corresponding Block.id
  discoveredBy: string;         // plugin/phase that created this node
  endConfidence: number;        // 0-100

  /** SCC membership (populated by Tarjan's decomposition) */
  sccId?: string;

  /** Banking state (populated by Stage 1 register propagation) */
  bankingState?: {
    onEntry: BankingSnapshot;
    onExit: BankingSnapshot;
  };

  /** IRQ interaction (populated by Stage 1 IRQ volatility analysis) */
  irqSafety?: IRQSafetyState;

  /** Does this node preserve $01? (populated by Stage 1 PHA/PLA detection) */
  bankingScope?: "local" | "leaked" | "unknown";

  /** Pipeline state tracking (persisted for resumability) */
  pipelineState: BlockPipelineState;
}

export interface DependencyGraphEdge {
  source: string;               // source node ID
  target: number;               // target address
  targetNodeId?: string;        // resolved target node ID (null if external/ROM)
  type: EdgeType;
  category: EdgeCategory;
  sourceInstruction: number;    // instruction address that creates this edge
  confidence: number;           // 0-100
  discoveredBy: string;         // plugin name
  discoveredInPhase: string;    // "static_analysis" | "enrichment" | "ai_analysis"
  discoveryTier?: "confirmed" | "probable" | "speculative";
  metadata?: Record<string, unknown>;

  /** For partially resolved edges (jump tables with multiple possible targets) */
  alternateTargets?: Array<{
    address: number;
    nodeId?: string;
    confidence: number;
  }>;
}

export interface DependencyGraphJson {
  nodes: Record<string, DependencyGraphNode>;
  edges: DependencyGraphEdge[];
  entryPoints: string[];
  irqHandlers: string[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    reachableNodes: number;
    deadNodes: number;
    bankingAnnotated: number;
  };
}

// ── SCC Decomposition ───────────────────────────────────────────
// Tarjan's SCC algorithm output.

export interface SCCDecomposition {
  /** nodeId → sccId */
  nodeToSCC: Map<string, string>;
  /** sccId → set of nodeIds */
  sccMembers: Map<string, Set<string>>;
  /** Condensation DAG: sccId → successor sccIds (guaranteed acyclic) */
  condensationEdges: Map<string, Set<string>>;
  /** Topological order of the condensation DAG (leaves first = callees first) */
  topologicalOrder: string[];
}

// ── Block Store Types ───────────────────────────────────────────

export interface BlockChange {
  timestamp: number;
  action: "reclassify" | "split" | "merge";
  blockAddress: number;
  details: Record<string, unknown>;
  reason: string;
  source: string;
}

// ── Enrichment Types ────────────────────────────────────────────

export type EnrichmentType =
  | "resolved_target"
  | "pointer_pair"
  | "vector_write"
  | "call_relationship"
  | "data_semantic"
  | "data_format"
  | "register_semantic"
  | "pattern"
  | "api_call"
  | "banking"
  | "banking_propagation"
  | "qdrant_knowledge"
  | "annotation";

/** RE pipeline enrichment (distinct from @c64/shared BlockEnrichment) */
export interface REBlockEnrichment {
  blockAddress: number;
  source: string;
  type: EnrichmentType;
  annotation: string;
  data: Record<string, unknown>;
}

export type EnrichmentMap = ReadonlyMap<string, REBlockEnrichment[]>;

// ── Enrichment Plugin Types ─────────────────────────────────────

export interface EnrichmentInput {
  readonly blocks: readonly Block[];
  readonly graph: MutableGraphInterface;
  readonly memory: Readonly<Uint8Array>;
  readonly loadedRegions: readonly LoadedRegion[];
  readonly priorEnrichments: EnrichmentMap;
}

export interface EnrichmentResult {
  enrichments: REBlockEnrichment[];
  reclassifications?: BlockReclassification[];
  newGraphEdges?: DependencyGraphEdge[];
  newGraphNodes?: DependencyGraphNode[];
  merges?: BlockMergeRequest[];
  splits?: BlockSplitRequest[];
}

export interface BlockReclassification {
  blockAddress: number;
  newType: BlockType;
  reason: string;
  splitAt?: number[];
}

export interface BlockMergeRequest {
  addr1: number;
  addr2: number;
  reason: string;
}

export interface BlockSplitRequest {
  blockAddress: number;
  splitAt: number;
  reason: string;
}

export interface EnrichmentPlugin {
  name: string;
  priority: number;
  enrich(input: EnrichmentInput): EnrichmentResult;
}

// ── Context Provider Types ──────────────────────────────────────

export interface ContextProviderInput {
  readonly block: Block;
  readonly graph: MutableGraphInterface;
  readonly blockStore: BlockStoreInterface;
  readonly enrichments: EnrichmentMap;
  readonly variableMap: VariableMapData;
  readonly priorAnalyses: ReadonlyMap<string, BlockAnalysis>;
  readonly symbolDb: SymbolDBInterface;
  readonly stage: 2 | 3;
}

export interface ContextContribution {
  section: string;
  content: string;
  priority: number;
  tokenEstimate: number;
}

export interface ContextProvider {
  name: string;
  priority: number;
  appliesTo: (2 | 3)[];
  provide(input: ContextProviderInput): ContextContribution | null;
}

// ── AI Tool Handler Types ───────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolSideEffect {
  type: "reclassify" | "split" | "merge" | "data_discovery" | "tree_edge" | "tree_node";
  details: Record<string, unknown>;
}

export interface ToolResult {
  content: string;
  sideEffects?: ToolSideEffect[];
}

export interface ToolContext {
  blockStore: BlockStoreInterface;
  graph: MutableGraphInterface;
  memory: Uint8Array;
  enrichments: EnrichmentMap;
  variableMap: VariableMapData;
  priorAnalyses: ReadonlyMap<string, BlockAnalysis>;
  symbolDb: SymbolDBInterface;
  projectCollection: ProjectCollectionInterface;
  searchKnowledgeBase(query: string, limit?: number): Promise<SearchHit[]>;
  stage: 2 | 3;
}

export interface AIToolHandler {
  name: string;
  definition: ToolDefinition;
  handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}

// ── Response Processor Types ────────────────────────────────────

export interface ProcessorInput {
  readonly block: Block;
  readonly graph: MutableGraphInterface;
  readonly aiResponse: Record<string, unknown>;
  readonly blockStore: BlockStoreInterface;
  readonly enrichments: EnrichmentMap;
  readonly variableMap: VariableMapData;
  readonly projectCollection: ProjectCollectionInterface;
  readonly stage: 2 | 3;
}

export interface BlockMutation {
  blockAddress: number;
  field: string;
  value: unknown;
  reason: string;
}

export interface ReviewFlag {
  blockId: string;
  field: string;
  reason: string;
  severity: "info" | "warning" | "error";
}

export interface DataDiscovery {
  address: number;
  size: number;
  format: string;
  discoveredBy: string;
}

export interface EmbeddingRequest {
  blockId: string;
  text: string;
  collection: string;
}

export interface ProcessorResult {
  mutations?: BlockMutation[];
  graphEdges?: DependencyGraphEdge[];
  graphNodes?: DependencyGraphNode[];
  embeddings?: EmbeddingRequest[];
  reviewFlags?: ReviewFlag[];
  discoveries?: DataDiscovery[];
  variableEntries?: VariableEntry[];
}

export interface ResponseProcessor {
  name: string;
  priority: number;
  appliesTo: (2 | 3)[];
  process(input: ProcessorInput): Promise<ProcessorResult>;
}

// ── Annotation Source Types ─────────────────────────────────────

export interface Instruction {
  address: number;
  opcode: number;
  mnemonic: string;
  operand: string;
  bytes: number[];
  size: number;
  addressingMode: string;
  annotation?: string;
  annotationSource?: "symbol_db" | "enrichment" | "ai";
}

export interface AnnotationSourceInput {
  instruction: Instruction;
  block: Block;
  enrichments: REBlockEnrichment[];
  symbolDb: SymbolDBInterface;
  bankingState: BankingSnapshot;
}

export interface AnnotationSource {
  name: string;
  priority: number;
  annotate(input: AnnotationSourceInput): string | null;
}

// ── Stage 2 Plugin Types ────────────────────────────────────────

export interface Stage2PluginInput {
  block: Block;
  graph: MutableGraphInterface;
  blockStore: BlockStoreInterface;
  enrichments: EnrichmentMap;
  variableMap: VariableMapData;
  priorStage2Results: Map<string, Stage2PluginResult>;
  symbolDb: SymbolDBInterface;
  qdrantSearch: (query: string) => Promise<SearchHit[]>;
}

export interface Stage2PluginResult {
  enrichments: REBlockEnrichment[];
  confidence: number;
  reclassifications?: BlockReclassification[];
  variableEntries?: VariableEntry[];
  discoveries?: Discovery[];
}

export interface Discovery {
  type: "code" | "data";
  address: number;
  size?: number;
  reason: string;
  discoveredBy: string;
}

export interface Stage2Plugin {
  name: string;
  priority: number;
  run(input: Stage2PluginInput): Promise<Stage2PluginResult>;
}

// ── Integration Types ───────────────────────────────────────────

export interface IntegrationAnalyzerInput {
  allBlocks: BlockAnalysis[];
  graph: MutableGraphInterface;
  variableMap: VariableMapData;
  enrichments: EnrichmentMap;
  blockStore: BlockStoreInterface;
}

export interface IntegrationContribution {
  section: string;
  data: Record<string, unknown>;
}

export interface IntegrationAnalyzer {
  name: string;
  priority: number;
  analyze(input: IntegrationAnalyzerInput): IntegrationContribution;
}

export interface IntegrationJson {
  program: {
    type: string;
    name: string;
    description: string;
    entryPoint: string;
    mainLoop: { block: string; description: string } | null;
    initChain: { block: string; purpose: string }[];
    irqHandlers: { address: string; purpose: string }[];
    stateMachines: { block: string; stateVariable: string; states: Record<string, string> }[];
  };
  files: {
    filename: string;
    module: string;
    description: string;
    blocks: string[];
    importsFrom: string[];
  }[];
  fileBuildOrder: string[];
  overviewComments: {
    fileHeaders: Record<string, string>;
    memoryMap: string;
  };
  documentation: {
    readme: string;
    interesting: string;
    howItWorks: string;
  };
  blockToFileMap: Record<string, string>;
  deadCode: {
    nodes: Array<{
      nodeId: string;
      address: string;
      type: BlockType;
      classification: "unused_routine" | "fill_padding" | "rom_shadow" | "abandoned_feature" | "unknown";
      recommendation: "remove" | "keep" | "investigate";
      reason: string;
    }>;
    totalDeadBytes: number;
    percentOfProgram: number;
  };
  unprocessedRegions: { start: string; end: string; reason: string }[];
}

// ── Variable Map Types ──────────────────────────────────────────

export interface VariableMapData {
  metadata: { source: string; timestamp: string; totalVariables: number };
  variables: Record<string, VariableEntry>;  // keyed by hex address (e.g., "FB")
}

export interface VariableEntry {
  address: number;
  currentName: string;
  nameHistory: NameChange[];
  usedBy: string[];
  usageContexts: UsageContext[];
  scope: "global" | "local";
  type?: "pointer" | "counter" | "flag" | "data" | "unknown";
}

export interface UsageContext {
  blockId: string;
  name: string;
  usage: "read" | "write" | "read_write";
  confidence: number;
  source: "stage2" | "stage3";
}

export interface NameChange {
  from: string;
  to: string;
  reason: string;
  source: string;   // block ID or "propagation"
  timestamp: string;
}

// ── Stage Output Types ──────────────────────────────────────────

export interface Stage1Output {
  blockStore: BlockStoreInterface;
  graph: MutableGraphInterface;
  enrichments: EnrichmentMap;
  changeLog: BlockChange[];
  stats: {
    totalEnrichments: number;
    reclassifications: number;
    passes: number;
    newGraphEdges: number;
    bankingNodesAnnotated: number;
    aiConceptExtractionCalls: number;
    qdrantLookups: number;
  };
}

export interface Stage2Output {
  blockStore: BlockStoreInterface;
  graph: MutableGraphInterface;
  variableMap: VariableMapData;
  enrichments: EnrichmentMap;
  stats: {
    totalBlocks: number;
    pluginsRun: string[];
    aiCalls: number;
    blocksReclassified: number;
    newGraphEdges: number;
  };
}

export interface Stage3Output {
  blockStore: BlockStoreInterface;
  graph: MutableGraphInterface;
  variableMap: VariableMapData;
  enrichments: EnrichmentMap;
  analyses: ReadonlyMap<string, BlockAnalysis>;
  stats: {
    outerPasses: number;
    totalBlockAttempts: number;
    blocksReverseEngineered: number;
    blocksBailed: number;
    forcePicks: number;
    aiCalls: number;
    blocksReclassified: number;
    newGraphEdges: number;
  };
}

// ── Shared Service Interfaces ───────────────────────────────────
// These are interfaces — implementations come in later loops.

export interface SymbolEntry {
  address: number;
  name: string;
  category: "hardware" | "kernal" | "zeropage" | "system" | "basic" | "other";
  description: string;
  chip?: string;
}

export interface RangeLookupResult {
  baseName: string;
  baseAddress: number;
  offset: number;
  category: SymbolEntry["category"];
}

export interface SymbolDBInterface {
  lookup(address: number): SymbolEntry | null;
  lookupWithBanking(address: number, banking: BankingSnapshot): SymbolEntry | null;
  lookupRange(address: number): RangeLookupResult | null;
  lookupRangeWithBanking(address: number, banking: BankingSnapshot): RangeLookupResult | null;
  isHardwareRegister(address: number): boolean;
  isKernalEntry(address: number): boolean;
  resolveOperandForAI(operand: string, banking: BankingSnapshot): string;
}

export interface BlockAnalysis {
  blockId: string;
  purpose: string;
  category: string;
  algorithm?: string;
  confidence: number;
  variables: Record<string, string>;
  headerComment: string;
  inlineComments: Record<string, string>;
  isReverseEngineered: boolean;
}

export interface SimilarBlock {
  blockId: string;
  purpose: string;
  category: string;
  score: number;
}

export interface VariableUsage {
  blockId: string;
  variableName: string;
  scope: string;
  confidence: Certainty;
}

export interface NormalizedPattern {
  pattern: string;
  category: string;
  hardwareSemantics: string[];
}

export interface PatternMatch {
  pattern: string;
  category: string;
  score: number;
  source: string;
}

export interface SearchHit {
  id: string;
  score: number;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectCollectionInterface {
  embedBlock(analysis: BlockAnalysis, varDict?: VariableMapData): Promise<void>;
  searchSimilar(query: string, hardwareRefs: string[], limit?: number): Promise<SimilarBlock[]>;
  searchByVariable(address: string, limit?: number): Promise<VariableUsage[]>;
  promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void>;
  searchPatterns(query: string, hardwareRefs: string[], limit?: number): Promise<PatternMatch[]>;
}

// ── Interface stubs for core classes ────────────────────────────
// Concrete implementations come in Loop 2. These interfaces allow
// types.ts to be self-consistent without circular imports.

export interface BlockStoreInterface {
  getVersion(): number;
  getSnapshot(): readonly Block[];
  getBlock(address: number): Block | null;
  findBlockContaining(address: number): Block | null;
  reclassify(address: number, newType: BlockType, reason: string): void;
  split(address: number, splitAt: number, reason: string): void;
  merge(addr1: number, addr2: number, reason: string): void;
  hasChangedSince(version: number): boolean;
  getChanges(): readonly BlockChange[];
}

export interface MutableGraphInterface {
  addNode(node: DependencyGraphNode): void;
  addEdge(edge: DependencyGraphEdge): void;
  removeNode(nodeId: string): void;
  splitNode(nodeId: string, splitAt: number, newIds: [string, string]): void;
  mergeNodes(nodeId1: string, nodeId2: string, mergedId: string): void;
  setBankingState(nodeId: string, entry: BankingSnapshot, exit: BankingSnapshot): void;
  setPipelineState(nodeId: string, state: Partial<BlockPipelineState>): void;
  getNode(nodeId: string): DependencyGraphNode | undefined;
  getNodes(): ReadonlyMap<string, DependencyGraphNode>;
  getEdges(): readonly DependencyGraphEdge[];
  getReachableNodes(): Set<string>;
  getDeadNodes(): DependencyGraphNode[];
  getSCCDecomposition(edgeFilter?: "control_flow" | "all"): SCCDecomposition;
  topologicalSort(edgeFilter?: "control_flow" | "all"): string[][];
  getChildren(nodeId: string, filter?: "control_flow" | "data" | "all"): DependencyGraphNode[];
  getParents(nodeId: string, filter?: "control_flow" | "data" | "all"): DependencyGraphNode[];
  hasSelfLoop(nodeId: string): boolean;
  getEntryPoints(): readonly string[];
  getIrqHandlers(): readonly string[];
  toJSON(): DependencyGraphJson;
}

// ── Speculative Discovery ───────────────────────────────────────

export interface SpeculativeDiscovery {
  id: string;
  type: "code" | "data" | "edge";
  address?: number;
  edge?: DependencyGraphEdge;
  discoveredBy: string;
  corroborations: string[];
  confidence: number;
}

// ── Data Format ─────────────────────────────────────────────────

export interface DataFormat {
  type: string;
  subtype?: string;
  confidence: Certainty;
  candidates?: DataFormat[];
  elementSize?: number;
  count?: number;
}

// ── Cross Reference ─────────────────────────────────────────────

export interface CrossReference {
  from: number;
  to: number;
  type: "call" | "jump" | "read" | "write" | "vector_write" | "smc";
  instruction?: string;
}

export interface HardwareReference {
  address: number;
  access: "read" | "write" | "read_write";
  instructionAddress: number;
  value?: number;
}

// ── Pipeline State JSON ─────────────────────────────────────────

export interface PipelineStateJson {
  stages: {
    stage1_enrichment?: StageStateJson;
    stage2_ai_enrichment?: StageStateJson;
    stage3_reverse_engineering?: Stage3StateJson;
    stage4_integration?: StageStateJson;
  };
  cost: {
    totalTokens: number;
    totalCost: number;
    perStage: Record<string, { tokens: number; cost: number }>;
  };
  lastUpdated: string;
}

export interface StageStateJson {
  status: "pending" | "in_progress" | "completed";
  [key: string]: unknown;
}

export interface Stage3StateJson extends StageStateJson {
  outerPasses?: number;
  passHistory?: Array<{
    pass: number;
    reversed: number;
    bailed: number;
    forced: number;
    newBlocks: number;
  }>;
  totalReversed?: number;
  totalForced?: number;
  confidenceSummary?: Record<string, number>;
}
