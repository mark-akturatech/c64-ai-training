# test for line decrement

**Summary:** Routine that tests whether the cursor should move up one row when decrementing the column; compares accumulator against the cursor column ($D3) and performs two ADC #$28 iterations (0x28 = 40) to test crossing line boundaries.

**Description**
This small 6502 routine runs a two-iteration test to determine if the cursor is at a line-start position that requires decrementing the cursor row. Operation summary:
- LDX #$02 sets a two-iteration loop count.
- LDA #$00 initializes A with 0 (the first column candidate).
- CMP $D3 compares A with the cursor column stored at zero page $D3.
  - If equal, the code branches to $E8B0 (handler that decrements the cursor row and exits).
- If not equal, the code clears carry (CLC) and adds $28 (ADC #$28, 40 decimal — the screen line length) to A, then decrements X and loops to compare the next candidate value of A (0x28) against $D3.
- After two iterations (A = 0 and A = $28) the routine returns (RTS) if no match was found.

This implements a simple test for whether a column value lies at the start of a logical line (column 0 or column 40), which is used when determining cursor movement across line boundaries.

## Source Code
```asm
                                *** test for line decrement
.,E8A1 A2 02    LDX #$02        set the count
.,E8A3 A9 00    LDA #$00        set the column
.,E8A5 C5 D3    CMP $D3         compare the column with the cursor column
.,E8A7 F0 07    BEQ $E8B0       if at the start of the line go decrement the cursor row
                                and exit
.,E8A9 18       CLC             else clear carry for add
.,E8AA 69 28    ADC #$28        increment to next line
.,E8AC CA       DEX             decrement loop count
.,E8AD D0 F6    BNE $E8A5       loop if more to test
.,E8AF 60       RTS             
```

## Key Registers
- **$D3**: Cursor column position

## References
- "newline_and_carriage_return_handling" — expands on called behavior when cursor-left reaches start-of-line to move up a line
- "test_for_line_increment_and_end_of_line" — counterpart routine for testing line increment when moving right

## Labels
- $D3
