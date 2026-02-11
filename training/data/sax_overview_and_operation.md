# NMOS 6510 — SAX (AAX/AXS) undocumented opcode — addressing modes and core behavior

**Summary:** SAX (also called AAX/AXS) is an undocumented NMOS 6510 opcode that stores the bitwise AND of the accumulator (A) and the X register into memory (M ← A & X) without changing A, X, or processor flags. Known opcode bytes and size/cycle information for several addressing modes are recorded: $87, $97, $83, and $8F. Keywords: SAX, AAX, AXS, undocumented opcode, opcode bytes, NMOS 6510, A & X, SHA, abs,Y simulation.

**Description**

SAX performs the operation: store (A AND X) into memory — M := A & X. It does not alter the contents of A or X and does not change any flags in the processor status register.

The instruction is sometimes called AAX or AXS in other documents.

Two addressing modes commonly used by other illegal opcodes are absent for SAX on NMOS: absolute,Y and (zp),Y (indirect Y). These can be simulated with the SHA-family instruction (also known as AXA/AHX/TEA variants).

Hardware explanation: SAX decodes on silicon as the simultaneous gating of two store operations (STA and STX outputs). During the bus-drive phase, the internal operand-output bus is precharged to all 1s, and the output-enable/read-enable signals from the accumulator and the X register can pull individual bits down to 0. Because the bus is only pulled to 0 by either register, the final bits placed on the bus are 0 if either A or X has a 0 in that bit position; only when both have 1 does the bus remain 1 — producing the bitwise AND result.

SAX does not modify processor flags, and A and X remain unchanged after execution.

**Addressing Modes and Opcodes**

The SAX instruction supports the following addressing modes:

| Addressing Mode       | Opcode | Bytes | Cycles |
|-----------------------|--------|-------|--------|
| Zero Page             | $87    | 2     | 3      |
| Zero Page,Y           | $97    | 2     | 4      |
| (Zero Page,X)         | $83    | 2     | 6      |
| Absolute              | $8F    | 3     | 4      |

**Note:** The opcode $87 corresponds to the Zero Page addressing mode, as confirmed by multiple sources. ([c64-wiki.com](https://www.c64-wiki.com/wiki/SAX?utm_source=openai))

## Source Code

```text
; Example usage
        SAX $FE      ; $87 FE

; Equivalent sequence using only legal opcodes
        PHP
        PHA
        STX $FE
        AND $FE
        STA $FE
        PLA
        PLP
; (save flags and accumulator; restore flags and accumulator)
```

```text
Test program filenames:
- Lorenz-2.15/axsa.prg
- Lorenz-2.15/axsix.prg
- Lorenz-2.15/axsz.prg
- Lorenz-2.15/axszy.prg
```

## References

- "sax_examples_mask_and_sprite_primary" — practical examples using SAX (masking, sprite pointer setup)
- "sax_alternative_sprite_method" — alternate sprite-pointer technique swapping A/X
- "lax_overview" — other undocumented combined-load opcode (LAX)

## Mnemonics
- SAX
- AAX
- AXS
