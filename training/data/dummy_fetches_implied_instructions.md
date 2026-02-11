# NMOS 6510 — Implied (single-byte) instructions: dummy-fetch cycle / bus activity

**Summary:** This document details the NMOS 6510 single-byte implied instructions (CLC, CLD, CLI, CLV, DEX, DEY, INX, INY, NOP, SEC, SED, SEI, TAX, TAY, TSX, TXA, TYA) and their standard 2-cycle execution pattern, including the dummy-fetch cycle. Understanding this behavior is crucial for recognizing unintended memory-mapped I/O reads.

**Implied instructions and dummy-fetch pattern**

The NMOS 6510 executes all single-byte implied-addressing instructions in two clock cycles. The bus activity for these instructions follows a consistent pattern:

- **Cycle 1:** Fetch the opcode from the program counter (PC).
- **Cycle 2:** Perform a dummy read from the next PC address.

This dummy read is a genuine memory access (R/W = Read) and can interact with memory-mapped hardware if the PC points to an I/O range.

**Instructions covered:**

- CLC, CLD, CLI, CLV
- DEX, DEY, INX, INY
- NOP
- SEC, SED, SEI
- TAX, TAY, TSX, TXA, TYA

**Behavior summary:**

- **Cycle 1:** Opcode fetch from PC (Address Bus = PC, Data Bus = opcode byte, R/W = Read). PC is incremented.
- **Cycle 2:** Dummy read from the new PC (Address Bus = PC+1, Data Bus = byte at that address, R/W = Read). The CPU performs the internal operation during this cycle.

**Notes:**

- The data from the dummy read is not used as an operand but may affect timing-sensitive hardware.
- This pattern is consistent across the listed implied single-byte instructions on the NMOS 6510.

## Source Code

```text
Implied single-byte instruction bus activity (NMOS 6510)

All listed instructions: 2 cycles

Cycle | Address Bus           | Data Bus                      | R/W
------+-----------------------+-------------------------------+-----
  1   | PC (opcode fetch)     | opcode byte (this instruction)| Read
  2   | PC+1 (next byte)      | next program byte (dummy read)| Read

Example (PC initially points at the implied opcode):
- Cycle 1: Address = PC, Data = <opcode>, R/W = R   ; CPU fetches opcode, PC -> PC+1
- Cycle 2: Address = PC (now PC+1), Data = <next byte>, R/W = R  ; dummy read of next program byte

(Interpretation: the second-cycle read places whatever the memory at PC contains onto the data bus; if PC points into an I/O range, this will read that I/O register.)
```

## References

- "unintended_memory_accesses_and_dummy_fetches_accumulator" — expands on Accumulator-mode dummy fetch pattern and general introduction to dummy fetches
- "rra_ror_then_adc_instruction" — covers a related undocumented opcode whose semantics may interact with internal fetch behavior

## Mnemonics
- CLC
- CLD
- CLI
- CLV
- DEX
- DEY
- INX
- INY
- NOP
- SEC
- SED
- SEI
- TAX
- TAY
- TSX
- TXA
- TYA
