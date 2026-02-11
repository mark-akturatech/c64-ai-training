# FHALF / FOUTBL / FDCEND — Floating-point constants and tables ($BF11, $BF1C, $BF3A)

**Summary:** Describes three floating-point constant tables used by BASIC's printing and TI$ conversion routines: FHALF at $BF11 (five-byte FP 1/2 for rounding and SQR), FOUTBL at $BF1C (four-byte FP powers of -10 for FOUT/printing), and FDCEND at $BF3A (FP powers of -60 × 1 or 10 for TI$ → ASCII conversion).

**Constants and tables**

- **FHALF ($BF11 / decimal 48913)**
  - The five-byte floating-point constant representing the value 1/2.
  - Used by the rounding logic and the SQR (square-root) routine.
  - Stored in the 5-byte floating-point format used by the Commodore 64:
    - Exponent byte: $80
    - Mantissa bytes: $00, $00, $00, $00
    - This corresponds to the value 0.5 in the C64's floating-point representation.

- **FOUTBL ($BF1C / decimal 48924)**
  - Table of powers of -10 stored as four-byte floating-point numbers.
  - Contains the following entries:
    - -1
    - +10
    - -100
    - +1000
    - -10,000
    - +100,000
    - -1,000,000
    - +10,000,000
    - -100,000,000
  - Each entry is stored in a 4-byte floating-point format:
    - Exponent byte
    - Mantissa bytes (3 bytes)
    - The sign bit is stored in the most significant bit of the first mantissa byte.
  - Used by FOUT and line-number printing routines to assist decimal/exponent conversion and formatting.

- **FDCEND ($BF3A / decimal 48954)**
  - Table of floating-point constants for TI$ conversion.
  - Contains representations of powers of -60 multiplied by 1 or 10 (values used when converting TI$ timestamps to ASCII).
  - Each entry is stored in a 4-byte floating-point format, similar to FOUTBL.
  - Employed by TI$ → ASCII conversion routines.

## Source Code

```asm
; Label and address listing with raw FP byte values

48913       $BF11   FHALF    ; Five-byte FP constant: 1/2 (used for rounding, SQR)
           .byte $80, $00, $00, $00, $00

48924       $BF1C   FOUTBL   ; Table: powers of -10 as four-byte FP numbers:
           ;   -1, +10, -100, +1000, -10,000, +100,000,
           ;   -1,000,000, +10,000,000, -100,000,000
           .byte $81, $80, $00, $00  ; -1
           .byte $82, $50, $00, $00  ; +10
           .byte $83, $C8, $00, $00  ; -100
           .byte $84, $3E, $80, $00  ; +1000
           .byte $85, $98, $96, $00  ; -10,000
           .byte $86, $86, $A0, $00  ; +100,000
           .byte $87, $F4, $24, $00  ; -1,000,000
           .byte $88, $98, $96, $80  ; +10,000,000
           .byte $89, $BE, $BC, $20  ; -100,000,000

48954       $BF3A   FDCEND   ; Table: FP representations of powers of -60 * (1 or 10)
           ;   (used for TI$ → ASCII conversion)
           .byte $81, $80, $00, $00  ; -1
           .byte $82, $50, $00, $00  ; +10
           .byte $83, $C8, $00, $00  ; -100
           .byte $84, $3E, $80, $00  ; +1000
           .byte $85, $98, $96, $00  ; -10,000
           .byte $86, $86, $A0, $00  ; +100,000
           .byte $87, $F4, $24, $00  ; -1,000,000
           .byte $88, $98, $96, $80  ; +10,000,000
           .byte $89, $BE, $BC, $20  ; -100,000,000
```

## References

- "inprt_linprt_and_fout_printing" — expands on tables used directly by FOUT and line-number printing routines
- "sqr_and_fpwrt_exponentiation" — expands on FHALF's role in rounding and square-root routines