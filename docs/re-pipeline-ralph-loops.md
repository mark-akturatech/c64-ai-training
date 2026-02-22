# RE Pipeline — Ralph Loop Implementation Plan

## Context

Build the 4-stage reverse engineering pipeline defined in [reverse-engineering-pipeline.md](docs/reverse-engineering-pipeline.md). It takes `blocks.json` + `dependency_tree.json` from static analysis and produces enriched output with AI annotations, variable names, documentation, and module assignments.

The project is ~95 files across 5 plugin types. We implement it incrementally using **10 Ralph Loops**, each with a clear completion promise and test criteria. Each loop builds on the previous loop's output.

### Existing infrastructure we reuse:
- **`@c64/shared`** — `Block`, `BlockEnrichment`, `EdgeType`, `EdgeCategory`, etc. (already defined)
- **`query/src/`** — `pipeline.ts`, `search/qdrant.ts`, `search/embedding.ts`, `numbers.ts`, enrichment plugins
- **`static-analysis/`** — plugin loader pattern (`loadEnrichers()` auto-discovery)
- **Test fixtures** — `test/spriteintro-output/blocks.json` + `dependency_tree.json`, `test/archon-output/`

### Project location: `reverse-engineering/`

---

## Research-First Rule

**CRITICAL: Research before building. Every loop iteration MUST follow this order:**

1. **Research first** — Before writing any non-trivial algorithm or pattern, consult external models and references. Use `mcp__zen__chat`, `mcp__zen__thinkdeep`, or `mcp__zen__consensus` to validate your approach with GPT-5/Gemini. Specific triggers:
   - Any algorithm from an academic paper (Tarjan's, bitmask domain, fixpoint iteration)
   - Any C64 hardware behavior (banking, IRQ timing, VIC-II modes)
   - Any OpenAI API pattern (function calling, tool use, structured outputs)
   - Any design decision with multiple valid approaches
   - Anything you're less than 90% confident about

2. **Build with confidence** — Only write code after research confirms the approach

3. **Test against reality** — Run against real test fixtures (spriteintro, archon), not just synthetic unit tests

4. **Ask when stuck** — If an iteration doesn't make progress, STOP and research the blocker rather than guessing. Use `mcp__zen__debug` for tricky issues.

### When to research (per loop)

| Loop | Research Topics | Tools |
|------|----------------|-------|
| 2 | Tarjan's SCC algorithm correctness, bitmask domain transfer functions, condensation DAG construction | `thinkdeep` or `consensus` with GPT-5 + Gemini |
| 3 | Inter-procedural dataflow analysis on 6502, banking propagation edge cases (IRQ entry state, PHA/PLA matching), constant propagation through indirect addressing | `thinkdeep` with Gemini |
| 3 | Complete KERNAL entry point table, all C64 hardware register addresses and meanings | `chat` + Qdrant knowledge base |
| 4 | RTS dispatch detection patterns, self-modifying code analysis approaches, pointer pair heuristics for 6502 | `chat` with GPT-5 |
| 4 | IRQ volatility — what registers can IRQ handlers actually modify? Raster split patterns | `chat` + Qdrant |
| 5 | Data format detection heuristics (how to distinguish sprite data from charset from bitmap) | `chat` with Gemini |
| 6 | OpenAI function calling best practices — tool definitions, multi-turn tool use, structured JSON output | `apilookup` for OpenAI docs |
| 7 | Effective prompts for C64 code analysis — what context makes AI most accurate? Token budget optimization | `consensus` GPT-5 vs Gemini |
| 8 | Iterative convergence patterns — when to bail vs force, how to detect forward progress, outer loop termination | `thinkdeep` |
| 9 | OpenAI structured output for integration analysis — module assignment prompting strategies | `chat` |

### Research artifacts

When research produces valuable findings, save them:
- **Algorithm details** → inline comments in the implementation file
- **C64 hardware tables** → `src/shared/symbol_db.ts` or dedicated data files
- **Design decisions** → brief comment at top of relevant file explaining "why this approach"
- **Edge cases found** → add as unit test cases

---

## Loop 1: Project Scaffold + Core Types
**Prompt ref:** Plan §Core Architecture, §Core Types (lines 2315-2516), §Directory Layout (lines 2672-2840)

### Build
- [ ] `reverse-engineering/package.json` — deps: `@c64/shared`, `openai`, dev: `tsx`, `typescript`, `vitest`
- [ ] `reverse-engineering/tsconfig.json` — match existing projects (ES2022, ESNext, bundler)
- [ ] `reverse-engineering/src/types.ts` — ALL pipeline-specific types:
  - `DependencyGraphNode`, `DependencyGraphEdge`, `SCCDecomposition`
  - `BitmaskValue`, `RegisterValue`, `BankingSnapshot`, `Ternary`
  - `IRQSafetyState`
  - `BlockPipelineState`, `BailReason`
  - `VariableMap`, `VariableEntry`, `UsageContext`, `NameChange`
  - `BlockChange`, `EnrichmentType`, `BlockEnrichment` (RE-internal, extends shared)
  - `EnrichmentInput`, `EnrichmentResult`, `BlockReclassification`
  - `ContextProvider`, `ContextContribution`
  - `AIToolHandler`, `ToolDefinition`, `ToolResult`, `ToolContext`
  - `ResponseProcessor`, `ProcessorInput`, `ProcessorResult`
  - `Stage2Plugin`, `Stage2PluginInput`, `Stage2PluginResult`
  - `IntegrationAnalyzer`, `IntegrationJson`
  - `DependencyGraphJson`
- [ ] `reverse-engineering/src/index.ts` — stub CLI that parses args, prints help
- [ ] Stub directories: `src/enrichment/`, `src/shared/`, `src/pipeline/context/`, `src/pipeline/tools/`, `src/pipeline/processors/`, `src/pipeline/annotations/`, `src/pipeline/integration/`, `src/pipeline/stage2_plugins/`

### Success criteria
```
COMPILATION: npx tsc --noEmit exits 0
CLI: npx tsx src/index.ts --help prints usage
TYPES: src/types.ts exports all interfaces listed above without errors
```

### Completion promise
`<promise>LOOP 1 COMPLETE</promise>` — when `tsc --noEmit` passes and CLI prints help.

---

## Loop 2: Core Data Structures + Unit Tests
**Prompt ref:** Plan §Mutable Block Store + Mutable Tree (lines 762-858), §SCC Decomposition (lines 349-389), §Bitmask Abstract Domain (lines 404-501), §IRQ Volatility (lines 543-574)

### Build
- [ ] `src/block_store.ts` — `BlockStore` class: getBlock, findBlockContaining, reclassify, split, merge, versioning, changeLog
- [ ] `src/mutable_graph.ts` — `MutableGraph` class: addNode/Edge, removeNode, splitNode, mergeNodes, setBankingState, setPipelineState, getReachableNodes, getDeadNodes, getSCCDecomposition, topologicalSort, getChildren/Parents, hasSelfLoop, toJSON. Lazy SCC cache invalidated on structural change.
- [ ] `src/scc_decomposition.ts` — Tarjan's algorithm: O(V+E), returns `SCCDecomposition` (nodeToSCC, sccMembers, condensationEdges, topologicalOrder). Edge filter parameter (control_flow vs all).
- [ ] `src/bitmask_value.ts` — `BitmaskValue` type + transfer functions: `transferAND`, `transferORA`, `transferEOR`, `transferLDA_IMM`, `transferLDA_MEM`, `meetBitmask`, `collapseToMask`. Plus `RegisterValue` with possibleValues + MAX_SET_SIZE=16.
- [ ] `src/irq_volatility_model.ts` — `IRQSafetyState`, volatile register set builder, SEI/CLI state tracking.
- [ ] `src/variable_map.ts` — `VariableMap` class: get, set, addUsageContext, recordNameChange, merge stage3 refinements.
- [ ] `src/plugin_loader.ts` — Generic auto-discovery: `loadPlugins<T>(dir, pattern, methodName)` following static-analysis pattern.
- [ ] Unit tests for ALL:
  - `src/__tests__/block_store.test.ts`
  - `src/__tests__/mutable_graph.test.ts`
  - `src/__tests__/scc_decomposition.test.ts`
  - `src/__tests__/bitmask_value.test.ts`
  - `src/__tests__/variable_map.test.ts`

### Success criteria
```
ALL TESTS: npx vitest run exits 0
SCC: correctly decomposes a graph with known cycles (main loop, IRQ chain)
BITMASK: AND #$F8 / ORA #$05 on unknown produces knownMask=0x07, knownValue=0x05
MEET: meet({$35}, {$37}) = knownMask=0xFD, knownValue=0x35
GRAPH: split/merge update edges correctly, SCC cache invalidates
```

### Research (do this BEFORE writing code)
- [ ] **Tarjan's SCC**: Use `mcp__zen__thinkdeep` to verify algorithm — specifically: how to produce topological order of condensation DAG as a byproduct, how to handle the edge filter (control_flow only), and correct index/lowlink update rules. Cross-check with LLVM's CallGraphSCCPass approach.
- [ ] **Bitmask transfer functions**: Use `mcp__zen__consensus` (GPT-5 + Gemini) to verify soundness of AND/ORA/EOR/meet functions. Test case: confirm `meetBitmask({mask:0xFF, val:0x35}, {mask:0xFF, val:0x37})` = `{mask:0xFD, val:0x35}`. Verify the invariant `knownValue & ~knownMask === 0` is maintained by all operations.
- [ ] **BlockStore split/merge**: Think through edge redistribution — when splitting a node at address X, which edges stay with the lower half vs upper half? What about edges whose sourceInstruction falls in the upper half?

### Completion promise
`<promise>LOOP 2 COMPLETE</promise>` — when `npx vitest run` passes all tests.

---

## Loop 3: Stage 1 Enrichment Runner + Foundation Plugins (pri 10-18)
**Prompt ref:** Plan §Stage 1: Static Enrichment (lines 861-941), §Plugin Catalogue Foundation (lines 945-952), §Register State Propagation (lines 1003-1071)

### Build
- [ ] `src/enrichment/types.ts` — `EnrichmentPlugin` interface (matches plan)
- [ ] `src/enrichment/index.ts` — multi-pass enrichment loop with version tracking
- [ ] `src/enrichment/constant_propagation_enrichment.ts` (pri 10) — trace LDA/LDX/LDY→STA/STX/STY, build instruction→register value map
- [ ] `src/enrichment/zero_page_tracker_enrichment.ts` (pri 12) — track ZP writes/reads, identify pointer pairs ($FA/$FB)
- [ ] `src/enrichment/kernal_api_enrichment.ts` (pri 15) — banking-aware KERNAL labeling → writes to `enrichment.semanticLabels`
- [ ] `src/enrichment/inter_procedural_register_propagation_enrichment.ts` (pri 18) — THE BIG ONE:
  - SCC-aware propagation using bitmask domain
  - Track $01, $DD00, $D018
  - PHA/PLA save/restore → bankingScope
  - SEI/CLI → irqSafety
  - Derive kernalMapped/basicMapped/ioMapped from bitmask
- [ ] `src/shared/symbol_db.ts` — hardcoded KERNAL entries, hardware registers, ZP system locations, banking-aware lookup
- [ ] `src/shared/banking_resolver.ts` — `resolveLabelForAddress()` using BankingSnapshot
- [ ] Integration test: load `test/spriteintro-output/blocks.json` + `dependency_tree.json`, run Stage 1, verify banking annotations

### Success criteria
```
UNIT TESTS: npx vitest run passes
INTEGRATION: loads spriteintro, runs all 4 foundation plugins
BANKING: every code node has bankingState.onEntry populated
KERNAL: JSR $FFD2 labeled as CHROUT (default banking $37)
CONST PROP: traces LDA #$00 / STA $D020 → value known at STA
MULTI-PASS: enrichment loop converges (no infinite looping)
```

### Research (do this BEFORE writing code)
- [ ] **Inter-procedural register propagation**: Use `mcp__zen__thinkdeep` to design the full algorithm before coding. Key questions: (1) How to handle the initial state for IRQ handlers (unknown $01 vs known from arming site). (2) How to handle JSR to a callee with `bankingScope="local"` — caller continues with own state, not callee's exit. (3) How to walk instructions within a block — do we need a full basic-block CFG walk with merge points, or is linear scan sufficient for most 6502 subroutines? (4) What happens when two callers with different banking states both call the same subroutine? Verify with `mcp__zen__consensus` (GPT-5 + Gemini).
- [ ] **Constant propagation scope**: Research what a realistic intra-block constant propagation looks like for 6502. How to handle TAX/TAY/TXA/TYA transfers? What about PHA/PLA — do we track the stack abstractly? Use `mcp__zen__chat` with Gemini.
- [ ] **KERNAL entry point table**: Query Qdrant knowledge base for complete KERNAL entry points. Cross-reference with symbol_db to ensure coverage. Common ones: $FFD2 (CHROUT), $FFE4 (GETIN), $FFE1 (STOP), $FFD5 (LOAD), $FFD8 (SAVE), $FFC0 (OPEN), $FFC3 (CLOSE), etc.
- [ ] **C64 banking edge cases**: Use `mcp__zen__chat` to research: What is the default $01 value after BASIC SYS? What about after loading from disk? What does $01 read back as (DDR bits vs port bits)? The DDR at $00 affects what $01 reads — is this relevant?

### Completion promise
`<promise>LOOP 3 COMPLETE</promise>` — when integration test loads spriteintro and produces banking annotations on all code nodes.

---

## Loop 4: Stage 1 Resolution + Semantics Plugins (pri 20-55)
**Prompt ref:** Plan §Plugin Catalogue Resolution (lines 954-963), §Plugin Catalogue Semantics (lines 965-977)

### Build
- [ ] `src/enrichment/pointer_pair_enrichment.ts` (pri 20) — detect lo/hi tables, add graph edges
- [ ] `src/enrichment/indirect_jmp_enrichment.ts` (pri 25) — resolve JMP ($xxxx), add graph edges
- [ ] `src/enrichment/vector_write_enrichment.ts` (pri 27) — detect IRQ/NMI vector writes, add graph edges
- [ ] `src/enrichment/rts_dispatch_enrichment.ts` (pri 30) — PHA/PHA/RTS pattern, add graph edges
- [ ] `src/enrichment/smc_target_enrichment.ts` (pri 32) — self-modifying code detection
- [ ] `src/enrichment/address_table_enrichment.ts` (pri 35) — resolve jump/address table entries
- [ ] `src/enrichment/register_semantics_enrichment.ts` (pri 40) — VIC/SID/CIA annotations → `enrichment.inlineComments`
- [ ] `src/enrichment/data_format_enrichment.ts` (pri 42) — classify data blocks (sprite/charset/music/string)
- [ ] `src/enrichment/irq_volatility_enrichment.ts` (pri 43) — build IRQ-volatile register set
- [ ] `src/enrichment/save_restore_detector_enrichment.ts` (pri 44) — PHA/PLA scope detection
- [ ] `src/enrichment/interrupt_chain_enrichment.ts` (pri 45) — raster split chain modeling
- [ ] `src/enrichment/state_machine_enrichment.ts` (pri 48) — state dispatch detection
- [ ] `src/enrichment/copy_loop_enrichment.ts` (pri 50) — memory copy/fill loop detection
- [ ] `src/enrichment/data_table_semantics_enrichment.ts` (pri 55) — what table values mean

### Success criteria
```
ALL TESTS: npx vitest run passes
INTEGRATION: spriteintro Stage 1 completes with all plugins
GRAPH GROWTH: new edges added (pointer pairs, vector writes, etc.)
REGISTER SEMANTICS: STA $D020 has inline comment "Set border color"
INTERRUPT CHAIN: IRQ handler chain detected in spriteintro
```

### Research (do this BEFORE writing code)
- [ ] **RTS dispatch detection**: Use `mcp__zen__chat` to research common 6502 RTS dispatch patterns. The basic PHA/PHA/RTS is well-known, but what about: (1) Values loaded from tables before push? (2) Address-1 convention (RTS adds 1 to the pulled address)? (3) PHA from A vs PHA from X/Y transfer? Get examples from real C64 games.
- [ ] **Self-modifying code patterns**: Use `mcp__zen__chat` with Gemini to enumerate common C64 SMC patterns: operand patching (STA into LDA operand), opcode patching (switching NOP/BRK), speed code generators. How to detect which instruction is being modified?
- [ ] **VIC-II/SID/CIA register map**: Query Qdrant for complete register descriptions. Verify register_semantics coverage: all VIC-II ($D000-$D03F), SID ($D400-$D41C), CIA1 ($DC00-$DC0F), CIA2 ($DD00-$DD0F). Each register needs: name, read/write, bit field meanings.
- [ ] **IRQ handler detection patterns**: Research how C64 programs set up raster interrupts. Common patterns: write to $D012 (raster line), $D01A (interrupt mask), $0314/$0315 (IRQ vector). What about NMI via $0318/$0319 or $FFFA/$FFFB?

### Completion promise
`<promise>LOOP 4 COMPLETE</promise>` — when spriteintro Stage 1 runs all plugins, graph has new edges from resolution plugins.

---

## Loop 5: Stage 1 Cross-Ref + C64 + AI Concept Extraction (pri 60-100)
**Prompt ref:** Plan §Plugin Catalogue Cross-Reference (lines 979-986), §C64-Specific (lines 988-996), §AI-Assisted (lines 997-1001), §Data Usage Tracking (lines 1073-1105)

### Build
- [ ] `src/enrichment/call_graph_enrichment.ts` (pri 60) — build caller/callee lists from graph edges
- [ ] `src/enrichment/data_boundary_enrichment.ts` (pri 62) — determine data block sizes
- [ ] `src/enrichment/data_flow_enrichment.ts` (pri 65) — DataUsageRecord: readers/writers/patterns
- [ ] `src/enrichment/shared_data_enrichment.ts` (pri 70) — flag multi-block data + race conditions
- [ ] `src/enrichment/banking_state_enrichment.ts` (pri 80) — complex banking annotations
- [ ] `src/enrichment/vic_annotation_enrichment.ts` (pri 85) — banking-aware VIC-II annotations
- [ ] `src/enrichment/sid_annotation_enrichment.ts` (pri 88) — SID setup detection
- [ ] `src/enrichment/screen_ops_enrichment.ts` (pri 90) — screen/colour RAM operations
- [ ] `src/enrichment/ai_concept_extraction_enrichment.ts` (pri 100) — OpenAI concept extraction + Qdrant lookup (first AI usage!)
- [ ] Wire up Qdrant search via `query/src/pipeline.ts` import

### Success criteria
```
ALL TESTS: npx vitest run passes
STAGE 1 COMPLETE: spriteintro runs full Stage 1 (all 28 plugins)
CALL GRAPH: every code block has callers/callees listed
DATA FLOW: data blocks have reader/writer lists
AI CONCEPT: extracts concepts and attaches Qdrant knowledge (with OPENAI_API_KEY)
STAGE 1 COST: 0 AI calls for deterministic plugins, ~N calls for concept extraction only
pipelineState.staticEnrichmentComplete = true for all blocks
```

### Completion promise
`<promise>LOOP 5 COMPLETE</promise>` — when full Stage 1 completes for spriteintro with all 28 plugins, pipelineState flags set.

---

## Loop 6: Shared Services + Plugin Framework (Context/Tools/Annotations/Processors)
**Prompt ref:** Plan §Pluggable Architecture (lines 1890-2049), §Annotation Sources (lines 2051-2078), §Context Providers (lines 1896-1943), §AI Tool Handlers (lines 1948-2000), §Response Processors (lines 2002-2049)

### Build
- [ ] `src/shared/naming.ts` — naming conventions (verb-first snake_case rules)
- [ ] `src/shared/project_collection.ts` — project Qdrant collection: embed, search, promote
- [ ] `src/shared/prompt_builder.ts` — assemble prompt sections with token budgeting
- [ ] **Context providers** (`src/pipeline/context/`):
  - [ ] types.ts, index.ts (auto-discovery)
  - [ ] banking_state_context.ts (pri 5), call_graph_context.ts (pri 10), enrichment_context.ts (pri 15), qdrant_knowledge_context.ts (pri 18), pattern_match_context.ts (pri 20), sibling_context.ts (pri 25), prior_analysis_context.ts (pri 30), variable_context.ts (pri 35), hardware_context.ts (pri 40), data_usage_context.ts (pri 45), cross_reference_context.ts (pri 50), re_status_context.ts (pri 55)
- [ ] **Tool handlers** (`src/pipeline/tools/`):
  - [ ] types.ts, index.ts (auto-discovery)
  - [ ] read_memory_tool.ts, read_block_tool.ts, find_references_tool.ts, reclassify_block_tool.ts, trace_data_usage_tool.ts, decode_data_format_tool.ts, search_knowledge_base_tool.ts, search_similar_blocks_tool.ts
- [ ] **Annotation sources** (`src/pipeline/annotations/`):
  - [ ] types.ts, index.ts
  - [ ] symbol_db_annotation.ts, enrichment_annotation.ts, constant_annotation.ts, kernal_api_annotation.ts
- [ ] **Response processors** (`src/pipeline/processors/`):
  - [ ] types.ts, index.ts (auto-discovery)
  - [ ] data_discovery_processor.ts, reclassification_processor.ts, research_request_processor.ts, context_request_processor.ts, embedding_processor.ts, certainty_processor.ts, variable_merge_processor.ts, conflict_processor.ts, review_flag_processor.ts, bail_reason_processor.ts

### Success criteria
```
ALL TESTS: npx vitest run passes
PROMPT BUILD: for any spriteintro block, assemble a complete AI prompt with all context sections
CONTEXT: banking_state_context produces "KERNAL is mapped" for default banking blocks
TOOLS: read_memory_tool returns base64-decoded bytes for valid address
ANNOTATIONS: symbol_db_annotation returns "CHROUT" for JSR $FFD2 (banking-aware)
PROCESSORS: certainty_processor detects conflict when AI claims wrong register meaning
```

### Research (do this BEFORE writing code)
- [ ] **OpenAI function calling / tool use API**: Use `mcp__zen__apilookup` to get current OpenAI API docs for function calling. Key questions: (1) How to define tools in the chat completions API. (2) How to handle multi-turn tool use (AI calls tool, gets result, calls another tool). (3) Structured JSON output via `response_format`. (4) Token counting for tool definitions. Get the latest API shape — this changes often.
- [ ] **Token budget estimation**: Use `mcp__zen__chat` to estimate: average tokens per prompt section (banking state, call graph, enrichments, code listing). Spriteintro blocks range from ~5 to ~100 instructions — what's the token range? How to stay within model context limits?
- [ ] **Prompt engineering for code analysis**: Use `mcp__zen__consensus` (GPT-5 + Gemini) to evaluate: what makes a good system prompt for 6502 code analysis? Should we use few-shot examples? How to phrase the banking warning so the AI actually respects it?

### Completion promise
`<promise>LOOP 6 COMPLETE</promise>` — when prompt builder assembles a complete prompt for a spriteintro block using all context providers.

---

## Loop 7: Stage 2 Orchestrator + AI Plugins
**Prompt ref:** Plan §Stage 2: AI Enrichment (lines 1187-1342), §Stage 2 Plugin Catalogue (lines 1237-1253), §Variable Map (lines 1780-1842)

### Build
- [ ] `src/pipeline/stage2_orchestrator.ts` — process blocks in SCC-aware topological order, run plugins sequentially per block, handle splits/reclassifications
- [ ] `src/pipeline/stage2_plugins/concept_extraction_plugin.ts` (pri 10)
- [ ] `src/pipeline/stage2_plugins/purpose_analysis_plugin.ts` (pri 20) — with OpenAI function calling (tools: read_memory, read_block, find_references, search_knowledge_base, etc.)
- [ ] `src/pipeline/stage2_plugins/variable_naming_plugin.ts` (pri 30)
- [ ] `src/pipeline/stage2_plugins/documentation_plugin.ts` (pri 40)
- [ ] `src/pipeline/stage2_plugins/validation_plugin.ts` (pri 50) — cross-validate vs Stage 1

### Success criteria
```
ALL TESTS: npx vitest run passes
STAGE 2 COMPLETE: every spriteintro block has purpose, category, confidence
VARIABLE MAP: variable_map.json written with entries for ZP addresses used
DOCUMENTATION: every block has headerComment
VALIDATION: conflicts detected and recorded (if any)
ORDERING: callees processed before callers (SCC topological)
pipelineState.aiEnrichmentComplete = true for all blocks
COST: reasonable token usage (logged to stderr)
```

### Research (do this BEFORE writing code)
- [ ] **AI purpose analysis prompt design**: Use `mcp__zen__consensus` (GPT-5 + Gemini) to evaluate competing prompt designs for the purpose_analysis plugin. Test with a real spriteintro block: provide the code + enrichments, ask each model to analyze it. Compare: does providing banking context prevent hallucination? Does the structured JSON output format work? Iterate on the prompt until both models produce accurate, consistent results.
- [ ] **Variable naming conventions**: Use `mcp__zen__chat` to research: what naming conventions do existing C64 disassembly projects use? Look at 6502bench SourceGen naming, Ghidra default names, IDA patterns. How to handle the same ZP address with different meanings in different subroutines?
- [ ] **Cross-validation approach**: Think through how `validation_plugin` compares AI claims vs Stage 1 annotations. What's the right data structure for a "claim"? How to detect "AI says $D011 controls sprites" vs "register_semantics says $D011 is VIC control register"?

### Completion promise
`<promise>LOOP 7 COMPLETE</promise>` — when Stage 2 completes for spriteintro, every block has purpose + variables + docs.

---

## Loop 8: Stage 3 Per-Block RE Loop + Outer Loop
**Prompt ref:** Plan §Stage 3: AI Reverse Engineering (lines 1346-1567), §Outer Loop (lines 1571-1731)

### Build
- [ ] `src/pipeline/stage3_orchestrator.ts` — outer loop: while unreversed blocks exist, run per-block loop, force-pick on no progress, handle splits
- [ ] `src/pipeline/stage3_phases.ts` — Phase A (context request), Phase B (gather with isReverseEngineered tags), Phase C (sufficiency check + confidence), Phase D (attempt RE or bail)
- [ ] Wire up response processors for Stage 3: context_request_processor, bail_reason_processor, variable_merge_processor
- [ ] Persistence: save blocks.json + variable_map.json after each outer pass

### Success criteria
```
ALL TESTS: npx vitest run passes
STAGE 3 COMPLETE: all spriteintro blocks have reverseEngineered=true
OUTER LOOP: converges in ≤10 passes
FORCE PICK: used only when necessary (logged)
BAIL REASONS: structured (not just strings)
VARIABLE MAP: refined with stage3 sources
CONTEXT TAGS: isReverseEngineered correctly flags context items
PERSISTENCE: blocks.json updated after each pass (resumable)
COST: logged per-pass and total
```

### Research (do this BEFORE writing code)
- [ ] **Outer loop convergence**: Use `mcp__zen__thinkdeep` to reason about: (1) Can the force-pick mechanism create a worse situation? (a forced low-confidence RE could mislead blocks that depend on it). (2) Should force-picked blocks be re-analyzed if better context becomes available later? (3) What's the right confidence threshold — 0.6 as default, but should it decrease with each bail? (4) How to detect "thrashing" — a block that keeps bailing for the same reason.
- [ ] **Phase A-D prompt design**: Use `mcp__zen__consensus` (GPT-5 + Gemini) to design the Stage 3 prompts. Phase A (context request) needs to elicit specific, useful requests — not vague "tell me everything about $C100". Phase C (sufficiency check) needs to return honest confidence, not always-optimistic scores. Phase D (RE attempt) needs structured output that the processors can parse. Test with a real spriteintro block.
- [ ] **isReverseEngineered tagging**: Think through exactly how context items get tagged. When the AI requests subroutine info for $C100, and $C100 has Stage 2 analysis (confidence 0.7) but not Stage 3 — the response must clearly say "this is preliminary Stage 2 analysis, not fully verified." How to format this so the AI actually uses it to calibrate confidence?

### Completion promise
`<promise>LOOP 8 COMPLETE</promise>` — when Stage 3 outer loop completes for spriteintro, all blocks RE'd.

---

## Loop 9: Stage 4 Integration + CLI + End-to-End
**Prompt ref:** Plan §Stage 4: Integration Analysis (lines 1846-1887), §Master Orchestrator (lines 2160-2228), §Persistence Model (lines 1735-1776)

### Build
- [ ] `src/pipeline/stage4_integration.ts` — orchestrate integration analyzers
- [ ] `src/pipeline/integration/` — 7 analyzers:
  - [ ] program_structure_analyzer.ts (pri 10)
  - [ ] module_assignment_analyzer.ts (pri 20)
  - [ ] irq_chain_analyzer.ts (pri 30)
  - [ ] state_machine_analyzer.ts (pri 40)
  - [ ] memory_map_analyzer.ts (pri 50)
  - [ ] file_dependency_analyzer.ts (pri 60)
  - [ ] dead_code_analyzer.ts (pri 70)
- [ ] `src/index.ts` — full CLI:
  - Accept blocks.json or .prg (run static analysis first)
  - `--from stage2/stage3` resume points
  - `--to stage1/stage2/stage3` stop points
  - `--force` override saved state
  - `--model`, `--max-outer-passes`, `--confidence-threshold`, `--cost-budget`
  - `--output-dir`
- [ ] `pipeline_state.json` tracking (cost, per-stage stats)
- [ ] Resumability: check pipelineState flags, skip completed stages
- [ ] **End-to-end test**: `npx tsx src/index.ts test/spriteintro-output/blocks.json -o test/re-output/`
- [ ] Verify builder can consume enriched output: `npx tsx builder/src/index.ts test/re-output/blocks.json`

### Success criteria
```
END TO END: npx tsx src/index.ts test/spriteintro-output/blocks.json → produces:
  - enriched blocks.json (with pipelineState on every block)
  - dependency_graph.json (with banking, SCC annotations)
  - variable_map.json
  - integration.json (with module assignments, dead code report)
  - pipeline_state.json (with cost tracking)
BUILDER: builder consumes enriched blocks.json and produces .asm
RESUMABILITY: re-running skips completed stages (checks pipelineState)
--from stage3: skips Stage 1+2, runs Stage 3+4
MODULE ASSIGNMENT: blocks grouped into reasonable modules
DEAD CODE: unreachable blocks identified
```

### Completion promise
`<promise>LOOP 9 COMPLETE</promise>` — when full pipeline runs end-to-end on spriteintro and builder produces .asm from enriched output.

---

## Loop 10: Archon Validation + Polish
**Prompt ref:** Plan §Verification (lines 2858-2877)

### Build
- [ ] Run full pipeline on `test/archon-output/blocks.json`
- [ ] Fix issues found:
  - [ ] JMP indirect dispatch resolved
  - [ ] Function pointer tables identified
  - [ ] Banking state tracked (archon banks out KERNAL)
  - [ ] IRQ handler chains detected
  - [ ] Module assignments make sense for a game
  - [ ] Dead code from snapshot classified
  - [ ] Variable map resolves cross-block conflicts
- [ ] Outer loop handles archon's circular dependencies
- [ ] Cost stays reasonable (<$1.00)

### Success criteria
```
ARCHON: full pipeline completes without crashes
BANKING: nodes with $01=$35 correctly label $FFD2 as ram_FFD2 (not CHROUT)
MODULES: ≤15 modules, reasonable assignments
OUTER LOOP: converges in ≤15 passes
COST: <$1.00 total
NO CRASHES: all blocks either RE'd or force-processed
```

### Completion promise
`<promise>LOOP 10 COMPLETE</promise>` — when archon pipeline completes, banking is correct, modules assigned.

---

## How to Run Each Loop

### Prompt template

Each Ralph Loop prompt should include ALL of the following:

```
Implement Loop N of the RE pipeline.

REFERENCES:
- Full spec: docs/reverse-engineering-pipeline.md
- Loop plan: docs/re-pipeline-ralph-loops.md (Loop N section)
- Build in: reverse-engineering/

RULES:
1. RESEARCH FIRST. Before writing any non-trivial algorithm, use mcp__zen__thinkdeep,
   mcp__zen__consensus, mcp__zen__chat, or mcp__zen__apilookup to validate your approach.
   Check the "Research" checklist in the loop plan — complete ALL research items before coding.
2. If unsure about ANYTHING (C64 hardware, algorithm correctness, API usage, design choice),
   STOP and research it. Use external models. Do NOT guess.
3. Save research findings as comments in the code or as test cases.
4. Test against real fixtures (test/spriteintro-output/) not just synthetic data.
5. When ALL success criteria pass, output <promise>LOOP N COMPLETE</promise>.
```

### Example commands

```bash
# Loop 1 (low complexity, fewer iterations needed)
/ralph-loop "Implement Loop 1 of the RE pipeline. [paste template above with N=1]" --max-iterations 8

# Loop 2 (high complexity — SCC, bitmask domain)
/ralph-loop "Implement Loop 2 of the RE pipeline. [paste template above with N=2]" --max-iterations 15

# Loop 3 (high complexity — register propagation)
/ralph-loop "Implement Loop 3 of the RE pipeline. [paste template above with N=3]" --max-iterations 15

# Cancel if stuck
/cancel-ralph
```

### Iteration budget guide

| Complexity | Max iterations | Examples |
|-----------|---------------|----------|
| Low | 8 | Loop 1 (scaffold) |
| Medium | 10 | Loops 4, 5, 6, 9 |
| High | 15 | Loops 2, 3, 7, 8 |
| Variable | 12 | Loop 10 (validation) |

---

## Estimated Effort

| Loop | Files | Iterations | Complexity |
|------|-------|------------|------------|
| 1: Scaffold + Types | ~5 | 2-3 | Low |
| 2: Core Data Structures | ~10 | 3-5 | High (SCC, bitmask) |
| 3: Stage 1 Foundation | ~8 | 4-6 | High (register propagation) |
| 4: Stage 1 Resolution+Semantics | ~14 | 3-5 | Medium |
| 5: Stage 1 Cross-Ref+C64+AI | ~10 | 3-4 | Medium |
| 6: Plugin Framework | ~40 | 4-6 | Medium (many files, each small) |
| 7: Stage 2 | ~7 | 3-5 | Medium (AI integration) |
| 8: Stage 3 | ~4 | 4-6 | High (outer loop, phases) |
| 9: Stage 4 + CLI + E2E | ~12 | 3-5 | Medium |
| 10: Archon Validation | ~0 (fixes) | 3-5 | Variable |
| **Total** | **~95** | **~30-50** | |
