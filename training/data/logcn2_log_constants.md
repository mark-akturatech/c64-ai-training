# LOGCN2 — table of eight floating point constants (five-byte FP) used by LOG

**Summary:** Table label LOGCN2 at address $B9C1 (decimal 47553) — eight numeric constants stored in Commodore five-byte floating point format used by the LOG (natural logarithm) routine during logarithm computation.

**Description**
The LOGCN2 table, located at $B9C1 (47553), consists of eight numeric constants encoded in the Commodore five-byte floating point representation. These constants are utilized by the LOG function implementation as part of the logarithm calculation algorithm.

The table is structured as follows:

- **Offset $00**: Degree of the polynomial (3), indicating four coefficients follow.
- **Offset $01–$05**: Coefficient for X^7 term.
- **Offset $06–$0A**: Coefficient for X^5 term.
- **Offset $0B–$0F**: Coefficient for X^3 term.
- **Offset $10–$14**: Coefficient for X^1 term.

The constants in the table are:

- **Coefficient for X^7 term**:
  - Raw bytes: $7F, $5E, $56, $CB, $79
  - Decoded value: 0.43425594189
- **Coefficient for X^5 term**:
  - Raw bytes: $80, $13, $9B, $0B, $64
  - Decoded value: 0.57658454124
- **Coefficient for X^3 term**:
  - Raw bytes: $80, $76, $38, $93, $16
  - Decoded value: 0.96180075919
- **Coefficient for X^1 term**:
  - Raw bytes: $82, $38, $AA, $3B, $20
  - Decoded value: 2.8853900731

These coefficients are used in a polynomial approximation within the LOG function to compute the natural logarithm. The LOG function calls the POLY1 routine, passing the address of LOGCN2, to evaluate the polynomial. The result of the polynomial evaluation is then adjusted by subtracting 0.5 to obtain the final logarithm value.

The LOGCN2 table is part of the BASIC ROM, specifically within the bank containing the floating-point math routines. The LOG function's entry point is at $B9EA, immediately following the LOGCN2 table.

## Source Code
```assembly
; LOGCN2 table at $B9C1
LOGCN2:
    .byte $03                    ; Degree of the polynomial (3)
    .byte $7F, $5E, $56, $CB, $79  ; Coefficient for X^7 term: 0.43425594189
    .byte $80, $13, $9B, $0B, $64  ; Coefficient for X^5 term: 0.57658454124
    .byte $80, $76, $38, $93, $16  ; Coefficient for X^3 term: 0.96180075919
    .byte $82, $38, $AA, $3B, $20  ; Coefficient for X^1 term: 2.8853900731
```

## References
- "log_natural_log_function" — expands on constants used directly by the LOG routine
- "exp_constants_and_exp_function" — expands on related exponential constants/tables used by EXP/LOG calculations