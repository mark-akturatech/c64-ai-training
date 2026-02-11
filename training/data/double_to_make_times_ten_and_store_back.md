# Multiply by 10 using ASL/ROL and store via indirect Y

**Summary:** Final ASL/ROL pair doubles a 16-bit value at $033C/$033D (times-five → times-ten) using ASL/ROL; result is written back into variable V% using indirect Y addressing with zero-page pointer $2D (LDY/LDA/STA ($2D),Y). Instructions: ASL, ROL, LDY, LDA, STA, RTS.

## Operation
This snippet assumes the two-byte value at $033C/$033D currently contains the original value times five. Doubling that 16-bit value yields the original value times ten.

The routine performs:
- A pair of shift/rotate instructions to double the 16-bit value (ASL/ROL).
- Two stores via the zero-page pointer at $2D using indirect Y addressing to write the low and high bytes back into the integer variable V%.

Important behavioral notes:
- The low and high bytes are read from $033C and $033D respectively and stored at offsets Y=#$02 (low) and Y=#$03 (high) through the pointer ($2D),Y.
- For correct 16-bit left-shift (doubling), the low byte must be shifted left with its carry propagated into the high byte (ASL low; ROL high). The source listing below shows the ASL/ROL pair in reversed order — see note.

**[Note: Source may contain an error — ASL/ROL order appears reversed. For a proper 16-bit double you normally ASL the low byte then ROL the high byte so the low-byte carry feeds into the high byte.]**

The routine ends with RTS.

## Source Code
```asm
.A 08B3  ASL $033D
.A 08B6  ROL $033C

.A 08B9  LDY #$02
.A 08BB  LDA $033C
.A 08BE  STA ($2D),Y
.A 08C0  LDY #$03
.A 08C2  LDA $033D
.A 08C5  STA ($2D),Y
.A 08C7  RTS
```

## References
- "adding_x4_to_original_to_get_x5" — expands on how the times-five value was produced
- "store_ordering_and_adjust_sov_pointer" — expands on byte order and adjusting the SOV pointer after embedding ML
