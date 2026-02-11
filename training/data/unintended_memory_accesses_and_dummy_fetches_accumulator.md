# NMOS 6510 — Dummy Fetches for Single-Byte and Accumulator Instructions

**Summary:** This document details the behavior of the NMOS 6510/6502 microprocessor, focusing on its execution cycles that include memory accesses (reads or writes), even during dummy fetches. It highlights that single-byte instructions perform a read of the program counter plus one (PC+1) after fetching the opcode and provides opcode information for accumulator-implied operations (ASL A, LSR A, ROL A, ROR A).

**Unintended Memory Accesses**

The 6502's internal timing ensures a memory access on every bus cycle, whether it's a read or write operation. Some of these accesses are dummy cycles—they do not supply data used by the instruction's visible semantics but still place addresses on the bus and can read or write memory-mapped I/O registers. These dummy accesses can cause observable side effects when the accessed locations are I/O, hardware registers, or share side effects on read.

**Dummy Fetches — Single-Byte Instructions and Accumulator Operations**

- **Single-Byte Instructions:** Instructions consisting of a single byte (opcode only) perform a memory read of PC+1 after fetching the opcode. This read is a dummy fetch; the fetched byte is not used by the instruction semantics for implied/accumulator addressing modes.

- **Accumulator (Implied) Operations:** Instructions such as ASL A, LSR A, ROL A, and ROR A are single-byte instructions that operate directly on the accumulator. They perform the opcode fetch followed by a dummy read of PC+1. The arithmetic/shift/rotate operations affect the A register; no memory operand is used, but the dummy fetch still occurs and is a true bus read cycle.

(*) The dummy PC+1 fetch is a read cycle and may trigger side effects if PC+1 points into I/O space.

## Source Code

```text
Cycle | Address Bus | Data Bus         | R/W
------+-------------+------------------+----
1     | PC          | Opcode fetch     | R
2 (*) | PC + 1      | Byte after opcode| R

(*) fetch after opcode
```

The above timing diagram illustrates the execution of single-byte instructions, including accumulator-implied operations.

## References

- "rra_ror_then_adc_instruction" — expands on undocumented instruction (RRA) whose behavior can be affected by internal memory fetches.
- "dummy_fetches_implied_instructions" — expands on dummy fetch patterns for implied instructions (different single-byte behavior).

## Mnemonics
- ASL
- LSR
- ROL
- ROR
