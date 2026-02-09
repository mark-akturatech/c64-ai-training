# 6510 Assembly: Source Line Format, Comments, and Labels

**Summary:** Covers the assembly source line format (LABEL OPCODE OPERAND ;comment), comment syntax (;), label placement (column 1), label values versus the program counter, and assembler handling of branch distance (relative branches).

## Basic line format
Assembly source lines follow a fixed layout:

LABEL OPCODE OPERAND ;comment

- OPCODE is the instruction to execute.
- OPERAND is the data, label, or memory address operated on.
- The label (if present) must start in column 1 of the source line.

## Comments
- Comments are introduced with a semicolon (;) and may appear after an instruction or on a line by themselves.
- Comments do not affect assembly and are for documentation only.

## Labels and program counter
- Labels prevent code from becoming unmanageable by providing symbolic names for addresses.
- A label may be explicitly assigned a value or may take on the current value of the program counter during assembly.
- Labels used as operands allow the assembler to resolve addresses and lengths without manual calculation.

## Branch distance and assembler handling
- When a label is used as the target of a branch (relative branch instructions), the assembler computes the branch displacement (branch length/distance) automatically.
- The assembler updates these calculations if the program layout changes, avoiding manual recomputation of branch distances.

## Source Code
```asm
LABEL OPCODE OPERAND ;comment
```

## References
- "using_an_assembler_pseudo_opcodes" — expands on how pseudo-opcodes and labels integrate with the assembler