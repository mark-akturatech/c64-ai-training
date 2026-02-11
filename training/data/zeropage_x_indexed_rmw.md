# NMOS 6510 — Zero-page X-indexed R-M-W timing (zp,X) — ASL/DEC/INC/ISC/LSR/ROL/ROR/RRA etc

**Summary:** Cycle-by-cycle read-modify-write (R-M-W) timing for zero-page,X indexed addressing variants (zp,X) on NMOS 6510/6502: shows opcode/direct-offset fetches, the dummy read from the target (before the high byte correction), two old-data reads, an unmodified-data write-back, and the final write of modified data. Searchable terms: R-M-W, dummy fetch, unmodified write-back, zp,X, ASL/DEC/INC/ISC/LSR/ROL/ROR/RRA, DCP/ISC/RLA/RRA/SLO.

**Timing sequence (per-cycle behavior)**

This document details the standard 8-cycle R-M-W sequence observed on NMOS 6502-family processors for zero-page,X indexed R-M-W instructions (examples: ASL/DEC/INC/LSR/ROL/ROR and unofficial/illegal R-M-W opcodes such as ISC/DCP/RLA/RRA/SLO).

Sequence summary (conceptual):

- **Cycle 1:** Opcode fetch from PC (read).
- **Cycle 2:** Fetch zero-page address from PC+1 (read).
- **Cycle 3:** Add X to zero-page address; read from resulting address (read).
- **Cycle 4:** Read from effective address (read).
- **Cycle 5:** Dummy read from effective address (read).
- **Cycle 6:** Read from effective address (read).
- **Cycle 7:** Write back unmodified data to effective address (write).
- **Cycle 8:** Write modified data to effective address (write).

Important semantics preserved:

- The dummy read (cycle 5) occurs from the effective address before any modification.
- An unmodified-data write-back (cycle 7) occurs between the data read(s) and the final write. This means a store of the original value is performed to memory before the modified value is stored (observable on bus, can cause side effects with memory-mapped hardware).

## Source Code

```text
Cycle-by-cycle listing:

1
PC
Opcode fetch
R

2
PC + 1
Zero-page address
R

3
Zero-page address + X
Effective address
R

4
Effective address
Old Data
R

5
Effective address
Dummy read
R

6
Effective address
Old Data
R

7
Effective address
Old Data
W

8
Effective address
New Data
W
```

## Key Registers

- **PC:** Program Counter
- **X:** Index Register X

## References

- "6502 Instruction Set" — detailed documentation of 6502 instructions and addressing modes. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))
- "6502 Instruction Tables" — comprehensive tables of 6502 opcodes and cycles. ([masswerk.at](https://www.masswerk.at/6502/instruction-tables/?utm_source=openai))
- "CPU - 6502" — detailed cycle-by-cycle breakdowns of 6502 instructions. ([fceux.com](https://fceux.com/web/help/6502CPU.html?utm_source=openai))

## Mnemonics
- ASL
- DEC
- INC
- LSR
- ROL
- ROR
- ISC/ISB/INS
- DCP/DCM
- RLA
- RRA
- SLO/ASO
