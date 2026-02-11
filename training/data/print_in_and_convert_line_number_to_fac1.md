# Print " IN " and Line Number (C64 ROM $BDC2)

**Summary:** Assembly snippet from C64 ROM that prints the literal " IN " then the current BASIC line number using FAC1 conversion routines; uses zero-page addresses $39/$3A for the line number, FAC1 mantissa bytes $62/$63, helper routines at $BC49 (set exponent/normalize), $BDDF (FAC1->ASCII) and $BDDA (print null‑terminated string / JMP $AB1E).

## Operation
This ROM sequence prints the string " IN " followed by the current BASIC line number (as an unsigned integer). Steps:

- Load a pointer to the literal " IN " into A (low byte) and Y (high byte), then JSR $BDDA to print that null‑terminated string.
- Read the current BASIC line number from zero page:
  - $3A = high byte of line number
  - $39 = low byte of line number
- Store those two bytes into the FAC1 mantissa bytes:
  - STA $62 → FAC1 mantissa1 (high-order mantissa byte)
  - STX $63 → FAC1 mantissa2
- Prepare FAC1 for integer conversion:
  - LDX #$90 — set exponent to 16d bits (value used by the exponent-setter routine)
  - SEC — set positive/integer flag (source comment: "set integer is +ve flag")
  - JSR $BC49 — routine that sets FAC1 exponent = X, clears mantissa bytes 3 and 4, and normalizes FAC1
- Convert FAC1 to an ASCII, null‑terminated string:
  - JSR $BDDF — FAC1 -> ASCII conversion routine (produces a string suitable for printing)
- Print the resulting null‑terminated ASCII string:
  - JSR $BDDA — print null‑terminated string (note: $BDDA JMPs to $AB1E which performs the print)

Notes:
- The code invokes $BDDA twice: first to print the literal " IN ", then to print the ASCII result produced by $BDDF.
- The zero-page addresses used for FAC1 mantissa bytes are $62 and $63 as shown; the exponent and normalization are handled by the $BC49 routine called with X = $90.
- The listing preserves original opcodes and addresses so the sequence can be relocated or examined in context of the ROM.

## Source Code
```asm
                                *** do " IN " line number message
.,BDC2 A9 71    LDA #$71        set " IN " pointer low byte
.,BDC4 A0 A3    LDY #$A3        set " IN " pointer high byte
.,BDC6 20 DA BD JSR $BDDA       print null terminated string
.,BDC9 A5 3A    LDA $3A         get the current line number high byte
.,BDCB A6 39    LDX $39         get the current line number low byte

                                *** print XA as unsigned integer
.,BDCD 85 62    STA $62         save high byte as FAC1 mantissa1
.,BDCF 86 63    STX $63         save low byte as FAC1 mantissa2
.,BDD1 A2 90    LDX #$90        set exponent to 16d bits
.,BDD3 38       SEC             set integer is +ve flag
.,BDD4 20 49 BC JSR $BC49       set exponent = X, clear mantissa 4 and 3 and normalise
                                FAC1
.,BDD7 20 DF BD JSR $BDDF       convert FAC1 to string
.,BDDA 4C 1E AB JMP $AB1E       print null terminated string
```

## References
- "convert_fac1_to_ascii_sign_and_zero_handling" — expands on FAC1-to-ASCII conversion and sign/zero handling in the ROM routines.
