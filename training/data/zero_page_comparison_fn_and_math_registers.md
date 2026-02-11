# Zero Page $004B-$0065 — BASIC interpreter: temp instruction pointer, GC step size, registers, FAC

**Summary:** Zero page layout for BASIC internals at $004B-$0065: saved temp instruction pointer ($004B-$004C), comparison operator flags ($004D), FN pointer ($004E-$004F), string variable pointer ($0050-$0051), garbage-collection step size ($0053), JMP instruction pointer ($0054-$0056), arithmetic registers #3/#4 ($0057-$005B and $005C-$0060), and the floating-point accumulator FAC ($0061-$0065).

## Zero page fields $004B-$0065
This region contains BASIC's transient pointers and numeric registers used by the interpreter:

- $004B-$004C — Temp Instruction: saved instruction pointer (2 bytes).
- $004D — Comparison Op: bit flags used for comparison operators.
- $004E-$004F — FN Pointer: current FN function pointer (2 bytes).
- $0050-$0051 — String Var Ptr: pointer to current string variable during allocation/operation (2 bytes).
- $0052 — Unused.
- $0053 — GC Step Size: garbage-collection step size; observed values $03 or $07.
- $0054-$0056 — JMP Instruction: jump pointer for the current BASIC function (3 bytes).
- $0057-$005B — Register #3: arithmetic register (5 bytes).
- $005C-$0060 — Register #4: arithmetic register (5 bytes).
- $0061-$0065 — FAC: floating-point accumulator (5 bytes).

**[Note: Source may contain an error — one summary line listed $0057-$0060 overlapping both registers; the intended mapping is the two 5-byte registers shown above ($0057-$005B and $005C-$0060).]**

## Source Code
```text
$004B-$004C  Temp Instruction   Saved instruction pointer
$004D        Comparison Op      Bit flags for comparison operators
$004E-$004F  FN Pointer         Current FN function pointer
$0050-$0051  String Var Ptr     Current string variable during allocation
$0052        Unused
$0053        GC Step Size       Garbage collection step size ($03 or $07)
$0054-$0056  JMP Instruction    Jump to current BASIC function
$0057-$005B  Register #3        Arithmetic register (5 bytes)
$005C-$0060  Register #4        Arithmetic register (5 bytes)
$0061-$0065  FAC                Floating-point accumulator (5 bytes)
```

## Key Registers
- $004B-$004C - Zero Page - Saved temp instruction pointer (2 bytes)
- $004D - Zero Page - Comparison operator flags (bit field)
- $004E-$004F - Zero Page - FN pointer (2 bytes)
- $0050-$0051 - Zero Page - Current string variable pointer (2 bytes)
- $0053 - Zero Page - Garbage collection step size ($03 or $07)
- $0054-$0056 - Zero Page - JMP instruction pointer for current BASIC function (3 bytes)
- $0057-$005B - Zero Page - Arithmetic Register #3 (5 bytes)
- $005C-$0060 - Zero Page - Arithmetic Register #4 (5 bytes)
- $0061-$0065 - Zero Page - FAC (floating-point accumulator, 5 bytes)

## References
- "garbage_collection_and_memory_management" — expands on GC step size usage ($0053)
- "floating_point_registers" — expands on FAC region ($0061-$0065)

## Labels
- TEMP_INSTRUCTION
- COMPARISON_OP
- FN_POINTER
- STRING_VAR_PTR
- GC_STEP_SIZE
- JMP_INSTRUCTION
- REGISTER_3
- REGISTER_4
- FAC
