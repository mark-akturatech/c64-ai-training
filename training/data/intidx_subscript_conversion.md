# INTIDX ($B1B2) — Convert floating-point subscript to positive integer

**Summary:** INTIDX at $B1B2 converts a floating-point array subscript to an integer and verifies it is positive; intended for use when subscripts may be supplied as floating-point values (used by ISARY). Keywords: $B1B2, INTIDX, floating-point, subscript, integer conversion, ISARY.

**Description**
This routine accepts a numeric value represented in the system's floating-point format (a subscript supplied as FP) and converts it to an integer index suitable for array access. Before returning the integer, the routine ensures the resulting value is positive (valid array subscript).

Intended usage: called when an array subscript may be a floating-point value; validates and converts the FP subscript so that downstream array lookup/creation code (for example ISARY) can use it as an integer index.

Related behavior: a separate routine (see referenced "ayint_fp_to_signed_integer") handles floating-point to signed-integer conversions and range checking for other numeric-to-integer contexts. INTIDX is the dedicated path ensuring a non-negative (positive) integer index for array subscripts.

## Source Code
```assembly
; INTIDX: Convert floating-point subscript to positive integer
; Address: $B1B2

B1B2  20 73 00    JSR $0073      ; CHRGET: Advance to next character
B1B5  20 9E AD    JSR $AD9E      ; FRMEVL: Evaluate expression
B1B8  20 8D AD    JSR $AD8D      ; CHKNUM: Ensure result is numeric
B1BB  A5 66       LDA $66        ; Load FAC sign byte
B1BD  30 0D       BMI $B1CC      ; If negative, branch to error
B1BF  A5 61       LDA $61        ; Load FAC exponent
B1C1  C9 90       CMP #$90       ; Compare with $90 (32768)
B1C3  90 09       BCC $B1CE      ; If less, jump to conversion
B1C5  A9 A5       LDA #$A5       ; Load error code for ILLEGAL QUANTITY
B1C7  A0 B1       LDY #$B1       ; Load error vector
B1C9  20 5B BC    JSR $BC5B      ; Invoke error handler
B1CC  D0 7A       BNE $B248      ; Jump to error handling
B1CE  4C 9B BC    JMP $BC9B      ; Convert FAC to integer
```

## Key Registers
- **$66 (FAC Sign Byte):** Determines the sign of the floating-point accumulator (FAC).
- **$61 (FAC Exponent):** Holds the exponent part of the floating-point number in FAC.

## References
- "ayint_fp_to_signed_integer" — expands on related conversion/range-checking routine used for numeric-to-integer conversions
- "array_lookup_and_creation_isary" — explains how INTIDX is used when validating array subscripts during ISARY's processing

## Labels
- INTIDX
