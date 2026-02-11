# test_for_line_increment (C64 ROM)

**Summary:** Routine that checks whether the cursor column ($D3) matches a target column sequence starting at #$27 and incremented by #$28 (looped ADC #$28), and if so increments the cursor row stored at $D6 unless it already equals $19 (end-of-screen). Uses A and X, returns with RTS.

## Operation
This small ROM routine has two flows:

- A quick decrement-and-return path:
  - DEC $D6 ; decrement the cursor row (used by the inverse/left-movement routine)
  - RTS

- The "test for line increment" path (main routine):
  - Set X = #$02 as a 2-iteration loop counter.
  - Load A = #$27 and compare A with the cursor column at $D3.
  - If equal, treat the cursor as being "at end of line" and proceed to potentially increment the cursor row.
  - If not equal, clear carry (CLC) and ADC #$28 to add $28 to A, decrement X and loop. This effectively tests A == #$27, then #$27 + $28, then #$27 + 2*$28 (three values total — initial + two ADC increments).
  - If none of the tested values match $D3 the routine returns (no row change).
  - If a match is found, load X from $D6 (cursor row), compare X with #$19 (constant used as end-of-screen), and:
    - If X == #$19 return (do not increment past the bottom).
    - Else INC $D6 to advance the cursor row and return.

CPU state / side effects:
- Uses A and X registers; modifies A and X.
- Modifies memory $D6 (increment/decrement) only when branch taken.
- Uses CLC/ADC in the loop to compute successive test values.
- Returns to caller with RTS.

Behavioral notes:
- The loop tests three candidate column values: #$27, #$27 + #$28, #$27 + 2*#28 (the loop is structured with LDX #$02 counting down).
- The end-of-screen test compares the cursor row ($D6) against the literal #$19 (0x19 = 25 decimal) and will not increment if equal.

## Source Code
```asm
.,E8B0 C6 D6    DEC $D6         else decrement the cursor row
.,E8B2 60       RTS             

                                *** test for line increment
                                
                                if at end of the line, but not at end of the last line, increment the cursor row
.,E8B3 A2 02    LDX #$02        set the count
.,E8B5 A9 27    LDA #$27        set the column
.,E8B7 C5 D3    CMP $D3         compare the column with the cursor column
.,E8B9 F0 07    BEQ $E8C2       if at end of line test and possibly increment cursor row
.,E8BB 18       CLC             else clear carry for add
.,E8BC 69 28    ADC #$28        increment to the next line
.,E8BE CA       DEX             decrement the loop count
.,E8BF D0 F6    BNE $E8B7       loop if more to test
.,E8C1 60       RTS             
                                cursor is at end of line
.,E8C2 A6 D6    LDX $D6         get the cursor row
.,E8C4 E0 19    CPX #$19        compare it with the end of the screen
.,E8C6 F0 02    BEQ $E8CA       if at the end of screen just exit
.,E8C8 E6 D6    INC $D6         else increment the cursor row
.,E8CA 60       RTS             
```

## References
- "test_for_line_decrement" — inverse test and behavior when moving cursor left
- "newline_and_carriage_return_handling" — newline logic that may call the scroll routine when incrementing past the bottom
