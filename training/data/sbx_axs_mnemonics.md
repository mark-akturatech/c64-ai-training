# NMOS 6510 Undocumented Opcodes: SBX and AXS (Assembler Name Mapping)

**Summary:** This document addresses the ambiguity in assembler mnemonics for the undocumented NMOS 6510 opcode $CB, which is variably labeled as SBX or AXS across different assemblers. It provides a comprehensive mapping of opcode $CB to its mnemonic, details its addressing mode, execution semantics, and identifies assembler-specific naming conventions.

**Overview**

The NMOS 6510 microprocessor includes undocumented opcodes that have been assigned various mnemonics by different assemblers. Opcode $CB is one such instruction, commonly referred to as SBX or AXS, depending on the assembler. This document clarifies the mapping of opcode $CB, its addressing mode, execution behavior, and the assembler-specific mnemonics used.

**Opcode-to-Mnemonic Mapping**

Opcode $CB is associated with the following mnemonics:

- **SBX**: Used by assemblers such as ACME and DASM.
- **AXS**: Utilized by assemblers like ca65 and Kick Assembler.

This variation in naming arises from the lack of official documentation for this opcode, leading to different conventions among assembler developers.

**Addressing Mode and Opcode Byte**

- **Opcode Byte**: $CB
- **Addressing Mode**: Immediate

In this mode, the instruction operates on an immediate value provided as an operand.

**Execution Semantics**

The operation performed by opcode $CB (SBX/AXS) is as follows:

1. Compute the bitwise AND of the Accumulator (A) and the X register.
2. Subtract the immediate operand from the result of the AND operation.
3. Store the final result in the X register.

This can be expressed as:


**Flags Affected**:

- **Negative (N)**: Set if the result in X is negative.
- **Zero (Z)**: Set if the result in X is zero.
- **Carry (C)**: Set if the subtraction did not require borrowing (i.e., if A AND X is greater than or equal to the immediate operand).

**Timing**:

- **Cycles**: 2

This instruction executes in 2 clock cycles.

**Assembler-Specific Mnemonic Usage**

Different assemblers have adopted varying mnemonics for opcode $CB:

- **ACME Assembler**: Uses the mnemonic SBX.
- **DASM Assembler**: Uses the mnemonic SBX.
- **ca65 Assembler**: Uses the mnemonic AXS.
- **Kick Assembler**: Uses the mnemonic AXS.

This discrepancy underscores the importance of consulting the specific assembler's documentation when working with undocumented opcodes.

## Source Code

```
X = (A AND X) - Immediate
```


## References

- "6502 Instruction Set" by Masswerk:
- "Undocumented 6502 Opcodes" by Millfork Documentation:
- "ca65 Users Guide":
- "Kick Assembler Manual":

These references provide further insights into the undocumented opcodes and their usage across different assemblers.

## Mnemonics
- SBX
- AXS
