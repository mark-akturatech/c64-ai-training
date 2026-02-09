# NMOS 6510 — Undocumented absolute and absolute,X NOPs ($0C, $1C/$3C/$5C/$7C/$DC/$FC)

**Summary:** Undocumented 6510 NOP opcodes that use absolute ($0C) and absolute,X addressing ($1C,$3C,$5C,$7C,$DC,$FC). All are 3-byte instructions that perform a memory read from the computed address (value discarded); $0C = 4 cycles, abs,X variants = 4 cycles (plus +1 if a page boundary is crossed).

## Overview
These undocumented opcodes behave as no-operation instructions (do not modify registers or flags) while performing a memory read from the addressed location:

- $0C — NOP absolute: 3 bytes, absolute addressing, fixed 4 cycles.
- $1C, $3C, $5C, $7C, $DC, $FC — NOP absolute,X: 3 bytes, absolute indexed X addressing, 4 cycles normally, +1 cycle if the address crosses a page boundary.

Operation specifics:
- The instruction computes the absolute address (for $0C) or absolute+X (for the abs,X group), performs a memory read from that address, and discards the read byte.
- No registers or processor status flags are altered by these opcodes (only PC and timing change).
- Because the abs,X variants use indexed addressing, crossing a page boundary during address calculation incurs the documented +1 cycle penalty.

Test vectors:
- The Lorenz test files listed in References validate the opcodes' behavior.

## Source Code
```text
Opcode  Mnemonic     Addressing    Size  Cycles    Page-boundary penalty
$0C     NOP abs      Absolute      3     4         (none)
$1C     NOP abs,X    Absolute,X    3     4  (+1)   (+1 cycle if page crossed)
$3C     NOP abs,X    Absolute,X    3     4  (+1)
$5C     NOP abs,X    Absolute,X    3     4  (+1)
$7C     NOP abs,X    Absolute,X    3     4  (+1)
$DC     NOP abs,X    Absolute,X    3     4  (+1)
$FC     NOP abs,X    Absolute,X    3     4  (+1)
```

```asm
; Minimal assembly examples (illustrative)
        .org $0800
; NOP absolute ($0C) -> operand low/high follow opcode
        .byte $0C, $00, $40     ; NOP $4000
; NOP absolute,X ($1C) -> operand low/high follow opcode, X is added to low/high
        .byte $1C, $00, $40     ; NOP $4000,X
```

## References
- "Lorenz-2.15/nopa.prg" — tests absolute NOP ($0C)
- "Lorenz-2.15/nopax.prg" — tests absolute,X NOPs
- "Lorenz-2.15/nopb.prg" — related NOP tests
- "Lorenz-2.15/nopn.prg" — related NOP tests
- "Lorenz-2.15/nopz.prg" — related NOP tests
- "Lorenz-2.15/nopzx.prg" — related NOP tests (zero-page/zero-page,X analogs)
- "zero_page_x_nops" — discusses zero-page,X NOP variants (analogous indexed-mode read-only NOPs)
- "examples_irq_and_skip_examples" — shows examples using abs,X NOPs (acknowledge IRQ, skipping instructions)