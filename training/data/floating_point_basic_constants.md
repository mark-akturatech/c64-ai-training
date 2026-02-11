# Floating-point constants table in C64 ROM ($BF11-$BF36)

**Summary:** Table of floating-point numeric constants used by BASIC math routines (addresses $BF11–$BF36): includes the full 5-byte representations of 0.5, a null return for undefined variables, and signed power-of-ten constants (from -100,000,000 down to -1) in Commodore 5‑byte floating format (1‑byte exponent + 4‑byte mantissa).

**Constants table and usage**

This ROM area contains numeric constants referenced by BASIC math routines (EXP/LOG and other numeric helpers). The block begins with the full 5-byte representation of 0.5 and a three‑byte null return pattern for undefined variables, followed by a series of signed power‑of‑ten constants (signed values spanning -100,000,000 → -1 and their positive counterparts). These constants are stored in the machine's 5‑byte floating format (Commodore BASIC: 1‑byte exponent, 4‑byte mantissa). Use the Source Code section for exact byte values and addresses.

## Source Code

```text
.:BF11 81 00 00 00 00           ; 0.5
.:BF16 FA 0A 1F 00 00           ; -100,000,000
.:BF1B 00 98 96 80 00           ; +10,000,000
.:BF20 FF F0 BD C0 00           ; -1,000,000
.:BF25 00 01 86 A0 00           ; +100,000
.:BF2A FF FF D8 F0 00           ; -10,000
.:BF2F 00 00 03 E8 00           ; +1,000
.:BF34 FF FF FF 9C 00           ; -100
.:BF39 00 00 00 0A 00           ; +10
.:BF3E FF FF FF FF 00           ; -1
```

## References

- "jiffy_count_constants" — expands on time/jiffy constants located immediately after these numeric constants
- "exp_constants_series_table" — expands on related floating-point constants used by EXP/LOG routines
