# FMULT / MLTPLY / CONUPK / MULDIV / MLDVEX — Floating-point multiply and exponent adjustment (ROM $BA28-$BAD4)

**Summary:** 6502 ROM routines at $BA28-$BAD4 implementing floating-point multiplication and exponent handling for FAC1/FAC2 (floating-point accumulators). Includes FMULT (multiply FAC1 by FAC2), MLTPLY (byte-repeat add helper), CONUPK (unpack 4‑byte compact format into FAC2), MULDIV (add exponents), and MLDVEX (underflow/overflow handling).

**Routines Overview**
- **FMULT ($BA28):** Multiply FAC1 with FAC2 and store the result in FAC1.
- **MLTPLY ($BA59):** Multiply a byte subroutine: repetitively adds a mantissa byte of FAC2 into FAC1 the number of times specified in the A register (used as repeated-add multiplication helper).
- **CONUPK ($BA8C):** Move (load) a floating-point number from a 4‑byte compact memory format into FAC2. The source is pointed to by the A and Y registers; format is 3 mantissa bytes + 1 sign byte.
- **MULDIV ($BAB7):** Add exponent of FAC1 to exponent of FAC2 (exponent handling used during multiply/divide).
- **MLDVEX ($BAD4):** Handle underflow or overflow resulting from exponent adjustments (range/normalization fixes).

Notes:
- FAC1 and FAC2 refer to the internal floating-point accumulators (three-byte mantissa + exponent/sign conventions) used by the ROM floating-point routines.
- MLTPLY is a low-level helper invoked by the multiply implementation to perform repeated-add of a single mantissa byte; it relies on the A register containing the repeat count.
- CONUPK expects a compact 4-byte representation (three mantissa bytes, one sign/exponent byte) at the address pointed to by A/Y — it loads that into FAC2.

## Source Code
```assembly
; FMULT: Multiply FAC1 by FAC2
; Entry: FAC1 and FAC2 contain the operands
; Exit: FAC1 contains the product
; Clobbers: A, X, Y, FAC1, FAC2, $26-$29, $70

FMULT:
    JSR CONUPK        ; Load FAC2 from memory
    LDA FAC1EXP       ; Load exponent of FAC1
    BEQ FMULT_DONE    ; If FAC1 is zero, result is zero
    LDA FAC2EXP       ; Load exponent of FAC2
    BEQ FMULT_DONE    ; If FAC2 is zero, result is zero
    JSR MULDIV        ; Add exponents
    JSR MLTPLY        ; Multiply mantissas
    JSR MLDVEX        ; Handle overflow/underflow
FMULT_DONE:
    RTS

; MLTPLY: Multiply mantissas
; Entry: FAC1 and FAC2 contain the mantissas
; Exit: FAC1 contains the product mantissa
; Clobbers: A, X, Y, FAC1, $26-$29, $70

MLTPLY:
    ; Implementation of mantissa multiplication
    ; using repeated addition and shifting
    ; ...
    RTS

; CONUPK: Load FAC2 from memory
; Entry: A/Y point to the 4-byte compact format number
; Exit: FAC2 contains the unpacked number
; Clobbers: A, X, Y, FAC2

CONUPK:
    ; Implementation of unpacking routine
    ; ...
    RTS

; MULDIV: Add exponents
; Entry: FAC1EXP and FAC2EXP contain the exponents
; Exit: FAC1EXP contains the sum
; Clobbers: A

MULDIV:
    ; Implementation of exponent addition
    ; ...
    RTS

; MLDVEX: Handle overflow/underflow
; Entry: FAC1EXP contains the exponent
; Exit: FAC1EXP adjusted for overflow/underflow
; Clobbers: A

MLDVEX:
    ; Implementation of overflow/underflow handling
    ; ...
    RTS
```

## Key Registers
- **FAC1 (Floating Point Accumulator 1):**
  - Exponent: $61
  - Mantissa: $62-$65
  - Sign: $66
- **FAC2 (Floating Point Accumulator 2):**
  - Exponent: $69
  - Mantissa: $6A-$6D
  - Sign: $6E

## References
- "mulshf_shift_routine" — shift helper used by multiplication internals
- "mul_div_helpers_and_division" — division and multiply-by-10 helpers used elsewhere in conversion and division routines

## Labels
- FMULT
- MLTPLY
- CONUPK
- MULDIV
- MLDVEX
