# Iterative Dataflow Analysis: Convergence, Worklists, and Cost-Aware AI Scheduling

Research compiled for the C64 reverse-engineering AI analysis pipeline.

---

## 1. Worklist Algorithms

### Naive Round-Robin vs Priority Worklists

**Round-robin (parallel iteration)** processes every node in the graph on every pass. If
there are N nodes and the lattice has height H, worst-case is O(N * H) node visits. Most
of those visits are wasted -- a node whose inputs haven't changed will recompute the same
result.

**Chaotic iteration** (the theoretical foundation for worklist algorithms) updates equations
one-by-one rather than in parallel. The key theorem: chaotic and parallel iteration converge
to the same fixpoint, provided the selection strategy is *fair* (every node is eventually
chosen). Chaotic iteration is N times cheaper per step since it updates one equation instead
of all N.

**Worklist algorithm** is the practical implementation of chaotic iteration:

```
initialize worklist with all nodes
while worklist is not empty:
    pick node i from worklist
    compute new value for node i
    if value changed:
        add all successors of i to worklist
```

The worklist only re-examines nodes whose inputs actually changed. When a node stabilizes,
it is never revisited unless a predecessor changes again.

### Ordering Strategies (Critical for Convergence Speed)

The correctness of worklist algorithms does not depend on visit order, but convergence speed
does. Key strategies:

1. **Reverse Postorder (RPO)**: For forward problems, RPO visits a node only after all its
   predecessors (except back edges). This means most nodes converge in a single pass through
   the ordering. LLVM uses RPO for its dataflow analyses.

2. **Strongly Connected Components (SCCs)**: Compute fixpoint within each SCC before moving
   to successor SCCs. Nodes in an SCC are mutually dependent (loops), so they must iterate
   among themselves, but once stable, downstream SCCs can be processed once.

3. **Weak Topological Ordering (WTO)** (Bourdoncle 1993): The gold standard. WTO
   pre-computes a hierarchical decomposition that identifies SCCs and their "heads" (loop
   entry points). The recursive iteration strategy processes each component as an
   "iterate until stabilization" operator. Widening is applied only at component heads,
   minimizing precision loss. WTO-based solvers are the reference approach in modern
   abstract interpretation frameworks.

### How LLVM and GCC Order Analysis

- **LLVM**: Uses worklist sorted in approximate topological order. Since LLVM IR is in SSA
  form (definitions dominate uses), instruction IDs provide a natural near-topological
  ordering. Nodes are added to the worklist only when their input lattice values change.
  Convergence bound: at most N * H worklist additions (N = nodes, H = lattice height).

- **GCC**: Uses iterative dataflow with RPO for forward problems and reverse RPO on the
  reverse CFG for backward problems. Tree-SSA analyses use similar worklist patterns.

### Relevance to Our System

Our block dependency graph is analogous to a CFG. Processing blocks in reverse dependency
order (leaves first, working toward the entry point) mirrors RPO. When a child block
changes, only its direct parents need re-examination -- not the entire graph.

---

## 2. Change Significance Filtering

### Monotone Frameworks and Convergence Guarantees

A **monotone dataflow framework** guarantees convergence when:

1. The **lattice has finite height** (ascending chain condition): there is a maximum number
   of times any value can increase before reaching the top element.
2. **Transfer functions are monotonic**: if input_1 <= input_2, then f(input_1) <= f(input_2).
3. The **meet/join operator** is well-defined on the lattice.

Under these conditions, the iterative algorithm converges in at most `height(L) * |nodes|`
steps. This is the Kam-Ullman theorem (1977).

For our AI system, the challenge is that AI outputs don't naturally form a lattice with
finite height -- text descriptions can change in unbounded ways. We must impose structure.

### Widening Operators

When the abstract domain has infinite ascending chains (or very long ones), **widening**
forces convergence by over-approximating: it "jumps" to a safe value that is guaranteed to
be above the fixpoint. Widening is typically applied at loop heads (SCC component heads in
WTO).

Properties of a widening operator `nabla`:
- For all x, y: x `nabla` y >= x and x `nabla` y >= y (over-approximation)
- For any ascending chain x_0, x_1, ..., the sequence y_0 = x_0, y_{n+1} = y_n `nabla` x_{n+1}
  stabilizes in finite steps

**Applied to AI analysis**: After K iterations where a block's description keeps changing,
"widen" by accepting the current description and marking the block as "stabilized" -- refuse
to re-analyze it unless a structurally significant input changes (new edges, not just
refined sibling descriptions).

### Narrowing (Precision Recovery)

After widening produces an over-approximation, **narrowing** iterates downward to recover
precision. Key property: narrowing iterations can be stopped at any point since all iterates
are sound (above the true fixpoint). This means you can run narrowing iterations until
budget is exhausted.

**Applied to AI analysis**: After initial convergence with widening, a "refinement pass"
can selectively re-analyze blocks that were widened, using the now-stable context of
surrounding blocks for better precision. This is budget-bounded -- stop whenever ROI drops.

### Material vs Cosmetic Change Detection

For our AI system, the core question is: when Block B's description changes, which parent
blocks actually need re-analysis?

**Proposed change classification framework**:

| Change Type | Example | Action |
|---|---|---|
| **Structural** | New edges discovered, block split/merged | Must re-analyze affected parents |
| **Categorical** | "unknown" -> "sprite loader" | Must re-analyze parents |
| **Refinement** | "sprite loader" -> "sprite position and color loader" | Skip re-analysis |
| **Cosmetic** | Rewording with same semantic content | Skip re-analysis |

**Implementation approaches**:

1. **Semantic hashing**: Hash the key fields (block type, category, key behaviors) rather
   than the full text. Only trigger re-analysis when the hash changes.

2. **Structured output**: Force the AI to output structured fields (type, category, reads,
   writes, calls) alongside the free-text description. Diff the structured fields only.

3. **Embedding distance**: Compute vector embedding of old vs new description. Only
   propagate if cosine distance exceeds a threshold. Risk: embeddings might be too sensitive
   or too insensitive.

4. **AI-as-judge**: Ask a cheap model "is this change material?" -- but this adds cost and
   latency. Better to use structural comparison.

**Recommendation**: Approach 2 (structured output) is the most robust. The AI already
produces structured analysis. Diff the structured fields with a deterministic comparator.
Free-text description changes alone never trigger parent re-analysis.

---

## 3. Applied to the AI Analysis Loop

### Designing the Lattice

For AI block analysis to converge like a dataflow analysis, define a lattice over block
states:

```
bottom (unknown) < partially_typed < typed < typed_with_context < fully_analyzed
```

Where:
- **bottom**: No analysis yet
- **partially_typed**: Has a type guess but no dependency context
- **typed**: Has confirmed type based on instruction analysis
- **typed_with_context**: Type informed by child block analysis
- **fully_analyzed**: Stable across iterations, all children also stable

The key monotonicity constraint: **analysis can only move UP the lattice**. Once a block is
"typed", it cannot regress to "partially_typed" (though the type itself might change within
the "typed" level -- that is handled by change significance filtering).

### Iteration Strategy

```
Phase 1: Bottom-up pass (leaves to roots)
  - Analyze all leaf blocks (no children) first
  - Process in reverse dependency order
  - This is analogous to RPO on the reversed dependency graph

Phase 2: Propagation pass
  - For each block that changed materially, add parents to worklist
  - Process worklist in reverse dependency order
  - Apply widening: if a block has been re-analyzed K times, stabilize it

Phase 3: Narrowing/refinement pass (budget-bounded)
  - Re-analyze widened blocks with full context
  - Stop when budget exhausted or no material changes
```

### Handling Cycles

If Block A calls Block B and Block B calls Block A (mutual recursion), they form an SCC.
Apply WTO-style handling:
- Identify the SCC head (the block with the most incoming edges)
- Iterate within the SCC until stable
- Apply widening at the head after K iterations
- Once the SCC stabilizes, propagate to downstream blocks

---

## 4. Discovery Management

### How IDA Pro Handles Discovery Cascades

IDA Pro's autoanalyzer is the best real-world reference for discovery during analysis. It
uses a **priority queue system** with multiple queues at different priority levels:

| Queue | Priority | Purpose |
|---|---|---|
| AU_UNK | 10 | Convert bytes to unexplored |
| AU_CODE | 20 | Convert to instruction |
| AU_WEAK | 25 | Convert to instruction (IDA decision) |
| AU_PROC | 30 | Convert to procedure start |
| AU_TAIL | 35 | Add procedure tail |
| AU_FCHUNK | 38 | Find function chunks |
| AU_USED | 40 | Reanalyze |
| AU_USD2 | 45 | Reanalyze, second pass |
| AU_TYPE | 50 | Apply type information |
| AU_LIBF | 60 | Apply signature |
| AU_LBF2 | 70 | Signature, second pass |
| AU_LBF3 | 80 | Signature, third pass |
| AU_FINAL | 200 | Final pass |

Key design principles from IDA:

1. **Strict priority ordering**: All addresses in a higher-priority queue are processed
   before moving to lower-priority queues. Instruction discovery (AU_CODE=20) completes
   before procedure analysis (AU_PROC=30), which completes before reanalysis (AU_USED=40).

2. **Discovery feeds back into queues**: When `AU_CODE` discovers a branch target, it adds
   the target to `AU_CODE`. When `AU_PROC` identifies a function, it adds callees to
   `AU_CODE`. Discoveries cascade naturally through the priority system.

3. **Selective re-analysis**: `reanalyze_callers()` only adds callers (not all references)
   to `AU_USED`. This is the IDA equivalent of "only propagate to parents."

4. **Termination by exhaustion**: Analysis completes when all queues are empty. A final
   `auto_empty` event allows plugins to add more work. If nothing is added,
   `auto_empty_finally` declares completion.

5. **Cancellation**: `auto_cancel()` can remove address ranges from queues, preventing
   runaway analysis of problematic regions.

### How Ghidra and angr Handle Discovery

- **Ghidra**: Uses recursive descent disassembly with function boundary detection. Discovers
  code through control flow following. Maintains a database that tracks the state of every
  byte (code/data/unknown). New discoveries feed back into the analysis queue.

- **angr**: Combines static and dynamic symbolic analysis. Uses CFGEmulated (dynamic) and
  CFGFast (static) -- the fast variant does recursive descent with heuristics for indirect
  jumps. Handles discovery through iterative CFG refinement.

### Discovery Caps and Quarantine

**Proposed discovery management for our system**:

1. **Per-iteration discovery cap**: Limit new discoveries per iteration to prevent cascades.
   Example: max 20 new blocks per iteration. Remaining discoveries queue for the next
   iteration.

2. **Confidence tiers for discoveries**:

   | Tier | Source | Treatment |
   |---|---|---|
   | **Confirmed** | Direct JMP/JSR target, data reference from analyzed code | Add to graph immediately |
   | **Probable** | Heuristic pattern match, table entry | Add to graph, mark as tentative |
   | **Speculative** | AI suggestion, indirect reference guess | Quarantine until corroborated |

3. **Quarantine mechanism**: Speculative discoveries sit in a quarantine queue. They are
   promoted to "probable" if a second independent analysis corroborates them, or discarded
   after N iterations without corroboration.

4. **Discovery dampening**: Each iteration can discover at most `D / (1 + iteration)`
   new blocks, where D is the initial discovery budget. This naturally limits cascades in
   later iterations when the graph should be stabilizing.

### Preventing Discovery Oscillation

The risk: Block A's analysis discovers Block X. Block X's analysis changes Block A's
context. Block A's re-analysis no longer thinks Block X is reachable. Block X is removed.
Block A is re-analyzed without Block X. Block A discovers Block X again. Loop.

**Solution**: Once a block/edge is confirmed, it is never removed within the same analysis
session. Discoveries are monotonic (add-only). If later analysis suggests a discovery was
wrong, mark it as "disputed" but keep it in the graph. Resolution of disputed items happens
in a separate reconciliation phase after convergence.

---

## 5. Cost Budgeting

### Budget-Aware Agent Scheduling (BATS Framework)

Google's BATS (Budget-Aware Test-time Scaling) paper (arxiv 2511.17006) is directly
relevant. Key findings:

- Simply giving an agent more budget (more API calls) does NOT improve performance. Agents
  lack "budget awareness" and hit a performance ceiling quickly.
- A **Budget Tracker** plugin that shows remaining budget at each step enables 10x better
  budget efficiency. With 10 tool calls, a budget-aware agent matches the accuracy of a
  budget-unaware agent using 100 calls.
- Budget regimes (HIGH/MEDIUM/LOW/CRITICAL) trigger different strategies:
  - HIGH: explore broadly, try multiple hypotheses
  - MEDIUM: focused exploration, verify before committing
  - LOW: exploit known information, skip speculative analysis
  - CRITICAL: only analyze the highest-value remaining items

### Cost-Aware Scheduling for Our System

**Token cost model**: Output tokens cost ~4x input tokens. A typical block analysis costs:
- Input: ~2000 tokens (block data + context) = ~$0.004
- Output: ~500 tokens (analysis result) = ~$0.008
- Total per block analysis: ~$0.012

**Priority scoring for re-analysis**:

```
priority(block) = importance(block) * change_magnitude(trigger) * (1 / times_analyzed)
```

Where:
- `importance(block)`: Based on in-degree (how many blocks depend on it), whether it's an
  entry point, whether it contains unresolved references
- `change_magnitude(trigger)`: Structural > Categorical > Refinement (see Section 2)
- `1 / times_analyzed`: Diminishing returns -- each re-analysis of the same block is less
  likely to yield new information

**Budget allocation across iterations**:

| Iteration | Budget Share | Strategy |
|---|---|---|
| 1 (initial) | 40% | Analyze all blocks bottom-up |
| 2 (propagation) | 25% | Re-analyze blocks with material changes |
| 3 (refinement) | 15% | Focus on high-importance unresolved blocks |
| 4 (targeted) | 10% | Only blocks with structural discoveries |
| 5+ (diminishing) | 10% | Highest-priority items only |

**Diminishing returns detection**:

Track the "information gain" per iteration:

```
gain(iteration) = (blocks_that_changed_materially / blocks_analyzed) * average_change_magnitude
```

If `gain(iteration) < threshold` (e.g., 0.05), stop iterating. This is analogous to
checking if the worklist is producing meaningful changes.

**Cost ceiling per block**: No single block should consume more than K * base_cost in total
across all iterations. Once a block hits its ceiling, it is frozen regardless of incoming
changes.

### Practical Budget Controls

1. **Hard cap on total API calls** per analysis session (non-negotiable)
2. **Per-iteration budget** that decreases geometrically (40%, 25%, 15%, 10%, 10%)
3. **Per-block analysis count cap** (e.g., max 3 re-analyses per block)
4. **Early termination**: If an iteration produces zero material changes, stop immediately
5. **Cost tracking**: Log cost per block, per iteration, cumulative. Expose as metrics.

---

## Summary: Recommended Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Analysis Controller                 │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Worklist │  │ Budget   │  │ Change            │  │
│  │ (RPO     │  │ Tracker  │  │ Significance      │  │
│  │  ordered) │  │ (BATS)  │  │ Filter            │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       │              │                 │              │
│  ┌────▼──────────────▼─────────────────▼──────────┐  │
│  │              Iteration Engine                   │  │
│  │                                                 │  │
│  │  for each block in worklist:                    │  │
│  │    if budget_remaining > block_cost:            │  │
│  │      result = analyze(block)                    │  │
│  │      if change_is_material(old, result):        │  │
│  │        for parent in block.parents:             │  │
│  │          worklist.add(parent, priority(parent)) │  │
│  │      if iteration_gain < threshold:             │  │
│  │        break                                    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────────┐  │
│  │            Discovery Manager                    │  │
│  │                                                 │  │
│  │  confirmed  ──► add to graph immediately        │  │
│  │  probable   ──► add tentatively                 │  │
│  │  speculative──► quarantine queue                │  │
│  │                                                 │  │
│  │  cap: D/(1+iteration) new blocks per iteration  │  │
│  │  monotonic: never remove confirmed discoveries  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────────┐  │
│  │            Convergence Monitor                  │  │
│  │                                                 │  │
│  │  track: gain per iteration                      │  │
│  │  track: blocks stabilized / total blocks        │  │
│  │  track: cumulative cost                         │  │
│  │  widen: freeze block after K re-analyses        │  │
│  │  stop:  gain < threshold OR budget exhausted    │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Key Invariants

1. **Monotonicity**: Block analysis state only moves up the lattice (unknown -> typed -> contextualized -> stable)
2. **Discovery monotonicity**: Confirmed discoveries are never removed
3. **Bounded iteration**: Widening freezes blocks after K re-analyses
4. **Budget awareness**: Every analysis decision considers remaining budget
5. **Material change gating**: Only structural/categorical changes propagate; refinements do not
6. **Diminishing returns**: Iteration stops when information gain drops below threshold

---

## References and Sources

### Worklist Algorithms and Dataflow Analysis
- [Data-flow Analysis - Wikipedia](https://en.wikipedia.org/wiki/Data-flow_analysis)
- [Worklist Algorithms - Martin Steffen](https://martinsteffen.github.io/compilerconstruction/worklistalgos/)
- [Cornell CS4120 Lecture 20: Dataflow Analysis](https://www.cs.cornell.edu/courses/cs4120/2019sp/lectures/20dataflow/lec20-sp16.pdf)
- [Wisconsin CS704: Dataflow Analysis](https://pages.cs.wisc.edu/~horwitz/CS704-NOTES/2.DATAFLOW.html)
- [Chaotic Iteration in Abstract Interpretation - EPFL](https://lara.epfl.ch/w/sav09/chaotic_iteration_in_abstract_interpretation)

### Weak Topological Ordering and Bourdoncle's Method
- [Bourdoncle Components - Matt Elder (Wisconsin)](https://pages.cs.wisc.edu/~elder/stuff/bourdoncle.pdf)
- [Formal Verification of WTO-based Dataflow Solvers (Springer 2025)](https://link.springer.com/chapter/10.1007/978-3-031-91121-7_4)
- [Efficient Chaotic Iteration Strategies with Widenings (Bourdoncle 1993)](https://link.springer.com/chapter/10.1007/BFb0039704)
- [WTO in SVF-tools DeepWiki](https://deepwiki.com/SVF-tools/SVF/4.2-wto-(weak-topological-ordering))

### Monotone Frameworks and Convergence
- [Monotone Data Flow Analysis Frameworks - Kam & Ullman (Springer)](https://link.springer.com/article/10.1007/BF00290339)
- [CMU Lecture 6: Foundations of Data Flow Analysis](https://www.cs.cmu.edu/afs/cs/academic/class/15745-s19/www/lectures/L6-Foundations-of-Dataflow.pdf)
- [Kildall's Lattice Framework (Wisconsin)](https://pages.cs.wisc.edu/~horwitz/CS704-NOTES/DATAFLOW-AUX/lattice.html)

### Widening and Narrowing
- [Abstract Interpretation: Fixpoints, Widening, and Narrowing (Harvard CS252r)](https://groups.seas.harvard.edu/courses/cs252/2011sp/slides/Lec12-AbstractInt-2.pdf)
- [Widening and Narrowing Operators for Abstract Interpretation (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S1477842410000254)
- [Introduction to Abstract Interpretation - Bruno Blanchet](https://bblanche.gitlabpages.inria.fr/absint.pdf)

### IDA Pro Auto-Analysis Architecture
- [IDA C++ SDK: auto.hpp](https://cpp.docs.hex-rays.com/auto_8hpp.html)
- [IDA Python: ida_auto](https://www.hex-rays.com/products/ida/support/idapython_docs/ida_auto.html)
- [Improving IDA Analysis - Hex-Rays Blog](https://hex-rays.com/blog/improving-ida-analysis)
- [IDA Help: Analysis Options](https://hex-rays.com/products/ida/support/idadoc/620.shtml)

### Binary Analysis and Dynamic Discovery
- [Toward a Best-of-Both-Worlds Binary Disassembler - Trail of Bits](https://blog.trailofbits.com/2022/01/05/toward-a-best-of-both-worlds-binary-disassembler/)
- [SoK: x86/x64 Binary Disassembly (arxiv 2007.14266)](https://arxiv.org/pdf/2007.14266)

### Incremental Analysis
- [An Incremental Algorithm for Algebraic Program Analysis (ACM 2024)](https://dl.acm.org/doi/10.1145/3704901)
- [IncA: Incremental Program Analyses DSL (ACM ASE 2016)](https://dl.acm.org/doi/10.1145/2970276.2970298)

### Cost-Aware AI Agent Scheduling
- [Budget-Aware Tool-Use Enables Effective Agent Scaling (arxiv 2511.17006)](https://arxiv.org/abs/2511.17006)
- [Designing Agentic Loops - Simon Willison](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/)
- [Evaluator Reflect-Refine Loop Patterns - AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/evaluator-reflect-refine-loop-patterns.html)

### LLVM Dataflow Implementation
- [LLVM Dataflow Analysis Framework (GitHub)](https://github.com/nsumner/llvm-dataflow-analysis)
- [LLVM Lifetime Safety: Dataflow for Loan Propagation](https://github.com/llvm/llvm-project/commit/f25fc5fe1ea1)
