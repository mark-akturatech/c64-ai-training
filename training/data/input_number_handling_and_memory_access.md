# Numeric parameter and address parsing and memory-access statements (GETBYTC, VAL, GETNUM, GETADR, PEEK, POKE, FUWAIT/WAIT)

**Summary:** Describes BASIC/ROM routines for parsing numeric ASCII parameters, converting between floating-point and integer formats, obtaining 8-/16-bit parameters for POKE/WAIT, and performing memory read/write and masked polling (WAIT). Includes routine entry addresses as given: VAL $B7AD, GETNUM $B7EB, GETADR $B7F7, PEEK $B80D, POKE $B824, FUWAIT $B82D.

**Routine descriptions**

**GETBYTC ($B79B / decimal 47003)**
- Evaluates the next numeric expression in the BASIC program text and returns the result as an 8-bit unsigned integer in the X register.
- If the result is not within the range 0–255, an `?ILLEGAL QUANTITY ERROR` is generated.
- Commonly used to parse byte-sized parameters for commands like POKE and WAIT.

**VAL ($B7AD / decimal 47021)**
- Reads a numeric ASCII string (from the current string pointer), accepts digits, optional sign, a single decimal point, exponent, and spaces.
- Scans characters until an invalid character is encountered. Converts the collected string to the internal floating-point format (via standard FP conversion used by BASIC).
- If no valid numeric characters are found, returns 0 (floating-point zero).
- Typical use: parsing numeric parameters from USR statements or extended command text.

**GETNUM ($B7EB / decimal 47083)**
- Parses the next numeric parameter from program text and evaluates it.
- Checks that the value is a positive integer in the range 0–65535.
- Converts the floating-point result to a two-byte unsigned integer and stores it in byte locations 20–21 (decimal) / $14–$15 (hex).
- Skips an optional comma separator, then reads a one-byte integer parameter and returns it in the X register (.X).
- Used to obtain the address and one-byte parameter for commands such as POKE and WAIT.

**GETADR ($B7F7 / decimal 47095)**
- Validates the value currently in the Floating Point Accumulator: must be >= 0 and < 65536.
- Calls the floating-point-to-integer conversion subroutine to produce an unsigned 16-bit address suitable for memory access.
- Used by commands requiring an address parameter (for example, PEEK).

**PEEK ($B80D / decimal 47117)**
- Obtains an address parameter (via GETADR/related conversion), forms a pointer, and reads the byte at that memory location.
- Places the retrieved byte into the Y register (.Y).
- Calls the POS routine (the integer-to-floating-point converter) to convert the single-byte integer in .Y into the floating-point accumulator for return to the caller.

**POKE ($B824 / decimal 47140)**
- Parses and converts the address parameter to a pointer.
- Reads the next numeric parameter (one byte) and stores that byte into the target memory location (standard POKE behavior).

**FUWAIT / WAIT ($B82D / decimal 47149)**
- Parses an address parameter and a required one-byte mask parameter.
- Optionally parses a pattern parameter (used as an XOR operand); if no pattern is supplied, zero is used.
- At each loop iteration:
  - Reads the byte at the target address.
  - Exclusive-ORs the byte with the optional pattern (EOR).
  - ANDs the result with the mask.
  - Continues looping until the final AND result is non-zero.
- Semantics:
  - AND detects bit transitions from 0→1 (i.e., test whether any masked bit(s) are now set).
  - EOR (pattern) lets you invert or pre-mask bits to detect transitions from 1→0 (by XORing with 1).
- Use cases: polling memory locations changed by the system or external hardware (software clock, keycode locations, I/O registers).
- See also the article "All About the Wait Instruction" (Compute! First Book of Commodore 64) for further discussion and examples.

## Source Code

```assembly
; GETBYTC routine at $B79B
B79B: 20 9E B7  JSR $B79E   ; Call GETBYT to evaluate byte expression
B79E: 20 9E AD  JSR $AD9E   ; Call FRMEVL to evaluate expression
B7A1: 20 8D AD  JSR $AD8D   ; Call CHKNUM to ensure result is numeric
B7A4: 20 47 B9  JSR $B947   ; Call FOUTI to convert FAC to integer
B7A7: A6 14     LDX $14     ; Load low byte of result into X
B7A9: A4 15     LDY $15     ; Load high byte of result into Y
B7AB: 84 14     STY $14     ; Store high byte back to $14
B7AD: 86 15     STX $15     ; Store low byte back to $15
B7AF: 60        RTS         ; Return
```

```assembly
; VAL routine at $B7AD
B7AD: 20 9E AD  JSR $AD9E   ; Call FRMEVL to evaluate expression
B7B0: 20 8D AD  JSR $AD8D   ; Call CHKNUM to ensure result is numeric
B7B3: 20 47 B9  JSR $B947   ; Call FOUTI to convert FAC to integer
B7B6: 60        RTS         ; Return
```

```assembly
; GETNUM routine at $B7EB
B7EB: 20 9E AD  JSR $AD9E   ; Call FRMEVL to evaluate expression
B7EE: 20 8D AD  JSR $AD8D   ; Call CHKNUM to ensure result is numeric
B7F1: 20 47 B9  JSR $B947   ; Call FOUTI to convert FAC to integer
B7F4: 20 FD AE  JSR $AEFD   ; Call CHKCOM to check for comma
B7F7: 20 9B B7  JSR $B79B   ; Call GETBYTC to get byte parameter
B7FA: 60        RTS         ; Return
```

```assembly
; GETADR routine at $B7F7
B7F7: 20 9E AD  JSR $AD9E   ; Call FRMEVL to evaluate expression
B7FA: 20 8D AD  JSR $AD8D   ; Call CHKNUM to ensure result is numeric
B7FD: 20 47 B9  JSR $B947   ; Call FOUTI to convert FAC to integer
B800: 60        RTS         ; Return
```

```assembly
; PEEK routine at $B80D
B80D: 20 F7 B7  JSR $B7F7   ; Call GETADR to get address parameter
B810: A0 00     LDY #$00    ; Set Y to 0
B812: B1 14     LDA ($14),Y ; Load byte from address in $14
B814: A8        TAY         ; Transfer A to Y
B815: 20 A2 B3  JSR $B3A2   ; Call POS to convert Y to floating point
B818: 60        RTS         ; Return
```

```assembly
; POKE routine at $B824
B824: 20 F7 B7  JSR $B7F7   ; Call GETADR to get address parameter
B827: 20 9B B7  JSR $B79B   ; Call GETBYTC to get byte parameter
B82A: A0 00     LDY #$00    ; Set Y to 0
B82C: 91 14     STA ($14),Y ; Store A at address in $14
B82E: 60        RTS         ; Return
```

## Labels
- GETBYTC
- VAL
- GETNUM
- GETADR
- PEEK
- POKE
- FUWAIT
- WAIT
