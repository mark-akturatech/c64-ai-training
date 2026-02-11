# Insert / Shift Current Screen Line (ROM $E7FE-$E82F)

**Summary:** ROM routine (E7FE–E82F) that inserts a space at the current cursor column by shifting characters and colour-ram bytes right using indirect-indexed accesses (LDA/STA ($D1),Y and ($F3),Y). Key variables used: zero page pointers $D1/$F3 (screen/colour pointers), cursor column $D3, line length $D5, insert count $D8, and current colour stored at $0286.

## Description
This ROM fragment implements "open a space on the current screen line" for the C64 text input/edit routines:

- Entry checks whether the cursor column has reached the maximum allowed column:
  - CPY #$4F (compare Y with $4F). If equal, it branches to restore/exit (JMP $E6A8).
- If not at the line end:
  - Calls JSR $E965 to perform higher-level "open up a space on the screen" bookkeeping.
  - Loads the current screen line length from zero page $D5 into Y (LDY $D5).
  - Calls JSR $EA24 to compute the pointer to the colour-ram line (sets up the zero-page pointer used by ($F3),Y).
- The routine then shifts characters and colour bytes right along the current line, one position at a time:
  - Uses an index Y that is decremented (DEY) to read the character/colour from the previous position via LDA ($D1),Y and LDA ($F3),Y, then INY and STA back to the next position via STA ($D1),Y and STA ($F3),Y, respectively.
  - The loop compares Y with the cursor column stored at $D3 (CPY $D3) and continues until reaching the cursor position.
- At the cursor position:
  - Stores ASCII space (A9 #$20; STA ($D1),Y) into screen memory.
  - Loads the current colour code from $0286 and stores it into colour RAM via STA ($F3),Y.
  - Increments the insert count in $D8 (INC $D8).
- Normal exit restores registers and sets flags via JMP $E6A8.
- Following the restore/exit path there is code that tests the insert count (LDX $D8; BEQ ...) and, if non-zero, ORs the accumulator with #$40 and jumps to an "insert reversed character" routine (JMP $E697). This code is part of the same ROM area and is reached by other callers or code flow that doesn't perform the earlier JMP-to-restore.

Implementation notes extracted from the disassembly:
- The routine relies on zero-page pointer addressing with indirect-indexed loads/stores for both screen memory and colour RAM (LDA/STA ($D1),Y and LDA/STA ($F3),Y).
- Cursor column is compared against $4F (decimal 79), so the maximum usable column in this context is $4F.
- Colour code for the inserted space is taken from absolute address $0286 before storing into colour RAM.

## Source Code
```asm
.,E7FE C0 4F    CPY #$4F        compare current column with max line length
.,E800 F0 24    BEQ $E826       if at line end just exit
.,E802 20 65 E9 JSR $E965       else open up a space on the screen
                                now open up space on the line to insert a character
.,E805 A4 D5    LDY $D5         get current screen line length
.,E807 20 24 EA JSR $EA24       calculate the pointer to colour RAM
.,E80A 88       DEY             decrement the index to previous character
.,E80B B1 D1    LDA ($D1),Y     get the character from the current screen line
.,E80D C8       INY             increment the index to next character
.,E80E 91 D1    STA ($D1),Y     save the character to the current screen line
.,E810 88       DEY             decrement the index to previous character
.,E811 B1 F3    LDA ($F3),Y     get the current screen line colour RAM byte
.,E813 C8       INY             increment the index to next character
.,E814 91 F3    STA ($F3),Y     save the current screen line colour RAM byte
.,E816 88       DEY             decrement the index to the previous character
.,E817 C4 D3    CPY $D3         compare the index with the cursor column
.,E819 D0 EF    BNE $E80A       loop if not there yet
.,E81B A9 20    LDA #$20        set [SPACE]
.,E81D 91 D1    STA ($D1),Y     clear character at cursor position on current screen line
.,E81F AD 86 02 LDA $0286       get current colour code
.,E822 91 F3    STA ($F3),Y     save to cursor position on current screen line colour RAM
.,E824 E6 D8    INC $D8         increment insert count
.,E826 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
.,E829 A6 D8    LDX $D8         get the insert count
.,E82B F0 05    BEQ $E832       branch if no insert space
.,E82D 09 40    ORA #$40        change to uppercase/graphic
.,E82F 4C 97 E6 JMP $E697       insert reversed character
```

## Key Registers
- $D1 - zero page pointer (pointer to current screen line, used with indirect-indexed addressing: LDA/STA ($D1),Y)
- $F3 - zero page pointer (pointer to current line's colour RAM, used with indirect-indexed addressing: LDA/STA ($F3),Y)
- $D3 - zero page byte - cursor column index (compared against Y during shifting)
- $D5 - zero page byte - current screen line length (loaded into Y)
- $D8 - zero page byte - insert count (incremented on insert; tested later)
- $0286 - absolute address - holds current colour code used for insertion (LDA $0286 -> stored into colour RAM)

## References
- "input_control_cursor_up_left_and_clear" — expands on dispatches that may call this insert/shift code
- "set_colour_code" — expands on how the colour code is saved to $0286 and used when inserting

## Labels
- $D1
- $F3
- $D3
- $D5
- $D8
- $0286
