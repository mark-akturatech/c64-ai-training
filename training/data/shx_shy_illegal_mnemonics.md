# SHX / SHY — Kick Assembler illegal mnemonics (opcodes $9E / $9C)

**Summary:** Kick Assembler's default 6502 set includes undocumented mnemonics SHX (store high X) and SHY (store high Y) with opcode bytes $9E and $9C respectively. These instructions are part of the 6502's unofficial opcode set and exhibit unstable behavior across different CPU variants.

**Description**

SHX and SHY are undocumented instructions in the 6502 microprocessor family:

- **SHX** — Opcode $9E
- **SHY** — Opcode $9C

These instructions are not part of the official MOS Technology 6502 instruction set but are recognized by assemblers like Kick Assembler. They are associated with other unofficial store-type instructions such as SAX and TAS/SHS.

**Operational Semantics and Addressing Modes**

Both SHX and SHY involve storing a value derived from the respective index register combined with the high byte of the target address incremented by one.

- **SHX (Opcode $9E):** Stores the result of `X AND (high-byte of address + 1)` into the memory location specified by the absolute,Y addressing mode.

  - **Addressing Mode:** Absolute,Y
  - **Operation:** `X AND (H + 1) → M`
  - **Bytes:** 3
  - **Cycles:** 5 (unstable)

- **SHY (Opcode $9C):** Stores the result of `Y AND (high-byte of address + 1)` into the memory location specified by the absolute,X addressing mode.

  - **Addressing Mode:** Absolute,X
  - **Operation:** `Y AND (H + 1) → M`
  - **Bytes:** 3
  - **Cycles:** 5 (unstable)

These instructions are considered unstable due to their reliance on internal processor behavior that can vary between CPU revisions and environmental conditions. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

**CPU Variant Support**

The behavior and support for SHX and SHY vary across different 6502-family processors:

- **NMOS 6502/6510:** These processors implement SHX and SHY, but the behavior is unstable and can differ between chip revisions.

- **CMOS 65C02:** These instructions are not implemented; executing them results in a NOP or other defined behavior.

- **65DTV02:** These instructions are not valid; executing them may result in undefined behavior. ([sources.debian.org](https://sources.debian.org/src/64tass/1.59.3120-2/README?utm_source=openai))

Due to their instability and lack of official documentation, reliance on SHX and SHY is discouraged in software intended for compatibility across different 6502 variants.

**Example Usage**

The following examples demonstrate the use of SHX and SHY and their effects on memory:


In these examples, the SHX and SHY instructions perform bitwise AND operations between the index register and the incremented high byte of the target address, storing the result in the computed memory location.

## Source Code

```assembly
; Example of SHX
LDX #$FF        ; Load X with $FF
LDA #$00        ; Load A with $00
STA $2000       ; Store A at $2000
SHX $1F00,Y     ; Store X AND (high-byte of $1F00 + 1) at $1F00 + Y

; Example of SHY
LDY #$FF        ; Load Y with $FF
LDA #$00        ; Load A with $00
STA $2000       ; Store A at $2000
SHY $1F00,X     ; Store Y AND (high-byte of $1F00 + 1) at $1F00 + X
```


## References

- ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))
- ([sources.debian.org](https://sources.debian.org/src/64tass/1.59.3120-2/README?utm_source=openai))

## Mnemonics
- SHX
- SHY
