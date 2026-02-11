# EXPCON ($BFBF) and EXP ($BFED) — Exponential Constants and e^x Routine

**Summary:** EXPCON at $BFBF is a table of five-byte floating-point constants used by the EXP routine at $BFED to compute e^x (natural exponential) for the value in FAC1, leaving the result in FAC1.

**Description**

EXPCON is a table of constants formatted as five-byte floating-point numbers in Commodore's format. These constants support the EXP routine in calculating e^x by facilitating the computation of 2^N (two to the Nth power). The EXP routine at $BFED computes the natural exponential e^x for the argument stored in FAC1 (the standard Commodore floating-point accumulator). After execution, the computed value e^(input) is left in FAC1.

**Implementation Notes**

- **EXPCON:** Table of constants in five-byte floating-point format; used by the EXP routine for computing 2^N.
- **EXP ($BFED):** Takes argument in FAC1, computes e^x, result returned in FAC1.

## Source Code

The EXPCON table at $BFBF contains the following five-byte floating-point constants:

```text
Address  Value (Decimal)        Floating-Point Bytes
-----------------------------------------------------
$BFBF    2.1498763701E-5        $71, $34, $58, $3E, $56
$BFC4    1.4352314037E-4        $74, $16, $7E, $B3, $1B
$BFC9    1.3422634825E-3        $77, $2F, $EE, $E3, $85
$BFCE    9.6140170135E-3        $7A, $1D, $84, $1C, $2A
$BFD3    5.5505126860E-2        $7C, $63, $59, $58, $0A
$BFD8    0.24022638460          $7E, $75, $FD, $E7, $C6
$BFDD    0.69314718618          $80, $31, $72, $18, $10
$BFE2    1.0                    $81, $00, $00, $00, $00
```

The EXP routine at $BFED utilizes these constants to compute e^x by first multiplying the input by log₂(e), then separating the result into integer and fractional parts. It calculates 2^(fractional part) using a polynomial approximation and adjusts the exponent accordingly. The result is stored back in FAC1.

## References

- "Commodore 64 Programmer's Reference Guide"
- "Advanced Commodore 64 BASIC Revealed"

## Labels
- EXPCON
- EXP
