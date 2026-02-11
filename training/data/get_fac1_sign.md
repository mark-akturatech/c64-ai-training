# get FAC1 sign ($BC2B-$BC38)

**Summary:** Routine reads FAC1 exponent ($61) and sign byte ($66) to produce A=$FF for negative, A=$01 for positive, and A=$00 for zero; it also rotates the sign bit (bit 7 of $66) into the CPU carry (ROL) so callers can test C for sign (carry=1 => negative, carry=0 => positive). Uses instructions LDA, BEQ, ROL, BCS, RTS.

## Description
This small helper returns a compact sign result for the FAC1 floating-point number:

- If FAC1 exponent at $61 is zero, the number is zero: the routine leaves A=0 (the loaded exponent) and returns immediately. The carry flag is not explicitly set in this path (carry is therefore unspecified).
- Otherwise it loads the FAC1 sign byte from $66, executes ROL on A to move the sign bit (bit 7) into the processor carry, then sets A to $FF to indicate negative if the carry was set, or $01 to indicate positive if the carry was clear.
- Branching: BCS after loading $FF returns immediately for negative; otherwise A is set to $01 for positive and RTS returns.

Calling convention / effects:
- Input: FAC1 exponent at $61, FAC1 sign byte at $66 (bit 7 = sign).
- Output:
  - A = $00 and returns if FAC1 exponent ($61) == 0 (zero).
  - A = $FF and Carry = 1 for negative numbers.
  - A = $01 and Carry = 0 for positive numbers.
- Notes:
  - Carry is not set in the zero path (undefined for callers that rely on C for zero detection).
  - The routine overwrites A; any previous accumulator value is lost.

## Source Code
```asm
; get FAC1 sign
; return A = $FF, Cb = 1/-ve
;        A = $01, Cb = 0/+ve
;        A = $00, Cb = ?/0

.,BC2B A5 61    LDA $61         ; get FAC1 exponent
.,BC2D F0 09    BEQ $BC38       ; exit if zero (already correct SGN(0)=0)

; return A = $FF, Cb = 1/-ve
; return A = $01, Cb = 0/+ve
; no = 0 check
.,BC2F A5 66    LDA $66         ; get FAC1 sign (bit 7)

; sign in A, move sign bit to carry
.,BC31 2A       ROL             ; rotate bit7 into carry
.,BC32 A9 FF    LDA #$FF        ; prepare byte for -ve result
.,BC34 B0 02    BCS $BC38       ; if carry set (negative) return with A=$FF
.,BC36 A9 01    LDA #$01        ; else prepare byte for +ve result
.,BC38 60       RTS             ; return
```

## References
- "perform_sgn" — caller wrapper that invokes this sign-extraction routine  
- "compare_fac1_with_pointer_AY" — uses sign extraction when comparing FAC1 with memory (AY)