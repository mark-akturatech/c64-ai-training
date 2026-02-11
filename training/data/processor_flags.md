# NMOS 6510 — Processor Status Flags and Flag-Usage Notation

**Summary:** This document details the status register flags (N, V, B, D, I, Z, C) of the NMOS 6510/6502 processors, including their bit positions (bits 7 through 0). It also explains the notation used in opcode tables to indicate whether an instruction reads, sets, or changes each flag ('i' = input, 'o' = output, 'x' = both, '-' = no usage).

**Processor Status Bits**

The 6502 processor status register (P) layout, from the highest to the lowest bit:

- **Bit 7 (N) — Negative:** Set if the result's bit 7 is 1 (indicating a negative result).
- **Bit 6 (V) — Overflow:** Set when a signed overflow occurs in two's-complement arithmetic.
- **Bit 5 — Unused/Reserved:** Always set to 1 when the status register is pushed onto the stack.
- **Bit 4 (B) — Break:** Indicates a BRK (break) instruction or a software interrupt; set to 1 when pushed by BRK or PHP instructions, and set to 0 when pushed by hardware interrupts (IRQ or NMI).
- **Bit 3 (D) — Decimal Mode:** Enables Binary-Coded Decimal (BCD) mode for ADC and SBC instructions.
- **Bit 2 (I) — Interrupt Disable:** When set, maskable interrupts (IRQ) are disabled.
- **Bit 1 (Z) — Zero:** Set when the result of an operation is zero.
- **Bit 0 (C) — Carry:** Set when an operation results in a carry out of the most significant bit in addition, or a borrow in subtraction.

*Note:* Bit 5 is unused in the NMOS 6502/6510 processors but is always set to 1 when the status register is pushed onto the stack. ([masswerk.at](https://masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

**Flag-Usage Notation in Opcode Tables**

Opcode tables use a compact notation to indicate how each instruction interacts with processor flags. The symbols used are:

- **i** — Instruction depends on this flag (uses it as input) but does not change it.
- **o** — Instruction does not depend on this flag but sets or clears it (output only).
- **x** — Instruction both depends on and changes this flag (reads and writes it).
- **-** — Instruction neither depends on nor changes this flag (no usage).

This notation allows opcode tables to concisely convey, for each flag, whether an instruction reads, writes, or both reads and writes the flag.

**Opcode Matrix / Decode ROM**

The 6502 opcode logic is implemented as a compressed 130-entry decode ROM combined with combinatorial post-processing. Instead of 256 separate micro-entries, the sparse ROM plus decoding logic (similar to a Programmable Logic Array) produces the final control signals. Many instructions intentionally activate multiple ROM lines (for addressing mode vs. opcode), and some unintended overlaps can also occur.

## References

- "Atari Roots - Appendix A" ([atariarchives.org](https://www.atariarchives.org/roots/AppendixA.php?utm_source=openai))
- "MOS 6502 - CPCWiki" ([cpcwiki.eu](https://www.cpcwiki.eu/index.php/MOS_6502?utm_source=openai))
- "6502 Instruction Set Quick Reference" ([blazinggames.com](https://blazinggames.com/2600dragons/articles/instructionset6502.html?utm_source=openai))
- "User:Karatorian/6502 Instruction Set - NESdev Wiki" ([nesdev.org](https://www.nesdev.org/wiki/User%3AKaratorian/6502_Instruction_Set?utm_source=openai))
- "MOS Technology 6502 - Wikipedia" ([en.wikipedia.org](https://en.wikipedia.org/wiki/MOS_Technology_6502?utm_source=openai))
- "6502 Instruction Set" ([masswerk.at](https://masswerk.at/6502/6502_instruction_set.html?utm_source=openai))