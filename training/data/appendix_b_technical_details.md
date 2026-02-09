# Kick Assembler — Appendix B: Internal Assembler Techniques

**Summary:** Describes Kick Assembler internals: the flexible pass algorithm (iterative parsing until stability), recording and replay of directive side effects, the distinction between Function Mode and Asm Mode (affecting preprocessor/directive evaluation and side-effect recording), and rules for how invalid/unresolved values (IValue variants) propagate through expressions and operations.

## Flexible pass algorithm (B.1)
The assembler uses an iterative pass strategy rather than a fixed two-pass model. Each pass:
- Parses as much source as it can given the current symbol table and recorded side effects.
- Evaluates expressions and directives that are resolvable with current information.
- Records newly discovered symbols/values and any produced side effects.

Passes are repeated until a stability condition is reached:
- No symbol table entries change between consecutive passes, and
- No new side effects are produced that would affect later parsing/evaluation.

This approach allows gradual resolution of forward references and deferred directives: unresolved items remain as "invalid" (IValue) during one pass and may become resolvable in a later pass when dependent symbols or side effects are available.

## Recording of side effects (B.2)
Directives and some assembler constructs can produce side effects (for example: macro expansions that modify state, preprocessor directives that define symbols, or file/include handling). To speed repeated processing (scripts, multiple passes, or reassembly), the assembler:
- Records the side effects produced during a pass (a replayable record of the actions taken by directives).
- Replays the recorded side effects in later passes or modes instead of re-executing the original directive logic whenever replay is allowed.

Recording/replay reduces re-evaluation cost for complex directives and script-driven assembly runs. Whether a side effect is recorded or replayed depends on the assembler mode (see below).

## Function Mode vs Asm Mode (B.3)
The assembler exposes two execution modes with different semantics for evaluation and side-effect handling:

- Function Mode
  - Intended for fast, script-only evaluations (preprocessor expressions, user function calls).
  - Executes preprocessor/functional code without recording directive side effects.
  - Used when only immediate evaluation is needed and persistent side effects are undesirable.
  - Faster because it skips side-effect recording and replay bookkeeping.

- Asm Mode
  - Full assembly mode used when assembling code and when side effects must be tracked across passes.
  - Records directive side effects so they can be replayed in later passes.
  - Required for directives that must persistently modify assembler state (definitions, emitted data/stateful macros).

Preprocessor directive evaluation is affected by the chosen mode: see the "preprocessor_directives_a2" reference for expanded behavior details.

## Invalid value calculations (B.4)
When expressions or directives reference unresolved symbols or otherwise produce values that cannot be fully determined during a pass, the assembler represents those as invalid/unresolved IValue variants (see "ivalue_interface_methods_and_representations" for representation details). The assembler propagates these invalid values through operations according to deterministic rules so that later passes can refine or preserve the provenance of the failure.

General propagation rules:
- Propagation: Any operation that uses an invalid IValue yields an invalid IValue (the invalidness propagates).
- Resultant type: The invalid IValue produced carries a type/category appropriate to the operation domain (numeric, address/reloc, boolean, string, etc.), so later resolution can attempt the correct interpretation.
- Partial resolution: If an operation has multiple operands and some are valid while others are invalid, the result remains invalid but records the contributing causes (which operands are unresolved), enabling targeted re-evaluation later.
- Combining invalids: Combining two invalid IValues yields an invalid value whose provenance includes both sources.
- Order of operations: Arithmetic, bitwise, logical, and concatenation operators all propagate invalidness; the precise invalid type follows the operator semantics (numeric ops -> numeric invalid, bitwise -> numeric invalid, comparison -> boolean invalid, concatenation -> string invalid).

Examples (illustrative):
- unresolved_label + 4 -> invalid (numeric) with cause: unresolved_label
- (unresolved_value * 2) -> invalid (numeric) with same unresolved cause
- unresolved_string || "text" -> invalid (string) with cause: unresolved_string
- unresolved_flag && true -> invalid (boolean) with cause: unresolved_flag
- unresolved1 + unresolved2 -> invalid combining both causes

These rules ensure that:
- Invalidness is explicit and trackable across passes.
- Later passes can determine whether previously invalid values become fully resolvable without re-running unrelated directive logic.
- Error reporting can reference the originating unresolved operands.

**[Note: For detailed IValue variant names, interface methods, and exact representation semantics, see "ivalue_interface_methods_and_representations".]**

## References
- "preprocessor_directives_a2" — expanded behavior of preprocessor evaluation and mode effects  
- "ivalue_interface_methods_and_representations" — internal representations and methods for Invalid/IValue variants