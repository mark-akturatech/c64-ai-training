# NMOS 6510 - Zeropage Indirect,Y read-modify-write (R-M-W) cycle timeline

**Summary:** Cycle-by-cycle timeline for a Zeropage Indirect,Y ((d),Y) read-modify-write instruction on the NMOS 6510: shows bus R/W, program-counter fetches, direct (zero-page) offset access, dummy read before index addition, DO+X low/high address fetch, old-data read, unmodified write-back, and final write of new data. Includes simulation link and footnotes explaining the dummy read and write-back behavior.

## Cycle-by-Cycle Overview
- Context: NMOS 6510, Zeropage Indirect,Y addressing mode ((d),Y) used by a read-modify-write instruction (R-M-W).
- Abbreviations: DO = direct (zero-page) offset (one-byte pointer) (zero-page address), AA = absolute address (two-byte effective address).
- Cycle summary:
  - Cycle 1: PC — opcode fetch (Read).
  - Cycle 2: PC+1 — fetch direct offset (Read).
  - Cycle 3: DO — dummy read from the direct (zero-page) offset (Read). (*1)
  - Cycle 4: DO + X — fetch low byte of effective (absolute) address (Read).
  - Cycle 5: DO + X + 1 — fetch high byte of effective (absolute) address (Read).
  - Cycle 6: AA — read old data from the effective address (Read).
  - Cycle 7: AA — write unmodified (old) data back to the effective address (Write). (*2)
  - Cycle 8: AA — write new (modified) data to the effective address (Write).

- Behavior notes:
  - The dummy read on cycle 3 occurs before the zero-page pointer is indexed by Y (the indirection base is read first).
  - An R-M-W sequence includes a write-back of the unmodified data (cycle 7) followed by the actual modified-data write (cycle 8). This write-back is part of the bus cycle sequence required by the NMOS hardware.

## Source Code
```text
Data-Bus

Read/Write

1

PC

Op Code Fetch

R

2

PC + 1

Direct Offset

R

3 (*1) DO

Byte at direct offset

R

4

DO + X

Absolute Address Low

R

5

DO + X + 1

Absolute Address High

R

6

AA

Old Data

R

7 (*2) AA

Old Data

W

8

New Data

W

AA

Simulation Link: http://visual6502.org/JSSim/expert.html?
graphics=f&a=0&steps=22&d=a2d0c310eaeaeaeaeaeaeaeaeaeaeaea1280

(*1) Dummy read from direct offset before index was added
(*2) Unmodified data is written back to the target address
```

## References
- "unintended_bugs_and_quirks_zeropage_indirect_interrupts" — expands on related addressing and interrupt behaviours from the 'Unintended bugs and quirks' chapter
- "opcode_naming_in_different_assemblers_matrix" — expands on related undocumented R-M-W opcodes that use this cycle behaviour