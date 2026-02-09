# Scale FAC1 to Digit-Extraction Range (prepare exponent count, multiply/divide by 10)

**Summary:** 6502 routine that scales a non-zero floating-point FAC1 into a range suitable for digit extraction by repeatedly multiplying or dividing by 10, initializing and adjusting the number exponent count ($005D), and using pointer lookups and JSR calls ($BA28, $BC5B, $BAE2, $BAFE).

**Description**
This routine normalizes FAC1 (a non-zero floating-point value) into a range appropriate for fixed-digit extraction or scientific formatting. It uses the X register as FAC1's exponent (CPX #$80 tests against the threshold $80), a zero-page byte $5D to accumulate the decimal exponent/count, and several pointer lookups to constant thresholds (addresses loaded into A/Y) with JSR calls to shared multiply/compare/divide helpers.

Key behavioral points and control flow:
- The routine clears the number exponent count and stores it in zero-page $5D. ($5D is incremented or decremented as FAC1 is scaled.)
- It compares FAC1's exponent (X) against $80 to determine whether FAC1 < 1 (less than 1.0) or >= 1. The branches distinguish these ranges and direct subsequent scaling behavior.
  - CPX #$80 ; BEQ $BE00 — handles the near-1 range (comment: 0.5 <= FAC1 < 1.0)
  - BCS $BE09 — branch if FAC1 exponent >= $80 (FAC1 >= 1)
- For large values (FAC1 >= 1), the code sets up a pointer to the 1,000,000,000 constant (low/high bytes loaded into A/Y), then JSR $BA28 (helper that multiplies FAC1 by the value pointed by AY) and sets an initial exponent count (LDA #$F7) which is stored to $5D.
- It then loads a pointer for 999,999,999.25 (and smaller thresholds) and uses JSR $BC5B to compare FAC1 with the pointed constant. Based on that compare result it either:
  - Multiply FAC1 by 10 (JSR $BAE2), DEC $5D (decrement decimal exponent count), and loop to test again; or
  - Divide FAC1 by 10 (JSR $BAFE), INC $5D (increment decimal exponent count), and loop to test again.
- The loop continues until FAC1 falls within the chosen thresholds so that digit extraction or fixed conversion routines can proceed cleanly.

Notes on usage and expectations:
- FAC1 is expected non-zero and its exponent is expected to be in the X register on entry (CPX is used).
- $5D is used as the decimal exponent counter (signed behavior implied by INC/DEC, stored as a byte).
- External helper routines used:
  - $BA28 — multiply FAC1 by (AY) (pointer lookup)
  - $BC5B — compare FAC1 with (AY) (pointer lookup)
  - $BAE2 — multiply FAC1 by 10
  - $BAFE — divide FAC1 by 10
- Pointer constants used (loaded via LDA/LDY #$BD etc.) reference a table of numeric thresholds (e.g., 1,000,000,000; 999,999,999.25; 99,999,999.90625) — these control when to switch scaling direction and when to stop.

## Source Code
```asm
; FAC1 is some non zero value
.,BDF8 A9 00    LDA #$00        clear (number exponent count)
.,BDFA E0 80    CPX #$80        compare FAC1 exponent with $80 (<1.00000)
.,BDFC F0 02    BEQ $BE00       branch if 0.5 <= FAC1 < 1.0
.,BDFE B0 09    BCS $BE09       branch if FAC1=>1
.,BE00 A9 BD    LDA #$BD        set 1000000000 pointer low byte
.,BE02 A0 BD    LDY #$BD        set 1000000000 pointer high byte
.,BE04 20 28 BA JSR $BA28       do convert AY, FAC1*(AY)
.,BE07 A9 F7    LDA #$F7        set number exponent count
.,BE09 85 5D    STA $5D         save number exponent count
.,BE0B A9 B8    LDA #$B8        set 999999999.25 pointer low byte (max before sci note)
.,BE0D A0 BD    LDY #$BD        set 999999999.25 pointer high byte
.,BE0F 20 5B BC JSR $BC5B       compare FAC1 with (AY)
.,BE12 F0 1E    BEQ $BE32       exit if FAC1 = (AY)
.,BE14 10 12    BPL $BE28       go do /10 if FAC1 > (AY)
                                FAC1 < (AY)
.,BE16 A9 B3    LDA #$B3        set 99999999.90625 pointer low byte
.,BE18 A0 BD    LDY #$BD        set 99999999.90625 pointer high byte
.,BE1A 20 5B BC JSR $BC5B       compare FAC1 with (AY)
.,BE1D F0 02    BEQ $BE21       branch if FAC1 = (AY) (allow decimal places)
.,BE1F 10 0E    BPL $BE2F       branch if FAC1 > (AY) (no decimal places)
                                FAC1 <= (AY)
.,BE21 20 E2 BA JSR $BAE2       multiply FAC1 by 10
.,BE24 C6 5D    DEC $5D         decrement number exponent count
.,BE26 D0 EE    BNE $BE16       go test again, branch always
.,BE28 20 FE BA JSR $BAFE       divide FAC1 by 10
.,BE2B E6 5D    INC $5D         increment number exponent count
.,BE2D D0 DC    BNE $BE0B       go test again, branch always
```

The numeric constants referenced by the LDA/LDY pointer loads are stored in memory starting at address $BDB3. These constants are used to control the scaling process:

- $BDB3: 99,999,999.90625
- $BDB8: 999,999,999.25
- $BDBD: 1,000,000,000

These constants are stored in the Commodore 64's floating-point format. ([c64-wiki.com](https://www.c64-wiki.com/wiki/BASIC-ROM?utm_source=openai))

The helper subroutines called within this routine perform the following functions:

- **$BA28**: Multiplies FAC1 by the floating-point number pointed to by the A and Y registers. ([skoolkid.github.io](https://skoolkid.github.io/sk6502/c64rom/asm/BA28.html?utm_source=openai))
- **$BC5B**: Compares FAC1 with the floating-point number pointed to by the A and Y registers. ([c64-wiki.com](https://www.c64-wiki.com/wiki/BASIC-ROM?utm_source=openai))
- **$BAE2**: Multiplies FAC1 by 10. ([c64-wiki.com](https://www.c64-wiki.com/wiki/BASIC-ROM?utm_source=openai))
- **$BAFE**: Divides FAC1 by 10. ([c64-wiki.com](https://www.c64-wiki.com/wiki/BASIC-ROM?utm_source=openai))

These subroutines manipulate the floating-point accumulator (FAC1) and utilize zero-page addresses for intermediate storage. The exact parameter and stack conventions for these subroutines are detailed in the Commodore 64's ROM disassembly and related documentation.

## Key Registers
- $005D - Zero Page - decimal number exponent/count (adjusted with DEC/INC and stored by this routine)

## References
- "scientific_mode_limits_constants" — constants and limits used to decide scientific notation and scaling thresholds
- "round_convert_and_prepare_digits" — routines for rounding, fixed-point conversion, and digit preparation after scaling