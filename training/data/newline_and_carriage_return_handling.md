# Newline and CR Handling (Commodore 64 ROM disassembly)

**Summary:** Implements the newline routine and CR output in the C64 ROM: updates cursor row ($D6), tests for bottom-of-screen and calls the screen-scroll routine (JSR $E8EA), locates the start-of-logical-line pointer (using $D9,X) and sets screen pointers (JMP $E56C). The CR output clears insert/count and flags ($D8, $C7, $D4), saves the cursor column ($D3), calls the newline routine, then restores registers (JMP $E6A8).

## Description
This chunk contains two routines from the C64 ROM:

- Newline routine (entry at $E87C): performs a logical newline by shifting a byte at $C9 (LSR $C9), loading the cursor row from $D6 into X, incrementing X, comparing X with #$19 (the row-after-last check), and calling the screen-scroll routine (JSR $E8EA) if the increment wrapped past the last visible row. After that, it scans the start-of-logical-line pointer table via LDA $D9,X and loops until a positive (sign bit clear) value is found (BPL $E880), stores the new row back to $D6, and jumps to $E56C to set the screen pointers for the new cursor row and column and return.

- CR output handler (entry at $E891): clears working flags and counters (stores #$00 into $D8 insert count, $C7 reverse flag, $D4 cursor-quote flag), stores #$00 into $D3 (cursor column), calls the newline routine (JSR $E87C), then jumps to $E6A8 to restore registers and set the quote flag before exit.

Notes on behavior (as present in source):
- The routine uses the sign bit of the byte fetched from $D9+X to detect the start-of-logical-line (BPL branches when bit 7 = 0).
- CPX #$19 is used as a boundary check for the last row (row indices are compared against 0x18 and #$19 represents the row-after-last).
- Important jumps/calls: JSR $E8EA (scroll screen and adjust line pointers), JMP $E56C (set screen pointers for cursor row/column), JMP $E6A8 (restore registers and exit).

No higher-level commentary or extra usage notes are added beyond what the disassembly provides.

## Source Code
```asm
                                to lower case

                                *** do newline
.,E87C 46 C9    LSR $C9         shift >> input cursor row
.,E87E A6 D6    LDX $D6         get the cursor row
.,E880 E8       INX             increment the row
.,E881 E0 19    CPX #$19        compare it with last row + 1
.,E883 D0 03    BNE $E888       if not last row + 1 skip the screen scroll
.,E885 20 EA E8 JSR $E8EA       else scroll the screen
.,E888 B5 D9    LDA $D9,X       get start of line X pointer high byte
.,E88A 10 F4    BPL $E880       loop if not start of logical line
.,E88C 86 D6    STX $D6         save the cursor row
.,E88E 4C 6C E5 JMP $E56C       set the screen pointers for cursor row, column and return

                                *** output [CR]
.,E891 A2 00    LDX #$00        clear X
.,E893 86 D8    STX $D8         clear the insert count
.,E895 86 C7    STX $C7         clear the reverse flag
.,E897 86 D4    STX $D4         clear the cursor quote flag, $xx = quote, $00 = no quote
.,E899 86 D3    STX $D3         save the cursor column
.,E89B 20 7C E8 JSR $E87C       do newline
.,E89E 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
```

## Key Registers
- $C9 - Zero page variable used/shifted by LSR (input cursor row related)
- $D6 - Zero page - cursor row (loaded into X / saved after increment)
- $D9 - Zero page base for start-of-logical-line pointer high bytes (LDA $D9,X used to find line start)
- $D8 - Zero page - insert count (cleared on CR)
- $C7 - Zero page - reverse flag (cleared on CR)
- $D4 - Zero page - cursor quote flag ($xx = quote, $00 = no quote) (cleared on CR)
- $D3 - Zero page - cursor column (saved/cleared on CR)

## References
- "scroll_screen_and_adjust_line_pointers" — expands on scrolling the screen when newline reaches bottom
- "test_for_line_decrement" — expands on logic used when moving left across line boundaries
- "test_for_line_increment_and_end_of_line" — expands on logic used when moving right/end-of-line is required