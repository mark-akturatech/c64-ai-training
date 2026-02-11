# NMOS 6510 — SAX (also called AXS or AAX) undocumented instruction

**Summary:** Undocumented 6510/6502 store instruction that writes the result of A & X to memory, effectively combining STA and STX with the same addressing mode. Known opcodes include $83, $87, $8F, and $97. Effect: {addr} = A & X. This instruction does not affect processor flags.

**Description**

SAX (also referred to as AXS or AAX in various documents) is an undocumented instruction on the 6502/6510 processors. It performs a bitwise AND operation between the A and X registers and stores the result into a specified memory location, determined by the addressing mode. Conceptually, it combines the effects of STA and STX instructions using the same addressing mode but writes only the result of A & X to memory.

- **Functional effect:** {addr} = A & X
- **Sub-instructions conceptually combined:** STA + STX (same addressing mode)
- **Common mnemonics:** SAX (also seen as AAX or AXS)
- **Known opcodes and addressing modes:**
  - $83 — (indirect,X)
  - $87 — zero page
  - $8F — absolute
  - $97 — zero page,Y
- **Flags affected:** None; this instruction does not modify any processor flags.

The SAX instruction does not alter the contents of the A or X registers. It is important to note that, as an undocumented instruction, its behavior is not officially defined and may vary between different 6502/6510 implementations.

## Source Code

```text
SAX (AXS, AAX)
Type: Combination of two operations with the same addressing mode (Sub-instructions: STA, STX)

Opcode  Mnemonic  Addressing Mode  Size  Cycles  Flags
$83     SAX       (indirect,X)     2     6       ------
$87     SAX       zero page        2     3       ------
$8F     SAX       absolute         3     4       ------
$97     SAX       zero page,Y      2     4       ------
```

## Key Registers

- **A Register:** Used in the AND operation.
- **X Register:** Used in the AND operation.

## References

- "6502 Instruction Set" — Detailed information on 6502 instructions, including undocumented opcodes.
- "6502 Instruction Tables" — Comprehensive tables of 6502 instructions and addressing modes.
- "Undocumented 6502 Instructions" — In-depth analysis of undocumented 6502 instructions.

## Mnemonics
- SAX
- AAX
- AXS
