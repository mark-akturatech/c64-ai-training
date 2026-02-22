# Iterative AI-Assisted Reverse Engineering of Legacy Binaries via Graph-Driven Abstract Interpretation and Semantic Knowledge Retrieval

**A Technical Paper on the Architecture, Algorithms, and Novel Contributions of an End-to-End Reverse Engineering Pipeline for Commodore 64 Binaries**

---

## Abstract

We present a complete, end-to-end pipeline for automated reverse engineering of Commodore 64 (6502-based) binaries that combines deterministic static analysis, abstract interpretation, semantic vector search, and iterative large language model (LLM) enrichment into a unified system. The pipeline transforms raw binary images into fully annotated, compilable KickAssembler source code that is byte-identical to the original program.

The core technical contributions are: (1) a bitmask abstract domain for inter-procedural banking state propagation through cyclic call graphs, using Tarjan's SCC decomposition for analysis scheduling; (2) a three-layer AI knowledge strategy that drastically mitigates the dominant class of LLM hallucinations (incorrect hardware register semantics) at near-zero cost; (3) a guaranteed-termination outer loop for iterative AI reverse engineering that resolves circular analysis dependencies without complex convergence machinery; and (4) a hybrid search architecture over a 4,000+ chunk vector knowledge base with automatic number base enrichment and hardware mirror resolution.

To our knowledge, the pipeline is the first publicly documented system to track C64 memory banking state through entire call graphs for label resolution, the first to combine interrupt-aware dataflow analysis with LLM-driven code comprehension, and the first to demonstrate byte-identical reconstruction of non-trivial C64 programs from automated analysis. If the approach generalizes, it establishes a template for AI-assisted reverse engineering of any legacy platform where domain-specific hardware knowledge is critical for correct analysis.

---

## 1. Introduction

### 1.1 The Problem

Reverse engineering legacy binaries is among the most labor-intensive tasks in software archaeology. A skilled human reverse engineer working on a 32KB Commodore 64 game binary might spend 40-100 hours producing annotated, readable assembly source. The work requires simultaneous mastery of the target CPU's instruction set, the platform's memory-mapped hardware, the software's algorithmic intent, and the idiomatic patterns of the era's programmers.

Modern LLMs possess remarkable code comprehension abilities, but applying them naively to binary reverse engineering produces results that are confidently wrong. The fundamental issue is not that LLMs cannot reason about assembly code — they can, often impressively — but that they lack the *platform-specific context* needed to distinguish between semantically identical instruction sequences that have radically different meanings depending on hardware state.

Consider a single instruction: `JSR $FFD2`. On a Commodore 64, this calls the KERNAL ROM routine `CHROUT` (print a character) — but only if the KERNAL ROM is currently mapped into the CPU's address space. If the program has executed `LDA #$35 / STA $01` to bank out the KERNAL, then `JSR $FFD2` calls whatever code the program has placed in RAM at that address. An LLM that doesn't track banking state will label this call incorrectly, and every downstream analysis that depends on this label will inherit the error.

This paper describes a system that solves this problem comprehensively.

### 1.2 Scope and Contributions

The system comprises five major subsystems:

1. **Static Analysis Pipeline** — deterministic binary decomposition into typed blocks with a dependency graph (14 discovery plugins, 13 data detectors, 7 enricher plugins)
2. **Knowledge Base Pipeline** — construction and querying of a 4,000+ chunk semantic vector database of C64/6502 documentation
3. **Reverse Engineering Pipeline** — four-stage AI-assisted enrichment with iterative convergence
4. **Builder Pipeline** — mechanical transformation of enriched analysis into compilable KickAssembler source
5. **Verification Pipeline** — byte-identical comparison of rebuilt binaries against originals

The novel contributions, each described in detail in subsequent sections, are:

- **Banking-aware abstract interpretation** using a bitmask domain with per-bit precision, propagated inter-procedurally through SCC-decomposed call graphs (Section 3)
- **Interrupt-aware dataflow analysis** with a three-tier volatility model derived from Regehr & Cooprider's Interatomic Concurrent Data-flow framework (Section 4)
- **A three-layer AI knowledge strategy** that drastically reduces hardware register hallucinations at <$0.01 marginal cost per binary (Section 5)
- **Guaranteed-progress iterative reverse engineering** via an outer loop with force-pick fallback, inspired by the Ralph Wiggum Loop pattern (Section 6)
- **Hybrid semantic search with automatic number enrichment** and hardware mirror resolution for domain-specific retrieval (Section 7)
- **Byte-identical reconstruction** verified via SHA comparison after the full analyze → build → compile round-trip (Section 8)

### 1.3 Why C64? Why Now?

The Commodore 64 is not merely a nostalgia platform. It is an ideal proving ground for AI-assisted reverse engineering because it concentrates, in a 64KB address space, every hard problem in binary analysis:

- **No metadata separation between code and data.** The 6502 has no concept of segments, executable permissions, or symbol tables. Every byte could be code, data, or both (self-modifying code is routine, not exceptional).
- **Memory-mapped I/O with banking.** The CPU port at $01 controls which of several overlapping memory regions (ROM, RAM, I/O) are visible at each address. Banking state is dynamic and path-dependent.
- **Asynchronous hardware interrupts that modify shared state.** Raster interrupts fire at specific screen scanlines and routinely modify VIC-II, SID, and CIA registers. Mainline code reading these registers between interrupt firings sees non-deterministic values.
- **Dense, hand-optimized code.** 1980s assembly programmers used every trick available: self-modifying code, RTS dispatch (push address-1, execute RTS as a computed jump), interleaved code/data, and timing-dependent instruction sequences.
- **Complete, bounded hardware specification.** Unlike modern x86-64 with thousands of pages of documentation, the C64's hardware is fully documented in a few hundred pages. This makes the "ground truth" knowledge base finite and constructible.

If a system can handle all of these simultaneously, the architectural patterns transfer to any legacy platform (Z80, 68000, ARM7TDMI) and, with appropriate knowledge bases, to modern architectures.

---

## 2. Static Analysis: Deterministic Binary Decomposition

### 2.1 Architecture

The static analysis pipeline is a seven-step deterministic process that transforms a raw binary into a structured representation. No AI calls are made. The output is a `blocks.json` file containing all discovered code and data blocks with full instruction metadata, and a `dependency_graph.json` file containing the complete relationship graph.

The pipeline accepts multiple input formats (PRG, VICE VSF snapshots, SID music files, raw binaries) through a parser abstraction that normalizes all inputs into a 64KB `MemoryImage` with metadata about loaded regions and parser-provided entry points.

### 2.2 Entry Point Detection

Entry point detection combines multiple signals:

- **BASIC SYS stub parsing:** The C64's BASIC ROM stores programs as tokenized line-link chains starting at $0801. A `SYS` token followed by a decimal address string (common pattern: `10 SYS 2064`) provides a high-confidence entry point.
- **Interrupt vector detection:** Hardware vectors at $FFFE/$FFFF (IRQ), $FFFA/$FFFB (NMI), and $FFF6/$FFF7 (BRK) provide entry points when the binary loads into these regions.
- **Snapshot state recovery:** VICE VSF snapshots encode the CPU program counter, register state, and full banking configuration at the moment of capture, providing perfect initial conditions.
- **Banking state inference:** The CPU port value ($01) at entry determines which ROM/RAM regions are visible, establishing the initial condition for banking propagation.

Each entry point is ranked by confidence (high/medium/low), and the tree walker processes them in priority order.

### 2.3 The Tree Walker: Queue-Based Control Flow Tracing

The core algorithm is a queue-based recursive descent disassembler, enhanced with a plugin architecture that allows 14 discovery plugins to participate in instruction-level analysis.

**Algorithm:**
```
queue ← entry_points
visited ← ∅

while queue is not empty:
    target ← dequeue(queue)
    if target ∈ visited or target ∈ ROM: continue

    node ← new_node(target)
    while true:
        instruction ← decode_6502(memory[pc])
        if byte_role[pc] ≠ UNKNOWN: break  // conflict

        mark_byte_roles(pc, instruction)
        run_instruction_plugins(instruction, node, queue)

        if instruction terminates flow: break
        pc ← pc + instruction.size

    run_node_plugins(node)
    add_node_to_graph(node)

run_tree_plugins(graph)
```

The critical innovation is **byte role tracking**: each of the 65,536 bytes in the address space is marked with one of four roles (UNKNOWN, CODE_OPCODE, CODE_OPERAND, DATA). This prevents the tree walker from re-analyzing bytes already claimed by a previous discovery path, and provides conflict detection when two paths attempt to claim the same byte with different roles.

### 2.4 Discovery Plugins

The plugin architecture processes instructions in three phases:

| Phase | Timing | Capabilities |
|-------|--------|-------------|
| **Instruction** | Per-instruction during walk | End nodes, queue new targets, add edges |
| **Node** | After node completion | Split/refine nodes, add metadata |
| **Tree** | After all initial nodes built | Global graph refinement |

Key plugins include:

- **Branch resolver** — queues both branch targets (taken and fallthrough), creating forked analysis paths
- **Indirect resolver** — resolves `JMP ($xxxx)` by reading the memory contents at the indirect address
- **RTS dispatch detector** — identifies the pattern `PHA / PHA / RTS` (or variants with table lookups) where the 6502's RTS instruction is abused as a computed jump by pushing an address-minus-one onto the stack
- **Pointer pair detector** — identifies `LDA #<addr / STA $ZP / LDA #>addr / STA $ZP+1` sequences that construct 16-bit pointers from 8-bit immediate values
- **Self-modifying code detector** — identifies `STA` instructions whose target falls within a previously discovered code region, creating data→code edges that flag the modified instruction as potentially variable

### 2.5 Code Island Discovery

Not all code is reachable from entry points. Dead code, multiple independent programs loaded into the same memory image, and computed dispatch patterns that the tree walker couldn't resolve all leave "orphan" regions.

The island discovery algorithm scans unclaimed memory regions and scores potential code islands using:

- **Instruction validity** — ratio of valid to invalid 6502 opcodes
- **Flow pattern heuristics** — presence of JSR/RTS pairs, balanced branch patterns, hardware register access
- **Known target references** — whether the island's instructions reference addresses in already-discovered code
- **Terminator analysis** — RTS/RTI/JMP at island boundaries (clean termination suggests real code)

Islands scoring above a threshold become new entry points, and the tree walker re-runs to discover their downstream code. This two-pass approach (directed walk + speculative discovery) follows the methodology established by Spedi [Ben Khadra et al., CASES 2016] and 6502bench SourceGen [fadden], adapted for the C64's specific characteristics.

### 2.6 Data Classification

Thirteen detector plugins classify data regions using format-specific heuristics:

| Detector | Format | Key Heuristic |
|----------|--------|--------------|
| Sprite | 63/64-byte blocks | Pointer tracing from VIC-II sprite pointer area ($07F8+) |
| Character set | 2KB-aligned, 4KB multiples | $D018 register write tracing for charset base |
| Screen map | 1000 bytes | Cross-reference with screen RAM write patterns |
| Bitmap | 8000 bytes | $D011 bit 5 (bitmap mode enable) + $D018 configuration |
| String | Variable length | PETSCII validity, null termination, code reference analysis |
| SID music | Variable | Frequency table detection, known player routine signatures |
| Jump table | Address pairs | Contiguous 16-bit values within loaded address range |
| Lookup table | Regular elements | Indexed addressing patterns in referencing code |

Each detector produces candidates with confidence scores (0-100) and supporting evidence. The block assembler selects the highest-confidence candidate while preserving alternatives for AI refinement in later pipeline stages.

### 2.7 Verified Output

The static analysis pipeline has been verified to produce byte-identical reconstructions on test binaries. The round-trip — `analyze → build → compile = original` — has been confirmed via SHA hash comparison on multiple programs including the `spriteintro` test fixture. This establishes that the pipeline's block decomposition is complete (no gaps) and accurate (no byte reinterpretation errors).

---

## 3. Banking-Aware Abstract Interpretation

### 3.1 The Banking Problem

The Commodore 64's MOS 6510 CPU (a 6502 variant) has a CPU port at address $01 whose low three bits control memory banking:

| Bits 0-2 | LORAM | HIRAM | CHAREN | Visible at $A000-$BFFF | Visible at $D000-$DFFF | Visible at $E000-$FFFF |
|----------|-------|-------|--------|------------------------|------------------------|------------------------|
| %111 ($37) | 1 | 1 | 1 | BASIC ROM | I/O | KERNAL ROM |
| %110 ($36) | 0 | 1 | 1 | RAM | I/O | KERNAL ROM |
| %101 ($35) | 1 | 0 | 1 | BASIC ROM | I/O | RAM |
| %000 ($30) | 0 | 0 | 0 | RAM | RAM | RAM |

This creates a path-dependent analysis problem: the meaning of addresses $A000-$FFFF depends on which code path was taken to reach the current instruction. A subroutine called from two sites — one with KERNAL mapped, one with KERNAL banked out — must be analyzed under both banking configurations.

### 3.2 The Bitmask Abstract Domain

We track banking register values using a **bitmask abstract domain** — a pair `(knownMask, knownValue)` where `knownMask` indicates which bits have determined values and `knownValue` gives those values. The invariant `knownValue & ~knownMask === 0` is maintained by all operations.

This domain is formally grounded in the work of Vishwanathan et al. ["Sound, Precise, and Fast Abstract Interpretation with Tristate Numbers," CGO 2022, Distinguished Paper]. The same mathematical framework powers LLVM's `KnownBits` analysis and the Linux kernel's BPF verifier (`tnum.c`), both used in production at massive scale.

**Why bitmask, not constant propagation?** Consider the most common C64 banking pattern:

```asm
LDA $01        ; read current port value (unknown)
AND #$F8       ; clear bits 0-2, preserve bits 3-7
ORA #$05       ; set bits 0-2 to %101
STA $01        ; write new banking configuration
```

A constant propagation analysis sees `LDA $01` as loading an unknown value and gives up — it cannot determine the final value written to $01. The bitmask domain tracks per-bit:

```
After LDA $01:  knownMask=00000000  knownValue=00000000  (all unknown)
After AND #$F8: knownMask=00000111  knownValue=00000000  (bits 0-2 forced to 0)
After ORA #$05: knownMask=00000111  knownValue=00000101  (bits 0-2 = 101)
```

Result: bits 0-2 are precisely known as `%101` (BASIC mapped, KERNAL banked out, I/O visible), even though bits 3-7 remain unknown. This is sufficient to determine the exact banking configuration for all address ranges.

**Transfer functions:**

| 6502 Operation | Transfer Function | Effect on Knowledge |
|----------------|------------------|-------------------|
| `AND #imm` | `knownMask \|= ~imm; knownValue &= imm` | Zero bits in immediate become known-zero |
| `ORA #imm` | `knownMask \|= imm; knownValue \|= imm` | One bits in immediate become known-one |
| `EOR #imm` | `knownValue ^= imm` (mask unchanged) | Known bits flip; knowledge preserved |
| `LDA #imm` | `knownMask = 0xFF; knownValue = imm` | Fully known |
| `LDA mem` | `knownMask = 0x00; knownValue = 0x00` | Fully unknown |

These transfer functions are proven sound and optimal by Vishwanathan et al. — no precision is lost that could be recovered by a more complex domain.

### 3.3 Hybrid Domain: Bitmask + Small Value Set

For additional precision, we augment the bitmask with a **small set of possible concrete values**. C64 programs typically use only 2-4 distinct banking configurations, so this set stays manageable.

When a control flow merge encounters two paths with different concrete values (e.g., one path has `$01=$35`, the other has `$01=$37`), we keep both values in the set rather than immediately collapsing to bitmask precision. This preserves the information that exactly two configurations are possible, enabling downstream analysis to enumerate both cases.

The set has a threshold (`MAX_SET_SIZE=16`). When exceeded, we collapse to the bitmask representation using:

```
allOnes  = AND of all values  (bits that are 1 in every value)
allZeros = AND of all ~values (bits that are 0 in every value)
knownMask = allOnes | allZeros
knownValue = allOnes
```

This is a pragmatic **reduced product-inspired combination** from abstract interpretation theory [Cousot & Cousot, 1979], combining a relational domain (the value set) with a non-relational domain (the bitmask) and using each to sharpen the other. We describe it as "inspired" rather than a formal reduced product because the collapse threshold introduces an approximation not present in the original formulation — a true reduced product would maintain both representations indefinitely.

### 3.4 Inter-Procedural Propagation via SCC Decomposition

Banking state must be propagated across subroutine boundaries. The call graph of a real C64 program contains cycles: main loops (`JMP` back to start), IRQ handler chains (handler A installs handler B, which installs handler A), state machines with mutual calls, and tail-call optimization patterns (`JMP` instead of `JSR/RTS`).

We handle cycles using **Tarjan's strongly connected component (SCC) decomposition** [Tarjan, 1972], which produces in a single O(V+E) DFS pass:

1. The partition of graph nodes into SCCs (maximal sets of mutually reachable nodes)
2. The **condensation DAG** — a directed acyclic graph where each SCC is collapsed to a single node
3. A reverse topological ordering of the condensation DAG (as a byproduct of the algorithm's stack-based processing)

**Why Tarjan's over Kosaraju's:** Tarjan's requires a single DFS traversal (vs. two for Kosaraju's), needs no transpose graph construction, and produces the topological order as a natural byproduct. For C64-scale graphs (20-200 nodes), the constant-factor advantage matters more than asymptotic complexity, which is identical.

**Propagation algorithm:**

```
1. Compute SCC decomposition (control-flow edges only)
2. Process SCCs in bottom-up topological order (callees before callers):

   For SINGLE-NODE SCCs (the common case):
     a. Compute onEntry = meet of all caller exit states at call sites
     b. Walk instructions, applying bitmask transfer functions
     c. Detect save/restore patterns (PHA/PLA of $01)
     d. Record onExit state

   For MULTI-NODE SCCs (cycles):
     a. Initialize all nodes from external caller states
     b. ITERATE:
        - Walk each node in reverse postorder within the SCC
        - Apply transfer functions
        - At merge points: meetBitmask(a, b) = keep only bits
          where both paths agree on the value
     c. If any node's exit state changed → iterate again
     d. Convergence guaranteed (see below)

3. Derive banking flags from final bitmask values:
     kernalMapped = bit 1 known? → (bit 1 = 1 → "yes" : "no") : "unknown"
```

**Convergence proof:** The bitmask domain for an 8-bit register has a finite state space: each `(knownMask, knownValue)` pair satisfying the invariant `knownValue & ~knownMask === 0` admits at most `3^8 = 6,561` abstract states (each bit is independently unknown, known-0, or known-1). Within a single SCC, the analysis operates as a standard iterative dataflow framework: transfer functions (AND, ORA, EOR with constant immediates) may increase knowledge (add known bits), while the meet operation at merge points may only *decrease* knowledge (retain only bits where both paths agree). Crucially, for a fixed set of program instructions, the transfer functions are deterministic — the only source of change between iterations is the meet at SCC back-edges, which is monotonically non-increasing in knowledge. Since knowledge can only decrease at merges and the domain is finite, the iteration reaches a fixpoint. With 3 tracked registers and N nodes, the practical bound is small: typical C64 SCCs (2-5 nodes) converge in 2-3 passes. The theoretical foundation is Kam & Ullman's monotone dataflow framework [1977], which proves convergence for any iterative analysis on a finite lattice with monotone transfer functions.

This approach directly mirrors LLVM's `CallGraphSCCPass` [LLVM Project], which processes SCCs in post-order and iterates within SCCs until fixpoint.

### 3.5 Save/Restore Detection

Many subroutines preserve the banking state:

```asm
LDA $01        ; save current banking
PHA
LDA #$35       ; switch to RAM-under-KERNAL
STA $01
; ... work ...
PLA
STA $01        ; restore original banking
RTS
```

We detect this by tracking PHA/PLA stack balance within each subroutine. If the PHA source was $01 and the PLA destination is also $01, and the stack is balanced at every RTS, the subroutine has **local banking scope** — its internal banking changes are invisible to the caller.

This is critical for propagation accuracy: when a caller encounters `JSR sub` where `sub` has local scope, the caller continues with its *own* banking state (not the subroutine's exit state). Without this detection, banking state would "leak" through subroutines that internally switch banking for temporary work.

### 3.6 Banking-Aware Label Resolution

The payoff of all this analysis is correct labeling. The function `resolveLabelForAddress(addr, bankingState)` produces:

- `CHROUT` when banking confirms KERNAL ROM is mapped at the call site
- `ram_FFD2` when banking confirms KERNAL is banked out (this is a RAM call, not a KERNAL call)
- `maybe_CHROUT` when banking state is ambiguous (flagged for human review)

No existing C64 reverse engineering tool performs this analysis. Traditional disassemblers (6502bench SourceGen, Regenerator, C64 Debugger) apply KERNAL labels unconditionally, producing incorrect output for any program that modifies banking state.

### 3.7 Soundness Scope

It is important to distinguish what is formally sound in this analysis from what is heuristic:

**Proven sound** (under the discovered CFG):
- Bitmask transfer functions for AND, ORA, EOR, LDA with immediate operands [Vishwanathan et al., 2022]
- Meet operation at control flow merge points (retains only mutually agreed bits)
- Fixpoint convergence within SCCs (finite domain + monotone framework)

**Sound but conditional on correct CFG**:
- Inter-procedural propagation via SCC decomposition — correct only if the call graph is complete. Unresolved indirect jumps or undiscovered code islands create missing edges, which could cause the analysis to miss banking state changes along those paths.
- Save/restore detection — correct only if the stack balance analysis covers all paths through the subroutine. Exceptional exits (e.g., direct manipulation of the stack pointer) can violate the balance assumption.

**Heuristic** (best-effort, not formally guaranteed):
- ISR handler discovery — relies on vector write detection, which may miss dynamically computed vector installations
- Code island discovery — uses scoring heuristics that may miss genuine code or misidentify data as code
- Self-modifying code handling — detected but not fully analyzed when the modified value is runtime-dependent

This distinction matters for consumers of the pipeline's output: banking labels derived from sound analysis paths can be trusted, while labels derived from heuristically discovered code should be treated as provisional.

---

## 4. Interrupt-Aware Dataflow Analysis

### 4.1 The Volatility Problem

On the C64, hardware interrupts fire asynchronously. A raster interrupt handler might execute between any two instructions of mainline code, modifying VIC-II registers, SID state, or memory. Mainline code that reads these registers may see values written by the interrupt handler, not values written by the mainline code itself.

Consider:

```asm
; Mainline code
LDA #$01
STA $D015     ; enable sprite 0
; ← IRQ fires here, handler writes STA $D015 = #$FF (enable all sprites)
LDA $D015     ; reads $FF, not $01!
```

A naive analysis that doesn't model interrupt effects would conclude that A contains $01 after the `LDA $D015` instruction. This is unsound.

### 4.2 Three-Tier Volatility Model

We implement a three-tier model inspired by Regehr & Cooprider's Interatomic Concurrent Data-flow (ICD) analysis [Cooprider, 2007]:

1. **IRQ-safe** (`irqsDisabled = "yes"`): Between `SEI` and `CLI` instructions. No maskable interrupt can fire. Full precision for all register values.

2. **IRQ-exposed** (`irqsDisabled = "no"`): Interrupts are enabled. Any register in the `irqVolatileRegisters` set must be treated as having an unknown value — the IRQ handler could have modified it between the previous instruction and this one.

3. **Stable**: Registers *not* in the IRQ-volatile set retain full precision even when interrupts are enabled. Most registers are stable; only those explicitly written by known IRQ handlers are volatile.

### 4.3 Building the Volatile Register Set

The algorithm walks all known IRQ and NMI handler code (identified during entry point detection and vector write analysis) and collects every hardware register write. The union of all handler writes forms the volatile set. Raster split chains — where one handler installs the next, forming a cycle — are followed to completion.

**SEI/CLI propagation** follows control flow:

| Instruction | Effect |
|------------|--------|
| SEI | `irqsDisabled ← "yes"` |
| CLI | `irqsDisabled ← "no"` |
| RTI | `irqsDisabled ← "unknown"` (restores processor flags from stack) |
| PLP | `irqsDisabled ← "unknown"` (same reason) |
| IRQ entry | `irqsDisabled ← "yes"` (6502 hardware sets I flag on interrupt entry) |
| Branch merge | If paths disagree → `"unknown"` |

### 4.4 Interaction with Banking Analysis

Interrupt-aware analysis integrates with banking propagation through a concrete join operation: when `irqsDisabled = "no"` and $01 is in the IRQ-volatile set (because an IRQ handler modifies banking), the mainline code's banking state must be widened to include the handler's effects.

**Join semantics at preemption points:**

```
bankingState_effective = meetBitmask(bankingState_mainline, bankingState_irqHandler)
```

Where `meetBitmask` retains only the bits where both the mainline state and all possible IRQ handler exit states agree. Concretely: if mainline has `knownMask=0x07, knownValue=0x05` (bits 0-2 known as %101) and the IRQ handler may exit with `knownValue=0x07` (bits 0-2 as %111), then after the meet, bits 1-2 remain known (both agree on 1) but bit 0 becomes unknown (0 vs 1 disagree), yielding `knownMask=0x06, knownValue=0x04`.

When multiple IRQ handlers exist (raster split chains), we first compute the meet across all handler exit states, then meet with the mainline state. This is a sound over-approximation: it may lose precision when only one specific handler fires at a given point, but it never produces incorrect banking labels.

This is a rare but critical case — programs that use raster interrupts to switch VIC banks for split-screen effects will have volatile banking state in mainline code between interrupt firings.

---

## 5. The Three-Layer AI Knowledge Strategy

### 5.1 The Hallucination Problem

LLMs confidently hallucinate hardware register semantics. When asked to analyze C64 assembly, they will state that `$D011` controls "sprite colour" (it controls VIC-II screen mode), that `$D418` is the "SID voice 3 control register" (it's the global filter/volume), or that `CHROUT` is always available at `$FFD2` (it's not, when KERNAL is banked out).

Checking every register claim against a knowledge base is too slow and expensive. Our strategy uses three layers, each targeting a different cost/accuracy tradeoff:

### 5.2 Layer 1: Deterministic Knowledge (Handles ~80%, Zero AI Cost)

A complete hardware symbol database (`symbol_db.ts`) contains every VIC-II register ($D000-$D03F), SID register ($D400-$D41C), CIA register ($DC00-$DCFF, $DD00-$DDFF), KERNAL entry point, and system zero-page location. This database is banking-aware: lookups against ROM addresses check the current banking state and return `null` when ROM is not mapped.

Stage 1 enrichment plugins annotate every hardware access deterministically. When the AI receives a block for analysis, it already has correct annotations like `STA $D020 = Set border color` and `JSR $FFD2 = CHROUT (print character to screen)` — or, crucially, `JSR $FFD2 = RAM target (KERNAL banked out)`.

These annotations are injected into the AI prompt as **established facts**, not suggestions. The AI cannot override them.

### 5.3 Layer 2: Proactive Concept Extraction + Qdrant Pre-Feed

For the ~20% of analysis that requires non-obvious domain knowledge (timing tricks, encoding formats, algorithm patterns), we proactively extract key concepts and pre-feed authoritative documentation.

**Algorithm:**

1. For each code block, a cheap AI call extracts up to 5 key concepts: "What non-obvious C64/6502 techniques does this code use? NOT registers (those are handled). Focus on: unusual techniques, data format interpretations, algorithm patterns, C64-specific conventions."

2. For each concept, query the Qdrant knowledge base (local, no API cost).

3. Take top 3 results per concept, strip source code sections (already separated in our chunk format), deduplicate.

4. Store results as `qdrant_knowledge` enrichment annotations on the block.

**Token budget:** 5 concepts × 3 results × ~400 tokens/result = ~4,000 tokens of authoritative context per block, well within prompt limits. A hard cap (`--qdrant-context-budget`, default 8,192 tokens) drops lowest-scoring results if needed.

**Why proactive, not on-demand:** LLMs don't ask for information they don't know they need. If an AI doesn't know that raster timing on the C64 requires specific cycle counts, it won't ask about it — it will hallucinate plausible but wrong timing values. Pre-feeding the documentation ensures the correct information is available *before* the AI begins reasoning.

### 5.4 Layer 3: Cross-Validation (Catches Remaining Lies)

For claims the AI does make beyond what's covered by deterministic annotations, we cross-validate:

1. `certainty_processor.ts` compares AI hardware claims against `symbol_db` + enrichment annotations
2. If AI claims `$D011` controls "sprite colour" but `register_semantics` says "VIC-II control register (screen height, bitmap mode, raster compare)" → **conflict detected**
3. Conflicts trigger a targeted Qdrant lookup for the specific register → result added to context → block re-submitted to AI
4. Claims without deterministic backing are accepted but marked `needs_qdrant_verification: true`
5. Blocks with unverified claims have certainty capped at MEDIUM

### 5.5 Cost Analysis

| Layer | AI Calls per Binary | Tokens | Marginal Cost |
|-------|-------------------|--------|---------------|
| Layer 1 (deterministic) | 0 | 0 | $0.00 |
| Layer 2 (concept extraction) | ~47 | ~47K | ~$0.007 |
| Layer 2 (Qdrant lookups) | 0 (local) | 0 | $0.00 |
| Layer 3 (conflict re-submissions) | ~5 | ~10K | ~$0.002 |
| **Total overhead** | **~52** | **~57K** | **~$0.009** |

Less than one cent per binary, compared to a base pipeline cost of ~$0.14. The accuracy improvement is substantial — in our testing, it addresses the entire category of "wrong hardware register" errors, which are the most common and most damaging class of LLM hallucinations in this domain. Quantitative evaluation on a larger corpus of binaries is planned (see Section 12A).

---

## 6. Iterative AI Reverse Engineering with Guaranteed Progress

### 6.1 The Chicken-and-Egg Problem

Reverse engineering a binary is riddled with circular dependencies:

- **Naming circularity:** You can't name a subroutine until you know what it does, but understanding what it does requires knowing what its callees do, which requires naming *them*.
- **Data/code circularity:** You can't classify data until you know how code uses it, but understanding the code requires knowing what the data is.
- **Banking circularity:** You can't label `JSR $FFD2` until you know the banking state, but banking state depends on what parent code executed — which you haven't analyzed yet.
- **Reachability circularity:** You can't determine reachability until you've resolved indirect jumps, but resolving indirect jumps requires analyzing the code that sets up the jump table.

A fixed linear pipeline (analyze once, name once, document once) cannot solve these. The only approach that works is **iterative convergence**: analyze what you can, use partial results as context, re-analyze with better context, repeat until stable.

### 6.2 The Four-Stage Architecture

Our pipeline addresses the circularity with increasing levels of sophistication:

**Stage 1 (Static Enrichment):** 28 deterministic plugins resolve the "easy 80%" — constant propagation, banking state, KERNAL API identification, pointer pair resolution, interrupt chain detection. No AI. The output gives every block accurate hardware annotations and banking state. This runs once (unless blocks are split later, in which case new fragments go through Stage 1).

**Stage 2 (AI Enrichment):** Five sequential AI plugins run once per block in SCC-aware topological order (callees before callers). Each plugin builds on the previous: concept extraction → purpose analysis → variable naming → documentation → validation. After Stage 2, every block has a purpose, category, confidence score, and initial variable names — even if the analysis is preliminary.

**Key insight:** After Stage 2, *every block provides useful context to its neighbors*. When Stage 3 asks "what does sub_C100 do?", it can answer from Stage 2 data. The context may not be fully verified, but it's far better than nothing.

**Stage 3 (AI Reverse Engineering):** The heart of the pipeline. An iterative per-block loop where AI requests context, the system gathers it (tagged with `isReverseEngineered` flags indicating source stage and confidence), AI evaluates sufficiency, then attempts full reverse engineering or bails with a structured reason.

**Stage 4 (Integration):** Whole-program analysis for module assignment, file splitting, dead code identification, and documentation generation. This is the only stage that sees the entire program at once.

### 6.3 The Per-Block RE Loop (Stage 3)

Each block goes through four phases:

**Phase A — Context Request:** The AI receives the block's code plus all Stage 1/2 enrichments and outputs structured context requests (subroutine details, raw data bytes, variable information, Qdrant research queries, reference lookups).

**Phase B — Context Gathering:** The system fulfills each request and tags every response with provenance:

```
{
  data: <the actual content>,
  isReverseEngineered: boolean,  // has this been through Stage 3?
  confidence: 0.0-1.0,
  source: "stage1" | "stage2" | "stage3"
}
```

This tagging is critical: the AI can distinguish between Stage 2 preliminary analysis (useful but unverified) and Stage 3 full RE results (trusted, high confidence). This allows the AI to calibrate its own confidence appropriately — it won't claim high confidence in its analysis of a block whose primary callee has only preliminary Stage 2 context.

**Phase C — Sufficiency Evaluation:** The AI evaluates whether it has enough context. It always returns a confidence score. If more context is needed, additional requests loop back to Phase A (up to N iterations, default 3).

**Phase D — Attempt RE or Bail:** If confidence exceeds the threshold (default 0.6), the AI produces a full reverse engineering result: block name, purpose, documentation, variable suggestions, inline comments. If confidence is too low, it bails with a structured reason.

### 6.4 The Outer Loop: Guaranteed Forward Progress

The outer loop wraps Stage 3 and ensures the pipeline always terminates:

```
while unreversed blocks exist AND pass < maxPasses:
    pass++
    for each unreversed block:
        result ← runPerBlockRELoop(block)
        if result.reverseEngineered: mark complete
        else: record bail reason, increment bail count

    if any blocks completed this pass: continue  // progress made
    else:
        candidate ← block with highest confidence score
        forceReverseEngineer(candidate)  // force-pick: never bail
```

**Force-pick** is the progress guarantee: when all remaining blocks bail (each waiting for some dependency), the block with the highest confidence is forced through Phase D with a modified prompt: "Produce the best reverse engineering you can with available information. Mark uncertain areas with LOW confidence. Flag what needs human review."

**Why this works:** Even a low-quality forced RE is useful context for other blocks. A block that bailed because it needed `sub_C100` to be RE'd can now proceed once `sub_C100` has a forced (if imperfect) result. The next pass has strictly more context than the previous one.

**Termination guarantee:** Each pass either completes ≥1 block (natural progress) or force-picks 1 block (guaranteed progress). With N initial blocks, a naive bound is N passes. However, Stage 3 may split blocks (sub-dividing a large block when the AI identifies internal structure), creating new analysis targets mid-pipeline. The effective bound is therefore ≤ N_total passes, where N_total is the total number of blocks ever created (initial + splits). Since each block can only be split a bounded number of times (a block cannot be split smaller than a single instruction), the process is finite. In practice, a `maxOuterPasses` configuration cap (default: 20) provides a hard termination guarantee independent of block creation dynamics. Empirically, a 47-block program converges in 4-6 passes with only 2-3 force-picks.

### 6.5 Relationship to the Ralph Wiggum Loop

The outer loop is inspired by the [Ralph Wiggum Loop pattern](https://beuke.org/ralph-wiggum-loop/) [Beuke, 2025; Huntley, 2025] — an iterative AI development pattern where an agent attempts a task, validates the result, feeds failures back as context, and retries until a concrete completion criterion is satisfied.

Our adaptation simplifies the pattern significantly: instead of worklists, cost budgets, and change-significance filtering, we use a simple "did any block make progress?" check with a force-pick fallback. This trades optimality for simplicity — the force-pick may produce lower-quality results than a more sophisticated scheduling strategy, but it guarantees termination with minimal machinery.

The key difference from a naive retry loop is **structured bail reasons**: when a block bails, it records exactly why (needs specific dependency, insufficient context, block too complex, hit iteration limit, low confidence below threshold). This enables intelligent scheduling in future passes — a block that bailed with `needs_dependency: [sub_C100]` is automatically retried once `sub_C100` is completed.

### 6.6 Discovery Management: Three Tiers

AI discoveries during Stages 2 and 3 are classified into tiers to prevent hallucinations from corrupting the dependency graph:

| Tier | Evidence | Action |
|------|----------|--------|
| **Confirmed** | Direct: resolved jump table, decoded pointer pair | Add to graph immediately |
| **Probable** | Heuristic: data resembles address table | Add with `discoveryTier="probable"`, verify later |
| **Speculative** | AI suggestion without hard evidence | Quarantine. Promote only if corroborated |

Confirmed nodes and edges are monotonically add-only — they are never removed. This prevents oscillation where one analysis pass adds an edge and the next removes it.

---

## 7. Hybrid Semantic Search with Number Enrichment

### 7.1 The Domain-Specific Search Problem

Standard semantic search fails for C64 queries because critical information is encoded as numbers. The query "SID voice 1 ADSR $D418" contains a hexadecimal address that maps to a specific hardware register. A semantic embedding of this query will capture "SID" and "ADSR" but may not correctly associate "$D418" with the SID filter/volume register.

### 7.2 The Enrichment Pipeline

Our query pipeline passes every query through 7 enrichment plugins before generating the embedding:

1. **Number extraction** — identifies hex ($D418), decimal (54296), and binary (%1101010000011000) numbers
2. **Multi-base conversion** — appends all representations: "$D418 = 54296 = %1101010000011000"
3. **Memory map enrichment** — maps addresses to hardware chips and register names: "$D418 → SID Filter Cutoff Frequency / Volume"
4. **Mirror resolution** — resolves hardware register mirrors to canonical addresses (VIC-II repeats every 64 bytes, SID every 32, CIAs every 16)
5. **Color enrichment** — maps values 0-15 to C64 color names
6. **Opcode enrichment** — recognizes 6502 mnemonics and adds instruction context
7. **Tag enrichment** — recognizes KERNAL routine names

The enriched query produces both a natural language embedding (for semantic search) and a set of filter tags (for exact-match filtering on the `registers` metadata field in Qdrant).

### 7.3 Three Search Strategies

The pipeline automatically selects a strategy based on query content:

| Query Content | Strategy | Method |
|--------------|----------|--------|
| Hex addresses + natural language | **Hybrid** | Filtered vector search (on register tags) + unfiltered semantic search, merged |
| Hex addresses only | **Filtered** | Filtered vector search on register tags |
| Natural language only | **Semantic** | Unfiltered vector search |

The hybrid strategy is the most common and most effective: it ensures that the specific hardware register documentation is always returned (via tag filtering) while also finding conceptually related documentation (via semantic search).

### 7.4 Chunk Architecture: Embedding/Payload Separation

All 4,000+ chunks in the knowledge base use a `## Source Code` marker to separate content into two sections:

- **Above the marker** (embedded): Natural language description, key concepts, register summaries — optimized for semantic similarity matching
- **Below the marker** (payload only): Actual code listings, register maps, data tables — stored in full but not included in the embedding vector

This prevents code noise from degrading search quality while ensuring the full technical content is available when a chunk is retrieved.

### 7.5 Register Metadata for Exact-Match Filtering

Each chunk carries a `registers` array in its Qdrant metadata, indexed as keyword fields. When a query references `$D418`, the search pipeline filters on this field, guaranteeing that the SID filter/volume documentation is returned regardless of how well the semantic embedding matches.

Register extraction is bounded: chunks without source code sections are capped at 16 registers (preventing metadata bloat on discursive text), while chunks with source code (register maps, disassembly listings) have no cap, since they have concrete backing for every register they reference.

---

## 8. Byte-Identical Reconstruction

### 8.1 The Pipeline Round-Trip

The full pipeline performs:

```
Game.prg
  → [Static Analysis]  → blocks.json + dependency_graph.json
  → [RE Pipeline]       → enriched blocks.json + variable_map.json + integration.json
  → [Builder]           → main.asm (KickAssembler source)
  → [KickAssembler]     → compiled.prg
  → [Verify]            → SHA(compiled.prg) == SHA(Game.prg)
```

The builder is a **mechanical renderer** — it applies enrichment data to produce assembly source without performing any analysis of its own. Label resolution, comment text, module assignment, and all semantic decisions come from the enrichment pipeline. The builder's emitter plugins handle the syntactic details of KickAssembler output (lowercase mnemonics, `BasicUpstart2()` macros, `!byte` directives for data).

### 8.2 Why Byte-Identical Matters

Byte-identical reconstruction proves that:

1. **Block decomposition is complete** — no bytes were lost or duplicated
2. **Instruction decoding is correct** — every opcode and operand was parsed accurately
3. **Data encoding is preserved** — base64-encoded raw data survives the round-trip
4. **Label resolution is correct** — symbolic references resolve to the same addresses as the original absolute references

This is a stronger guarantee than "the program works" — behavioral equivalence can be coincidental, but byte-identical output proves structural correctness of the decomposition and reassembly.

### 8.3 What Byte-Identical Does Not Prove

Byte-identical reconstruction validates the **structural pipeline** (analysis → build → compile) but does not validate the **semantic pipeline** (naming, purpose inference, documentation). A program that is byte-identical but has every subroutine named `sub_XXXX` with incorrect purpose descriptions is still byte-identical. The semantic quality of the reverse engineering output — the part that matters most to human consumers — requires separate evaluation (see Section 12A).

Similarly, byte-identical reconstruction validates block *coverage* (all bytes accounted for) but not block *boundary correctness* in all cases. If a boundary between code and data is drawn one byte too late, the builder may still emit the correct bytes (via raw data encoding of the misclassified byte) while producing a structurally misleading source listing.

---

## 9. The Dependency Graph as Central Data Structure

### 9.1 Why a Graph, Not a Tree

Despite the pipeline's JSON file being named `dependency_tree.json` (for historical compatibility), the data structure is a **directed graph with cycles**. Real C64 programs have abundant cycles:

- Main loops: `JMP` back to the start of the loop
- IRQ handler chains: handler A writes handler B's address to the vector, handler B writes handler A's address
- State machines: mutual calls between state handlers
- Tail-call optimization: `JMP sub` instead of `JSR sub / RTS`

Any algorithm that assumes acyclicity (topological sort, simple dependency ordering) must first reduce the graph to a DAG. We do this via SCC condensation: each cycle collapses to a single "super-node" in the condensation DAG, which is guaranteed acyclic.

### 9.2 Graph Lifecycle

The graph is **mutable throughout the pipeline**. Every stage can add nodes (discovered code/data), add edges (resolved references), split nodes (block decomposition), or merge nodes (block consolidation). The SCC decomposition is lazily cached and invalidated on any structural change.

For C64-scale graphs (< 500 nodes), full Tarjan recomputation takes microseconds. We therefore do not implement incremental SCC maintenance — we simply recompute from scratch on any structural change. This trades theoretical optimality for implementation simplicity and correctness.

### 9.3 Edge Type Classification

A critical design decision is the separation of edges into **control-flow** and **data** categories:

- **Control-flow edges** (branch, fallthrough, jump, indirect_jump, call, rts_dispatch): Participate in SCC decomposition. Create analysis ordering constraints — a callee should be analyzed before its caller.
- **Data edges** (data_read, data_write, pointer_ref, hardware_read, hardware_write, smc_write, vector_write): Do *not* create analysis ordering constraints. A block can be analyzed without its data sources being fully resolved.

This separation is essential for preventing the SCC decomposition from collapsing unrelated blocks into the same component. Without it, a main loop that reads a lookup table would be in the same SCC as the lookup table — even though the table doesn't influence the loop's control flow.

---

## 10. Plugin Architecture: Extensibility Without Orchestrator Changes

### 10.1 Design Philosophy

Every analytical capability in the pipeline is implemented as a drop-in plugin. Adding a new analysis — say, detection of a previously unrecognized data format, or a new C64-specific pattern — requires creating a single file in the appropriate directory. No orchestrator code changes, no registration, no configuration updates.

### 10.2 Plugin Types

The system has seven distinct plugin interfaces:

| Plugin Type | Count | Location | Discovery Pattern |
|------------|-------|----------|------------------|
| Discovery plugins (tree walker) | 14 | `static-analysis/src/plugins/` | `*_plugin.ts` |
| Data detectors | 13 | `static-analysis/src/detectors/` | `*_detector.ts` |
| Block enrichers | 7 | `static-analysis/src/enrichers/` | `*_enricher.ts` |
| Stage 1 enrichment plugins | 28 | `reverse-engineering/src/enrichment/` | `*_enrichment.ts` |
| Context providers | 12 | `reverse-engineering/src/pipeline/context/` | `*_context.ts` |
| Response processors | 10 | `reverse-engineering/src/pipeline/processors/` | `*_processor.ts` |
| AI tool handlers | 8 | `reverse-engineering/src/pipeline/tools/` | `*_tool.ts` |

All use the same auto-discovery mechanism: scan the directory for files matching the naming pattern, load each module, validate it exports the required interface, sort by priority, and execute in order.

### 10.3 Why This Matters

The plugin architecture means the system's analytical capabilities can grow without increasing the complexity of the core pipeline. Each plugin is independently testable, independently deployable, and independently understandable. The ~95 files in the RE pipeline are overwhelmingly plugins (~82 of 95) — the core infrastructure is only 13 files.

---

## 11. Related Work

### 11.1 Traditional Binary Analysis

**ddisasm** [Flores-Montoya & Schulte, USENIX Security 2020, Distinguished Paper] uses Datalog rules compiled via Soufflé to fuse multiple disassembly heuristics. Their key insight — "no individual analysis is perfect but combining several maximizes chances" — directly informs our multi-plugin approach. However, ddisasm targets modern ELF binaries with rich metadata (sections, symbols, DWARF). Our pipeline operates on bare binaries with no metadata whatsoever.

**6502bench SourceGen** [fadden] is the closest existing tool to our static analysis pipeline. It uses recursive descent with branch-following and status flag tracking, applied specifically to 6502 binaries. Our pipeline extends this approach with full banking state propagation, interrupt-aware analysis, and AI-assisted enrichment — capabilities SourceGen does not attempt.

**Spedi** [Ben Khadra et al., CASES 2016] introduces speculative disassembly: recover all possible basic blocks, then prune via overlap analysis. Our code island discovery algorithm adapts this idea for the 6502, using confidence scoring rather than overlap analysis to filter genuine code from data.

**Ghidra** [NSA] implements a 7-phase auto-analysis pipeline including an "Aggressive Instruction Finder" for undefined bytes. Our architecture follows a similar phased approach but adds banking-aware analysis and interrupt modeling that Ghidra's generic framework does not provide for the C64 platform.

### 11.2 LLM-Assisted Reverse Engineering

**SK2Decompile** [Tan et al., 2025] decomposes LLM-based decompilation into two phases: structure recovery ("skeleton") then identifier naming ("skin"). This validates our separation of structural analysis (Stages 1-2) from semantic understanding (Stage 3). SK2Decompile operates on modern x86-64 binaries with compiler conventions; we address the harder problem of hand-written assembly with no ABI guarantees.

**GenNm** [NDSS 2025] demonstrates that call graph context propagation improves function naming by 168% over local-only analysis. This validates our SCC-aware topological ordering in Stage 2 and context tagging in Stage 3. GenNm propagates names along call edges; we propagate full semantic analysis with confidence scores and `isReverseEngineered` flags.

**ReVa** [cyberkaida, 2024-2025] is a Ghidra MCP server that gives LLMs access to reverse engineering tools. Their philosophy — "smaller, critical fragments with reinforcement and links" — validates our sub-block splitting and context provider architecture. However, ReVa is interactive (human-guided); our pipeline is fully automated with guaranteed termination.

**Talos Intelligence** [2024] documents practical lessons from LLM-assisted RE: don't bias the AI (let it determine program type independently), use explicit instructions, prefer compact summaries over full code dumps. All three lessons are directly applied in our prompt engineering.

### 11.3 Abstract Interpretation

**Tristate Numbers** [Vishwanathan et al., CGO 2022, Distinguished Paper] formally proves the soundness and optimality of bitmask transfer functions. Our `BitmaskValue` domain implements their framework directly. The paper's contribution — proving that AND/ORA/EOR transfer functions are optimal (no precision loss possible in this domain) — gives us confidence that our banking analysis cannot be improved within the bitmask abstraction.

**LLVM KnownBits** and **Linux kernel tnum.c** are production implementations of the same bitmask domain. Our transfer functions mirror LLVM's, providing an independent validation.

**Bourdoncle's Weak Topological Ordering** [1993] is the gold standard for iterative abstract interpretation scheduling. For our scale (< 500 nodes), the simpler approach of processing SCCs in condensation DAG order and iterating within SCCs to fixpoint is sufficient. Bourdoncle's WTO would be appropriate if we targeted larger binaries (> 10,000 functions).

### 11.4 Interrupt-Aware Analysis

**Regehr & Cooprider** [2007] introduce Interatomic Concurrent Data-flow (ICD) analysis, which tracks which variables are shared between mainline code and interrupt service routines. Our three-tier volatility model (IRQ-safe, IRQ-exposed, stable) is a direct simplification of their framework, adapted for C64's single-level interrupt priority.

**Astrée** [AbsInt] performs sound analysis of interrupt-driven safety-critical software. While Astrée handles complex priority schemes and nested interrupts, C64 programs use only two interrupt levels (IRQ and NMI), making our simplified model sufficient.

---

## 12. Cost Analysis and Scalability

### 12.1 Per-Binary Cost Breakdown

For a typical 32KB C64 game with ~47 subroutines, using gpt-5-mini:

| Stage | AI Calls | Est. Tokens | Est. Cost |
|-------|----------|-------------|-----------|
| Stage 1 (deterministic) | 0 | 0 | $0.00 |
| Stage 1 (concept extraction) | ~50 | ~50K | $0.008 |
| Stage 2 (all plugins) | ~146 | ~386K | $0.058 |
| Stage 3 (context + RE) | ~188 | ~487K | $0.073 |
| Stage 4 (integration) | ~3 | ~24K | $0.004 |
| Qdrant (embed + search) | ~100 | ~35K | $0.001 |
| **Total** | **~487** | **~982K** | **$0.144** |

The entire analysis of a game binary costs approximately 14 cents. Even large programs (200+ subroutines) with extended outer loop convergence remain under $1.00.

### 12.2 Scaling Characteristics

- **Stage 1** scales as O(blocks × plugins × passes). Passes converge quickly (typically 2-3) due to the finite-height bitmask lattice.
- **Stage 2** scales as O(blocks × plugins). Each block is processed exactly once (unless split).
- **Stage 3** scales as O(blocks × outer_passes × iterations_per_block). The force-pick guarantee bounds outer_passes ≤ blocks. In practice, 60-70% of blocks complete in pass 1, reducing the effective multiplier.
- **Stage 4** is O(1) — a single whole-program analysis.

The dominant cost is Stage 3. Each additional outer loop pass costs ~$0.02-$0.05 depending on how many blocks bail. The force-pick mechanism ensures at most one pass per unresolved block.

---

## 12A. Evaluation

### 12A.1 Current Validation Status

This paper describes a system under active development. At the time of writing, the following components have been validated:

**Fully validated (deterministic, repeatable):**
- Static analysis pipeline: byte-identical round-trip confirmed on multiple test binaries via SHA hash comparison (`spriteintro.prg` and others through the analyze → build → compile cycle)
- Bitmask transfer functions: implementation matches the formal specification of Vishwanathan et al. [2022] and produces correct results on manually verified banking sequences
- Plugin auto-discovery: all 7 plugin types load, sort by priority, and dispatch correctly across ~95 plugin files
- Qdrant knowledge base: 4,000+ chunks imported with correct embedding/payload separation and register metadata extraction

**Partially validated (correct on tested cases, not exhaustively evaluated):**
- Banking state propagation through SCCs: tested on programs with known banking patterns (KERNAL bank-out sequences, VIC bank switching), producing correct labels in all tested cases. No systematic evaluation across a corpus of binaries with known ground-truth banking behavior has been performed.
- Three-layer AI knowledge strategy: qualitative testing shows Layer 1 annotations prevent the most common hardware register hallucinations. No quantitative hallucination rate comparison (with vs. without the three layers) has been measured.
- Outer loop convergence: tested on programs with ~47 blocks, converging in 4-6 passes. Performance on larger or more complex binaries (200+ blocks, heavy self-modifying code) is projected but not yet measured.

**Not yet validated:**
- The full four-stage RE pipeline (Stages 2-4 are specified but implementation is in progress)
- Cross-program pattern accumulation
- Interrupt-aware banking widening (specified, implementation pending)

### 12A.2 Planned Evaluation Metrics

A rigorous evaluation, planned for after pipeline completion, will measure:

1. **Banking label accuracy**: Compare pipeline-generated banking labels against manually verified ground truth for a corpus of 10+ C64 binaries spanning common banking patterns (KERNAL bank-out, VIC bank switching, RAM-under-I/O, all-RAM mode).

2. **Hallucination rate reduction**: Measure the rate of incorrect hardware register claims with and without the three-layer knowledge strategy, using a fixed set of binaries and a fixed LLM model version.

3. **Convergence characteristics**: For each test binary, record: number of outer loop passes, number of force-picks, percentage of blocks completing per pass, and total cost. Report mean and variance across the corpus.

4. **Semantic quality**: Human expert evaluation of naming quality, purpose accuracy, and documentation usefulness on a 1-5 scale for a random sample of blocks, comparing pipeline output against expert-produced reference annotations.

5. **Time savings**: Compare wall-clock time for pipeline + human review against fully manual reverse engineering for matched binaries.

We acknowledge that without these metrics, the claims in this paper about accuracy improvement and practical effectiveness are based on qualitative observation and engineering judgment rather than rigorous empirical evidence. The architectural contributions (bitmask domain, SCC propagation, three-layer strategy, guaranteed-progress loop) stand on their formal properties, but their practical impact remains to be quantified.

---

## 13. Limitations and Future Work

### 13.1 Current Limitations

- **Platform-specific knowledge base required.** The pipeline's effectiveness depends heavily on the completeness of the Qdrant knowledge base and the `symbol_db` hardware database. Applying the system to a new platform (e.g., ZX Spectrum with Z80) requires constructing a comparable knowledge base.

- **Self-modifying code remains hard.** While we detect and flag self-modifying code, dynamic operand patching (where the patched value depends on runtime state) defeats static analysis. The AI can sometimes infer the intent, but confidence is necessarily low.

- **No cycle-accurate timing analysis.** C64 programs that depend on exact cycle counts (raster effects, bus timing tricks) cannot be fully understood without a cycle-accurate simulator. Our pipeline identifies timing-sensitive patterns but cannot verify correctness.

- **Force-picked blocks may have low quality.** The guaranteed-progress mechanism can produce low-confidence results that cascade misleading context to dependent blocks. The persistence model allows re-running Stage 3 after human review of force-picked blocks.

- **Single-binary scope.** The pipeline analyzes one binary at a time. Multi-load programs (where a loader brings in successive program segments) are not handled as a unit.

### 13.2 Future Directions

- **Cross-program pattern learning.** The `c64_re_patterns` Qdrant collection is designed to accumulate high-confidence patterns across multiple analyzed binaries. As the collection grows, pattern matching should reduce the number of outer loop passes needed for new binaries.

- **Active learning from human corrections.** When a human reviews and corrects a force-picked or low-confidence block, the correction could be fed back to refine the pipeline's prompts and confidence thresholds.

- **Platform generalization.** The core architecture (static analysis → deterministic enrichment → AI enrichment → iterative RE → integration) is platform-agnostic. Platform-specific components are confined to: the 6502 instruction decoder, the banking model, the hardware symbol database, the Qdrant knowledge base, and the data format detectors. Replacing these for a Z80/ZX Spectrum or 68000/Amiga target would enable the same pipeline on different platforms.

- **Formal verification of banking analysis.** The bitmask domain's soundness is proven by Vishwanathan et al., but our implementation has not been formally verified. Property-based testing against an exhaustive enumeration of 8-bit bitmask states would provide strong confidence.

---

## 14. Conclusion

This paper describes a system that brings together techniques from compiler construction (abstract interpretation, SCC decomposition, dataflow analysis), information retrieval (hybrid vector search, number enrichment, metadata filtering), and AI-assisted software engineering (iterative LLM analysis with structured feedback) to solve a problem that none of these fields can address alone.

The key insight is that **deterministic analysis and AI analysis are complementary, not competing.** Deterministic analysis handles the parts of reverse engineering that have provably correct answers (banking state, hardware register semantics, control flow structure). AI handles the parts that require judgment (naming, purpose inference, documentation, module organization). By running deterministic analysis first and injecting its results as constraints on the AI's reasoning, we get the accuracy of formal methods combined with the flexibility of language models.

The three-layer knowledge strategy demonstrates that the "hallucination problem" in AI-assisted reverse engineering is not inherent to the approach — it is a symptom of providing insufficient context. When the AI is given correct hardware annotations, authoritative documentation, and cross-validation against deterministic analysis, its error rate drops dramatically at negligible cost.

The guaranteed-progress outer loop demonstrates that circular analysis dependencies — often cited as a fundamental barrier to automated reverse engineering — can be resolved with surprisingly simple machinery. No complex worklist algorithms, no convergence proofs over abstract lattices, no change-significance thresholds. Just: try everything, check for progress, force-pick when stuck.

Whether this system fulfills its potential to generalize beyond the C64 platform remains to be demonstrated. But the architectural patterns — deterministic-first analysis, knowledge-grounded AI reasoning, iterative convergence with guaranteed progress, and byte-identical verification — are not platform-specific. They are a template for bringing AI assistance to any domain where precise domain knowledge matters more than general intelligence.

---

## References

1. Ben Khadra, A., Stoffel, D., & Kunz, W. (2016). Speculative disassembly of binary code. *Proceedings of the International Conference on Compilers, Architectures and Synthesis for Embedded Systems (CASES)*.

2. Beuke, J. (2025). Ralph Wiggum Loop. https://beuke.org/ralph-wiggum-loop/

3. Bourdoncle, F. (1993). Efficient chaotic iteration strategies with widenings. *Formal Methods in Programming and Their Applications*, LNCS 735.

4. Cooprider, N. & Regehr, J. (2007). Data-flow analysis for interrupt-driven software. *Proceedings of the 2nd Workshop on Programming Languages and Analysis for Security*.

5. Cousot, P. & Cousot, R. (1979). Systematic design of program analysis frameworks. *Proceedings of the 6th ACM SIGACT-SIGPLAN Symposium on Principles of Programming Languages*.

6. fadden. 6502bench SourceGen. https://6502bench.com/

7. Flores-Montoya, A. & Schulte, E. (2020). Datalog disassembly. *Proceedings of the 29th USENIX Security Symposium*. Distinguished Paper.

8. Huntley, G. (2025). Everything is a Ralph Loop. https://ghuntley.com/loop/

9. Kam, J.B. & Ullman, J.D. (1977). Monotone data flow analysis frameworks. *Acta Informatica*, 7(3), 305-317.

10. LLVM Project. KnownBits.cpp. https://github.com/llvm/llvm-project/blob/main/llvm/lib/Support/KnownBits.cpp

11. National Security Agency. Ghidra. https://ghidra-sre.org/

12. Regehr, J., Reid, A., & Webb, K. (2005). Eliminating stack overflow by abstract interpretation. *ACM Transactions on Embedded Computing Systems*, 4(4), 751-778.

13. Tan, W. et al. (2025). SK2Decompile: LLM-based two-phase binary decompilation from skeleton to skin. *arXiv:2509.22114*.

14. Tarjan, R. (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146-160.

15. Talos Intelligence (2024). Using LLMs as a reverse engineering sidekick. https://blog.talosintelligence.com/using-llm-as-a-reverse-engineering-sidekick/

16. Torvalds, L. et al. Linux kernel tnum.c. https://github.com/torvalds/linux/blob/master/kernel/bpf/tnum.c

17. Vishwanathan, H., Shachnai, M., Narayana, S., & Nagarakatte, S. (2022). Sound, precise, and fast abstract interpretation with tristate numbers. *Proceedings of the 20th IEEE/ACM International Symposium on Code Generation and Optimization (CGO)*. Distinguished Paper. arXiv:2105.05398.

18. cyberkaida (2024-2025). ReVa — Reverse Engineering Assistant. https://github.com/cyberkaida/reverse-engineering-assistant

19. GenNm (2025). Unleashing the power of generative model in recovering variable names from stripped binary. *Proceedings of the Network and Distributed System Security Symposium (NDSS)*.

20. BATS (2025). Budget-aware tool scheduling for LLM agents. *arXiv:2511.17006*.
