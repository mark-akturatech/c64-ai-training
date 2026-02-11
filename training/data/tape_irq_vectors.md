# TAPE IRQ VECTORS ($FD9B-$FDA1) — KERNAL

**Summary:** KERNAL ROM table at $FD9B-$FDA1 containing four 16-bit little-endian IRQ vectors used by tape handling: $FC6A (tape write), $FBCD (tape write II), $EA31 (normal IRQ), $F92C (tape read).

## Description
This KERNAL table holds four consecutive 16-bit vectors (low byte then high byte) that the tape-handling IRQ dispatcher uses to jump to the appropriate routine when a tape-related IRQ is serviced. The table entries map as follows:

- Vector at $FD9B-$FD9C -> $FC6A : tape write
- Vector at $FD9D-$FD9E -> $FBCD : tape write II
- Vector at $FD9F-$FDA0 -> $EA31 : normal IRQ
- Vector at $FDA1-$FDA2 -> $F92C : tape read

(Addresses are stored little-endian: low byte at the first address, high byte at the next.)

The table is part of the C64 KERNAL ROM and is referenced by tape handling code to dispatch different IRQ-time operations for reading/writing the tape. For more on how IRQ dispatching manipulates the stack and IRQ flags in tape contexts, see the referenced "fake_irq_tape" chunk.

## Source Code
```asm
.:FD9B 6A FC    ; $FD9B-$FD9C -> $FC6A - tape write
.:FD9D CD FB    ; $FD9D-$FD9E -> $FBCD - tape write II
.:FD9F 31 EA    ; $FD9F-$FDA0 -> $EA31 - normal IRQ
.:FDA1 2C F9    ; $FDA1-$FDA2 -> $F92C - tape read
```

## Key Registers
- $FD9B-$FDA1 - KERNAL ROM - Tape IRQ vector table (vectors to tape write, tape write II, normal IRQ, tape read)

## References
- "fake_irq_tape" — expands on FAKE IRQ TAPE behavior (manipulates processor stack and IRQ flags for tape IRQ handling)