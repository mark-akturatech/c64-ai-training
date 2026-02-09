# FAC1 Absolute Value and Normalisation Entry (C64 ROM)

**Summary:** Disassembly of Commodore 64 ROM sequence that takes the absolute value of FAC1 (floating accumulator 1) and enters the normalisation routine; uses zero page mantissa bytes $62/$63, calls negate routine at $B947, and branches to the main normalisation loop at $B929.

## Sequence overview
This ROM fragment performs two tasks in sequence:

- Take the absolute value of FAC1: branch if positive (BCS), otherwise call the negate routine at $B947.
- Initialise state for normalisation: clear index Y, clear A (via TYA), clear carry (CLC) for subsequent addition, load FAC1 mantissa bytes from zero page ($62/$63), and branch to the main normalisation loop if a mantissa byte is non-zero.

FAC1 refers to the floating point accumulator 1 (FAC1) used by the ROM floating-point routines (FAC1 (floating accumulator 1)).

Behavioral details preserved from the ROM:
- BCS $B8D7: if the sign indicates positive (carry set), skip negation.
- JSR $B947: performs two's-complement negation of FAC1 when negative.
- LDY #$00 and TYA: clear Y and A registers to zero (A cleared via TYA).
- CLC: clear carry to prepare for multi-byte add operations during normalisation.
- LDX $62 / BNE $B929: check lowest mantissa byte; if non-zero, go to main normalisation at $B929.
- If $62 is zero, load $63 into X and store it into $62 (move high mantissa byte down), preparing for further byte shifts handled by the normalisation loop.

## Source Code
```asm
; do ABS and normalise FAC1
.,B8D2 B0 03    BCS $B8D7       ; branch if number is +ve
.,B8D4 20 47 B9 JSR $B947       ; negate FAC1

; normalise FAC1
.,B8D7 A0 00    LDY #$00        ; clear Y
.,B8D9 98       TYA             ; clear A
.,B8DA 18       CLC             ; clear carry for add
.,B8DB A6 62    LDX $62         ; get FAC1 mantissa 1 (zero page)
.,B8DD D0 4A    BNE $B929       ; if not zero, normalise FAC1 (main loop)
.,B8DF A6 63    LDX $63         ; get FAC1 mantissa 2 (zero page)
.,B8E1 86 62    STX $62         ; save FAC1 mantissa 1 (move byte)
```

## References
- "mantissa_subtract_sequence" — expands on normalization following a subtraction result
- "normalisation_byte_shift_loop" — expands on continuing the normalization process, moving bytes and adjusting exponent offset