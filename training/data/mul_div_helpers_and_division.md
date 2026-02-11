# MUL10 / TENC / DIV10 / FDIV / FDIVT — FAC1/FAC2 Floating-Point Helpers ($BAE2–$BB12)

**Summary:** Floating-point helper routines in the Commodore 64 BASIC ROM for multiplying and dividing the FAC1/FAC2 five-byte floating-point format. Entry points include $BAE2 (MUL10), $BAF9 (TENC), $BAFE (DIV10), $BB0F (FDIV), and $BB12 (FDIVT). These routines are utilized in float-to-ASCII conversion and general floating-point division, incorporating a division-by-zero check. The C64's five-byte floating-point format consists of a 1-byte exponent and a 4-byte mantissa.

**Description**

- **$BAE2 — MUL10:** Multiplies FAC1 by decimal 10. This routine is called during floating-point to ASCII conversion to shift decimal digits out of the fractional portion, facilitating digit extraction.

- **$BAF9 — TENC:** Stores the constant 10 in the Commodore BASIC five-byte floating-point format. This constant is used by the MUL10 and DIV10 routines.

- **$BAFE — DIV10:** Divides FAC1 by decimal 10. This routine is used when normalizing or stepping digits during formatting and parsing operations.

- **$BB0F — FDIV:** Loads a number from memory into FAC2 and then falls through to FDIVT. It prepares a memory-stored number to be divided by FAC1.

- **$BB12 — FDIVT:** Divides FAC2 by FAC1, placing the result into FAC1. This routine performs a division-by-zero check before executing the division.

**Behavioral Notes:**

- These routines operate on the interpreter's FAC1 and FAC2 five-byte floating-point accumulators, which are used in BASIC's floating-point operations.

- MUL10 and DIV10 are explicitly used by the float-to-ASCII conversion routines for digit extraction and scaling.

- FDIV copies a memory-stored value into FAC2 and then performs the division FAC2 / FAC1, storing the result in FAC1 via FDIVT.

- FDIVT contains logic to detect division by zero and handle it before performing the division. If division by zero is detected, a `?DIVISION BY ZERO ERROR` is triggered.

- Exponent and mantissa handling (including normalization, rounding, and exponent adjustment) for multiplication and division follow the conventions shared with BASIC's multiplication internals.

## Source Code

```assembly
; MUL10 ($BAE2)
BAE2  20 0C BC    JSR MOVFA      ; Round FAC1 and copy to ARG
BAE5  A5 66       LDA $66        ; Load sign byte of FAC1
BAE7  85 6F       STA $6F        ; Store sign byte in $6F
BAE9  A5 62       LDA $62        ; Load exponent of FAC1
BAEB  F0 0C       BEQ $BAF9      ; If exponent is zero, jump to TENC
BAED  18          CLC            ; Clear carry flag
BAEE  69 02       ADC #$02       ; Add 2 to exponent (multiply by 4)
BAF0  90 02       BCC $BAF4      ; If no overflow, skip next instruction
BAF2  E6 63       INC $63        ; Increment high byte of mantissa
BAF4  85 62       STA $62        ; Store new exponent
BAF6  4C 28 BA    JMP FMULT      ; Multiply FAC1 by ARG
```

```assembly
; TENC ($BAF9)
BAF9  00          .BYTE $00      ; Exponent byte
BAFA  00          .BYTE $00      ; Mantissa byte 1
BAFB  00          .BYTE $00      ; Mantissa byte 2
BAFC  00          .BYTE $00      ; Mantissa byte 3
BAFD  00          .BYTE $00      ; Mantissa byte 4
```

```assembly
; DIV10 ($BAFE)
BAFE  20 0C BC    JSR MOVFA      ; Round FAC1 and copy to ARG
BB01  A9 F9       LDA #$F9       ; Load low byte of TENC address
BB03  A0 BA       LDY #$BA       ; Load high byte of TENC address
BB05  20 A2 BB    JSR MOVFM      ; Load TENC into FAC1
BB08  A9 00       LDA #$00       ; Load zero
BB0A  85 6F       STA $6F        ; Store zero in $6F (positive sign)
BB0C  4C 12 BB    JMP FDIVT      ; Jump to FDIVT
```

```assembly
; FDIV ($BB0F)
BB0F  20 A2 BB    JSR MOVFM      ; Load number from memory into FAC2
BB12  4C 12 BB    JMP FDIVT      ; Jump to FDIVT
```

```assembly
; FDIVT ($BB12)
BB12  A5 62       LDA $62        ; Load exponent of FAC1
BB14  F0 0C       BEQ $BB22      ; If exponent is zero, jump to division by zero error
BB16  20 0C BC    JSR MOVFA      ; Round FAC1 and copy to ARG
BB19  20 28 BA    JSR FMULT      ; Multiply FAC1 by ARG
BB1C  20 0C BC    JSR MOVFA      ; Round FAC1 and copy to ARG
BB1F  4C 28 BA    JMP FMULT      ; Multiply FAC1 by ARG
BB22  4C 5B A4    JMP ERROR      ; Jump to error handler
```

## Key Registers

- **FAC1 ($61–$65):** Floating-point accumulator 1.

- **FAC2 ($66–$6A):** Floating-point accumulator 2.

- **ARG ($6B–$6F):** Floating-point argument register.

- **$6F:** Sign byte for floating-point operations.

## References

- "fmultiplication_internals" — multiplication/division exponent handling and shared internals

- "fout" — use of MUL10/DIV10 during floating-point to ASCII conversion routines

## Labels
- MUL10
- TENC
- DIV10
- FDIV
- FDIVT
- FAC1
- FAC2
- ARG
