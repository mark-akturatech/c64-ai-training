# Entry: SQR() setup — round/copy FAC1→FAC2, load 0.5 pointer, unpack FAC1

**Summary:** Disassembly of C64 ROM entry sequence at $BF71–$BF78 that prepares FAC1 for the square-root/power routines: it JSRs to round-and-copy FAC1→FAC2, loads a pointer to the 0.5 constant ($BF11) into A/Y, and calls the unpack routine to move the referenced memory (AY) into FAC1.

## Operation
- $BF71 JSR $BC0C — call the routine that rounds FAC1 and copies the result into FAC2 (prepares FAC2 for later use).
- $BF74 LDA #$11 — load the low byte of the pointer to the 0.5 constant (low = $11).
- $BF76 LDY #$BF — load the high byte of the pointer to the 0.5 constant (high = $BF), forming address $BF11 in A/Y.
- $BF78 JSR $BBA2 — call the unpack routine which reads the value at (A,Y) and unpacks it into FAC1 (FAC1 now contains 0.5, or the unpacked memory pointed to by $BF11).

This sequence sets FAC1 for subsequent SQR (square-root) or power-function drivers which expect FAC1 loaded and FAC2 holding the rounded copy.

## Source Code
```asm
.,BF71 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,BF74 A9 11    LDA #$11        set 0.5 pointer low address
.,BF76 A0 BF    LDY #$BF        set 0.5 pointer high address
.,BF78 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
```

## References
- "checksum_and_spare_bytes" — expands on code that follows the spare bytes area
- "power_function_driver" — shows shared unpacking/unary-operation patterns used by SQR and the power/EXP driver