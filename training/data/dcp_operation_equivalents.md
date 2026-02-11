# NMOS 6510 — DCP (illegal) — Decrement and Compare Memory with A

**Summary:** DCP is an NMOS 6510 illegal opcode that decrements a memory location and then compares the decremented result with the A register, affecting N, Z and C flags (like DEC followed by CMP). Searchable terms: DCP, DEC, CMP, NMOS 6510, N Z C flags.

## Operation
Decrement the contents of a memory location and then compare the result with the A register. The processor sets the N, Z and C flags according to the compare that occurs after the decrement (i.e., as if performing DEC <mem> then CMP <mem>).

Equivalence: The visible effect on memory and flags is the same as executing:
- DEC <mem>
- CMP <mem>

No further behavioral detail (timing/opcode variants) is included here; see referenced opcode-variants table for addressing-mode opcode bytes.

## Source Code
```asm
; Example (zero page):
DCP $FF        ; opcode bytes: C7 FF

; Equivalent legal sequence:
DEC $FF
CMP $FF
```

```text
Test code / verification filenames:
Lorenz-2.15/dcma.prg
Lorenz-2.15/dcmax.prg
Lorenz-2.15/dcmay.prg
Lorenz-2.15/dcmix.prg
Lorenz-2.15/dcmiy.prg
Lorenz-2.15/dcmz.prg
Lorenz-2.15/dcmzx.prg
64doc/dincsbc-deccmp.prg
```

## References
- "dcp_opcode_variants_table" — expands which opcode bytes and addressing modes implement DCP
- "dcp_example_decrement_loop_counter" — shows practical use replacing DEC+LDA+CMP with DCP in loops

## Mnemonics
- DCP
- DCM
