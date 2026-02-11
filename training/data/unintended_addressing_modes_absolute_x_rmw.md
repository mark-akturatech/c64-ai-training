# NMOS 6510 — Unintended Absolute,X Read‑Modify‑Write (R‑M‑W)

**Summary:** Unintended Absolute,X (abs,X) R‑M‑W behavior on the NMOS 6510 / 6502: 3‑byte addressing, 7 CPU cycles, dummy fetch semantics, and page‑cross handling. Covers undocumented opcodes $DF, $FF, $7F, $3F, $1F, $5F (DCP, ISC, RRA, RLA, SLO, SRE) and shows the per‑cycle bus sequence which matches the legal R‑M‑W (ASL/DEC/INC/LSR/ROL/ROR) timing.

**Description**

These undocumented/illegal opcodes that use Absolute,X addressing perform a three‑byte operand fetch (low, high) and execute a read‑modify‑write sequence occupying 7 clock cycles. The machine executes:

- **Cycle 1:** Opcode fetch
- **Cycle 2:** Operand low byte fetch
- **Cycle 3:** Operand high byte fetch
- **Cycle 4:** Dummy memory read used for index addition (abs + X); this is where the low‑byte + X carry is applied, and the effective high byte is adjusted if the addition crosses a page boundary
- **Cycle 5:** Read of the memory location (old data)
- **Cycle 6:** Write of the modified value (first write)
- **Cycle 7:** Write of the final modified value (second write)

The undocumented opcodes listed below behave as combined operations—a read‑modify on memory followed by an accumulator-affecting operation—but their memory access timing for abs,X is the same 3‑byte, 7‑cycle R‑M‑W sequence. The hardware performs a dummy fetch (cycle 4) that ensures proper address calculation with X; if low+X crosses a page boundary, the high byte used for the subsequent memory read (cycle 5) is incremented accordingly.

This node documents:

- The specific undocumented opcode bytes involved
- Their unofficial mnemonic names
- The canonical 7‑cycle per‑cycle bus activity for abs,X R‑M‑W
- The correspondence to the legal single‑operation equivalents (ASL/DEC/INC/LSR/ROL/ROR) used in timing diagrams

Behavioral notes:

- The instruction is encoded as three bytes (opcode, low, high).
- The extra cycle for abs,X R‑M‑W (relative to absolute R‑M‑W) comes from the dummy fetch for index addition; page crossing is handled during that dummy fetch and updates the effective high byte.
- Because of the read‑modify‑write pattern, the location is read once and written twice (internal hardware causes the double write).

## Source Code

```asm
; Undocumented opcode bytes (Absolute,X R-M-W variants) and their common unofficial mnemonics
; Mapping provided in source:
; $DF  — DCP (DEC then CMP)
; $FF  — ISC (INC then SBC)   ; also called ISB / INS in some docs
; $7F  — RRA (ROR then ADC)
; $3F  — RLA (ROL then AND)
; $1F  — SLO (ASL then ORA)   ; also called ASO in some docs
; $5F  — SRE (LSR then EOR)   ; also called LSE in some docs
```

```text
Per-cycle bus activity for Absolute,X R-M-W (3‑byte, 7‑cycle)

Cycle | Activity                          | Address on Bus         | Data on Bus / R‑W
------+-----------------------------------+------------------------+-----------------------
1     | Opcode fetch                      | PC                     | Opcode (R)
2     | Operand low byte fetch            | PC + 1                 | Low byte (R)
3     | Operand high byte fetch           | PC + 2                 | High byte (R)
4     | Dummy memory read for (abs + X)   | Effective addr (pre-corrected) | Dummy read (R)
      |   (low + X carry adjusted here)   |                        |
5     | Read memory (old data)            | Effective addr         | Old data (R)
6     | Write modified data (1st write)   | Effective addr         | Modified data (W)
7     | Write modified data (2nd write)   | Effective addr         | Modified data (W)

Notes:
- Effective addr = (abs low + X) with carry applied to high byte as needed.
- Cycle 4 is the extra cycle that makes abs,X R‑M‑W one cycle longer than plain absolute R‑M‑W.
- Page crossing: if (low + X) > $FF, the high byte used for cycles 5–7 is incremented during/after cycle 4.
```

```text
Equivalent (legal) single‑operation behaviors reflected by the R‑M‑W portion:
; The undocumented opcodes internally perform a memory R-M-W similar to these legal ops:
ASL  — arithmetic shift left (used by SLO family)
LSR  — logical shift right (used by SRE family)
ROL  — rotate left (used by RLA family)
ROR  — rotate right (used by RRA family)
INC  — increment memory (used by ISC family)
DEC  — decrement memory (used by DCP family)

; After the memory R-M-W, the undocumented opcode performs an additional accumulator op
; (CMP/SBC/ADC/AND/ORA/EOR respectively) — that second ALU step is the non‑standard part.
```

```text
Timing diagram for Absolute,X Read-Modify-Write instruction (7 cycles):

Cycle | Address Bus | Data Bus | R/W | Description
------+-------------+----------+-----+------------------------------
1     | PC          | OPCODE   | R   | Fetch opcode
2     | PC + 1      | ADL      | R   | Fetch low byte of address
3     | PC + 2      | ADH      | R   | Fetch high byte of address
4     | ADH, ADL+X* | Dummy    | R   | Dummy read at adjusted address
5     | ADH', ADL+X | DATA     | R   | Read from effective address
6     | ADH', ADL+X | DATA     | W   | Write back unmodified data
7     | ADH', ADL+X | DATA'    | W   | Write modified data

* If (ADL + X) > $FF, ADH' = ADH + 1 (page boundary crossed)
```

```text
Example of per-cycle bus activity for opcode $DF (DCP abs,X):

Assume:
- PC = $1000
- X = $10
- Memory at $1234 contains $56

Cycle | Address Bus | Data Bus | R/W | Description
------+-------------+----------+-----+------------------------------
1     | $1000       | $DF      | R   | Fetch opcode
2     | $1001       | $34      | R   | Fetch low byte of address
3     | $1002       | $12      | R   | Fetch high byte of address
4     | $12, $44    | $XX      | R   | Dummy read at $1244
5     | $12, $44    | $56      | R   | Read from effective address
6     | $12, $44    | $56      | W   | Write back unmodified data
7     | $12, $44    | $55      | W   | Write modified data ($56 - 1)
```

## References

- "unintended_addressing_modes_absolute_y_rmw" — expands on related unintended mode Absolute,Y
- "indexed_read_modify_write_absx" — expands on indexed R‑M‑W behavior for abs,X

## Mnemonics
- DCP
- ISC
- ISB
- INS
- RRA
- RLA
- SLO
- ASO
- SRE
- LSE
