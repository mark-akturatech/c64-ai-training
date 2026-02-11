# INPRT / LINPRT / FOUT (BASIC ROM number-to-ASCII and line-number printing)

**Summary:** ROM routines at $BDC0 (INPRT), $BDCD (LINPRT), and $BDDD (FOUT) that format and output BASIC line numbers and floating-point values. INPRT prints the characters "IN" followed by a line number; LINPRT converts a 16-bit line number (A = high byte, X = low byte) to a floating-point value and calls FOUT; FOUT converts FAC1 (floating point accumulator 1) to an ASCII decimal string and returns a pointer to that string in A/Y.

**Behavior and Purpose**

- **INPRT ($BDC0)**
  - **Purpose:** Print the literal characters "IN" followed immediately by a formatted line number (used by BASIC error messages and listings).
  - **High-level behavior:** Outputs the string "IN" then relies on LINPRT to format the numeric line number into ASCII before output.

- **LINPRT ($BDCD)**
  - **Purpose:** Accept a 16-bit integer line number (high byte in A, low byte in X), convert it to the ROM floating-point format used by BASIC, and pass it to the floating-point-to-ASCII formatter.
  - **High-level behavior:** Converts the integer in A/X into FAC1 (the BASIC floating-point accumulator) and then calls FOUT to produce an ASCII representation suitable for printing.

- **FOUT ($BDDD)**
  - **Purpose:** Convert the floating-point number currently in FAC1 into an ASCII decimal string and return a pointer to that string.
  - **High-level behavior:** Uses ROM constants/tables (powers of 10, rounding/half constants) to convert FAC1 to a sequence of ASCII digits; on completion, it sets a pointer to the ASCII string in A and Y for the caller to use when printing.

**Usage Notes**

- **LINPRT Calling Convention:**
  - **Input:** 16-bit integer where A = high byte, X = low byte.
  - **Output:** Converts the integer into FAC1 and calls FOUT to produce an ASCII representation.

- **FOUT Returns:**
  - **Output:** Pointer to ASCII digits in A (low byte) and Y (high byte); it formats FAC1 as an ASCII decimal string.

- **FOUT Dependencies:** Relies on ROM constants/tables for powers of ten and half-values.

## Source Code

```assembly
; INPRT ($BDC0)
INPRT:
    LDA #$49        ; Load ASCII code for 'I'
    JSR CHROUT      ; Output character
    LDA #$4E        ; Load ASCII code for 'N'
    JSR CHROUT      ; Output character
    JMP LINPRT      ; Jump to LINPRT to print line number

; LINPRT ($BDCD)
LINPRT:
    STA $14         ; Store high byte of line number
    STX $15         ; Store low byte of line number
    JSR INT2FP      ; Convert integer in $14/$15 to floating point in FAC1
    JMP FOUT        ; Jump to FOUT to print floating point number

; FOUT ($BDDD)
FOUT:
    ; Conversion of FAC1 to ASCII string
    ; Implementation details involve:
    ; - Checking the sign of FAC1
    ; - Normalizing the number
    ; - Rounding and formatting
    ; - Storing the result at $0100
    ; - Returning pointer to result in A/Y
    ; (Detailed assembly code omitted for brevity)
    RTS
```

## Key Registers

- **INPRT:**
  - **Input:** None.
  - **Output:** Outputs "IN" followed by the line number.

- **LINPRT:**
  - **Input:** A = high byte of line number, X = low byte of line number.
  - **Output:** Calls FOUT to print the line number.

- **FOUT:**
  - **Input:** FAC1 contains the floating-point number to be converted.
  - **Output:** Pointer to ASCII string in A (low byte) and Y (high byte).

## References

- "fout_constants_tables" — Tables/constants used by FOUT (powers of -10, half rounding constants).
- "fin_finlog_and_conversion_constants" — Complementary routines and constants for converting ASCII to floating point and related log/scale data.

## Labels
- INPRT
- LINPRT
- FOUT
