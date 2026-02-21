# C64 Reverse Engineering Automation Pipeline

## Context

We have a comprehensive C64/6502 knowledge base in Qdrant (4000+ chunks), an MCP tools plan ([ai-disassembler-mcp.md](docs/ai-disassembler-mcp.md)) that defines interactive MCP tools, and a static analysis pipeline ([static-analysis.md](docs/static-analysis.md)) that defines the deterministic code/data classification layer.

**This plan defines the reverse engineering enrichment pipeline.** It takes `blocks.json` + `dependency_graph.json` from static analysis and produces **enriched output** with AI-generated annotations, variable names, documentation, module assignments, and a fully resolved dependency graph. The pipeline has four stages:

1. **Stage 1: Static Enrichment** — deterministic plugins resolve indirect addressing, classify data formats, detect patterns, propagate banking state through the call graph (no AI, fast, repeatable, run once)
2. **Stage 2: AI Enrichment** — sequential AI plugins run once per block, building on each other: purpose analysis → variable naming → documentation → validation. Creates the initial variable map.
3. **Stage 3: AI Reverse Engineering** — the heart of the pipeline. A per-block iterative loop where AI requests context, the system gathers it (tagged with `isReverseEngineered` flags), AI evaluates sufficiency, then attempts full reverse engineering or bails with a structured reason. An outer loop guarantees forward progress: if all blocks bail, force-pick the highest-confidence candidate.
4. **Stage 4: Integration** — whole-program structure analysis, module assignment, file splitting, dead code identification, documentation generation

Code generation (KickAssembler output) is handled by the standalone **builder** project — see [builder.md](docs/builder.md). The builder reads the enriched output and produces compilable `.asm` files plus a human-readable dependency tree document.

All code is TypeScript/Node.js. The pipeline is pluggable at every layer — adding new analysis capabilities means dropping a file into the right directory.

### Why Iterative? The Fundamental Problem

Reverse engineering a C64 binary is a **chicken-and-egg problem at every level:**
- You can't label `JSR $FFD2` as `CHROUT` until you know whether KERNAL ROM is mapped in — but banking state depends on what parent code executed before this point
- You can't name a subroutine until you know what it does — but understanding what it does requires knowing what its callees do
- You can't classify data until you know how code uses it — but understanding the code requires knowing what the data is
- You can't determine reachability until you've resolved indirect jumps — but resolving indirect jumps requires analyzing the code that sets up the jump table

A fixed linear pipeline (analyze once, name once, document once) cannot solve these circular dependencies. The only approach that works is **iterative convergence**: analyze what you can, use partial results as context, re-analyze with better context, repeat until stable.

Our architecture handles this with a **three-layer strategy**:
- **Stage 2 (AI Enrichment)** gives every block an initial understanding (purpose, names, documentation) in a single pass — no iteration. Even this partial context is valuable.
- **Stage 3 (AI Reverse Engineering)** is where iteration lives. Each block's per-block RE loop can request context from other blocks, and the AI explicitly sees whether that context comes from a fully reverse-engineered block or a preliminary Stage 2 analysis. This lets the AI make informed decisions about confidence.
- **The Outer Loop** handles the chicken-and-egg problem at the global level: try all blocks, detect progress, and when stuck, force-pick the highest-confidence candidate. This guarantees forward progress without complex convergence machinery.

This approach is inspired by the [Ralph Wiggum Loop](https://beuke.org/ralph-wiggum-loop/) pattern but simplifies it significantly: instead of worklists, cost budgets, and change-significance filtering, we use a simple outer loop with forced progress.

### AI Knowledge Strategy

The AI **will** hallucinate C64 facts if left unchecked. It confidently states wrong register meanings, incorrect KERNAL calling conventions, and fabricated VIC-II modes. But checking every register against Qdrant is too slow and expensive. Our strategy is **three-layered**: give the AI authoritative knowledge upfront, let deterministic annotations handle the easy 80%, and cross-validate AI output to catch lies.

#### Layer 1: Deterministic Knowledge (Handles ~80% — Free, Fast)

Most C64 hardware knowledge is already captured deterministically:
- **`symbol_db.ts`** — complete hardware register names, KERNAL routines, ZP system locations
- **Enrichment plugins** — `register_semantics`, `kernal_api`, `vic_annotation`, `sid_annotation` produce human-readable annotations for every hardware access
- **Query enrichment** — `query/` pipeline auto-converts numbers, resolves mirrors, maps addresses to chips
- **Banking state propagation** — determines whether KERNAL/BASIC ROM is mapped at each point, making symbol_db lookups banking-aware

These produce annotations like `STA $D020 = Set border color` with ZERO AI calls. The AI gets these in its prompt as established facts.

#### Layer 2: AI Concept Extraction + Qdrant Pre-Feed (Handles Unknowns)

Rather than relying on the AI to ask for information (it won't — it'll guess), we **proactively extract key concepts and pre-feed authoritative documentation**.

**How it works** (runs as enrichment plugin `ai_concept_extraction_enrichment.ts`, priority 100):

1. For each code block, send a cheap AI call with a focused prompt:
   ```
   List the key C64/6502 concepts in this code that a reverse engineer would
   need expert knowledge about. NOT registers (those are handled). Focus on:
   - Unusual techniques (self-modifying code patterns, timing tricks)
   - Data format interpretations (what does this data structure represent?)
   - Algorithm patterns (what is this loop/dispatch/table doing?)
   - C64-specific conventions (interrupt setup sequences, banking patterns)
   Return: ["concept1", "concept2", ...] (max 5)
   ```
2. For each extracted concept, query Qdrant via `query/src/pipeline.ts`
3. Take top 3 results per concept, **strip source code sections** (already done in our chunks)
4. Deduplicate across concepts (same chunk returned for multiple topics)
5. Store results as `qdrant_knowledge` enrichment annotations on the block

**Token budget management** (addresses the 80K concern):
- Average Qdrant chunk (before `## Source Code`) ≈ 200-500 tokens
- 5 concepts × 3 results = 15 max results, but deduplication typically yields ~8-10 unique chunks
- ~10 × 400 tokens = **~4,000 tokens** of Qdrant context — very manageable
- Hard cap: `--qdrant-context-budget` (default 8192 tokens). Context provider drops lowest-scoring results if over budget
- Skip concepts where `symbol_db` + `register_semantics` already provide full coverage

**The result:** When the AI analyzes a block, it already has authoritative Qdrant documentation for the non-obvious concepts — without having to ask. It can't hallucinate about raster interrupt timing if the actual documentation is right there in the prompt.

#### Layer 3: Cross-Validation (Catches Remaining Lies)

For the claims the AI does make, we cross-validate against deterministic annotations:

1. **`certainty_processor.ts`** compares AI hardware claims against `symbol_db` + enrichment annotations
2. If AI says `$D011` controls "sprite colour" but `register_semantics` says "VIC-II control register (screen height, bitmap mode, raster compare)" → **conflict detected**
3. Conflicts trigger a targeted Qdrant lookup for the specific register → result is added to context → block is re-submitted to AI
4. If no deterministic annotation exists for a claim (novel/unusual usage), the claim is accepted but marked `needs_qdrant_verification: true`
5. Blocks with unverified claims get `certainty` capped at MEDIUM

This is cheap because conflicts are rare (~5-10% of blocks) and each conflict triggers only 1-2 Qdrant lookups.

#### Cost Impact

| Component | AI Calls | Tokens | Cost |
|-----------|----------|--------|------|
| Layer 1 (deterministic) | 0 | 0 | $0.00 |
| Layer 2 (concept extraction) | ~47 (one per block) | ~47K | ~$0.007 |
| Layer 2 (Qdrant lookups) | 0 (local) | 0 | $0.00 |
| Layer 3 (conflict re-submissions) | ~5 | ~10K | ~$0.002 |
| **Total overhead** | **~52** | **~57K** | **~$0.009** |

Negligible compared to the base pipeline cost (~$0.12). But the accuracy improvement is significant — eliminates the biggest class of AI errors (wrong hardware register assumptions) without slowing down the pipeline.

**Related plans:**
- [static-analysis.md](docs/static-analysis.md) — produces `blocks.json` + `dependency_tree.json` (input to this pipeline)
- [static-analysis-modifications.md](docs/static-analysis-modifications.md) — tree preservation changes required
- [builder.md](docs/builder.md) — consumes enriched output, produces KickAssembler source + dependency tree docs
- [builder-modifications.md](docs/builder-modifications.md) — tree documentation output and dead code reporting
- [verify.md](docs/verify.md) — standalone byte-comparison tool for checking rebuilt output against original
- [ai-disassembler-mcp.md](docs/ai-disassembler-mcp.md) — defines MCP tools and output format

---

## Target Output

The RE pipeline enriches blocks with annotations, variable names, documentation, and module assignments. It also grows and annotates the dependency tree with banking state, resolution levels, and reachability. The downstream **builder** project consumes the enriched output and produces KickAssembler source files plus a human-readable dependency tree document.

### Output Contract: RE Pipeline → Builder

The RE pipeline is the **sole source of intelligent analysis**. The builder is a **renderer** — it mechanically applies whatever the RE pipeline decided. All label decisions, comment text, and annotations flow through the `enrichment` fields on each block (defined in `shared/src/enrichment.ts`):

| Enrichment Field | Written By | Consumed By Builder | Example |
|-----------------|-----------|-------------------|---------|
| `semanticLabels` | Stage 1 `kernal_api_enrichment` (banking-aware) + Stage 2/3 AI (semantic names) | `label_resolver.ts` — highest priority label source | `{ "FFD2": "CHROUT" }` or `{ "FFD2": "ram_FFD2" }` |
| `inlineComments` | Stage 1 `register_semantics_enrichment` + Stage 2/3 AI | `code_emitter.ts` — emitted as instruction comments | `{ "0A05": "⚠ Bank out KERNAL ($01=$35)" }` |
| `headerComment` | Stage 2 AI | `code_emitter.ts` — block header comment | `"Initialize SID and start music"` |
| `variableNames` | Stage 2/3 AI | `code_emitter.ts` — zero page / variable naming | `{ "FB": "sprite_ptr_lo" }` |
| `annotations` | Stage 1 enrichment plugins | `code_emitter.ts` — structured annotation output | KERNAL API info, hardware register detail |

**Banking-aware labeling** happens entirely in the RE pipeline:
- `kernal_api_enrichment.ts` (Stage 1, pri 15) uses `banking_resolver.ts` to decide whether `$FFD2` should be labeled `CHROUT`, `ram_FFD2`, or `maybe_CHROUT` based on the node's banking state from `inter_procedural_register_propagation`
- The result is written to `block.enrichment.semanticLabels`
- The builder's `label_resolver.ts` reads `enrichment.semanticLabels` and applies them — no banking logic in the builder

**Register state comments** also happen in the RE pipeline:
- `register_semantics_enrichment.ts` (Stage 1, pri 40) detects `STA $01` / `STA $DD00` instructions, determines the stored value (via constant propagation), and writes a descriptive comment to `block.enrichment.inlineComments`
- The builder's `code_emitter.ts` emits these comments on the correct instructions — no banking analysis in the builder

### Module Dictionary (controlled vocabulary)

The integration pass assigns blocks to modules from this dictionary — prevents explosion into hundreds of files. The builder uses these assignments for multi-file output:

| Module | Description | Example (Archon) |
|--------|-------------|-------------------|
| `entry` | Program entry, init, main loop | `main.asm` entry/init |
| `intro` | Title screen, attract mode | `intro.asm` |
| `game` | Core gameplay loop, turn logic | `game.asm` |
| `graphics` | Screen setup, drawing, rendering | VIC-II config, charset setup |
| `sprites` | Sprite management, multiplexing | Sprite position/animation |
| `sound` | SID music player, sound effects | Music player, SFX |
| `input` | Joystick/keyboard handling | Input polling |
| `ai` | Computer player logic | `ai.asm` |
| `common` | Shared utilities (clear screen, delays) | `common.asm` |
| `resources` | Binary data assets | `resources.asm` |
| `io` | C64 hardware constants | `io.asm` (standard) |
| `const` | Game-specific constants | `const.asm` |
| `data` | Runtime variables, state storage | Variables segment |

Additional modules can be added per-game (e.g. `board`, `challenge`, `magic` for Archon), but the AI must justify any module not in the base dictionary.

---

## Core Architecture: The Dependency Graph

The dependency graph is the **central data structure** of the entire pipeline. It represents every relationship between code blocks, data blocks, and hardware accesses — with full edge type information, confidence scores, and banking state at every node.

> **Terminology note:** We call this a "dependency graph", not a "dependency tree", because **cycles are common** in real C64 programs: main loops (`JMP` back to start), IRQ handler chains (handler A installs B, B installs A), state machines with mutual calls, and tail-call patterns (`JMP` instead of `JSR`). The graph is a **directed graph with cycles**, not a DAG. Algorithms that need ordering (banking propagation, analysis scheduling) use **SCC condensation** to convert the cyclic graph into a DAG of strongly connected components.

### Why the Graph is Essential

Without an accurate dependency graph, the RE pipeline cannot:
- **Determine reachability** — which blocks are actually used vs dead code
- **Propagate register state** — banking changes in a caller affect all callees
- **Order analysis** — must analyze callees before callers for context (SCC-aware)
- **Discover new code** — resolving a jump table adds nodes/edges to the graph
- **Eliminate junk** — unreachable blocks from snapshots or PRG fill can be identified and removed

### Graph Lifecycle

```
Static Analysis
    │ Creates initial graph from code/data discovery
    │ Edges: branch, jump, call, data_read, data_write,
    │        pointer_ref, hardware_read, hardware_write, smc_write
    ▼
dependency_graph.json + blocks.json
    │
    ▼
Stage 1: Static Enrichment (deterministic, no AI)
    │ GROWS the graph:
    │   - Resolves indirect jumps → new code edges
    │   - Resolves pointer pairs → new data edges
    │   - Detects vector writes → new IRQ handler edges
    │   - RTS dispatch → new call edges
    │ ANNOTATES the graph:
    │   - SCC decomposition (Tarjan's) for cycle-aware ordering
    │   - Banking state on every node (entry + exit) via SCC-aware propagation
    │   - IRQ volatility analysis (SEI/CLI tracking + IRQ handler register writes)
    │   - PHA/PLA save/restore detection for local banking scopes
    ▼
Stage 2: AI Enrichment (sequential plugins, run once per block)
    │ ANNOTATES the graph:
    │   - Purpose, category, algorithm per node
    │   - Initial variable names (→ variable_map.json)
    │   - Header/inline documentation
    │   - Confidence scores
    │ MAY GROW the graph:
    │   - AI discovers jump tables → new code targets
    │   - AI discovers data formats → reclassify nodes
    │   - New blocks → re-run Stage 1 + Stage 2 on fragments
    ▼
Stage 3: AI Reverse Engineering (per-block iterative loop)
    │ ANNOTATES the graph:
    │   - Full reverse engineering per block (name, purpose, docs, variables)
    │   - Refined confidence scores
    │   - Refined variable names (→ variable_map.json)
    │ MAY GROW the graph:
    │   - AI resolves unknown blocks → new edges
    │   - Block splits → new fragments (re-run Stage 1 + 2)
    │ OUTER LOOP:
    │   - Processes all un-RE'd blocks per pass
    │   - Force-picks highest confidence when all bail
    │   - Guaranteed forward progress: ≥1 block RE'd per pass
    ▼
Stage 4: Integration
    │ READS the graph:
    │   - Module assignment based on graph structure
    │   - File splitting based on call clusters
    │   - Dead node identification
    ▼
enriched blocks.json + dependency_graph.json + variable_map.json + integration.json
    │
    ▼
Builder (separate project)
    │ READS the graph:
    │   - Tree documentation output (renders graph as indented call chains)
    │   - Dead node reporting
    ▼
main.asm + dependency_tree.md + dependency_graph.json
```

### Graph Node Structure

```typescript
interface DependencyGraphNode {
  id: string;                    // e.g. "code_C000", "data_C800"
  type: "code" | "data";
  start: number;
  end: number;                   // exclusive
  blockId: string;               // corresponding Block.id (e.g. "sub_C000")
  discoveredBy: string;          // plugin/phase that created this node
  endConfidence: number;         // 0-100

  // SCC membership (populated by Tarjan's decomposition)
  sccId?: string;                // which SCC this node belongs to (null = singleton)

  // Banking state (populated by Stage 1 register propagation)
  bankingState?: {
    onEntry: BankingSnapshot;
    onExit: BankingSnapshot;
  };

  // IRQ interaction (populated by Stage 1 IRQ volatility analysis)
  irqSafety?: IRQSafetyState;

  // Save/restore analysis (populated by Stage 1 PHA/PLA detection)
  bankingScope?: "local" | "leaked" | "unknown";  // does this node preserve $01?

  // Pipeline state tracking (persisted in blocks.json for resumability)
  pipelineState: BlockPipelineState;
}

interface DependencyGraphEdge {
  source: string;                // source node ID
  target: number;                // target address
  targetNodeId?: string;         // resolved target node ID (null if target is external/ROM)
  type: EdgeType;
  category: "control_flow" | "data";  // CRITICAL: scheduling uses only control_flow edges
  sourceInstruction: number;     // instruction address that creates this edge
  confidence: number;            // 0-100
  discoveredBy: string;          // plugin name
  discoveredInPhase: string;     // "static_analysis" | "enrichment" | "ai_analysis"
  discoveryTier?: "confirmed" | "probable" | "speculative";  // for discovery management
  metadata?: Record<string, unknown>;

  // For partially resolved edges (e.g., jump tables with multiple possible targets)
  alternateTargets?: Array<{
    address: number;
    nodeId?: string;
    confidence: number;          // per-target confidence
  }>;
}

type EdgeType =
  | "branch"           // BNE, BEQ, BCC, etc.
  | "fallthrough"      // Sequential execution into next block
  | "jump"             // JMP absolute
  | "indirect_jump"    // JMP ($xxxx) — resolved
  | "call"             // JSR
  | "data_read"        // LDA from data address
  | "data_write"       // STA to data address
  | "pointer_ref"      // Address constructed via LDA #lo/hi pairs
  | "hardware_read"    // LDA from $D000-$DFFF
  | "hardware_write"   // STA to $D000-$DFFF
  | "smc_write"        // Self-modifying code: write into code region
  | "vector_write"     // Write to IRQ/NMI/BRK vector locations
  | "rts_dispatch";    // PHA/PHA/RTS computed jump

// Edge classification for scheduling: only control_flow edges create analysis dependencies.
// data edges (data_read, data_write, pointer_ref, hardware_read, hardware_write) do NOT
// block analysis scheduling — a block can be analyzed without its data sources being resolved.
const CONTROL_FLOW_EDGES: EdgeType[] = [
  "branch", "fallthrough", "jump", "indirect_jump", "call", "rts_dispatch"
];
const DATA_EDGES: EdgeType[] = [
  "data_read", "data_write", "pointer_ref", "hardware_read", "hardware_write",
  "smc_write", "vector_write"
];

// Pipeline state — persisted in blocks.json for resumability
interface BlockPipelineState {
  // Stage completion flags
  staticEnrichmentComplete: boolean;   // Stage 1 done
  aiEnrichmentComplete: boolean;       // Stage 2 done
  reverseEngineered: boolean;          // Stage 3 done

  // Confidence (0.0 - 1.0) — set by Stage 2 (initial) and Stage 3 (refined)
  confidence: number;

  // Stage 3 tracking
  stage3Iterations: number;            // how many per-block loop iterations
  bailReason?: BailReason;             // why Stage 3 bailed (if it did)
  bailCount: number;                   // how many outer loop passes this block has bailed

  // Timestamps for resumability
  lastStage1Timestamp?: string;
  lastStage2Timestamp?: string;
  lastStage3Timestamp?: string;
}

// Structured bail reasons for traceability
type BailReason =
  | { type: "needs_dependency"; dependencies: string[]; details: string }
  | { type: "insufficient_context"; details: string }
  | { type: "block_too_complex"; complexityFactors: string[] }
  | { type: "hit_iteration_limit"; iterations: number }
  | { type: "low_confidence"; confidence: number; threshold: number };
```

### SCC Decomposition and Cycle Handling

Real C64 programs have cycles in their call graphs. Main loops (`JMP` back to start), IRQ handler chains (handler A installs B, B installs A), state machines with mutual calls, and tail-call optimization patterns (`JMP` instead of `JSR/RTS`) all create cycles.

**Algorithm:** Tarjan's SCC decomposition (single DFS pass, O(V+E)).

```typescript
interface SCCDecomposition {
  // SCC assignments: nodeId → sccId
  nodeToSCC: Map<string, string>;
  // SCC contents: sccId → set of nodeIds
  sccMembers: Map<string, Set<string>>;
  // Condensation DAG: sccId → successor sccIds (guaranteed acyclic)
  condensationEdges: Map<string, Set<string>>;
  // Topological order of the condensation DAG (leaves first = callees first)
  topologicalOrder: string[];
}
```

**Why Tarjan's (not Kosaraju's):**
- Single DFS traversal (vs two for Kosaraju's)
- No transpose graph needed (less bookkeeping on mutable graph)
- Produces SCCs in reverse topological order of condensation DAG as a byproduct
- Lower constant factors for small graphs (typical C64: 20-200 nodes)

**How it's used:**

1. **Analysis scheduling (Stage 3):** Topological sort is on the **condensation DAG**, not the raw graph. Nodes within the same SCC are analyzed together (see below). SCCs are processed bottom-up (callees before callers).

2. **Banking state propagation (Stage 1):** Propagate state through the condensation DAG. Within each multi-node SCC, iterate until fixed point (see [Register State Propagation](#register-state-propagation)).

3. **Within-SCC analysis:** All nodes in an SCC share coupled context — analyzing any one of them provides context for all others. Process as a group:
   - Analyze all nodes in the SCC (parallel OK)
   - If any node advanced, re-analyze all others in the SCC that haven't converged
   - Iterate until SCC-local fixed point, then propagate to successor SCCs

4. **Incremental SCC updates:** When AI discovers a new edge:
   - If both endpoints are in the same SCC: no SCC structure change (may need to re-converge dataflow within this SCC)
   - If endpoints are in different SCCs and a reverse path exists: SCCs must merge → rerun Tarjan's, re-converge affected SCCs
   - If no reverse path: just a new DAG edge in condensation, propagate normally
   - For C64-scale graphs (< 500 nodes), full Tarjan recomputation takes microseconds — just recompute from scratch on any structural change

### Banking State Representation

Banking state is the **critical context** for correct labeling. On the C64, the CPU port ($01) controls which ROMs are visible:

| $01 bits 0-2 | LORAM (bit 0) | HIRAM (bit 1) | CHAREN (bit 2) | Effect |
|--------------|---------------|---------------|----------------|--------|
| `%111` ($37) | BASIC in | KERNAL in | I/O in | Default C64 state |
| `%110` ($36) | BASIC out | KERNAL in | I/O in | RAM at $A000-$BFFF |
| `%101` ($35) | BASIC in | KERNAL out | I/O in | RAM at $E000-$FFFF |
| `%100` ($34) | BASIC out | KERNAL out | I/O in | RAM at $A000-$BFFF + $E000-$FFFF |
| `%011` ($33) | BASIC in | KERNAL in | Char ROM in | Character ROM at $D000-$DFFF |
| `%000` ($30) | All out | All out | All out | Full 64KB RAM |

#### The Bitmask Abstract Domain

Register values are tracked using a **bitmask abstract domain** — inspired by LLVM's `KnownBits` and the Linux kernel's `tnum` (tristate numbers). This gives us per-bit precision, which is critical because C64 programs commonly use read-modify-write patterns on $01 that preserve some bits while changing others:

```asm
; Common pattern: preserve DDR bits, change banking
LDA $01        ; read current port value
AND #$F8       ; clear bits 0-2 (banking), preserve bits 3-7 (DDR, datasette)
ORA #$05       ; set banking to %101 (BASIC in, KERNAL out, I/O in)
STA $01
```

A simple constant tracker sees `LDA $01` (unknown value from memory) and gives up. The bitmask domain tracks **which bits are known**:

```
After LDA $01:  knownMask=00000000  knownValue=00000000  → ????????
After AND #$F8: knownMask=00000111  knownValue=00000000  → ?????000
After ORA #$05: knownMask=00000111  knownValue=00000101  → ?????101
```

Result: we know bits 0-2 are `101` even though bits 3-7 are unknown. This is enough to determine the exact banking configuration.

```typescript
interface BitmaskValue {
  knownMask: number;             // 1 = this bit's value is known
  knownValue: number;            // the value of known bits (invariant: knownValue & ~knownMask === 0)
}

// Transfer functions for 6502 bitwise operations:
function transferAND(input: BitmaskValue, imm: number): BitmaskValue {
  return {
    knownMask:  input.knownMask | (~imm & 0xFF),  // imm=0 bits become known-zero
    knownValue: input.knownValue & imm,             // imm=0 forces value to 0
  };
}
function transferORA(input: BitmaskValue, imm: number): BitmaskValue {
  return {
    knownMask:  input.knownMask | imm,              // imm=1 bits become known-one
    knownValue: input.knownValue | imm,             // imm=1 forces value to 1
  };
}
function transferEOR(input: BitmaskValue, imm: number): BitmaskValue {
  return {
    knownMask:  input.knownMask,                    // XOR preserves knowledge
    knownValue: input.knownValue ^ imm,             // flips known bits
  };
}
function transferLDA_IMM(imm: number): BitmaskValue {
  return { knownMask: 0xFF, knownValue: imm };      // fully known
}
function transferLDA_MEM(): BitmaskValue {
  return { knownMask: 0x00, knownValue: 0x00 };     // fully unknown
}

// Meet at control flow merge points (keep only what both paths agree on):
function meetBitmask(a: BitmaskValue, b: BitmaskValue): BitmaskValue {
  const bothKnown = a.knownMask & b.knownMask;
  const agreeValue = ~(a.knownValue ^ b.knownValue) & 0xFF;
  const resultMask = bothKnown & agreeValue;
  return {
    knownMask:  resultMask,
    knownValue: a.knownValue & resultMask,
  };
}
// For {$35, $37}: meet = knownMask=0xFD, knownValue=0x35 → bit 1 unknown, all others known
```

#### Hybrid Domain: Bitmask + Small Value Set

For extra precision, we also track a **small set of possible concrete values** alongside the bitmask. C64 programs typically use only 2-4 banking configurations, so the set stays small:

```typescript
interface RegisterValue {
  // Primary: bitmask abstract domain (always maintained, O(1) operations)
  bitmask: BitmaskValue;

  // Secondary: small set of possible concrete values (null = too many, use bitmask only)
  possibleValues: Set<number> | null;
  static MAX_SET_SIZE = 16;      // collapse to bitmask-only above this threshold

  // Metadata
  isDynamic: boolean;            // true if set by SMC, runtime computation, or unresolvable indirect
  source: string;                // "default" | "constant_propagation" | "parent_exit_state" | "dynamic"
}

// When possibleValues exceeds threshold, collapse:
function collapseToMask(values: Set<number>): BitmaskValue {
  let allOnes = 0xFF, allZeros = 0xFF;
  for (const v of values) {
    allOnes  &= v;               // bits that are 1 in ALL values
    allZeros &= (~v & 0xFF);     // bits that are 0 in ALL values
  }
  return {
    knownMask:  allOnes | allZeros,
    knownValue: allOnes,
  };
}
```

**Example:** `possibleValues = {$35, $37}` → `collapseToMask` gives `knownMask=0xFD, knownValue=0x35` — all bits known except bit 1. The bitmask correctly captures that BASIC is mapped (bit 0=1) and I/O is mapped (bit 2=1), while KERNAL mapping is uncertain (bit 1=? → either mapped or not).

But keeping the set `{$35, $37}` is MORE useful: we can answer "is KERNAL mapped?" with `{yes, no}` and present both interpretations to the AI, rather than a single "unknown".

#### BankingSnapshot

```typescript
interface BankingSnapshot {
  cpuPort: RegisterValue;          // $01 value(s) — bitmask + optional value set
  vicBank: RegisterValue;          // $DD00 bits 0-1 (CIA2 port A)
  vicMemPtr: RegisterValue;        // $D018 (screen/charset base)

  // Derived convenience flags (computed from cpuPort.bitmask)
  kernalMapped: Ternary;           // Is KERNAL ROM visible at $E000-$FFFF? (bit 1 of $01)
  basicMapped: Ternary;            // Is BASIC ROM visible at $A000-$BFFF? (bit 0 of $01)
  ioMapped: Ternary;               // Is I/O area visible at $D000-$DFFF? (bit 2 of $01)
  chargenMapped: Ternary;          // Is Character ROM visible at $D000-$DFFF?
}

type Ternary = "yes" | "no" | "unknown";

// Deriving Ternary from bitmask is trivial:
function deriveBanking(cpuPort: BitmaskValue): { kernalMapped: Ternary; ... } {
  return {
    kernalMapped: (cpuPort.knownMask & 0x02)  // bit 1 known?
      ? ((cpuPort.knownValue & 0x02) ? "yes" : "no")
      : "unknown",
    basicMapped: (cpuPort.knownMask & 0x01)   // bit 0 known?
      ? ((cpuPort.knownValue & 0x01) ? "yes" : "no")
      : "unknown",
    ioMapped: (cpuPort.knownMask & 0x04)      // bit 2 known?
      ? ((cpuPort.knownValue & 0x04) ? "yes" : "no")
      : "unknown",
    // chargenMapped requires ioMapped=no AND bit 2=0, more nuanced
  };
}
```

**Academic grounding:** The bitmask domain is formally studied in ["Sound, Precise, and Fast Abstract Interpretation with Tristate Numbers"](https://arxiv.org/abs/2105.05398) (CGO 2022 Distinguished Paper). Transfer functions are proven sound and optimal. LLVM's `KnownBits` and the Linux kernel's BPF verifier both use this domain in production. Combining with a small value set is a standard **reduced product** technique from abstract interpretation theory.

#### IRQ Volatility

Hardware registers may be modified asynchronously by IRQ handlers. When analyzing mainline code, we must know which registers are **IRQ-volatile** (potentially changed between any two instructions when IRQs are enabled).

```typescript
interface IRQSafetyState {
  irqsDisabled: Ternary;          // "yes" = between SEI/CLI, "no" = IRQs enabled, "unknown"
  irqVolatileRegisters: Set<number>;  // hardware addrs modified by known IRQ handlers
  nmiVolatileRegisters: Set<number>;  // hardware addrs modified by NMI handler (non-maskable)
}
```

**Three-tier volatility model** (based on Regehr & Cooprider's Interatomic Concurrent Data-flow analysis):
1. **IRQ-safe** (`irqsDisabled="yes"`): Between `SEI` and `CLI`. No IRQ can fire. Full precision for all registers.
2. **IRQ-exposed** (`irqsDisabled="no"`): IRQs are enabled. Registers in `irqVolatileRegisters` must be treated as having unknown values (the IRQ handler could have changed them between the previous instruction and this one).
3. **Stable**: Registers NOT in the IRQ-volatile set. Full precision even when IRQs are enabled.

**Building the IRQ-volatile register set:**
1. Identify all IRQ/NMI handler entry points (already done by `entry_point_detector.ts`)
2. Follow handler chains (handler A installs B via `$0314/$0315` writes)
3. Walk each handler's code, collecting all hardware register writes (`STA $D018`, `STA $DD00`, etc.)
4. Union of all handler writes = IRQ-volatile register set
5. Detect raster split patterns: chained handlers managing `$D012`, `$D020`, `$D021`, `$D018`, `$DD00`

**SEI/CLI propagation:**
- `SEI`: set `irqsDisabled = "yes"`
- `CLI`: set `irqsDisabled = "no"`
- `RTI`: `irqsDisabled = "unknown"` (restores P from stack, I flag unknown)
- `PLP`: same as RTI
- IRQ handler entry: `irqsDisabled = "yes"` (6502 hardware sets I flag on IRQ entry)
- Branch merge: if paths disagree → `"unknown"`

#### Save/Restore Detection

Many subroutines (not just IRQ handlers) preserve banking state:

```asm
; Pattern 1: PHA/PLA
LDA $01        ; read current banking
PHA            ; save on stack
LDA #$35
STA $01        ; change banking
...            ; work with different banking
PLA
STA $01        ; restore original banking
RTS

; Pattern 2: register transfer
LDA $01
TAX            ; save in X
LDA #$35
STA $01
...
STX $01        ; restore from X
RTS
```

Detection: track PHA/PLA stack balance within a subroutine. If balanced and the PHA source was `$01` and the PLA destination is `$01`, mark the node as `bankingScope = "local"`. This means the caller's banking state is **preserved** — the JSR does not change the caller's `$01` state. Unbalanced = `"leaked"`.

**Impact on propagation:** When computing a caller's exit state after `JSR sub`:
- `sub.bankingScope === "local"` → caller continues with its OWN state at the JSR site (sub's banking changes are invisible)
- `sub.bankingScope === "leaked"` → caller continues with sub's exit state (banking changed)
- `sub.bankingScope === "unknown"` → conservative: merge both possibilities

**Propagation rules:**
- **Entry points** start with default C64 state: `$01 = $37` (everything mapped)
- **IRQ handlers** start with "unknown" banking state — interrupted code could have any state — UNLESS we can prove IRQ is only armed after a specific banking setup
- **Call edges** propagate: callee's `onEntry` = caller's state at the JSR instruction
- **Return edges** propagate: after `JSR sub`, caller continues with sub's `onExit` state (or own state if sub is `bankingScope = "local"`)
- **Conditional branches**: if banking changes on one path but not the other, the merge point uses `meetBitmask()` to keep only known-agreeing bits
- **Self-modifying code** that targets $01: banking becomes "dynamic" for all descendants
- **IRQ-volatile registers**: when `irqsDisabled = "no"`, registers in the IRQ-volatile set lose their known values (they could have been changed by an IRQ between any two instructions)

### Banking-Aware Labeling

The key payoff of banking state tracking. When generating labels for addresses in ROM space:

```typescript
function resolveLabelForAddress(addr: number, bankingState: BankingSnapshot): LabelResolution {
  // Is this a KERNAL address?
  if (addr >= 0xE000 && addr <= 0xFFFF) {
    if (bankingState.kernalMapped === "yes") {
      // Definitely KERNAL ROM — use KERNAL label
      return { label: KERNAL_SYMBOLS[addr]?.name ?? `kernal_${hex(addr)}`, type: "kernal", confidence: "high" };
    } else if (bankingState.kernalMapped === "no") {
      // Definitely RAM behind KERNAL — use RAM label
      return { label: `ram_${hex(addr)}`, type: "ram", confidence: "high",
               warning: "KERNAL banked out — this targets RAM, not ROM" };
    } else {
      // Unknown — could be either
      const kernalName = KERNAL_SYMBOLS[addr]?.name;
      return { label: kernalName ? `maybe_${kernalName}` : `addr_${hex(addr)}`, type: "ambiguous", confidence: "low",
               warning: "Banking state unknown — may be KERNAL or RAM" };
    }
  }

  // Similar for BASIC ROM ($A000-$BFFF) and I/O vs Character ROM ($D000-$DFFF)
  // ...
}
```

This means `JSR $FFD2` produces:
- `jsr CHROUT` when banking confirms KERNAL is mapped
- `jsr ram_FFD2` when banking confirms KERNAL is banked out
- `jsr maybe_CHROUT` when banking is uncertain (flagged for human review)

---

## Full Pipeline Diagram

```
Static Analysis
    │
    ├─→ blocks.json
    ├─→ dependency_graph.json
    │
    ▼
═══ RE PIPELINE ══════════════════════════════════════════════════════════════

STAGE 1: Static Enrichment (deterministic, no AI, run once)
    │   28 plugins · SCC decomposition · bitmask banking propagation
    │   IRQ volatility · save/restore detection · can split/reclassify
    │
    ▼
STAGE 2: AI Enrichment (sequential AI plugins, run once per block)
    │   Purpose analysis → variable naming → documentation → validation
    │   Creates initial variable map (variable_map.json)
    │   Can split/reclassify (new blocks → back to Stage 1)
    │   Each block gets confidence score
    │                                        ┌─────────────────────────┐
    │                                        │  Qdrant Collections     │
    ▼                                        │                         │
╔═══ OUTER LOOP (guaranteed progress) ═════╗ │  re_<project>           │
║                                           ║ │  ◄── embed after Stage │
║  For each un-RE'd block:                  ║ │       2 + Stage 3      │
║  ┌──────────────────────────────────────┐ ║ │                         │
║  │ STAGE 3: Per-Block AI RE Loop        │ ║ │  c64_re_patterns        │
║  │                                      │ ║ │  ◄── promote HIGH      │
║  │  Phase A: AI requests context ───────│─║─│──► search by concept   │
║  │      ↓                               │ ║ │                         │
║  │  Phase B: System gathers (isRE'd)    │ ║ │  c64_knowledge          │
║  │      ↓                               │ ║ │  ◄── authoritative docs │
║  │  Phase C: Sufficiency + confidence   │ ║ └─────────────────────────┘
║  │      ↓                               │ ║
║  │  Phase D: Attempt RE ─or─ bail       │ ║
║  │                                      │ ║
║  │  (repeats up to N iterations/block)  │ ║
║  └──────────────────────────────────────┘ ║
║                                           ║
║  Progress check after each pass:          ║
║    • Any RE'd? → continue next pass       ║
║    • All bailed? → force-pick highest     ║
║      confidence → RE it (guaranteed       ║
║      forward progress)                    ║
║    • New blocks from splits? →            ║
║      Stage 1 + 2 → back to loop          ║
╚═══════════════════════════════════════════╝
    │
    ▼
STAGE 4: Integration (whole-program, runs once)
    │   Module assignment · file splitting · dead code · overview docs
    │
    ▼
═══ OUTPUT ═══════════════════════════════════════════════════════════════════
    │
    ├─→ enriched blocks.json (with BlockPipelineState per block)
    ├─→ dependency_graph.json (banking, SCC, RE annotations)
    ├─→ variable_map.json
    ├─→ integration.json
    │
    ▼
[Human review via Claude + MCP tools]      Promote HIGH blocks
    Review flagged items, iterate           to c64_re_patterns
    │
    ▼
[Builder (separate project)] ──────── main.asm + dependency_tree.md
    See builder.md                     + compiled .prg (via KickAssembler)
```

**Every layer is pluggable.** Adding new capabilities at any stage means dropping a file into the right directory — no orchestrator code changes required.

---

## Pre-requisite: Static Analysis

Before the pipeline runs, the static analysis pipeline must produce `blocks.json` **and** `dependency_tree.json`. See [static-analysis.md](docs/static-analysis.md) and [static-analysis-modifications.md](docs/static-analysis-modifications.md) for the full design.

**Input:** `.prg` file + entry address (or `.asm` disassembly dump — auto-detected format)

**What it does (7-step deterministic pipeline, no AI):**
1. Load binary into 64KB memory image
2. Detect entry points (BASIC SYS stub, IRQ/NMI vector setup patterns, snapshot PC)
3. Discover code via queue-based tree walker with pluggable discovery plugins
4. Discover unreached code islands via pluggable code discovery plugins
5. Classify data regions via pluggable data detector plugins
6. Assemble blocks with metadata (tree edge information preserved — see modifications plan)
7. Enrich blocks via pluggable enricher plugins (tree updated during splits/merges)

**Output:**
- `blocks.json` — one entry per subroutine/data region/unknown region, with full instruction data, basic blocks, xrefs, hardware refs, reachability classification
- `dependency_tree.json` — full graph with typed edges, confidence scores, discovery provenance

The pipeline also stores base64-encoded loaded regions in `blocks.json` as `raw_binary` for AI data requests during Stage 2/3.

## Block Structure (blocks.json)

The `blocks.json` format is fully defined in [static-analysis.md — Output](docs/static-analysis.md#output). The static analysis pipeline is self-contained and owns the schema.

**Key points for the RE pipeline:**
- Every loaded byte belongs to exactly one block (coverage guarantee — no gaps)
- Block types: `subroutine`, `irq_handler`, `fragment`, `data`, `unknown`
- Reachability: `proven`, `indirect`, `unproven` — `unproven` blocks are prime candidates for data reclassification or dead code elimination
- Data blocks carry a `candidates` array with ALL detector proposals (not just the winner)
- Large subroutines (>120 instructions) are sub-split with sibling summaries
- `raw_binary` field contains base64-encoded loaded regions for AI data requests
- `coverage` section shows code/data/unknown byte counts and percentages

---

## Mutable Block Store + Mutable Tree

Blocks and the dependency graph are **mutable in memory** throughout the pipeline. Both enrichment plugins and AI can reclassify, split, or merge blocks — and the graph is updated in lockstep.

```typescript
// block_store.ts
class BlockStore {
  private blocks: Block[];
  private version: number = 0;
  private changeLog: BlockChange[] = [];

  getVersion(): number { ... }
  getSnapshot(): readonly Block[] { ... }
  getBlock(address: number): Block | null { ... }
  findBlockContaining(address: number): Block | null { ... }

  /** Reclassify a block — updates tree node type */
  reclassify(address: number, newType: BlockType, reason: string): void { ... }

  /** Split a block — creates new tree nodes, redistributes edges */
  split(address: number, splitAt: number, reason: string): void { ... }

  /** Merge two adjacent blocks — merges tree nodes, combines edges */
  merge(addr1: number, addr2: number, reason: string): void { ... }

  hasChangedSince(version: number): boolean { ... }
  getChanges(): readonly BlockChange[] { ... }
}

// mutable_graph.ts
class MutableGraph {
  private nodes: Map<string, DependencyGraphNode>;
  private edges: DependencyGraphEdge[];
  private edgesBySource: Map<string, DependencyGraphEdge[]>;
  private edgesByTarget: Map<string, DependencyGraphEdge[]>;
  private sccDecomp: SCCDecomposition | null = null;  // cached, invalidated on structural change

  /** Add a new node (discovered code/data). Invalidates SCC cache. */
  addNode(node: DependencyGraphNode): void { ... }

  /** Add a new edge (discovered relationship). Invalidates SCC cache. */
  addEdge(edge: DependencyGraphEdge): void { ... }

  /** Remove a node (reclassified away). Invalidates SCC cache. */
  removeNode(nodeId: string): void { ... }

  /** Update node when block is split — creates child nodes, redistributes edges.
   *  Emits ID change events for all systems holding references to the old node. */
  splitNode(nodeId: string, splitAt: number, newIds: [string, string]): void { ... }

  /** Update nodes when blocks are merged — combines into single node.
   *  Emits ID change events for systems holding references to the old nodes. */
  mergeNodes(nodeId1: string, nodeId2: string, mergedId: string): void { ... }

  /** Set banking state on a node */
  setBankingState(nodeId: string, entry: BankingSnapshot, exit: BankingSnapshot): void { ... }

  /** Set pipeline state on a node */
  setPipelineState(nodeId: string, state: Partial<BlockPipelineState>): void { ... }

  /** Get all nodes reachable from entry points */
  getReachableNodes(): Set<string> { ... }

  /** Get dead nodes (not reachable from any entry point) */
  getDeadNodes(): DependencyGraphNode[] { ... }

  /** SCC decomposition via Tarjan's (cached, recomputed on structural change) */
  getSCCDecomposition(edgeFilter?: "control_flow" | "all"): SCCDecomposition { ... }

  /** Topological sort of condensation DAG (leaf SCCs first = callees first) */
  topologicalSort(edgeFilter?: "control_flow" | "all"): string[][] { ... }

  /** Get children of a node, optionally filtered by edge category */
  getChildren(nodeId: string, filter?: "control_flow" | "data" | "all"): DependencyGraphNode[] { ... }

  /** Get parents of a node, optionally filtered by edge category */
  getParents(nodeId: string, filter?: "control_flow" | "data" | "all"): DependencyGraphNode[] { ... }

  /** Check if a node has a self-loop (e.g., JMP to own start = main loop) */
  hasSelfLoop(nodeId: string): boolean { ... }

  /** Get banking state at a specific instruction address */
  getBankingStateAt(instructionAddr: number): BankingSnapshot | null { ... }

  /** Quarantine a speculative discovery (stored separately, not in graph) */
  quarantine(discovery: SpeculativeDiscovery): void { ... }

  /** Promote a quarantined discovery to the graph (after corroboration) */
  promoteQuarantined(discoveryId: string): void { ... }

  /** Serialize to JSON (outputs as dependency_tree.json for pipeline compat) */
  toJSON(): DependencyGraphJson { ... }
}
```

The `BlockStore` and `MutableGraph` are kept in sync: every block mutation triggers a corresponding graph mutation. They are passed together as context to all enrichment plugins and AI analysis.

---

## Stage 1: Static Enrichment (Pluggable, Iterative, No AI)

Before any AI calls, a pluggable enrichment layer runs deterministic analysis. This is an **iterative fixpoint loop** — plugins can trigger reclassifications that cause other plugins to discover new information. Stage 1 runs **once** per block (unless a block is split in Stage 2/3, in which case new fragments go through Stage 1).

SCC-aware inter-procedural register state propagation runs as part of this stage, giving every graph node accurate banking state BEFORE any AI analysis begins. IRQ volatility analysis identifies which hardware registers may be asynchronously modified. Save/restore detection identifies subroutines with local banking scope.

After Stage 1 completes, each block's `pipelineState.staticEnrichmentComplete` is set to `true`.

All enrichment plugins live in `src/enrichment/` and are auto-discovered by filename pattern `*_enrichment.ts`.

### Plugin Interface

```typescript
interface EnrichmentInput {
  readonly blocks: readonly Block[];
  readonly tree: MutableGraph;                    // NEW: mutable tree access
  readonly memory: Readonly<Uint8Array>;
  readonly loadedRegions: readonly LoadedRegion[];
  readonly priorEnrichments: ReadonlyMap<string, BlockEnrichment[]>;
}

interface EnrichmentResult {
  enrichments: BlockEnrichment[];
  reclassifications?: BlockReclassification[];
  newTreeEdges?: DependencyTreeEdge[];           // NEW: plugins can add tree edges
  newTreeNodes?: DependencyTreeNode[];           // NEW: plugins can add tree nodes
}

interface BlockEnrichment {
  blockAddress: number;
  source: string;
  type: EnrichmentType;
  annotation: string;
  data: Record<string, unknown>;
}

type EnrichmentType =
  | "resolved_target"      // Indirect target resolved to concrete address
  | "pointer_pair"         // Low/high byte table pairing detected
  | "vector_write"         // Code writes to a known vector location
  | "call_relationship"    // Calling relationship between blocks
  | "data_semantic"        // What a data value means in context
  | "data_format"          // Data block format classification
  | "register_semantic"    // What a register write does (VIC/SID/CIA)
  | "pattern"              // Higher-level pattern (interrupt chain, state machine, etc.)
  | "api_call"             // Known API/KERNAL call identified
  | "banking"              // Banking state change detected
  | "banking_propagation"  // Banking state propagated from parent
  | "qdrant_knowledge"     // Authoritative Qdrant docs for AI concepts
  | "annotation";          // General annotation

interface BlockReclassification {
  blockAddress: number;
  newType: BlockType;
  reason: string;
  splitAt?: number[];
}
```

### Multi-Pass Reclassification Loop

```typescript
let pass = 0;
do {
  pass++;
  const lastVersion = store.getVersion();
  for (const plugin of plugins) {
    const result = plugin.enrich({
      blocks: store.getSnapshot(), tree, memory, loadedRegions, priorEnrichments
    });
    enrichments.set(plugin.name, result.enrichments);
    // Apply tree changes
    for (const edge of result.newTreeEdges ?? []) tree.addEdge(edge);
    for (const node of result.newTreeNodes ?? []) tree.addNode(node);
    // Apply block reclassifications (also updates tree via BlockStore sync)
    for (const r of result.reclassifications ?? []) {
      store.reclassify(r.blockAddress, r.newType, r.reason);
    }
  }
} while (store.hasChangedSince(lastVersion) && pass < maxPasses);
```

### Plugin Catalogue

#### Foundation (priority 10-19) — No dependencies

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `constant_propagation` | 10 | Trace immediate values through LDA/LDX/LDY → STA/STX/STY chains within a block. Build a map of "at instruction X, register A/X/Y holds value V". Essential for all later resolution. |
| `zero_page_tracker` | 12 | Track zero-page writes/reads across blocks. Identify ZP locations used as pointers (consecutive byte pairs like $FA/$FB). Map which blocks set vs read each ZP location. |
| `kernal_api` | 15 | Identify JSR targets that hit known KERNAL ROM entry points ($FFD2=CHROUT, $FFE4=GETIN, etc.). **Banking-aware**: only label as KERNAL if `bankingState.kernalMapped !== "no"`. Uses `banking_resolver.ts` to decide label: `CHROUT` (mapped), `ram_FFD2` (banked out), `maybe_CHROUT` (unknown). **Writes to `enrichment.semanticLabels`** — the builder applies these labels with no banking logic of its own. Also writes API calling convention info to `enrichment.annotations`. |
| `inter_procedural_register_propagation` | 18 | **NEW — Critical.** SCC-aware register state propagation using the bitmask abstract domain. (1) Compute SCC decomposition via Tarjan's algorithm. (2) Build condensation DAG. (3) Process SCCs in bottom-up topological order. (4) For single-node SCCs: compute banking state from instructions + callee exit states. (5) For multi-node SCCs (cycles): iterate within the SCC using `meetBitmask()` until fixed-point convergence. (6) Track $01 (CPU port), $DD00 (CIA2/VIC bank), $D018 (VIC memory pointer) using `BitmaskValue` — handles AND/ORA/EOR read-modify-write patterns precisely. (7) Detect PHA/PLA save/restore patterns and mark nodes as `bankingScope = "local"` (caller's state preserved). (8) Propagate IRQ-safety state (SEI/CLI tracking). (9) Build IRQ-volatile register set from known IRQ handler writes. See [Banking State Representation](#banking-state-representation) for domain details. |

#### Resolution (priority 20-39) — Core indirect addressing

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `pointer_pair` | 20 | **Critical.** Detect paired low/high byte tables. Pattern: two data blocks at nearby addresses where entry N of table A = `<addr_N` and entry N of table B = `>addr_N`. Also detect `.word` tables. Reconstruct full 16-bit addresses. **Adds tree edges** for each resolved pointer target. |
| `indirect_jmp` | 25 | Resolve `JMP ($xxxx)` instructions. Use constant propagation + pointer pair results. **Adds tree edges** for resolved targets. Annotate unresolvable as "dynamic — set by block $XXXX". |
| `vector_write` | 27 | Detect writes to known vector locations ($0314/$0315 = IRQ, $0316/$0317 = BRK, $0318/$0319 = NMI, $FFFE/$FFFF). Use constant propagation to resolve target. **Adds tree edges** (vector_write type). Annotate: "Sets IRQ vector to $XXXX". |
| `rts_dispatch` | 30 | Detect RTS-as-jump pattern: push high byte, push low byte, RTS. Resolve target (pushed value + 1). **Adds tree edges** (rts_dispatch type). Also detect PHA/PHA/RTS with values from tables. |
| `smc_target` | 32 | Detect self-modifying code. STA into operand bytes of a later instruction. Flag banking state as "dynamic" if SMC targets $01 writes. **Adds tree edges** (smc_write type). |
| `address_table` | 35 | For data blocks identified as address/jump tables, resolve each entry. **Adds tree edges** for each resolved entry → target block. Annotate entries. |

#### Semantics (priority 40-59) — Pattern recognition

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `register_semantics` | 40 | Annotate writes to VIC-II ($D000-$D3FF), SID ($D400-$D7FF), CIA1/2 ($DC00-$DDFF). **Banking-aware**: only annotate I/O registers if `bankingState.ioMapped !== "no"`. Use constant propagation for values. Detects `STA $01` / `STA $DD00` banking changes and describes the effect. **Writes to `enrichment.inlineComments`** (e.g., `"⚠ Bank out KERNAL ($01=$35)"`, `"Sets border to black"`). The builder emits these as instruction-level comments with no analysis of its own. |
| `data_format` | 42 | Classify data blocks by content. Not just "it's data" but "it's a half charset" or "it's 54-byte sprites" (like Archon's non-standard sprite size). Heuristics: sprite alignment, charset boundaries, PETSCII text, known music formats, bitmap sizes. |
| `embedded_command` | 44 | Detect embedded bytecode/command languages in data. Find interpreter loop (LDA (ptr),Y / CMP / BEQ), map command byte → handler, determine parameter count, annotate data with command dictionary. |
| `irq_volatility` | 43 | **NEW.** Build IRQ-volatile register set: walk each IRQ/NMI handler, collect hardware register writes. Detect raster split patterns (chained handlers managing $D012, $D020, $D021, $D018, $DD00). Propagate SEI/CLI state through control flow — annotate each instruction as `irq-safe` or `irq-exposed`. Flag mainline accesses to IRQ-volatile registers as potentially asynchronously modified. Based on Regehr & Cooprider's Interatomic Concurrent Data-flow analysis. |
| `save_restore_detector` | 44 | **NEW.** Track PHA/PLA stack balance per subroutine. Match `LDA $01 / PHA` with `PLA / STA $01` patterns and register-transfer variants (`LDA $01 / TAX ... STX $01`). Set `node.bankingScope = "local"` when save/restore is balanced. Flag stack imbalances as potential bugs or intentional banking leaks. |
| `interrupt_chain` | 45 | Detect linked interrupt patterns. Look for blocks that write to IRQ/NMI vectors where targets form a chain/cycle. Build raster split model: chain of handlers, raster line assignments ($D012), registers managed per screen section. Annotate: "IRQ chain: handler_1 → handler_2 → handler_3 → handler_1 (raster multiplexer, 3 splits)". |
| `state_machine` | 48 | Detect state machine patterns. State variable read (LDA state), dispatch (indexed table jump, comparison chains, computed branch). Annotate states and transitions. |
| `copy_loop` | 50 | Detect memory copy/fill loops. LDA source,X / STA dest,X / INX/DEX / BNE. Or indirect: LDA ($ZP),Y / STA ($ZP),Y. Annotate source, destination, size, direction. |
| `data_table_semantics` | 55 | For data blocks read by code, determine what values mean. Cross-reference with register_semantics: if table values are written to $D027, they're "sprite colours". |

#### Cross-Reference (priority 60-79)

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `call_graph` | 60 | Build complete call graph from tree edges (direct + indirect + resolved). For each code block, list callers/callees with mechanism. Annotate entry points and leaf functions. |
| `data_boundary` | 62 | Determine data block sizes. Terminator scan ($00, $FF), counter-based (loop count × element size), pointer math, cross-reference (next referenced address). |
| `data_flow` | 65 | Track data flow between blocks. Which blocks write/read each data block. Identify "write-once" tables vs "read-write" state. Build data usage map with access patterns. |
| `shared_data` | 70 | Identify data referenced by multiple code blocks. Annotate as shared state. Flag potential race conditions (data modified by both mainline and IRQ handler without SEI protection). |

#### C64-Specific (priority 80-99)

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `banking_state` | 80 | Higher-level banking annotations. Detect: bank-switch sequences, ROM shadowing, under-ROM data access patterns. Flag blocks that execute with non-default banking. **Note:** Basic banking propagation happens in `inter_procedural_register_propagation` (pri 18). This plugin handles the complex/unusual cases. |
| `vic_annotation` | 85 | Higher-level VIC-II annotations. Detect: screen mode setup (bitmap vs text vs multicolour), sprite enable/position sequences, scroll register manipulation, VIC bank selection. **Banking-aware**: check VIC bank from `$DD00` state. |
| `sid_annotation` | 88 | Higher-level SID annotations. Detect: voice setup (waveform + frequency + ADSR), filter configuration, music player init/play patterns. |
| `screen_ops` | 90 | Detect screen/colour RAM operations. Writes to $0400-$07FF (screen) or $D800-$DBFF (colour RAM), often in loops. **Banking-aware**: screen RAM location depends on VIC bank. |

#### AI-Assisted (priority 100+) — Uses OpenAI

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `ai_concept_extraction` | 100 | For each code block, cheap AI call: "What non-obvious C64 concepts does this code use?" Takes concepts, queries Qdrant, deduplicates, stores as `qdrant_knowledge` enrichments. Token budget capped at `--qdrant-context-budget` (default 8192). See [AI Knowledge Strategy](#ai-knowledge-strategy). |

### Register State Propagation (SCC-Aware)

The `inter_procedural_register_propagation` plugin (priority 18) is the **most important new addition**. It runs early in enrichment and gives every graph node accurate banking state.

**Algorithm (SCC-aware, using bitmask abstract domain):**

```
1. Initialize entry points with default state:
   - BASIC SYS entry: $01 = BitmaskValue(mask=0xFF, value=0x37), $DD00, $D018 similarly
   - VSF snapshot entry: read $01/$DD00/$D018 from snapshot CPU state (fully known)
   - IRQ handlers: $01 = BitmaskValue(mask=0x00, value=0x00) (fully unknown)
     UNLESS single arming site with known state

2. Compute SCC decomposition (Tarjan's algorithm):
   - Input: control_flow edges only (branch, jump, call, rts_dispatch)
   - Output: SCCDecomposition (node→SCC mapping, condensation DAG, topological order)

3. Process SCCs in bottom-up topological order (callees first):

   For SINGLE-NODE SCCs (most subroutines):
     a. Compute onEntry = meetBitmask() of all caller exit states at JSR sites
     b. Walk instructions using bitmask transfer functions:
        - LDA #imm → A = (mask=0xFF, value=imm)
        - LDA $01 → A = current $01 bitmask (NOT fully-unknown — we track $01!)
        - AND #imm → A = transferAND(A, imm)
        - ORA #imm → A = transferORA(A, imm)
        - EOR #imm → A = transferEOR(A, imm)
        - STA $01 → cpuPort.bitmask = A.bitmask; update possibleValues if small set
        - STA $DD00 → vicBank.bitmask = A.bitmask
        - Conditional branches: fork state, meetBitmask() at join points
     c. Detect save/restore: if PHA(LDA $01) balanced with PLA/STA $01 → bankingScope="local"
     d. Track SEI/CLI → set irqSafety state
     e. Set onExit = state after last instruction
     f. For JSR callees: if callee.bankingScope="local", continue with pre-JSR state

   For MULTI-NODE SCCs (cycles — main loops, mutual recursion, IRQ chains):
     a. Initialize all nodes in SCC to entry state from external callers
     b. ITERATE within SCC:
        - For each node in reverse postorder within the SCC:
          - Compute onEntry = meetBitmask() of predecessor exit states
          - Walk instructions (same as single-node)
          - Compute onExit
        - If any node's onExit changed → iterate again
        - Convergence guaranteed: bitmask lattice has finite height (8 bits × 3 states
          = max 8 iterations per register). In practice, converges in 2-3 passes.
     c. After SCC converges, propagate results to successor SCCs in the condensation DAG

4. Compute derived flags from final bitmask values:
   - kernalMapped = (cpuPort.bitmask.knownMask & 0x02)
       ? (cpuPort.bitmask.knownValue & 0x02) ? "yes" : "no"
       : "unknown"
   - Similarly for basicMapped (bit 0), ioMapped (bit 2)

5. Build IRQ volatility model:
   - Collect all hardware register writes from IRQ/NMI handler code
   - Set irqVolatileRegisters on all mainline nodes
   - When irqsDisabled="no": registers in IRQ-volatile set → bitmask reset to unknown
```

**Convergence proof:** The bitmask lattice for an 8-bit register has height 8 (each bit independently transitions from unknown to known, never back). Meet is monotonically decreasing. With 3 tracked registers ($01, $DD00, $D018) and N nodes in an SCC, worst case is 3 × 8 × N iterations. For realistic C64 SCCs (typically 2-5 nodes), this means < 120 iterations — trivial cost.

**Handling complexity:**
- **Conditional banking**: `meetBitmask()` at branch join points preserves known-agreeing bits, marks disagreeing bits as unknown. No confidence scores needed — the bitmask IS the precision.
- **RMW patterns** (`LDA $01 / AND #$F8 / ORA #$05 / STA $01`): handled precisely by bitmask transfer functions. Result: bits 0-2 known, bits 3-7 unknown.
- **Dynamic banking** (SMC writes to $01): mark cpuPort.bitmask as all-unknown, all descendants inherit this.
- **Save/restore patterns**: detected by PHA/PLA balance tracking. Marked as `bankingScope = "local"` → caller's state preserved across JSR.
- **Table-driven banking** (`LDX level / LDA banking_table,X / STA $01`): `constant_propagation` can't resolve the index → bitmask becomes all-unknown. But if the `data_table_semantics` plugin (pri 55) later identifies the table contents, the banking state can be refined to the possibleValues set derived from table entries. This is a Stage 1 multi-pass benefit.
- **IRQ-volatile registers**: when `irqsDisabled = "no"`, writes to IRQ-volatile register addresses within mainline code may be overwritten by the next IRQ. The analysis flags these but doesn't invalidate the mainline write's bitmask — the IRQ handler's effect is modeled separately.
- **Cost**: purely deterministic — zero AI calls. O(nodes + edges) per pass, O(lattice_height) passes per SCC.

### Data Usage Tracking

The `data_flow` plugin (priority 65) builds a data usage map that is critical for AI analysis:

```typescript
interface DataAccess {
  blockAddress: number;
  instructionAddress: number;
  accessType: "read" | "write";
  indexRegister?: "X" | "Y";
  indirect?: boolean;
}

type AccessPattern = "sequential" | "random" | "indexed" | "indirect" | "command_stream" | "constant";

interface DataUsageRecord {
  dataAddress: number;
  dataSize: number;
  sizeEvidence: SizeEvidence;
  readers: DataAccess[];
  writers: DataAccess[];
  accessPattern: AccessPattern;
  terminatorByte?: number;
  elementSize?: number;
}

type SizeEvidence =
  | { type: "counter"; counterSource: number; value: number }
  | { type: "terminator"; byte: number; offset: number }
  | { type: "boundary"; nextReference: number }
  | { type: "format"; formatName: string; expectedSize: number }
  | { type: "unknown" };
```

---

## Data Detection Strategy

Data detection is the hardest problem in disassembly. On the 6502, there's no metadata separating code from data. Our approach is **three-layered**: static heuristics first (cheap, deterministic in static analysis), enrichment plugins second (cross-block deterministic reasoning in Stage 1), then AI refinement (Stage 2 enrichment + Stage 3 reverse engineering).

### Phase A: Static Detection (static analysis pipeline)

Deterministic heuristics applied during static analysis. No AI. See [static-analysis.md](docs/static-analysis.md) for full details.

**Summary of what static analysis detects:**
- **Sprite data** — trace sprite pointer writes ($07F8+) back to `LDA #N` → data at N*64+VIC_bank (HIGH confidence)
- **Character sets** — trace `$D018` writes to compute charset address, 2048 bytes (HIGH confidence)
- **Screen/color maps** — trace `$D018` writes, 1000 bytes each (MEDIUM confidence)
- **Bitmap data** — detect `$D011` bit 5 set + `$D018` bit 3, 8000 bytes (MEDIUM confidence)
- **Strings** — PETSCII null-terminated, high-bit terminated, length-prefixed, screen codes (HIGH when code-referenced)
- **SID music data** — frequency table detection, player routine tracing, known player signatures (MEDIUM confidence)
- **Jump/RTS dispatch tables** — detect `LDA lo,X / PHA / LDA hi,X / PHA / RTS` pattern (HIGH confidence)
- **Lookup tables** — screen line offsets, bit masks, sine tables, color tables (MEDIUM confidence)
- **Pointer patterns** — A/Y register pairs, zero page pointer pairs (MEDIUM confidence)
- **Boundary detection** — format-specific sizes, null-termination, next code address, copy loop lengths

### Phase B: Enrichment Plugin Detection (Stage 1)

The Stage 1 enrichment plugins add cross-block deterministic reasoning:
- `data_format` — classifies data blocks by content (sprite/charset/music/string/table/bitmap)
- `data_boundary` — determines data block sizes using multiple heuristics
- `data_table_semantics` — determines what values mean by tracing how code uses them
- `embedded_command` — detects bytecode/command languages in data streams
- `data_flow` — tracks which code reads/writes each data block

### Phase C: AI-Driven Data Discovery (Stage 2 + Stage 3)

The AI discovers and classifies data as a side-effect of understanding code. This is the key insight: code tells you what data means.

**How it works (in Stage 2 and Stage 3):**

1. AI analyzes a code block and sees data references (e.g., `LDA $C800,X / CMP #$00 / BEQ done`)
2. AI can **request raw bytes** at any address range via tool call:
   ```json
   { "name": "read_memory", "arguments": { "address": 51200, "length": 256 } }
   ```
3. Script fetches raw bytes from the binary and returns them with context
4. AI returns data classification:
   ```json
   {
     "data_discoveries": [{
       "start": "0xC800", "end": "0xC812",
       "type": "string", "subtype": "petscii_null_terminated",
       "label": "txt__author", "value": "WRITTEN BY J.SMITH",
       "confidence": "HIGH"
     }]
   }
   ```
5. Discovery gets merged into BlockStore + graph — the `unknown` block at $C800 becomes a `data` block with new graph edges
6. Other blocks referencing $C800 now get this context in their next analysis

**This is iterative in Stage 3.** The outer loop means: as more code blocks are reverse-engineered, more data blocks are discovered, which provides more context for reverse-engineering remaining code blocks.

### Inter-Procedural Data Tracing

The hardest case: data addressed via pointers passed between subroutines.

```
caller:
    LDA #<bitmap_data    ; $FB = low byte of bitmap address
    STA $FB
    LDA #>bitmap_data    ; $FC = high byte
    STA $FC
    JSR process_bitmap   ; process_bitmap uses LDA ($FB),Y
```

**Enrichment plugins** detect this: `zero_page_tracker` identifies $FB/$FC as a pointer pair, `constant_propagation` traces the immediate values, and `data_flow` connects the caller's writes to the callee's reads.

**AI analysis** refines this: when analyzing `process_bitmap`, AI sees it uses `($FB),Y` and can infer it processes sequential data. When analyzing `caller`, AI sees the pointer setup and can request the bytes at the target address.

The tree-driven ordering ensures we understand data flow direction: the `data_flow` enrichment plugin annotates "ZP $FB/$FC set by caller at $0810, read by callee at $0950".

---

## Stage 2: AI Enrichment (Sequential Plugins, Run Once Per Block)

Stage 2 gives every block an initial AI-powered understanding. Unlike Stage 3's iterative loop, Stage 2 runs **once per block** with sequential AI plugins — each plugin builds on the previous plugin's output.

### What Stage 2 Produces

After Stage 2, every block has:
- **Purpose**: what the block does (e.g., "Initialize all 8 sprite positions from lookup table")
- **Category**: functional classification (e.g., `graphics/init`)
- **Algorithm summary**: how it works (e.g., "Loop 0-7, indexed load from table, write to VIC-II registers")
- **Initial variable names**: added to the global variable map
- **Header/inline documentation**: comments for the builder to emit
- **Confidence score**: 0.0-1.0, how confident the AI is in its analysis
- **Validation status**: cross-checked against Stage 1 deterministic annotations

**Key insight:** Even before Stage 3 (reverse engineering), Stage 2 gives every block useful context. When Stage 3 asks "what does sub_C100 do?", it can answer from Stage 2 data — it doesn't need sub_C100 to be fully reverse-engineered.

This means **every block provides useful context to its neighbors after Stage 2**, even before reverse engineering.

### Sequential AI Plugin Architecture

Stage 2 plugins run in **priority order**, each building on the outputs of previous plugins. Unlike Stage 1's fixpoint loop, Stage 2 plugins run exactly **once per block** (unless a block split triggers re-processing).

```typescript
interface Stage2Plugin {
  name: string;
  priority: number;
  run(input: Stage2PluginInput): Promise<Stage2PluginResult>;
}

interface Stage2PluginInput {
  block: Block;
  graph: MutableGraph;
  blockStore: BlockStore;
  enrichments: EnrichmentMap;
  variableMap: VariableMap;                    // mutable — plugins can add entries
  priorStage2Results: Map<string, Stage2PluginResult>;  // results from earlier plugins on THIS block
  symbolDb: SymbolDB;
  qdrantSearch: (query: string) => Promise<SearchHit[]>;
}

interface Stage2PluginResult {
  enrichments: BlockEnrichment[];
  confidence: number;                          // 0.0-1.0
  reclassifications?: BlockReclassification[];
  variableEntries?: VariableEntry[];           // new/updated variable map entries
  discoveries?: Discovery[];                    // new code/data found
}
```

### Stage 2 Plugin Catalogue

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `ai_concept_extraction` | 10 | Extract key C64 concepts from code, query Qdrant for authoritative documentation, store as `qdrant_knowledge` enrichments. See [AI Knowledge Strategy](#ai-knowledge-strategy). |
| `ai_purpose_analysis` | 20 | Determine block purpose, category, algorithm. Banking-aware: AI is explicitly told what ROM/RAM is mapped. Uses tool calls (read_memory, find_references, search_knowledge_base) for interactive analysis. Returns confidence score. |
| `ai_variable_naming` | 30 | Assign meaningful variable names for all addresses used in the block. Uses scoped naming (same ZP address → different names in different blocks). Adds entries to the global variable map. |
| `ai_documentation` | 40 | Generate header comment, inline comments, requires/sets sections. Banking state prominently documented. LOW-confidence blocks get modified prompt: "Flag what a human should examine." |
| `ai_validation` | 50 | Cross-validate AI claims against Stage 1 deterministic annotations. Compare hardware register claims against `symbol_db`. Flag conflicts → targeted Qdrant lookup → record conflict. Cap certainty at MEDIUM if unverified claims exist. |

**Processing order within a block:** For block `sub_C000`:
1. `ai_concept_extraction` runs → Qdrant docs attached
2. `ai_purpose_analysis` runs → sees Qdrant docs from step 1 → produces purpose/category
3. `ai_variable_naming` runs → sees purpose from step 2 → names variables in context
4. `ai_documentation` runs → sees purpose + variable names → writes comments
5. `ai_validation` runs → cross-checks everything → records conflicts

**Block processing order:** SCC-aware topological order (callees first), using control-flow edges only. This means when analyzing a caller, all of its callees have already been through Stage 2 and have purposes/names.

### What Gets Fed to the AI (Banking-Aware Context)

Every Stage 2 purpose analysis prompt includes:

```
System: You are analyzing a 6502 subroutine from a Commodore 64 program.

=== Banking State ===
On entry: $01=$35 (KERNAL ROM banked OUT, BASIC ROM banked OUT, I/O visible)
⚠ KERNAL is NOT mapped. Addresses $E000-$FFFF point to RAM, not ROM.
⚠ BASIC is NOT mapped. Addresses $A000-$BFFF point to RAM, not ROM.
JSR $FFD2 in this code does NOT call CHROUT — it calls RAM at $FFD2.

=== Stage 1 Enrichment Annotations ===
- [constant_propagation] A=$35 at instruction $C005 (STA $01)
- [register_semantics] STA $D015 = enable all 8 sprites (#$FF)
- [banking_state] Switches to RAM-under-KERNAL at $C005
- [interrupt_chain] Part of 3-stage raster chain: $0900 → $0950 → $0A00

=== Call Context (from Stage 2 of callees — already processed) ===
Calls:
  * $C100 [purpose: "Initialize sprite positions from lookup table", confidence: 0.85]
  * $FFD2 [RAM target — KERNAL banked out, NOT CHROUT]
  * $C200 [purpose: "Initialize SID and play music", confidence: 0.72]

Called by:
  * $0810 [purpose: "Program entry point — init hardware, start main loop", confidence: 0.95]

=== Data References ===
  * reads $C800: 8 bytes, byte_table (from Stage 1 data_format detection)
  * reads $C810: 8 bytes, byte_table

=== Qdrant Knowledge (from ai_concept_extraction) ===
[Authoritative documentation pre-fetched for detected concepts]
- "C64 memory banking via CPU port $01": ...
- "Raster interrupt multiplexing technique": ...

[Full annotated subroutine code]

Return JSON: { purpose, purpose_short, category, module, confidence,
               algorithm_summary, hardware_interaction, side_effects,
               data_discoveries, reclassify, research_needed }
```

The AI is **explicitly told** about banking state — it can't accidentally label `JSR $FFD2` as CHROUT because the prompt says "KERNAL is NOT mapped."

### AI Tool Calls in Stage 2

The `ai_purpose_analysis` plugin uses OpenAI function calling. The AI can call:

| Tool | Purpose |
|------|---------|
| `read_memory(address, length)` | Read raw bytes from binary |
| `read_block(address)` | Get full disassembly + enrichments for a block |
| `find_references(address)` | Find all code that reads/writes an address |
| `reclassify_block(address, newType, reason, splitAt?)` | Change block type (triggers graph update) |
| `trace_data_usage(address)` | Trace data usage across all blocks |
| `decode_data_format(address, format, elementSize?)` | Decode data as specific format |
| `search_knowledge_base(query)` | Query Qdrant knowledge base |
| `search_similar_blocks(query)` | Search project collection for similar blocks |

**Caps per block:** data requests: 3, context requests: 3, research queries: 5.

### Graph Mutation in Stage 2

Stage 2 plugins can reclassify or split blocks. When this happens:

1. `BlockStore.split()` or `BlockStore.reclassify()` updates the block + graph
2. New fragment blocks get `pipelineState = { staticEnrichmentComplete: false, ... }`
3. After all current blocks finish Stage 2, new fragments are processed:
   - Run Stage 1 (static enrichment) on new fragments
   - Run Stage 2 (AI enrichment) on new fragments
4. This sub-loop repeats until no more splits (typically 0-2 rounds)

### Discovery Management: Three Tiers

AI discoveries (in both Stage 2 and Stage 3) are classified into tiers:

| Tier | Criteria | Action | Example |
|------|----------|--------|---------|
| **Confirmed** | Direct evidence: resolved jump table entry, decoded pointer pair | Add to graph immediately. Run Stage 1 enrichment on new nodes. | `JMP ($C000)` where `$C000` contains `$0A80` → add edge to `$0A80` |
| **Probable** | Heuristic pattern: data looks like an address table | Add to graph with `discoveryTier="probable"`. Verify later. | Data at `$C000` contains byte pairs resembling addresses |
| **Speculative** | AI suggestion without hard evidence | Quarantine. Promote if corroborated. | AI says "this might be a callback" |

**Monotonicity:** Confirmed nodes/edges are never removed (add-only). Contradictions are marked "disputed" and resolved in integration.

After Stage 2 completes, each block's `pipelineState.aiEnrichmentComplete` is set to `true` and `pipelineState.confidence` is set to the validation plugin's final score.

---

## Stage 3: AI Reverse Engineering (Per-Block Iterative Loop)

This is the **heart of the pipeline** — where each block gets fully reverse-engineered. Unlike Stage 2 (which runs once and gives a preliminary understanding), Stage 3 is iterative: the AI can request context, evaluate whether it has enough information, and either attempt full RE or bail with a structured reason.

### The Per-Block AI RE Loop

```
                    Per-Block AI RE Loop (Stage 3)
                    ════════════════════════════════

                         Block enters Stage 3
                         (has Stage 1 + 2 data)
                                │
                        ┌───────┘
                        ▼
              ┌─── PHASE A: Request ────────────────────┐
              │                                          │
              │  AI receives:                            │
              │  • Block code + all Stage 1/2 enrichments│
              │  • Variable map (current state)          │
              │  • Known context from other blocks       │
              │    (tagged with isReverseEngineered)      │
              │                                          │
              │  AI outputs structured context requests:  │
              │  • subroutine details                    │
              │  • data at address                       │
              │  • variable info                         │
              │  • Qdrant research                       │
              │  • reference lookups                     │
              └──────────────┬───────────────────────────┘
                             │
                             ▼
              ┌─── PHASE B: Gather ─────────────────────┐
              │                                          │
              │  System fulfills each request.            │
              │                                          │
              │  Each context item tagged with:           │
              │  ┌────────────────────────────────────┐  │
              │  │ isReverseEngineered: true/false     │  │
              │  │ confidence: 0.0-1.0                │  │
              │  │ source: "stage2" | "stage3"        │  │
              │  └────────────────────────────────────┘  │
              │                                          │
              │  AI can distinguish:                     │
              │  • Stage 2 preliminary analysis          │
              │    (useful but unverified)               │
              │  • Stage 3 full RE result                │
              │    (trusted, high confidence)            │
              └──────────────┬───────────────────────────┘
                             │
                             ▼
              ┌─── PHASE C: Evaluate ───────────────────┐
              │                                          │
              │  AI evaluates sufficiency of context      │
              │                                          │
              │  ALWAYS returns:                         │
              │  • confidence score (0.0-1.0)            │
              │  • readiness assessment                  │
              │                                          │
              │  If needs more context:                  │
              │  → additional requests (back to Phase A) │
              │    (up to N iterations, default 3)       │
              │                                          │
              └──────┬─────────────────┬─────────────────┘
                     │                 │
              confidence ≥        confidence <
              threshold            threshold
              (default 0.6)        ─or─ complexity
                     │             too high
                     ▼                 ▼
              ┌─── PHASE D ──┐  ┌─── BAIL ──────────────┐
              │ Attempt RE    │  │                        │
              │               │  │ Record:                │
              │ AI produces:  │  │ • bail reason (struct) │
              │ • Block name  │  │ • confidence score     │
              │ • Full purpose│  │ • bail count++         │
              │ • Documentation│ │                        │
              │ • Variable    │  │ Block stays un-RE'd    │
              │   suggestions │  │ for next outer loop    │
              │ • Inline      │  │ pass                   │
              │   comments    │  │                        │
              │ • Final       │  └────────────────────────┘
              │   confidence  │
              │               │
              │ Block marked: │
              │ reverseEng-   │
              │ ineered=true  │
              └───────────────┘
```

### Phase A: Context Request

The AI is given the block's code plus all Stage 1/2 enrichments, then outputs **structured context requests**:

```typescript
interface ContextRequest {
  type: "subroutine" | "data" | "variable" | "qdrant" | "references";
  address?: number;
  length?: number;
  query?: string;
  reason: string;      // why the AI needs this — for traceability
}

// Example AI output:
{
  "requests": [
    { "type": "subroutine", "address": "0xC100",
      "reason": "Called at $C005 — need full analysis to understand init sequence" },
    { "type": "data", "address": "0xC800", "length": 16,
      "reason": "Read at $C010 via LDA $C800,X — need to see table contents" },
    { "type": "variable", "address": "0xFB",
      "reason": "Used as loop counter — check if named in other blocks" },
    { "type": "qdrant", "query": "raster interrupt chain VIC-II $D012",
      "reason": "Pattern at $C020 matches raster split setup" },
    { "type": "references", "address": "0xD012",
      "reason": "Need all raster line setters to understand interrupt chain" }
  ]
}
```

### Phase B: Context Gathering

The system fulfills each request and tags every response with provenance:

```typescript
interface ContextResponse {
  request: ContextRequest;
  data: unknown;                       // the actual content
  isReverseEngineered: boolean;        // has this been through Stage 3?
  confidence: number;                  // 0.0-1.0
  source: "stage1" | "stage2" | "stage3";
}
```

**What each request type returns:**

| Request Type | Returned Data | isReverseEngineered |
|-------------|---------------|---------------------|
| `subroutine` | Full Stage 2 analysis OR Stage 3 RE result | `true` if Stage 3 complete |
| `data` | Raw bytes + Stage 1/2 classification + format | `true` if Stage 3 classified |
| `variable` | Variable map entry with all known names/contexts | N/A (from variable map) |
| `qdrant` | Top 3-5 Qdrant search results (docs stripped of source code) | N/A (authoritative docs) |
| `references` | All xrefs + their Stage 2/3 status | Per-reference |

**The `isReverseEngineered` flag is critical.** It lets the AI make informed decisions:
- If a callee has `isReverseEngineered: true, confidence: 0.9` → trust its analysis fully
- If a callee has `isReverseEngineered: false, confidence: 0.7` → Stage 2 preliminary analysis — useful but may be incomplete or wrong

### Phase C: Sufficiency Check + Confidence

The AI evaluates whether it has enough context to attempt reverse engineering. This phase **always returns a confidence score**, even when bailing:

```typescript
interface SufficiencyResult {
  confidence: number;                  // 0.0-1.0, ALWAYS returned
  ready: boolean;                      // can we attempt RE?
  additionalRequests?: ContextRequest[];  // if not ready, what more is needed
  bailReason?: BailReason;             // structured reason if bailing
}
```

**Confidence factors the AI considers:**
- What percentage of callees are fully RE'd vs Stage 2 only?
- Are the critical data structures understood?
- Is the algorithm pattern recognized?
- Is the banking state clear?
- How complex is the block? (branch count, loop nesting, indirect addressing)

**Phase C loops with Phase A/B** up to N iterations (default 3). Each iteration, the AI can request more context. If after N iterations it's still not confident enough, it bails.

### Phase D: Attempt RE or Bail

**If confidence ≥ threshold (default 0.6)** — AI attempts full reverse engineering:

```typescript
interface ReverseEngineeringResult {
  name: string;                        // verb-first snake_case subroutine name
  purpose: string;                     // full description (what + WHY)
  purposeShort: string;                // one-line summary
  category: string;                    // e.g., "graphics/init"
  headerComment: string;               // for builder to emit
  inlineComments: Record<string, string>;  // address → comment
  variableSuggestions: VariableEntry[]; // new/refined variable names
  requires: string[];                  // input registers/memory
  sets: string[];                      // output registers/memory
  bankingNotes?: string;               // non-default banking documentation
  algorithmSummary: string;            // how it works
  confidence: number;                  // final confidence (may differ from Phase C)
  discoveries?: Discovery[];           // any new code/data found during RE
  reclassifications?: BlockReclassification[];  // block type changes
}
```

**If confidence < threshold** — bail with structured reason:

```typescript
// BailReason types (defined earlier in BlockPipelineState):
// { type: "needs_dependency", dependencies: ["sub_C100", "sub_C200"], details: "..." }
// { type: "insufficient_context", details: "Can't determine data format at $C800" }
// { type: "block_too_complex", complexityFactors: ["self-modifying code", "8 indirect jumps"] }
// { type: "hit_iteration_limit", iterations: 3 }
// { type: "low_confidence", confidence: 0.4, threshold: 0.6 }
```

**Bail vs low-confidence RE:** Phase D can also bail even when Phase C said "ready", if during the actual RE attempt the AI realizes the code is more complex than expected. In this case, bail reason is `block_too_complex` or `low_confidence` and the block stays un-RE'd.

### Variable Map Refinement in Stage 3

When the AI reverse-engineers a block, it may:
- **Confirm** Stage 2 variable names (increases confidence)
- **Refine** names with better understanding (e.g., `loop_var` → `sprite_index`)
- **Add context-specific names** (same address, different usage in this block)
- **Discover new variables** not seen in Stage 2

All changes are recorded in the variable map with `source: "stage3"` and the block ID.

### Graph Mutation in Stage 3

Stage 3 can split or reclassify blocks, same as Stage 2. When this happens:
1. New fragments get `pipelineState = { staticEnrichmentComplete: false, ... }`
2. They are queued for Stage 1 + Stage 2 processing
3. After the current outer loop pass, new fragments go through the full pipeline before the next pass

---

## Outer Loop: Guaranteed Progress

The outer loop wraps Stage 3 and ensures the pipeline **always terminates** with **every block either reverse-engineered or force-processed**. No complex convergence machinery needed — just a simple progress-tracking loop with a force-pick fallback.

### The Outer Loop Algorithm

```typescript
async function runOuterLoop(config: OuterLoopConfig): Promise<void> {
  const { blockStore, graph, variableMap } = config;
  let outerPass = 0;

  while (outerPass < config.maxOuterPasses) {  // default 10
    outerPass++;
    let progressThisPass = false;
    const stats = { reversed: 0, bailed: 0, forced: 0, newBlocks: 0 };

    // Get all blocks not yet reverse-engineered
    const unreversed = blockStore.getSnapshot()
      .filter(b => !b.pipelineState.reverseEngineered);

    if (unreversed.length === 0) break;  // all done

    // --- Run Stage 3 on each un-RE'd block ---
    for (const block of unreversed) {
      const result = await runPerBlockRELoop(block, {
        graph, blockStore, variableMap, config,
      });

      if (result.reverseEngineered) {
        block.pipelineState.reverseEngineered = true;
        block.pipelineState.confidence = result.confidence;
        block.pipelineState.lastStage3Timestamp = new Date().toISOString();
        stats.reversed++;
        progressThisPass = true;
      } else {
        block.pipelineState.bailReason = result.bailReason;
        block.pipelineState.bailCount++;
        block.pipelineState.confidence = result.confidence;
        stats.bailed++;
      }
    }

    // --- Handle block splits from this pass ---
    const newBlocks = blockStore.getNewBlocksSince(outerPass);
    if (newBlocks.length > 0) {
      await runStage1(newBlocks, config);
      await runStage2(newBlocks, config);
      stats.newBlocks = newBlocks.length;
      progressThisPass = true;  // new blocks = progress
    }

    // --- Force-pick if no progress ---
    if (!progressThisPass) {
      const candidate = pickHighestConfidence(unreversed);
      if (candidate) {
        const forced = await forceReverseEngineer(candidate, { graph, blockStore, variableMap, config });
        candidate.pipelineState.reverseEngineered = true;
        candidate.pipelineState.confidence = forced.confidence;
        stats.forced++;
        progressThisPass = true;  // forced = progress
      }
    }

    // --- Persist state after each pass ---
    await saveBlockStore(blockStore);
    await saveVariableMap(variableMap);

    log(`Outer pass ${outerPass}: ${stats.reversed} RE'd, ${stats.bailed} bailed, `
      + `${stats.forced} forced, ${stats.newBlocks} new blocks`);

    if (!progressThisPass) break;  // truly stuck (shouldn't happen)
  }
}
```

### Force-Pick: The Progress Guarantee

When all remaining blocks bail in a pass, the outer loop **force-picks** the block with the highest confidence score and reverse-engineers it with the best available context:

```typescript
function pickHighestConfidence(blocks: Block[]): Block | null {
  return blocks
    .filter(b => !b.pipelineState.reverseEngineered)
    .sort((a, b) => b.pipelineState.confidence - a.pipelineState.confidence)[0] ?? null;
}

async function forceReverseEngineer(block: Block, ctx: OuterLoopContext): Promise<REResult> {
  // Force-RE with modified prompt:
  // "This block could not be fully analyzed due to missing context.
  //  Produce the BEST reverse engineering you can with available information.
  //  Mark uncertain areas with LOW confidence. Flag what needs human review."
  const result = await runPerBlockRELoop(block, {
    ...ctx,
    forceAttempt: true,      // Phase D always attempts, never bails
    maxIterations: 1,         // don't loop — just do your best
  });
  result.reverseEngineered = true;  // even forced results count as "done"
  return result;
}
```

**Why this works:** Even a low-quality forced RE is useful context for other blocks. A block that bailed because it needed `sub_C100` to be RE'd can now proceed once `sub_C100` has a forced (if imperfect) result. The next pass will have strictly more context than the previous one.

**Guaranteed termination:** Each outer pass either RE's ≥1 block (progress) or force-picks 1 block (forced progress). With N blocks, the loop terminates in at most N passes.

### Block Split Re-enrichment Pipeline

When Stage 2 or Stage 3 splits a block, the new fragments need full pipeline treatment:

```
Block sub_C000 is split at $C040:
    │
    ├─→ sub_C000 ($C000-$C03F) — inherits existing enrichments for this range
    ├─→ sub_C040 ($C040-$C07F) — NEW: no enrichments yet
    │
    │   For sub_C040:
    │   1. Stage 1: static enrichment (full plugin run)
    │   2. Stage 2: AI enrichment (full plugin run)
    │   3. Queued for Stage 3 in next outer loop pass
    │
    │   For sub_C000 (the survivor):
    │   1. Stage 1: re-run (edges may have changed)
    │   2. Stage 2: re-run (context changed — lost part of the block)
    │   3. Queued for Stage 3 re-attempt
```

### Outer Loop Diagram

```
╔═══ OUTER LOOP ═════════════════════════════════════════════════╗
║                                                                 ║
║  Pass 1:                                                        ║
║    Stage 3 on all blocks → 30 RE'd, 17 bailed                  ║
║    Progress? YES → continue                                     ║
║                                                                 ║
║  Pass 2:                                                        ║
║    Stage 3 on 17 remaining → 10 RE'd (better context now),      ║
║    7 bailed, 2 blocks split → Stage 1+2 on fragments            ║
║    Progress? YES → continue                                     ║
║                                                                 ║
║  Pass 3:                                                        ║
║    Stage 3 on 9 remaining → 5 RE'd, 4 bailed                   ║
║    Progress? YES → continue                                     ║
║                                                                 ║
║  Pass 4:                                                        ║
║    Stage 3 on 4 remaining → 0 RE'd, 4 bailed                   ║
║    Progress? NO → force-pick highest confidence                  ║
║    Force-RE sub_C100 (confidence 0.55) → 1 forced               ║
║                                                                 ║
║  Pass 5:                                                        ║
║    Stage 3 on 3 remaining → 2 RE'd (sub_C100 unlocked them),    ║
║    1 bailed                                                      ║
║    Progress? YES → continue                                     ║
║                                                                 ║
║  Pass 6:                                                        ║
║    Stage 3 on 1 remaining → 0 RE'd, 1 bailed                   ║
║    Progress? NO → force-pick → forced                            ║
║                                                                 ║
║  All blocks RE'd (47 regular + 2 forced). Done.                  ║
╚═════════════════════════════════════════════════════════════════╝
```

---

## Persistence Model

The pipeline saves state after each outer loop pass, enabling **resumability** — if the pipeline crashes or the user stops it, it can pick up where it left off.

### BlockPipelineState (Per-Block)

Every block in `blocks.json` carries a `pipelineState` field:

```typescript
interface BlockPipelineState {
  // Stage completion flags
  staticEnrichmentComplete: boolean;   // Stage 1 done
  aiEnrichmentComplete: boolean;       // Stage 2 done
  reverseEngineered: boolean;          // Stage 3 done

  // Confidence (0.0-1.0)
  confidence: number;

  // Stage 3 tracking
  stage3Iterations: number;
  bailReason?: BailReason;
  bailCount: number;                   // how many outer passes this block bailed

  // Timestamps
  lastStage1Timestamp?: string;
  lastStage2Timestamp?: string;
  lastStage3Timestamp?: string;
}
```

### Resumability

When the pipeline starts, it checks each block's `pipelineState`:
- `staticEnrichmentComplete: true` → skip Stage 1
- `aiEnrichmentComplete: true` → skip Stage 2
- `reverseEngineered: true` → skip Stage 3

The outer loop resumes from wherever it left off. Variable map and graph state are also persisted.

### Force Re-run

Use `--force` to override saved state and re-run everything. Use `--from stage2` to re-run from Stage 2 onward (keeping Stage 1 results). Use `--from stage3` to re-run only Stage 3.

---

## Variable Map

The variable map is a **global artifact** that tracks variable names, usage, and refinement history across all blocks. It's created in Stage 2 and refined in Stage 3.

### Structure

```typescript
interface VariableMap {
  metadata: { source: string; timestamp: string; totalVariables: number };
  variables: Record<string, VariableEntry>;  // keyed by hex address (e.g., "FB")
}

interface VariableEntry {
  address: number;
  currentName: string;                 // best current name
  nameHistory: NameChange[];           // evolution of the name over time
  usedBy: string[];                    // block IDs that use this variable
  usageContexts: UsageContext[];       // different names in different blocks
  scope: "global" | "local";
  type?: "pointer" | "counter" | "flag" | "data" | "unknown";
}

interface UsageContext {
  blockId: string;
  name: string;                        // name in THIS block's context
  usage: "read" | "write" | "read_write";
  confidence: number;
  source: "stage2" | "stage3";
}

interface NameChange {
  from: string;
  to: string;
  reason: string;
  source: string;                      // block ID or "propagation"
  timestamp: string;
}
```

### Variable Naming Rules

1. **Hardware registers = KNOWN.** Never renamed. From `symbol_db`. **Banking-aware**: `$FFD2` is only named `CHROUT` if KERNAL is mapped at the access site.
2. **KERNAL entries = KNOWN.** Never renamed (banking-aware).
3. **Scoped naming.** Same address in different subroutines → different names:
   - `$FB` in `init_sprites` → `sprite_index` (loop counter 0-7)
   - `$FB` in `draw_explosion` → `frame_index` (animation frame counter)
4. **Conflict resolution:** KNOWN always wins. HIGH vs HIGH → flag conflict, keep existing, record alternative.
5. **Usage detection from xrefs:** read-before-write → parameter, write-then-read → local, cross-subroutine → global.
6. **Generic fallback:** `temp_zp_1` if too many unrelated uses.

### Creation (Stage 2)

The `ai_variable_naming` plugin (Stage 2, priority 30) creates the initial variable map. It processes blocks in SCC-aware topological order and searches Qdrant for consistent naming across unrelated call chains before proposing new names.

### Refinement (Stage 3)

During reverse engineering, the AI may:
- **Confirm** Stage 2 names → increase confidence
- **Refine** with better understanding → record in `nameHistory`
- **Add context-specific names** → new `UsageContext` entry
- **Discover new variables** → new `VariableEntry`

All Stage 3 changes are recorded with `source: "stage3"` and the block ID for traceability.

---

## Stage 4: Integration Analysis

### `integrate_analysis.ts` — OpenAI (Whole-Program, runs once after Stage 3)

```
npx tsx src/pipeline/integrate_analysis.ts
```

**This is the only pass that sees the ENTIRE program.** Stages 2 and 3 operate per-block.

**Four-part analysis:**

**Part 1 — Program structure:**
- Program type (game, demo, utility)
- Main loop identification
- Init chain
- IRQ/NMI handler mapping
- State machine detection

**Part 2 — File splitting:**
- Group blocks into modules using the Module Dictionary
- Assign blocks to files
- Import dependency order
- Namespace assignments
- Move low-confidence regions to `unprocessed/`

**Part 3 — Dead code analysis:**
- Walk the dependency graph from all entry points
- Identify unreachable nodes (no path from any entry)
- Classify dead code: unused routines, fill/padding, ROM shadows, abandoned features
- Report dead code with recommendations (keep? remove? investigate?)

**Part 4 — Overview documentation:**
- File-level header comments
- Section divider comments
- Memory map documentation (including banking configuration)
- Architecture overview (state machine, event loop, interrupt structure)
- Dependency tree summary (integrated into README)
- README.md, INTERESTING.md, How it works.md

**Token management:** For large programs (100+ subroutines), compress to: name, purpose_short, category, module, banking state, immediate callers/callees only.

---

## Pluggable Architecture

Every stage of the pipeline is pluggable. Stage 1 uses enrichment plugins, Stage 2 uses AI enrichment plugins, Stage 3 uses context providers + tool handlers + response processors, and Stage 4 uses integration analyzers. Adding new capabilities means dropping a file into the right directory — no orchestrator changes required.

### Three Plugin Types

#### 1. Context Providers (`pipeline/context/*_context.ts`)

Context providers contribute sections to the AI prompt. Used by both Stage 2 and Stage 3 — each provider adds relevant information about the block being analyzed.

```typescript
interface ContextProviderInput {
  readonly block: Block;
  readonly graph: MutableGraph;
  readonly blockStore: BlockStore;
  readonly enrichments: EnrichmentMap;
  readonly variableMap: VariableMap;
  readonly priorAnalyses: ReadonlyMap<string, BlockAnalysis>;
  readonly symbolDb: SymbolDB;
  readonly stage: 2 | 3;                // which stage is requesting context
}

interface ContextContribution {
  section: string;
  content: string;
  priority: number;
  tokenEstimate: number;
}

interface ContextProvider {
  name: string;
  priority: number;
  appliesTo: (2 | 3)[];  // Which stages use this provider
  provide(input: ContextProviderInput): ContextContribution | null;
}
```

**Plugin catalogue** (all in `pipeline/context/`, auto-discovered by `*_context.ts`):

| Plugin | Pri | Stages | Purpose |
|--------|-----|--------|---------|
| `banking_state_context` | 5 | 2,3 | Banking state with warnings. "KERNAL is NOT mapped" etc. |
| `call_graph_context` | 10 | 2,3 | Caller/callee info with purposes, confidence, and `isReverseEngineered` flags |
| `enrichment_context` | 15 | 2,3 | Stage 1 deterministic enrichment annotations |
| `qdrant_knowledge_context` | 18 | 2,3 | Authoritative Qdrant docs from AI concept extraction |
| `pattern_match_context` | 20 | 2 | Cross-program Qdrant pattern matches |
| `sibling_context` | 25 | 2,3 | Sub-block sibling summaries |
| `prior_analysis_context` | 30 | 2,3 | Already-analyzed block purposes (Stage 2 or Stage 3 results) |
| `variable_context` | 35 | 2,3 | Known variable names from variable map |
| `hardware_context` | 40 | 2,3 | Hardware register usage summary (banking-aware) |
| `data_usage_context` | 45 | 2,3 | Data flow / access pattern info |
| `cross_reference_context` | 50 | 2,3 | Xref summary (who reads/writes) |
| `re_status_context` | 55 | 3 | Stage 3 only: `isReverseEngineered` status of all referenced blocks |

The `banking_state_context` (priority 5, runs first) is the most important context provider. It explicitly tells the AI what ROM/RAM configuration is active, preventing the single biggest category of AI errors (wrong KERNAL/hardware assumptions).

The `re_status_context` (Stage 3 only) is critical for the per-block RE loop — it tells the AI which pieces of context come from fully reverse-engineered blocks vs preliminary Stage 2 analysis.

#### 2. AI Tool Handlers (`pipeline/tools/*_tool.ts`)

Tool handlers implement the OpenAI function-calling tools that AI can invoke during Stage 2 and Stage 3 analysis.

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

interface ToolResult {
  content: string;
  sideEffects?: ToolSideEffect[];
}

interface ToolSideEffect {
  type: "reclassify" | "split" | "merge" | "data_discovery" | "tree_edge" | "tree_node";
  details: Record<string, unknown>;
}

interface AIToolHandler {
  name: string;
  definition: ToolDefinition;
  handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}

interface ToolContext {
  blockStore: BlockStore;
  graph: MutableGraph;
  memory: Uint8Array;
  enrichments: EnrichmentMap;
  variableMap: VariableMap;
  priorAnalyses: ReadonlyMap<string, BlockAnalysis>;
  symbolDb: SymbolDB;
  projectCollection: ProjectCollection;
  searchKnowledgeBase(query: string, limit?: number): Promise<SearchHit[]>;
  stage: 2 | 3;                      // which stage is invoking the tool
}
```

**Plugin catalogue** (all in `pipeline/tools/`, auto-discovered by `*_tool.ts`):

| Plugin | Purpose |
|--------|---------|
| `read_memory_tool` | Read raw bytes from binary at a specific address |
| `read_block_tool` | Get full disassembly + enrichments for a block |
| `find_references_tool` | Find all code that reads/writes an address |
| `reclassify_block_tool` | Change block type (triggers tree update + mini re-enrichment) |
| `trace_data_usage_tool` | Trace how a data address is used across blocks |
| `decode_data_format_tool` | Attempt to decode data as a specific format |
| `search_knowledge_base_tool` | Query Qdrant knowledge base |
| `search_similar_blocks_tool` | Search project collection for similar blocks |

#### 3. Response Processors (`pipeline/processors/*_processor.ts`)

Response processors handle specific parts of the AI's response.

```typescript
interface ProcessorInput {
  readonly block: Block;
  readonly graph: MutableGraph;
  readonly aiResponse: Record<string, unknown>;
  readonly blockStore: BlockStore;
  readonly enrichments: EnrichmentMap;
  readonly variableMap: VariableMap;
  readonly projectCollection: ProjectCollection;
  readonly stage: 2 | 3;
}

interface ProcessorResult {
  mutations?: BlockMutation[];
  graphEdges?: DependencyGraphEdge[];
  graphNodes?: DependencyGraphNode[];
  embeddings?: EmbeddingRequest[];
  reviewFlags?: ReviewFlag[];
  discoveries?: DataDiscovery[];
  variableEntries?: VariableEntry[];
}

interface ResponseProcessor {
  name: string;
  priority: number;
  appliesTo: (2 | 3)[];             // which stages use this processor
  process(input: ProcessorInput): Promise<ProcessorResult>;
}
```

**Plugin catalogue** (all in `pipeline/processors/`, auto-discovered by `*_processor.ts`):

| Plugin | Stages | Purpose |
|--------|--------|---------|
| `data_discovery_processor` | 2,3 | Merge AI-discovered data blocks into BlockStore + graph |
| `reclassification_processor` | 2,3 | Apply AI-requested block reclassifications, update graph |
| `research_request_processor` | 2,3 | Queue Qdrant lookups for `research_needed` |
| `context_request_processor` | 3 | Stage 3: fulfill Phase A context requests, tag with `isReverseEngineered` |
| `embedding_processor` | 2,3 | Embed analysis into project Qdrant collection |
| `certainty_processor` | 2,3 | Cross-validate AI claims vs deterministic annotations, including banking |
| `variable_merge_processor` | 2,3 | Merge proposed names into variable map |
| `conflict_processor` | 2,3 | Detect and flag naming conflicts across scopes |
| `review_flag_processor` | 2,3 | Collect low-confidence/conflicting items needing human review |
| `bail_reason_processor` | 3 | Stage 3: record structured bail reasons and confidence scores |

### Annotation Sources (instruction-level, used by Stage 2 + Stage 3)

```typescript
interface AnnotationSource {
  name: string;
  priority: number;
  annotate(input: AnnotationSourceInput): string | null;
}

interface AnnotationSourceInput {
  instruction: Instruction;
  block: Block;
  enrichments: BlockEnrichment[];
  symbolDb: SymbolDB;
  bankingState: BankingSnapshot;     // NEW: banking context for correct labeling
}
```

**Plugin catalogue** (all in `pipeline/annotations/`, auto-discovered by `*_annotation.ts`):

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `symbol_db_annotation` | 10 | Known C64 symbols. **Banking-aware**: only use KERNAL names if ROM is mapped. |
| `enrichment_annotation` | 20 | Annotations from Stage 1 enrichment plugins |
| `constant_annotation` | 30 | Well-known constants (40=screen width, $0F=color mask, etc.) |
| `kernal_api_annotation` | 40 | KERNAL JSR targets with calling conventions. **Banking-aware**. |

If ALL annotation sources return null for an instruction, it goes to the AI batch.

### Integration Analyzers (Stage 4)

```typescript
interface IntegrationAnalyzer {
  name: string;
  priority: number;
  analyze(input: IntegrationAnalyzerInput): IntegrationContribution;
}

interface IntegrationAnalyzerInput {
  allBlocks: BlockAnalysis[];
  graph: MutableGraph;
  variableMap: VariableMap;
  enrichments: EnrichmentMap;
  blockStore: BlockStore;
}
```

**Plugin catalogue** (all in `pipeline/integration/`, auto-discovered by `*_analyzer.ts`):

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `program_structure_analyzer` | 10 | Detect program type, main loop, init chain |
| `module_assignment_analyzer` | 20 | Assign blocks to modules from dictionary |
| `irq_chain_analyzer` | 30 | Map interrupt handler chains and raster splits |
| `state_machine_analyzer` | 40 | Detect and document state machines |
| `memory_map_analyzer` | 50 | Generate memory map documentation (banking-aware) |
| `file_dependency_analyzer` | 60 | Compute import order between output files |
| `dead_code_analyzer` | 70 | Walk graph, identify unreachable nodes, classify dead code |

---

## Project Qdrant Collection

Each RE project gets its own Qdrant collection for similarity search within the project + variable propagation.

### Collection Architecture

| Collection | Scope | Contents | Lifetime |
|------------|-------|----------|----------|
| `re_<project>` | Per-project | Analyzed blocks from this project | Deleted on cleanup |
| `c64_re_patterns` | Cross-program | HIGH-confidence normalized patterns | Persistent, grows |

**Embedding model:** OpenAI `text-embedding-3-small` (consistent with knowledge base).

### What Gets Embedded

The embedding text is the **analysis**, not the raw assembly:
```
Purpose: Initialize all 8 sprite positions and colors
Category: graphics/init
Algorithm: Loop 0-7, load X/Y from position table, store to VIC-II sprite registers
Hardware: VIC-II sprite position registers $D000-$D00F (write)
Variables: $FB (loop index), $FC-$FD (table pointer)
Banking: Default ($01=$37, KERNAL+BASIC+IO mapped)
Calls: none (leaf subroutine)
```

### Pipeline Integration

**Stage 2:** After each block's `ai_purpose_analysis` runs, embed immediately. Before analyzing the NEXT block, search for similar already-embedded blocks + search `c64_re_patterns`. Include top matches as hints.

**Stage 3:** After each block is reverse-engineered, re-embed with full RE data. Search by variable address to propagate naming across unrelated call chains.

**After Stage 3:** Re-embed all blocks with final variable names and RE results included.

### Cross-Program Pattern Normalization

Before embedding into `c64_re_patterns`, normalize to remove project-specific details:
- Absolute addresses → relative descriptions
- Variable names → types
- Hardware registers → semantic names
- Instruction sequences → generic signatures

### Promotion Criteria

A block is promoted to patterns when: certainty = HIGH, human reviewed, verification PASS, category is recognizable.

---

## Master Orchestrator

### `re_pipeline.ts`

```
npx tsx src/pipeline/index.ts blocks.json                  # full pipeline
npx tsx src/pipeline/index.ts blocks.json --from stage2     # resume from Stage 2
npx tsx src/pipeline/index.ts blocks.json --from stage3     # resume from Stage 3
npx tsx src/pipeline/index.ts blocks.json --to stage1       # stop after Stage 1
npx tsx src/pipeline/index.ts blocks.json --output-dir out/
npx tsx src/pipeline/index.ts blocks.json --model gpt-5-mini --max-outer-passes 10
npx tsx src/pipeline/index.ts blocks.json --max-iterations 3  # per-block Stage 3 iterations
npx tsx src/pipeline/index.ts blocks.json --confidence-threshold 0.6
npx tsx src/pipeline/index.ts blocks.json --cost-budget 0.50
npx tsx src/pipeline/index.ts blocks.json --force            # ignore saved pipeline state
npx tsx src/pipeline/index.ts input.prg --entry 0x0810      # run static analysis first
```

**When given a `.prg` or `.asm` file**, runs static analysis first to produce `blocks.json` + `dependency_graph.json`.

**Pipeline state is stored in two places:**
- **Per-block state:** `BlockPipelineState` in `blocks.json` (which stages are complete, confidence, bail reasons)
- **Pipeline-level state:** `pipeline_state.json` (overall progress, cost tracking)

```json
{
  "stages": {
    "stage1_enrichment": {
      "status": "completed",
      "passes": 3,
      "reclassifications": 5,
      "newGraphEdges": 12,
      "bankingNodesAnnotated": 47
    },
    "stage2_ai_enrichment": {
      "status": "completed",
      "blocksProcessed": 47,
      "variableMapEntries": 89,
      "splits": 2,
      "aiCalls": 235
    },
    "stage3_reverse_engineering": {
      "status": "completed",
      "outerPasses": 6,
      "passHistory": [
        { "pass": 1, "reversed": 30, "bailed": 17, "forced": 0, "newBlocks": 0 },
        { "pass": 2, "reversed": 10, "bailed": 7, "forced": 0, "newBlocks": 2 },
        { "pass": 3, "reversed": 5, "bailed": 4, "forced": 0, "newBlocks": 0 },
        { "pass": 4, "reversed": 0, "bailed": 4, "forced": 1, "newBlocks": 0 },
        { "pass": 5, "reversed": 2, "bailed": 1, "forced": 0, "newBlocks": 0 },
        { "pass": 6, "reversed": 0, "bailed": 1, "forced": 1, "newBlocks": 0 }
      ],
      "totalReversed": 47,
      "totalForced": 2,
      "confidenceSummary": { "high": 38, "medium": 7, "low": 2 }
    },
    "stage4_integration": { "status": "completed" }
  },
  "cost": {
    "totalApiCalls": 310,
    "totalTokens": 750000,
    "estimatedCostUsd": 0.12,
    "perStage": {
      "stage2": { "calls": 235, "tokens": 470000, "cost": 0.07 },
      "stage3": { "calls": 72, "tokens": 260000, "cost": 0.04 },
      "stage4": { "calls": 3, "tokens": 20000, "cost": 0.01 }
    }
  }
}
```

---

## Claude Skill: `/disasm-auto`

The pipeline is designed to be orchestrated by a Claude skill:

```
User: /disasm-auto chess.prg

Claude:
1. Run static analysis → blocks.json + dependency_graph.json
   "Loaded chess.prg (32KB at $0801). Found 47 subroutines, 12 data regions.
    Graph: 62 nodes, 156 edges."

2. Run Stage 1 (static enrichment)
   "Enrichment: 3 passes, 189 annotations, 5 reclassifications.
    Resolved 8 indirect JMPs, 4 pointer pair tables, 2 interrupt chains.
    Banking: 42 nodes default ($37), 5 nodes KERNAL-banked-out ($35).
    12 new graph edges from indirect resolution."

3. Run Stage 2 (AI enrichment)
   "47 blocks processed: purpose + names + docs + validation.
    Variable map: 89 entries. 2 blocks split → re-enriched.
    Cost: $0.07 (235 AI calls)"

4. Run Stage 3 (AI reverse engineering — outer loop)
   "Pass 1: 30 RE'd, 17 bailed
    Pass 2: 10 RE'd, 7 bailed, 2 blocks split
    Pass 3: 5 RE'd, 4 bailed
    Pass 4: 0 RE'd → force-pick sub_C100 (confidence 0.55)
    Pass 5: 2 RE'd, 1 bailed
    Pass 6: 0 RE'd → force-pick sub_E400 (confidence 0.42)
    All 49 blocks RE'd (47 regular + 2 forced).
    Cost: $0.04 (72 AI calls, 6 outer passes)"

5. Run Stage 4 (integration)
   "Module assignment: 6 modules, 8 files. Dead code: 2048 bytes (7%).
    3 blocks flagged for review."

6. Present review items:
   "3 blocks need review:
    - sub_C100 @ $C100 [forced, conf 0.55] — Complex bit manipulation, banking uncertain
    - sub_C300 @ $C300 [conf 0.45] — No callers found (dead code?)
    - sub_C500 @ $C500 [conflict] — AI says 'sprite setup' but banking shows I/O not mapped"

7. Human picks sub_C100 → Claude deep-analyzes with MCP tools + Qdrant

8. Re-run Stage 3 for affected blocks: pipeline --from stage3

9. Build + verify:
   builder blocks.json → main.asm + dependency_tree.md
   verify output/main.asm --original chess.prg → "PASS — 78% coverage"
```

---

## Pipeline Stage Contracts

Each pipeline stage has a well-defined input and output. Stages communicate via JSON files on disk + in-memory state. Any stage can be re-run independently (earlier stages are skipped via `BlockPipelineState` flags).

```
blocks.json + dependency_graph.json
    ──→ [Stage 1: Static Enrichment] ──→ Enriched BlockStore + Annotated MutableGraph (in-memory)
                                             │
                                             ▼
                              [Stage 2: AI Enrichment] ──→ variable_map.json (initial)
                                             │
                                             ▼
                              [Stage 3: AI Reverse Engineering] ──→ variable_map.json (refined)
                              │  Outer loop: per-block RE loop      blocks.json (updated)
                              │  Persistence after each pass
                                             │
                                             ▼
                              [Stage 4: Integration] ──→ integration.json
                                        │
                                        ▼
                              enriched blocks.json + dependency_graph.json
                              + variable_map.json + integration.json
                                        │
                                        ▼
                              [Builder (separate project)] ──→ .asm + dependency_tree.md
                              See builder.md + builder-modifications.md
```

### Core Types (defined in `src/types.ts`)

```typescript
// ── Block Types ─────────────────────────────────────────────────

type BlockType = "subroutine" | "irq_handler" | "fragment" | "data" | "unknown";
type Reachability = "proven" | "indirect" | "unreachable";
type Certainty = "HIGH" | "MEDIUM" | "LOW";

interface LoadedRegion {
  start: number;
  end: number;
  data: Uint8Array;
}

interface Instruction {
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

interface BasicBlock {
  start: number;
  end: number;
  exitType: "fall_through" | "branch" | "jump" | "return" | "halt";
  successors: number[];
}

interface CrossReference {
  from: number;
  to: number;
  type: "call" | "jump" | "read" | "write" | "vector_write" | "smc";
  instruction?: string;
}

interface HardwareReference {
  address: number;
  access: "read" | "write" | "read_write";
  instructionAddress: number;
  value?: number;
}

interface Block {
  id: string;
  address: number;
  endAddress: number;
  type: BlockType;
  reachability: Reachability;
  instructions: Instruction[];
  basicBlocks: BasicBlock[];
  xrefsIn: CrossReference[];
  xrefsOut: CrossReference[];
  hardwareRefs: HardwareReference[];
  siblings?: string[];
  dataFormat?: DataFormat;
  raw?: string;
  // Pipeline state (persisted for resumability):
  pipelineState?: BlockPipelineState;
  needsReview?: boolean;
}

interface DataFormat {
  type: string;
  subtype?: string;
  confidence: Certainty;
  candidates?: DataFormat[];
  elementSize?: number;
  count?: number;
}

// ── Block Store Types ───────────────────────────────────────────

interface BlockChange {
  timestamp: number;
  action: "reclassify" | "split" | "merge";
  blockAddress: number;
  details: Record<string, unknown>;
  reason: string;
  source: string;
}

// ── Enrichment Types ────────────────────────────────────────────

type EnrichmentType =
  | "resolved_target" | "pointer_pair" | "vector_write" | "call_relationship"
  | "data_semantic" | "data_format" | "register_semantic" | "pattern"
  | "api_call" | "banking" | "banking_propagation" | "qdrant_knowledge" | "annotation";

interface BlockEnrichment {
  blockAddress: number;
  source: string;
  type: EnrichmentType;
  annotation: string;
  data: Record<string, unknown>;
}

type EnrichmentMap = ReadonlyMap<string, BlockEnrichment[]>;

// ── Banking Types ───────────────────────────────────────────────

interface BankingSnapshot {
  cpuPort: RegisterValue;
  vicBank: RegisterValue;
  vicMemPtr: RegisterValue;
  kernalMapped: Ternary;
  basicMapped: Ternary;
  ioMapped: Ternary;
  chargenMapped: Ternary;
}

interface RegisterValue {
  values: Array<{ value: number; confidence: number; source: string }>;
  isDynamic: boolean;
}

type Ternary = "yes" | "no" | "unknown";

// ── Graph Types ─────────────────────────────────────────────────

interface DependencyGraphJson {
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

// See DependencyGraphNode, DependencyGraphEdge, EdgeType defined earlier in this document

// ── Pipeline State Types ────────────────────────────────────────

// BlockPipelineState and BailReason defined earlier in this document (see Graph Node Structure)

// ── Variable Map Types ──────────────────────────────────────────

// VariableMap, VariableEntry, UsageContext, NameChange defined earlier (see Variable Map section)

// ── Shared Service Types ────────────────────────────────────────

interface SymbolDB {
  lookup(address: number): SymbolEntry | null;
  /** Banking-aware lookup: returns null if ROM not mapped at this address */
  lookupWithBanking(address: number, banking: BankingSnapshot): SymbolEntry | null;
  isHardwareRegister(address: number): boolean;
  isKernalEntry(address: number): boolean;
}

interface SymbolEntry {
  address: number;
  name: string;
  category: "hardware" | "kernal" | "zeropage" | "basic" | "other";
  description: string;
  chip?: string;
}

interface ProjectCollection {
  embedBlock(analysis: BlockAnalysis, varDict?: VariableDictJson): Promise<void>;
  searchSimilar(query: string, hardwareRefs: string[], limit?: number): Promise<SimilarBlock[]>;
  searchByVariable(address: string, limit?: number): Promise<VariableUsage[]>;
  promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void>;
  searchPatterns(query: string, hardwareRefs: string[], limit?: number): Promise<PatternMatch[]>;
}

interface SimilarBlock {
  blockId: string;
  purpose: string;
  category: string;
  score: number;
}

interface VariableUsage {
  blockId: string;
  variableName: string;
  scope: string;
  confidence: Certainty;
}

interface NormalizedPattern {
  pattern: string;
  category: string;
  hardwareSemantics: string[];
}

interface PatternMatch {
  pattern: string;
  category: string;
  score: number;
  source: string;
}
```

### Stage Input/Output Contracts

#### Static Analysis → `blocks.json` + `dependency_tree.json`

```typescript
interface BlocksJson {
  metadata: {
    source: string;
    loadAddress: number;
    entryPoints: number[];
    totalBytes: number;
    coverage: { code: number; data: number; unknown: number };
  };
  blocks: Block[];
  rawBinary: string;
}

// File is named dependency_tree.json for backward compat; internal type is DependencyGraphJson
type DependencyTreeJson = DependencyGraphJson;  // See definition above
```

#### Stage 1: Static Enrichment — In-Memory

```typescript
interface Stage1Output {
  blockStore: BlockStore;
  graph: MutableGraph;                       // Annotated graph with banking state
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
```

#### Stage 2: AI Enrichment → `blocks.json` (updated) + `variable_map.json`

```typescript
interface Stage2Output {
  blockStore: BlockStore;                    // blocks updated with enrichment fields
  graph: MutableGraph;                       // updated with any discovered edges
  variableMap: VariableMap;                  // initial variable naming
  stats: {
    totalBlocks: number;
    pluginsRun: string[];
    aiCalls: number;
    blocksReclassified: number;
    newGraphEdges: number;
  };
}
```

#### Stage 3: AI Reverse Engineering → `blocks.json` (updated) + `variable_map.json` (updated)

```typescript
interface Stage3Output {
  blockStore: BlockStore;                    // blocks with pipelineState updated
  graph: MutableGraph;                       // updated with discovered edges
  variableMap: VariableMap;                  // refined variable naming
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
```

#### Stage 4: Integration → `integration.json`

```typescript
interface IntegrationJson {
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
```

---

## Cost Estimate (gpt-5-mini)

For a typical C64 game (32KB, ~47 subroutines, ~3 outer loop passes):

| Stage | AI Calls | Est. Tokens | Est. Cost |
|-------|----------|-------------|-----------|
| Stage 1: Static Enrichment (deterministic) | 0 | 0 | $0.00 |
| Stage 1: AI concept extraction | ~50 | ~50K | ~$0.008 |
| Stage 2: Purpose analysis plugin | ~47 | ~94K | ~$0.014 |
| Stage 2: Variable naming plugin | ~47 | ~94K | ~$0.014 |
| Stage 2: Documentation plugin | ~47 | ~188K | ~$0.028 |
| Stage 2: Validation plugin | ~5 | ~10K | ~$0.002 |
| Stage 3: Context + sufficiency checks | ~141 | ~282K | ~$0.042 |
| Stage 3: RE attempts (pass 1 — leaves) | ~30 | ~120K | ~$0.018 |
| Stage 3: RE attempts (pass 2 — parents) | ~12 | ~60K | ~$0.009 |
| Stage 3: RE attempts (pass 3 — force-pick) | ~5 | ~25K | ~$0.004 |
| Stage 4: Integration | ~3 | ~24K | ~$0.004 |
| Qdrant (embed + search) | ~100 | ~35K | ~$0.001 |
| **Total** | **~487** | **~982K** | **~$0.144** |

Even large programs (200+ subroutines) with more outer loop passes would cost under $1.00. The iterative architecture is more expensive per block than a single-pass pipeline, but catches dependency cycles and handles the chicken-and-egg problems that a linear pipeline would miss entirely.

**Cost scaling**: Stage 3 dominates. Each outer loop pass costs ~$0.02-$0.05 depending on how many blocks bail. The force-pick mechanism guarantees at least one block completes per pass, so worst-case passes = number of blocks.

---

## Complete Directory Layout

Every file in the RE pipeline. Pluggable directories use auto-discovery — drop a file matching the naming convention and it's automatically loaded.

```
reverse-engineering/
  package.json
  tsconfig.json
  src/
    # ──────────────────────────────────────────────────────────────
    # CORE (not pluggable — pipeline infrastructure)
    # ──────────────────────────────────────────────────────────────
    index.ts                                      # Master orchestrator (CLI entry point)
    block_store.ts                                # Mutable block store with versioning + change log
    mutable_graph.ts                              # Mutable dependency graph with SCC tracking
    scc_decomposition.ts                          # Tarjan's algorithm + condensation DAG
    bitmask_value.ts                              # Bitmask abstract domain for register tracking
    irq_volatility_model.ts                       # IRQ-volatile register set + SEI/CLI tracking
    variable_map.ts                               # Global variable map (created Stage 2, refined Stage 3)
    plugin_loader.ts                              # Generic auto-discovery for all plugin types
    types.ts                                      # All shared type definitions

    # ──────────────────────────────────────────────────────────────
    # SHARED MODULES (imported by multiple pipeline stages)
    # ──────────────────────────────────────────────────────────────
    shared/
      symbol_db.ts                                # Known C64 symbols — banking-aware lookups
      naming.ts                                   # Naming conventions (prefix/suffix rules)
      project_collection.ts                       # Project Qdrant collection management
      prompt_builder.ts                           # Assemble prompt sections with token budgeting
      banking_resolver.ts                         # NEW: Banking-aware label resolution

    # ──────────────────────────────────────────────────────────────
    # ENRICHMENT PLUGINS — Stage 1 (auto-discovered: *_enrichment.ts)
    # ──────────────────────────────────────────────────────────────
    enrichment/
      types.ts
      index.ts                                    # Auto-discovery + multi-pass runner
      # --- Foundation (priority 10-19) ---
      constant_propagation_enrichment.ts          # Pri 10
      zero_page_tracker_enrichment.ts             # Pri 12
      kernal_api_enrichment.ts                    # Pri 15 — banking-aware
      inter_procedural_register_propagation_enrichment.ts  # Pri 18 — NEW
      # --- Resolution (priority 20-39) ---
      pointer_pair_enrichment.ts                  # Pri 20 — adds tree edges
      indirect_jmp_enrichment.ts                  # Pri 25 — adds tree edges
      vector_write_enrichment.ts                  # Pri 27 — adds tree edges
      rts_dispatch_enrichment.ts                  # Pri 30 — adds tree edges
      smc_target_enrichment.ts                    # Pri 32 — adds tree edges
      address_table_enrichment.ts                 # Pri 35 — adds tree edges
      # --- Semantics (priority 40-59) ---
      register_semantics_enrichment.ts            # Pri 40 — banking-aware
      data_format_enrichment.ts                   # Pri 42
      irq_volatility_enrichment.ts                # Pri 43 — NEW: SEI/CLI tracking + IRQ register volatility
      save_restore_detector_enrichment.ts         # Pri 44 — NEW: PHA/PLA banking scope detection
      interrupt_chain_enrichment.ts               # Pri 45 — raster split chain modeling
      state_machine_enrichment.ts                 # Pri 48
      copy_loop_enrichment.ts                     # Pri 50
      data_table_semantics_enrichment.ts          # Pri 55
      # --- Cross-Reference (priority 60-79) ---
      call_graph_enrichment.ts                    # Pri 60 — uses tree edges
      data_boundary_enrichment.ts                 # Pri 62
      data_flow_enrichment.ts                     # Pri 65
      shared_data_enrichment.ts                   # Pri 70
      # --- C64-Specific (priority 80-99) ---
      banking_state_enrichment.ts                 # Pri 80 — complex banking cases
      vic_annotation_enrichment.ts                # Pri 85 — banking-aware
      sid_annotation_enrichment.ts                # Pri 88
      screen_ops_enrichment.ts                    # Pri 90 — banking-aware
      # --- AI-Assisted (priority 100+) ---
      ai_concept_extraction_enrichment.ts         # Pri 100

    # ──────────────────────────────────────────────────────────────
    # STAGE 2-4 ORCHESTRATORS
    # ──────────────────────────────────────────────────────────────
    pipeline/
      stage2_orchestrator.ts                      # Stage 2: sequential AI enrichment plugins
      stage2_plugins/                             # Stage 2 AI plugins (auto-discovered: *_plugin.ts)
        concept_extraction_plugin.ts              # Pri 10 — extract purpose + patterns
        purpose_analysis_plugin.ts                # Pri 20 — detailed purpose + category
        variable_naming_plugin.ts                 # Pri 30 — name variables + parameters
        documentation_plugin.ts                   # Pri 40 — header comments + inline docs
        validation_plugin.ts                      # Pri 50 — cross-validate AI output
      stage3_orchestrator.ts                      # Stage 3: per-block AI RE loop + outer loop
      stage3_phases.ts                            # Stage 3: Phase A/B/C/D implementations
      stage4_integration.ts                       # Stage 4: whole-program integration

      # ──────────────────────────────────────────────────────────
      # CONTEXT PROVIDERS (auto-discovered: *_context.ts)
      # Used by Stage 2 plugins and Stage 3 RE loop
      # ──────────────────────────────────────────────────────────
      context/
        types.ts
        index.ts
        banking_state_context.ts                  # Pri 5
        call_graph_context.ts                     # Pri 10
        enrichment_context.ts                     # Pri 15
        qdrant_knowledge_context.ts               # Pri 18
        pattern_match_context.ts                  # Pri 20
        sibling_context.ts                        # Pri 25
        prior_analysis_context.ts                 # Pri 30
        variable_context.ts                       # Pri 35
        hardware_context.ts                       # Pri 40
        data_usage_context.ts                     # Pri 45
        cross_reference_context.ts                # Pri 50
        re_status_context.ts                      # Pri 55 — Stage 3 only: isReverseEngineered flags

      # ──────────────────────────────────────────────────────────
      # AI TOOL HANDLERS (auto-discovered: *_tool.ts)
      # Available to Stage 2 plugins and Stage 3 RE loop
      # ──────────────────────────────────────────────────────────
      tools/
        types.ts
        index.ts
        read_memory_tool.ts
        read_block_tool.ts
        find_references_tool.ts
        reclassify_block_tool.ts                  # Updates tree via BlockStore sync
        trace_data_usage_tool.ts
        decode_data_format_tool.ts
        search_knowledge_base_tool.ts
        search_similar_blocks_tool.ts

      # ──────────────────────────────────────────────────────────
      # RESPONSE PROCESSORS (auto-discovered: *_processor.ts)
      # ──────────────────────────────────────────────────────────
      processors/
        types.ts
        index.ts
        data_discovery_processor.ts               # Updates graph
        reclassification_processor.ts             # Updates graph
        research_request_processor.ts
        context_request_processor.ts              # Stage 3: processes Phase A context requests
        bail_reason_processor.ts                  # Stage 3: processes structured bail reasons
        embedding_processor.ts
        certainty_processor.ts                    # Banking-aware cross-validation
        variable_merge_processor.ts
        conflict_processor.ts
        review_flag_processor.ts

      # ──────────────────────────────────────────────────────────
      # ANNOTATION SOURCES (auto-discovered: *_annotation.ts)
      # ──────────────────────────────────────────────────────────
      annotations/
        types.ts
        index.ts
        symbol_db_annotation.ts                   # Banking-aware
        enrichment_annotation.ts
        constant_annotation.ts
        kernal_api_annotation.ts                  # Banking-aware

      # ──────────────────────────────────────────────────────────
      # INTEGRATION ANALYZERS (auto-discovered: *_analyzer.ts)
      # ──────────────────────────────────────────────────────────
      integration/
        types.ts
        index.ts
        program_structure_analyzer.ts
        module_assignment_analyzer.ts
        irq_chain_analyzer.ts
        state_machine_analyzer.ts
        memory_map_analyzer.ts
        file_dependency_analyzer.ts
        dead_code_analyzer.ts                     # Reachability + classification

    # ──────────────────────────────────────────────────────────────
    # CODE GENERATION — separate project, see builder.md
    # ──────────────────────────────────────────────────────────────
```

**File count:** 5 core + 5 shared + 28 enrichment plugins + 8 Stage 2-4 orchestrators (incl. 5 Stage 2 plugins) + 13 context providers + 10 tool handlers + 11 response processors + 6 annotation sources + 9 integration analyzers = **95 files total** (of which 82 are drop-in plugins). Code generation handled by builder project.

### Reused from `query/` (imported directly, not copied)

| Module | Import Path | What We Use |
|--------|------------|-------------|
| Qdrant search | `query/src/search/qdrant.ts` | `qdrantSearch()`, `mergeResults()`, `trimByScore()` |
| Embeddings | `query/src/search/embedding.ts` | `getEmbedding()` — OpenAI embedding wrapper |
| Search strategy | `query/src/search/strategy.ts` | `determineStrategy()`, `executeStrategy()` |
| Number extraction | `query/src/numbers.ts` | `extractNumbers()`, `toHex()`, `toBinary()` |
| Query enrichment | `query/src/enrichment/index.ts` | `runEnrichment()` — full enrichment pipeline |
| Types | `query/src/types.ts` | `QueryConfig`, `SearchHit`, `ParsedNumber` |
| Pipeline | `query/src/pipeline.ts` | `runPipeline()` — full query→enrich→search→format |

---

## Verification

To test the RE pipeline end-to-end:
1. Compile `spriteintro.asm` → `.prg`, run static analysis → `blocks.json` + `dependency_graph.json`
2. Run Stage 1 → verify: interrupt chain detection, pointer pair resolution, data classification, **banking state propagation**
3. Run Stage 2 → verify: purpose annotations, variable naming, documentation quality, **banking-aware labeling**
4. Run Stage 3 → verify: outer loop converges (all blocks either `reverseEngineered` or bailed with reason), variable map is complete, force-pick used only when needed
5. Run Stage 4 → verify: module assignments, file splitting, dead code classification
6. Run builder on enriched output (see [builder.md](docs/builder.md)), then verify byte-match (see [verify.md](docs/verify.md))
7. Verify dependency tree output (markdown + JSON) is accurate and complete
8. Repeat with archon snapshot → verify:
   - JMP indirect dispatch resolved
   - Function pointer table correctly identified
   - 54-byte sprite format detected
   - Music data with embedded commands detected
   - File split into logical modules
   - Banking state correctly tracked (archon banks out KERNAL during gameplay)
   - Dead code from snapshot correctly identified and classified
   - Outer loop handles circular dependencies between subroutines
   - Variable map resolves cross-block naming conflicts

---

## Research References

### Static Analysis References

| Reference | Relevance |
|-----------|-----------|
| **6502bench SourceGen** | Primary reference. Same platform (6502), same approach (recursive descent + speculative). |
| **Spedi** | Inspires speculative code discovery. Recover all possible basic blocks, prune via overlap analysis. |
| **ddisasm** | Datalog-based heuristic fusion. Key: "no individual analysis is perfect but combining several maximizes chances." |
| **Ghidra Auto-Analysis** | 7-phase analysis pipeline. Aggressive Instruction Finder for undefined bytes. |

### AI-Assisted RE References

| Reference | Relevance |
|-----------|-----------|
| **SK2Decompile** | Two-phase decompilation: structure then naming. Validates our level ordering. |
| **GenNm** | Call graph context propagation improves naming by 168%. Validates topological ordering. |
| **ReVa** | Ghidra MCP tool. "Smaller, critical fragments with reinforcement and links." Validates sub-block splitting. |
| **ChatCPS / Trim My View** | Two-pass LLM analysis: per-function then module-level. Validates Stage 2-3 / Stage 4 split. |
| **Talos Intelligence** | Practical LLM RE. Don't bias AI; use explicit instructions; compact summaries beat full dumps. |
| **LLM4Decompile** | Open-source LLM for decompilation. Future consideration. |

### Iterative AI References

| Reference | Relevance |
|-----------|-----------|
| **[Ralph Wiggum Loop](https://beuke.org/ralph-wiggum-loop/)** | Iterative AI pattern: attempt → validate → feed failures back → retry until convergence. Inspires our Stage 3 outer loop (simplified: force-pick instead of worklist). |
| **[Geoffrey Huntley — Everything is a Ralph Loop](https://ghuntley.com/loop/)** | Original framing. "One task per loop." Dense error-focused context constrains future attempts. |
| **IDA Pro auto-analysis** | Multi-level priority queue with 14 levels. Discovery feeds back into queues. Inspires our discovery tier system. |
| **Ghidra decompiler** | Iterative data flow analysis with fixpoint convergence. Similar to our banking state propagation. |

### Abstract Interpretation & Dataflow References

| Reference | Relevance |
|-----------|-----------|
| **[Sound, Precise, and Fast Abstract Interpretation with Tristate Numbers](https://arxiv.org/abs/2105.05398)** | CGO 2022 Distinguished Paper. Formally proves soundness and optimality of bitmask transfer functions. Directly grounds our `BitmaskValue` domain. |
| **[LLVM KnownBits](https://github.com/llvm/llvm-project/blob/main/llvm/lib/Support/KnownBits.cpp)** | Production implementation of bitmask abstract domain in a major compiler. Our transfer functions mirror LLVM's. |
| **[Linux kernel tnum.c](https://github.com/torvalds/linux/blob/master/kernel/bpf/tnum.c)** | Production implementation in the BPF verifier. Validates the `(mask, value)` representation. |
| **[Tarjan's SCC Algorithm](https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm)** | O(V+E) single-pass SCC decomposition. We use this for cycle detection and condensation DAG construction. |
| **[LLVM CallGraphSCCPass](https://llvm.org/doxygen/CallGraphSCCPass_8cpp.html)** | LLVM's approach: process SCCs in post-order, iterate within SCCs until fixpoint. Directly inspires our Stage 1 and Stage 3 scheduling. |
| **[Bourdoncle's Weak Topological Ordering (1993)](https://link.springer.com/chapter/10.1007/BFb0039704)** | Gold standard for iterative abstract interpretation. Pre-computes SCC heads for widening placement. |
| **[Kam & Ullman — Monotone Dataflow Frameworks (1977)](https://link.springer.com/article/10.1007/BF00290339)** | Proves convergence of iterative dataflow analysis on finite-height lattices. Our bitmask lattice satisfies all requirements. |

### Interrupt-Aware Analysis References

| Reference | Relevance |
|-----------|-----------|
| **[Regehr & Cooprider — Data-Flow Analysis for Interrupt-Driven Software](https://www.semanticscholar.org/paper/Data-Flow-Analysis-for-Interrupt-Driven-Software-Cooprider/425c7f69d1415b3b23ee61adc2e99216a75e10bd)** | Interatomic Concurrent Data-flow (ICD). Tracks which variables are shared between mainline and ISR. Directly inspires our three-tier volatility model. |
| **[Regehr et al. — Eliminating Stack Overflow by Abstract Interpretation](https://users.cs.utah.edu/~regehr/papers/p751-regehr.pdf)** | Introduces the Interrupt Preemption Graph. SEI/CLI tracking at the bit level. Inspires our IRQ-safety propagation. |
| **[Astree Static Analyzer](https://www.absint.com/astree/index.htm)** | Industrial tool for analyzing interrupt-driven safety-critical software. Sound interleaving semantics with priority awareness. |
| **[SDRacer — Automated Race Condition Detection in Embedded Software](https://arxiv.org/abs/2305.17869)** | Detects and repairs races in interrupt-driven code. SEI/CLI injection as repair strategy. |

### Convergence & Cost References

| Reference | Relevance |
|-----------|-----------|
| **[BATS — Budget-Aware Tool Scheduling for LLM Agents](https://arxiv.org/abs/2511.17006)** | Agents with budget awareness achieve 10× better efficiency. Budget regimes (HIGH/MEDIUM/LOW/CRITICAL). Directly inspires our cost budget system. |
| **[Widening Operators for Powerset Domains](https://link.springer.com/chapter/10.1007/978-3-540-24622-0_13)** | Theory for finite-set abstract domains with widening. Grounds our `possibleValues` set with threshold-based collapse to bitmask. |

### Lessons Applied

1. **Don't bias AI** (Talos) — Stage 2/3 don't assume program type; AI determines independently
2. **"DO NOT STOP" instructions** (Talos) — All prompts require full analysis, not early LOW returns
3. **Compact summaries** (Talos, ReVa, ChatCPS) — Cross-block context uses one-line summaries; full code only on request
4. **Iterative convergence** (Ralph Wiggum, IDA, Ghidra) — Fixed-pass pipelines can't handle circular dependencies; iterate until stable
5. **Separate deterministic from AI** (this plan) — Register propagation and banking are FREE and 100% accurate; do them in Stage 1 before AI to constrain hallucination
6. **Banking-aware everything** (novel) — No existing tool tracks C64 banking state through the call graph for label resolution
7. **Graph-driven traversal with SCC awareness** (novel) — Dependency graph determines analysis order via condensation DAG, grows during analysis, handles cycles via within-SCC iteration
8. **Bitmask abstract domain for $01 tracking** (novel for C64 RE) — Precise handling of AND/ORA/EOR read-modify-write patterns that naive constant propagation misses
9. **IRQ volatility analysis** (novel for C64 RE) — No existing C64 tool propagates IRQ handler side effects into mainline analysis
10. **isReverseEngineered context flagging** (novel) — Stage 3 context items tagged with source stage and confidence, so AI can weight dependencies appropriately
11. **Guaranteed forward progress** — Outer loop force-picks highest-confidence candidate when all blocks bail, preventing infinite loops without complex convergence machinery
12. **Discovery tiers** — Confirmed/probable/speculative classification prevents AI hallucinations from corrupting the graph
13. **Structured bail reasons** — Discriminated union bail types enable intelligent scheduling (e.g., retry after dependency is resolved)
14. **Validation as feedback** — Failures map back to blocks for re-analysis
15. **Project Qdrant collection** (GenNm) — Similarity search catches patterns call graphs miss
16. **Function decomposition** (ReVa, ChatCPS) — Large blocks sub-split with sibling summaries
17. **Variable map with context-specific names** — Variables can have different names in different contexts (e.g., `temp` in one subroutine, `sprite_index` in another)
