# EXP series constants in ROM ($BFBF-$BFE8)

**Summary:** ROM data at $BFBF-$BFE8 contains the 1/LOG(2) constant ($BFBF), a series count byte ($BFC4), and a table of 5-byte floating-point coefficients used by the EXP series expansion (C64 5-byte float format). These constants are referenced by EXP/log conversion routines (e.g. exp_entry_prepare, power_function_driver).

## Description
This ROM block provides the numeric constants used to prepare and evaluate the exponential (EXP) series kernel in the Commodore 64 ROM math routines.

- $BFBF..$BFC3 (5 bytes) — 1.44269504 (1/LOG(2)), used to convert between natural-log and base-2 scalings when computing pow/exp/log.
- $BFC4 (1 byte) — series count: 07 (number of 5-byte coefficients that follow).
- $BFC5..$BFE8 — seven 5-byte floating-point coefficients for the EXP series expansion, ordered from smallest to largest term, ending with 1.00000000. Each coefficient is stored in the C64 5-byte floating-point format (1 exponent + 4 mantissa bytes).

These constants are loaded/pointed-to by the ROM routines that compute exponentials and powers; callers include the power_function_driver and exp_entry_prepare routines (see References).

## Source Code
```asm
.:BFBF 81 38 AA 3B 29           1.44269504 = 1/LOG(2)
.:BFC4 07                       series count
.:BFC5 71 34 58 3E 56           2.14987637E-5
.:BFCA 74 16 7E B3 1B           1.43523140E-4
.:BFCF 77 2F EE E3 85           1.34226348E-3
.:BFD4 7A 1D 84 1C 2A           9.61401701E-3
.:BFD9 7C 63 59 58 0A           5.55051269E-2
.:BFDE 7E 75 FD E7 C6           2.40226385E-1
.:BFE3 80 31 72 18 10           6.93147186E-1
.:BFE8 81 00 00 00 00           1.00000000
```

## References
- "power_function_driver" — uses these constants when converting/scaling with LOG/EXP
- "exp_entry_prepare" — loads the 1.443 pointer and uses the series table