# Unpack (AY) into FAC2 — ROM routine $BA8C

**Summary:** Unpacks a 5-byte floating-point value pointed-to by the (A,Y) pair into FAC2: reads mantissa bytes and exponent, preserves the pointer, normalises the mantissa sign bit into FAC2, stores FAC2 exponent/mantissa at $69/$6A-$6D, and computes a sign-compare (FAC1 XOR FAC2) into $6F. Uses zero page pointer $22/$23 and FAC1 fields at $61/$66.

## Description
This ROM routine expects the caller to provide a pointer to a 5-byte floating-point number with the pointer low byte in A and high byte in Y on entry. It saves that pointer into zero page $22/$23, then uses the indirect indexed load `LDA ($22),Y` with Y initially set to 4 to fetch five bytes:

- The bytes are read in this order: mantissa byte 4, 3, 2, 1 (which contains sign in bit 7), then exponent.
- Mantissa bytes are stored into FAC2 mantissa slots:
  - FAC2 mantissa4 -> $6D
  - FAC2 mantissa3 -> $6C
  - FAC2 mantissa2 -> $6B
  - FAC2 mantissa1 -> $6A (after setting the normal/implicit bit)
- The raw mantissa1 byte (which contains the sign in bit7) is first saved to $6E. Then an EOR with FAC1 sign (at $66) produces a sign-compare result stored to $6F (FAC1 XOR FAC2 sign).
- The mantissa1 is then ORed with #$80 (sets bit7) and stored to $6A to ensure the normal/implicit bit is set in FAC2's mantissa1 byte.
- The exponent byte is stored into FAC2 exponent at $69.
- The routine finally loads FAC1 exponent (from $61) into A and returns (RTS), leaving A holding FAC1's exponent on return.

The routine preserves the caller's pointer by storing the incoming A and Y into $22/$23; subsequent memory accesses are indirect via that saved pointer.

## Source Code
```asm
                                *** unpack memory (AY) into FAC2
.,BA8C 85 22    STA $22         save pointer low byte
.,BA8E 84 23    STY $23         save pointer high byte
.,BA90 A0 04    LDY #$04        5 bytes to get (0-4)
.,BA92 B1 22    LDA ($22),Y     get mantissa 4
.,BA94 85 6D    STA $6D         save FAC2 mantissa 4
.,BA96 88       DEY             decrement index
.,BA97 B1 22    LDA ($22),Y     get mantissa 3
.,BA99 85 6C    STA $6C         save FAC2 mantissa 3
.,BA9B 88       DEY             decrement index
.,BA9C B1 22    LDA ($22),Y     get mantissa 2
.,BA9E 85 6B    STA $6B         save FAC2 mantissa 2
.,BAA0 88       DEY             decrement index
.,BAA1 B1 22    LDA ($22),Y     get mantissa 1 + sign
.,BAA3 85 6E    STA $6E         save FAC2 sign (b7)
.,BAA5 45 66    EOR $66         EOR with FAC1 sign (b7)
.,BAA7 85 6F    STA $6F         save sign compare (FAC1 EOR FAC2)
.,BAA9 A5 6E    LDA $6E         recover FAC2 sign (b7)
.,BAAB 09 80    ORA #$80        set 1xxx xxx (set normal bit)
.,BAAD 85 6A    STA $6A         save FAC2 mantissa 1
.,BAAF 88       DEY             decrement index
.,BAB0 B1 22    LDA ($22),Y     get exponent byte
.,BAB2 85 69    STA $69         save FAC2 exponent
.,BAB4 A5 61    LDA $61         get FAC1 exponent
.,BAB6 60       RTS             
```

## Key Registers
- $22 - Zero page - saved pointer low byte (stored from A on entry)
- $23 - Zero page - saved pointer high byte (stored from Y on entry)
- $61 - Zero page - FAC1 exponent (loaded into A before return)
- $66 - Zero page - FAC1 sign (bit7)
- $69 - Zero page - FAC2 exponent (target)
- $6A-$6D - Zero page - FAC2 mantissa 1..4 (1 at $6A)
- $6E - Zero page - FAC2 raw mantissa1/sign byte (original, sign in b7)
- $6F - Zero page - FAC2 sign-compare (FAC1 XOR FAC2 sign, result of EOR $66)

## References
- "multiply_fac1_by_memory_shift_add_loop" — expands on how FAC2 is used by FAC1 * (AY) multiply entry
- "divide_ay_by_fac1_core_algorithm" — expands on how FAC2 is used when dividing (AY) by FAC1 (unpacks divisor/operand into FAC2)

## Labels
- $22
- $23
- $61
- $66
- $69
- $6A
- $6B
- $6C
- $6D
- $6E
- $6F
