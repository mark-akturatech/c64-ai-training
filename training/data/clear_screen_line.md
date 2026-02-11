# CLEAR SCREEN LINE (KERNAL)

**Summary:** Clears one screen line by writing ASCII spaces ($20) to screen memory via STA ($D1),Y and resets the corresponding colour RAM line by calling the colour-reset routine (JSR $E4DA). Uses zero-page pointer $D1/$D2 and calls routines at $E9F0 and $EA24 to position pointers. Includes a free NOP byte at $EA12.

## Description
This routine clears a single 40-column screen line and clears the matching colour RAM line:

- LDY #$27 initializes Y = 39 (40 columns counting 0..39).
- JSR $E9F0 ("set_start_of_line") computes and sets the screen pointer (zero-page pointer at $D1/$D2) to the first column of the line to be cleared.
- JSR $EA24 ("synchronise_colour_pointer") aligns the colour RAM pointer for the same screen line.
- JSR $E4DA ("reset character colour, to COLOR") clears the colour RAM byte(s) for the current position to the value in the variable COLOR.
- LDA #$20 loads ASCII space and STA ($D1),Y writes the space into screen memory through the zero-page indirect pointer.
- The loop DEY / BPL repeats for all 40 columns.
- RTS returns; a single-byte NOP follows at $EA12 (unused/free byte).

Behavioral notes (from code):
- Uses indirect indexed addressing STA ($D1),Y to write to screen memory; the zero-page pointer pair at $D1/$D2 must point at the desired screen offset before the loop.
- Colour clearing is performed by a separate routine; this code synchronises the colour pointer first so both screen and colour RAM advance in step.
- The loop count of 40 is implemented by loading Y with $27 and decrementing until BPL fails.

## Source Code
```asm
.,E9FF A0 27    LDY #$27
.,EA01 20 F0 E9 JSR $E9F0       set start of line
.,EA04 20 24 EA JSR $EA24       synchronise colour pointer
.,EA07 20 DA E4 JSR $E4DA       reset character colour, to COLOR
.,EA0A A9 20    LDA #$20        ASCII space
.,EA0C 91 D1    STA ($D1),Y     store character on screen
.,EA0E 88       DEY             next
.,EA0F 10 F6    BPL $EA07       till hole line is done
.,EA11 60       RTS

.,EA12 EA       NOP             free byte
```

## Key Registers
- $D1-$D2 - Zero Page - indirect screen memory pointer used by STA ($D1),Y (points to current screen byte base)

## References
- "set_start_of_line" — computes the address to start clearing from
- "synchronise_colour_pointer" — positions the colour RAM pointer before clearing colours
- "print_to_screen" — routines that write to both screen and colour RAM at computed pointers

## Labels
- D1
- D2
