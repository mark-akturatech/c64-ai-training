# LAX

**Summary:** The LAX instruction is an undocumented opcode on the NMOS 6510 processor that simultaneously loads a memory value into both the accumulator (A) and the X register.

**Description**

LAX combines the operations of LDA (Load Accumulator) and LDX (Load X Register) into a single instruction, loading the same memory operand into both A and X registers. This can be more efficient than executing LDA followed by TAX (Transfer Accumulator to X).

The instruction affects the Negative (N) and Zero (Z) flags based on the loaded value.

## Source Code

```text
LAX
Type: Combination of LDA and LDX operations with the same addressing mode
Function: A, X = {addr}

Addressing Modes and Opcodes:

Addressing Mode | Mnemonic    | Opcode | Size (Bytes) | Cycles
----------------|-------------|--------|--------------|-------
Zero Page       | LAX $nn     | $A7    | 2            | 3
Zero Page,Y     | LAX $nn,Y   | $B7    | 2            | 4
Absolute        | LAX $nnnn   | $AF    | 3            | 4
Absolute,Y      | LAX $nnnn,Y | $BF    | 3            | 4*
(Indirect,X)    | LAX ($nn,X) | $A3    | 2            | 6
(Indirect),Y    | LAX ($nn),Y | $B3    | 2            | 5*

*Add 1 cycle if a page boundary is crossed.

Flags Affected: N Z - - - - - -

Note: LAX is an undocumented opcode and may not be supported on all 6502 variants. Its behavior can vary between different hardware implementations.
```

## References

- "6502 Instruction Set" — Detailed information on 6502 instructions, including undocumented opcodes.
- "6502 Opcodes" — Comprehensive list of 6502 opcodes and their functions.

## Mnemonics
- LAX
