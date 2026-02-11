# MACHINE: AND 100 bytes ($17E0-$1844) — cycle-by-cycle timing example

**Summary:** 6502 timing example that ANDs 100 memory locations $17E0-$1844 using indexed absolute addressing (AND $17E0,X), showing per-instruction cycle counts, page-cross penalty explanation, and a total of 1171 cycles. Relevant mnemonics: LDX, LDA, AND (abs,X), INX, CPX, BCC, RTS; topic terms: page-cross, cycles, 6502 timing.

**Routine description and timing breakdown**
This routine clears the X register and the accumulator, then ANDs the accumulator with each byte in the 100-byte range $17E0–$1844 using indexed absolute addressing (AND $17E0,X). It increments X and loops until X == $64 (100 decimal). The AND instruction is an absolute,X addressing mode and incurs an extra cycle when the indexed address crosses a 256-byte page boundary.

Page-cross detail for this base address:
- Base low byte = $E0. Adding X crosses the page when $E0 + X > $FF.
- Solve: X >= $20 (32 decimal) causes a page-cross.
- For X = 0..31 (32 iterations) there is no page-cross (4 cycles each).
- For X = 32..99 (68 iterations) there is a page-cross (+1 cycle, 5 cycles each).

Per-instruction execution counts and cycles (as given):

- LDX #$00 — executed once: 2 cycles
- LDA #$00 — executed once: 2 cycles
- AND $17E0,X — 32 times at 4 cycles = 128 cycles; 68 times at 5 cycles = 340 cycles
- INX — 100 times at 2 cycles = 200 cycles
- CPX #$64 — 100 times at 2 cycles = 200 cycles
- BCC (branch back) — 99 times taken at 3 cycles = 297 cycles; 1 time not taken at 2 cycles = 2 cycles
- RTS — 6 cycles

Summation:
- 2 + 2 + (128 + 340) + 200 + 200 + (297 + 2) + 6 = 1171 cycles
- At a 1.0 MHz 6502 (C64 NTSC-style nominal), 1171 cycles ≈ 1.171 ms (approx. 1.17e-3 s)

Notes in source:
- The author suggests adding ~10% to allow for the effects of interrupts (or lock interrupts with SEI where appropriate).
- If this code is invoked as a subroutine, add the caller JSR cost (JSR = 6 cycles) on top of the listed total.

## Source Code
```asm
; Addresses shown as example (033C-0349) — routine ANDs $17E0..$1844 (100 bytes)

033C  LDX #$00
033E  LDA #$00
0340  AND $17E0,X
0343  INX
0345  CPX #$64
0347  BCC $0340
0349  RTS
```

```text
Timing breakdown (as provided in source):

LDX #$00 -- executed once:               2
LDA #$00 -- executed once:               2

AND $17E0,X:
  32 times at 4 cycles:  128
  68 times at 5 cycles:  340

INX -- 100 times at 2 cycles:           200
CPX #$64 -- 100 times at 2 cycles:      200

BCC -- 99 times at 3 cycles:            297
     1 time at 2 cycles (no branch):     2

RTS -- 6 cycles:                          6

Total time: 1171 cycles
```

## References
- "timing_rules_and_memory_cycles" — applies timing rules to concrete examples and expands on page-cross and cycle-count behavior

## Mnemonics
- LDX
- LDA
- AND
- INX
- CPX
- BCC
- RTS
