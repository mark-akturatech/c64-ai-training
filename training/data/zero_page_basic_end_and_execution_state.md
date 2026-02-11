# Zero Page $0037-$004A — BASIC Pointers and Temp Variables

**Summary:** Zero-page pointers used by the KERNAL/BASIC interpreter: BASIC end pointer ($0037-$0038), current line and CONT line/pointer ($0039-$003E), DATA line/pointer ($003F-$0042), input/result and variable name/value pointers ($0043-$0048), and variable pointer/WAIT/temp storage ($0049-$004A).

## Zero-page layout and usage
This block ($0037-$004A) holds the runtime pointers and small temporaries used by the BASIC interpreter. All multi-byte pointers are stored as 16-bit addresses in little-endian (low byte first). The locations are updated during BASIC parsing and execution and are referenced by KERNAL/BASIC routines for CONT, DATA, INPUT, variable lookup, and intermediate instruction storage.

Brief descriptions:
- $0037-$0038 — BASIC End: start address of BASIC program memory (end of BASIC workspace). Default value on power-up is $A000 (top of default BASIC area).
- $0039-$003A — Current Line: line number currently executing (16-bit).
- $003B-$003C — CONT Line: line number saved for the CONT command (line to resume).
- $003D-$003E — CONT Pointer: saved program-counter (address of next instruction) for CONT.
- $003F-$0040 — DATA Line: line number containing the next DATA statement.
- $0041-$0042 — DATA Pointer: pointer to the next DATA item (address within BASIC program text).
- $0043-$0044 — Input Result: pointer used for INPUT/GET results and input buffer operations.
- $0045-$0046 — Variable Name: pointer to the current variable name and type bits (used during parsing/assignment).
- $0047-$0048 — Variable Value: pointer to the variable or function value (address of the value or function entry).
- $0049-$004A — Variable Ptr / WAIT / Temp: used variably by operations (variable pointer, WAIT state storage, temporary instruction bytes).

These locations are modified by BASIC interpreter routines and are referenced by routines that implement CONT, DATA scanning, INPUT handling, variable lookup/assignment, and certain temporary state during expression evaluation.

## Source Code
```text
$0037-$0038  BASIC End          End of program area (default: $A000)
$0039-$003A  Current Line       Active line number during execution
$003B-$003C  CONT Line          Line number for CONT command
$003D-$003E  CONT Pointer       Next instruction for CONT
$003F-$0040  DATA Line          Current DATA statement line number
$0041-$0042  DATA Pointer       Next DATA item location
$0043-$0044  Input Result       Pointer to input data
$0045-$0046  Variable Name      Current variable name and type bits
$0047-$0048  Variable Value     Pointer to variable/function value
$0049-$004A  Variable Ptr/WAIT  Varies by operation context
```

## Key Registers
- $0037-$004A - Zero Page - BASIC pointers: BASIC end, current/CONT/DATA line numbers and pointers, input/result pointer, variable name/value pointers, variable pointer/WAIT/temp storage

## References
- "interrupt_and_basic_vectors" — expands on BASIC/USR/IRQ vectors and their influence on execution flow