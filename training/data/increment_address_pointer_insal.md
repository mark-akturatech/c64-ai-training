# INCSAL / INCR — Increment SAL (two-byte source address)

**Summary:** KERNAL routine INCSAL at $FCDB increments the two-byte SAL pointer (low byte $00AC, high byte $00AD) using INC/BNE/INC/RTS. Machine opcodes: E6 AC / D0 02 / E6 AD / 60.

## Description
INCSAL (label at $FCDB) increments the two-byte source address pointer SAL: low byte at $00AC and high byte at $00AD. Operation sequence:
- INC $00AC — increment low byte.
- BNE $FCE1 — if low byte did not wrap to zero (non-zero), branch to INCR ($FCE1) and return.
- INC $00AD — if low byte wrapped (became zero), increment high byte.
- RTS — return.

Effect: the two-byte address in $00AC/$00AD is advanced by one, with correct carry propagation from low to high. SAL is used as the source address while fetching header/data characters (see referenced routine for context).

## Source Code
```asm
; INCREMENT ADDRESS POINTER SAL
; INCSAL INC SAL

        .org $FCDB
$FCDB   E6 AC     INC $AC        ; INCSAL  INC SAL (increment SAL low)
$FCDD   D0 02     BNE $FCE1      ;         BNE    INCR (if low != 0, skip high increment)
$FCDF   E6 AD     INC $AD        ;         INC    SAH (increment SAL high)
$FCE1   60        RTS            ; INCR    RTS
```

## Key Registers
- $00AC - Zero Page - SAL (source address) low byte
- $00AD - Zero Page - SAL (source address) high byte

## References
- "byte_finish_parity_and_header_character_output" — expands on INCSAL usage while fetching header/data characters (SAL) for BCC and output

## Labels
- INCSAL
- SAL
- SAH
