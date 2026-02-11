# FSUBT — BASIC's subtraction operation ($B853)

**Summary:** FSUBT at $B853 implements BASIC floating-point subtraction by complementing the sign of FAC1 and then performing an addition; affects the floating-point accumulators FAC1 and ARG.

**Operation**
FSUBT implements FAC1 := FAC1 - ARG. The subtraction is performed by complementing (negating) the sign of FAC1 and then performing the addition path used for floating-point addition. In other words, FAC1's sign bit is flipped, and the resulting value is added to ARG using BASIC's floating-point addition routine FADDT.

## Source Code
```assembly
; FSUBT - Floating Point Subtraction
; Entry point: $B853
; Subtracts the value in ARG from FAC1 and stores the result in FAC1.

FSUBT:
    LDA $61        ; Load the sign byte of FAC1
    EOR #$80       ; Complement the sign bit
    STA $61        ; Store the complemented sign back to FAC1
    JMP FADDT      ; Jump to the floating-point addition routine
```

## Key Registers
- **FAC1 ($61-$66):** Floating-point accumulator 1, holds the first operand and the result.
- **ARG ($75-$7A):** Floating-point accumulator 2, holds the second operand.

## References
- "faddh_and_fsub" — expands on related move/subtract entry (FSUB moves memory into FAC2 before subtraction).
- "fadd_faddt_fadd4_addition_operations" — expands on analogous addition routines (FADDT) for the addition path.

## Labels
- FSUBT
- FAC1
- ARG
