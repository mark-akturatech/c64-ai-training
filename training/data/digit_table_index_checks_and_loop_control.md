# ROM: Digit-extraction loop — restore pointer, recover character, mask & table-index checks ($BEB4-$BEC2)

**Summary:** 6502 disassembly for the C64 ROM handling loop control in digit extraction: restores the variable pointer low byte from $47, recovers the working character (A) via TXA, toggles/inverts bits with EOR #$FF, isolates bit 7 with AND #$80, stores the masked result into X, and checks the table index in Y against two maxima ($24 for decimal, $3C for time) using CPY/BEQ and CPY/BNE to either exit or continue the digit loop.

## Loop control and table-index checks
This code fragment executes the final steps of a digit-extraction iteration:

- LDY $47 restores the current variable-pointer low byte into Y; Y is used as the table index for selecting digit-encoding/table entries.
- TXA restores the working character into A from X (the character had been saved in X earlier).
- EOR #$FF inverts all bits in A (logical NOT). This effectively toggles the test-sense bit among others (the code masks afterwards to isolate the relevant bit).
- AND #$80 masks A to keep only bit 7; this clears the digit bits and isolates the sign/test bit.
- TAX copies the masked result into X — X now holds the "new digit" value (bit7 only).
- CPY #$24 compares Y (table index) to $24 (36 decimal). If equal (BEQ $BEC4) the routine exits the digit loop (decimal max reached).
- If Y != $24 it then CPY #$3C and BNE $BE6A: if Y != $3C (60 decimal) branch back to the loop at $BE6A; if Y == $3C execution falls through to $BEC4 (exit). Thus the loop exits when Y equals either $24 or $3C; otherwise it repeats.

Branch targets:
- BEQ $BEC4 — exit digit loop (when Y == $24)
- BNE $BE6A — loop/continue (when Y != $3C)

(Parenthetical: restoring A via TXA assumes X previously held the working character; Y holds the table index/pointer low byte.)

## Source Code
```asm
.,BEB4 A4 47    LDY $47         get current variable pointer low byte
.,BEB6 8A       TXA             get character back
.,BEB7 49 FF    EOR #$FF        toggle the test sense bit
.,BEB9 29 80    AND #$80        clear the digit
.,BEBB AA       TAX             copy it to the new digit
.,BEBC C0 24    CPY #$24        
                                compare the table index with the max for decimal numbers
.,BEBE F0 04    BEQ $BEC4       if at the max exit the digit loop
.,BEC0 C0 3C    CPY #$3C        
                                compare the table index with the max for time
.,BEC2 D0 A6    BNE $BE6A       loop if not at the max
```

## References
- "digit_extraction_loop_and_output_write" — continuation: logic for continuing/exiting the digit extraction loop and writing output
