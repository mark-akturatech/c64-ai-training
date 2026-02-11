# NMOS 6510 — Opcode bytes for undocumented mnemonic SLO (assembler variations)

**Summary:** This document details the opcode bytes for the undocumented 6510 mnemonic SLO, including their corresponding addressing modes and variations across different assemblers (KickAss, Acme, ca65, dasm, 64tass). The SLO instruction combines an arithmetic shift left (ASL) operation with a logical OR (ORA) operation.

**Overview**

The SLO instruction performs an arithmetic shift left on a memory location and then logically ORs the result with the accumulator. This operation affects the Negative (N), Zero (Z), and Carry (C) flags. The opcode bytes and their corresponding addressing modes are as follows:

- **$03**: (Indirect,X)
- **$07**: Zero Page
- **$0F**: Absolute
- **$13**: (Indirect),Y
- **$17**: Zero Page,X
- **$1B**: Absolute,Y
- **$1F**: Absolute,X

Different assemblers may use varying mnemonics for the SLO instruction. For instance, some assemblers refer to it as ASO. It's important to consult the specific assembler's documentation to determine the correct mnemonic.

## Source Code

```text
; Opcode bytes and corresponding addressing modes for SLO instruction

Opcode  Addressing Mode  Mnemonic
$03     (Indirect,X)     SLO
$07     Zero Page        SLO
$0F     Absolute         SLO
$13     (Indirect),Y     SLO
$17     Zero Page,X      SLO
$1B     Absolute,Y       SLO
$1F     Absolute,X       SLO
```

## Key Registers

- **Accumulator (A)**: Used in the ORA operation.
- **Processor Status Register (P)**: Flags affected include Negative (N), Zero (Z), and Carry (C).

## References

- "NMOS 6510 Unintended Opcodes — No More Secrets" by Groepaz, v0.99, December 24, 2024. [Link](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf)
- "6502 Opcodes and Quasi-Opcodes" from C=Hacking Issue #1, December 1991. [Link](https://www.codebase64.net/doku.php?id=magazines%3Achacking1)
- "Undocumented instruction support" from Millfork documentation. [Link](https://millfork.readthedocs.io/en/v0.3.30/abi/undocumented/)

*Note: The SLO instruction is undocumented and may not be supported by all assemblers. Ensure compatibility with your assembler and hardware before use.*

## Mnemonics
- SLO
- ASO
