# Long Division (pencil-and-paper) analogy for binary division

**Summary:** Describes the long-division (pencil-and-paper) algorithm for dividing arbitrary integers and states that binary division follows the same process with base-2 digits; relevant search terms: long division, trial-subtract, binary division, quotient, remainder.

**Long-division algorithm (decimal example)**
The algorithm proceeds digit-by-digit from the left (most-significant digits) of the dividend:

Steps:
- Take the leftmost one-or-more digits of the dividend that form a value >= divisor.
- Find the largest integer multiple of the divisor that is <= that leftmost portion; that multiple is the next quotient digit.
- Subtract that multiple from the leftmost portion; the difference is the partial remainder.
- Bring down the next digit of the dividend (append it to the partial remainder) and repeat until no digits remain.
- The collected quotient digits form the final quotient; the final partial remainder is the remainder.

Example (decimal): dividing 12345 by 67 yields quotient 184 and remainder 17 (see Source Code for the vertical-layout illustration).

**Mapping to binary division**
Binary division is the same long-division procedure carried out in base 2. Practically this is implemented using bit-wise operations rather than decimal digit arithmetic:

- Work from the most-significant bit toward the least-significant bit of the dividend.
- At each step, align (shift) the divisor under the current partial remainder and perform a trial subtraction.
- If the shifted divisor is <= current partial remainder, subtract it and set the current quotient bit to 1; otherwise set the quotient bit to 0.
- Shift in the next dividend bit and repeat until all bits are processed.
- This "trial-subtract" approach produces an integer quotient and remainder in the same way as decimal long division (trial-subtract = shift-and-subtract).

## Source Code
```text
   184
  _______
67 ) 12345
     -67
     ---
      564
     -536
     ----
       285
      -268
      ----
        17
```

```text
   1001
  _______
11 ) 11011
     -11
     ---
      0011
     -00
     ----
       0011
      -11
      ----
        00
```

```assembly
; 16-bit unsigned division routine for 6502
; Divides dividend (16-bit) by divisor (8-bit)
; Returns quotient in QUOT and remainder in REM

DIVIDEND  = $0200  ; Address of 16-bit dividend (low byte at $0200, high byte at $0201)
DIVISOR   = $0202  ; Address of 8-bit divisor
QUOT      = $0203  ; Address to store 16-bit quotient
REM       = $0205  ; Address to store 8-bit remainder

        LDX #16          ; Set bit counter to 16
        LDA #0
        STA REM          ; Clear remainder
        STA REM+1        ; Clear high byte of remainder (not used)
        STA QUOT         ; Clear quotient
        STA QUOT+1       ; Clear high byte of quotient

DIV_LOOP:
        ASL DIVIDEND     ; Shift left dividend low byte
        ROL DIVIDEND+1   ; Shift left dividend high byte
        ROL REM          ; Shift left remainder
        ROL REM+1        ; Shift left high byte of remainder (not used)

        LDA REM
        SEC
        SBC DIVISOR      ; Subtract divisor from remainder
        BCC SKIP_SUB     ; If borrow, skip subtraction
        STA REM          ; Store new remainder
        INC QUOT         ; Set LSB of quotient
SKIP_SUB:
        ROL QUOT         ; Rotate quotient left
        ROL QUOT+1       ; Rotate high byte of quotient left

        DEX
        BNE DIV_LOOP     ; Repeat for all bits

        RTS
```

## References
- "binary_division_example_and_code" — expands on binary example and trial-subtract implementation
