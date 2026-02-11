# PI2: TABLE OF TRIGONOMETRY CONSTANTS ($E2E0-$E309)

**Summary:** Table of 5-byte floating-point (Commodore 40-bit FP) trig constants in the KERNAL/BASIC space at $E2E0-$E309, including pi/2 ($E2E0), 2*pi ($E2E5 and $E309), a 0.25 constant, a one-byte SIN-series counter at $E2EF, and six SIN-series floating-point coefficients used by the SIN routine.

## Description
This data block holds constants used by the KERNAL/BASIC trigonometry routines. Each multi-byte numeric constant is stored as a 5-byte Commodore floating-point word (40-bit). Layout and purpose:

- $E2E0 — 5-byte FP: pi/2 (≈ 1.570796327) — used to convert COS→SIN and angle adjustments.
- $E2E5 — 5-byte FP: 2*pi (≈ 6.28318531).
- $E2EA — 5-byte FP: 0.25.
- $E2EF — 1 byte: 5 — one-byte counter used by the SIN series evaluation (number of terms).
- $E2F0-$E308 — six 5-byte FP words: SIN series constants (SIN constant 1..6), used by the polynomial/series evaluation in the SIN routine.
- $E309 duplicates 2*pi (SIN constant 6, value ≈ 6.28318531).

These constants are referenced by the SIN/COS/TAN routines (see referenced chunks). The one-byte counter at $E2EF selects how many terms of the SIN series are used (value = 5). The exact byte encodings for each floating-point word are in the Source Code section.

## Source Code
```asm
                                *** PI2: TABLE OF TRIGONOMETRY CONSTANTS
                                The following constants are held in 5 byte flpt for
                                trigonometry evaluation.
.:E2E0 81 49 0F DA A2           ; 1.570796327 (pi/2)
.:E2E5 83 49 0F DA A2           ; 6.28318531  (pi*2)
.:E2EA 7F 00 00 00 00           ; 0.25
.:E2EF 05                       ; 5 (one byte counter for SIN series)
.:E2F0 84 E6 1A 2D 1B           ; -14.3813907 (SIN constant 1)
.:E2F5 86 28 07 FB F8           ; 42.0077971  (SIN constant 2)
.:E2FA 87 99 68 89 01           ; -76.7041703 (SIN constant 3)
.:E2FF 87 23 35 DF E1           ; 81.6052237  (SIN constant 4)
.:E304 86 A5 5D E7 28           ; -41.3417021 (SIN constant 5)
.:E309 83 49 0F DA A2           ; 6.28318531  (SIN constant 6, pi*2)
```

## References
- "sin_routine_sequence" — expands on SIN series constants and the counter used by SIN
- "cos_via_sin" — shows use of the pi/2 constant to convert COS to SIN
- "tan_routine" — holds constants referenced indirectly during tangent computation