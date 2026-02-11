# Clear screen line X ($E9FF-$EA11)

**Summary:** Clears one C64 text screen line by storing ASCII space ($20) across 40 columns using zero-page indirect-indexed addressing (STA ($D1),Y). Involves zero-page pointer $00D1/$00D2, a colour-RAM pointer (writes to $D800-$DBFF), and VIC-II/ROM helpers (JSR $E9F0, $EA24, $E4DA); key mnemonics: LDY, STA ($D1),Y, DEY, BPL.

## Description
This ROM routine zeros (writes spaces) to a single text line on the screen:

- LDY #$27 sets Y = 0x27 (39 decimal). The loop decrements Y down to $00, so the routine performs 40 stores (Y = 39..0) — one per column of a standard C64 text line.
- JSR $E9F0 ("fetch screen address") initializes the zero-page indirect pointer at $00D1/$00D2 to the base address used for character writes (effective base for STA ($D1),Y).
- JSR $EA24 ("calculate the pointer to colour RAM") prepares a parallel pointer used for colour-RAM writes (colour RAM is at $D800-$DBFF).
- JSR $E4DA saves the current foreground/background colour into the computed colour-RAM location for the current character position.
- LDA #$20 loads the ASCII code for space; STA ($D1),Y writes that space into video RAM at the effective address formed by the 16-bit pointer in $00D1/$00D2 plus Y.
- DEY / BPL $EA07 loop decrement and branch until Y underflows (terminates after Y goes from 0 to $FF => negative).
- RTS returns to the caller.

Notes on addressing:
- STA ($D1),Y is the zero-page indirect-indexed store: it reads the 16-bit address from $00D1/$00D2 and adds Y to form the final target address for each write.
- Colour RAM writes are handled by the called subroutines; the ROM routine writes both the character (space) and the corresponding colour for each column.

## Source Code
```asm
                                *** clear screen line X
.,E9FF A0 27    LDY #$27        set number of columns to clear
.,EA01 20 F0 E9 JSR $E9F0       fetch a screen address
.,EA04 20 24 EA JSR $EA24       calculate the pointer to colour RAM
.,EA07 20 DA E4 JSR $E4DA       save the current colour to the colour RAM
.,EA0A A9 20    LDA #$20        set [SPACE]
.,EA0C 91 D1    STA ($D1),Y     clear character in current screen line
.,EA0E 88       DEY             decrement index
.,EA0F 10 F6    BPL $EA07       loop if more to do
.,EA11 60       RTS
```

## Key Registers
- $00D1-$00D2 - Zero Page - 16-bit indirect pointer used by STA ($D1),Y for screen memory writes
- $D800-$DBFF - Colour RAM - per-character colour RAM for screen text

## References
- "fetch_screen_address" — initializes the ($D1/$D2) pointer used to write the spaces
- "calculate_colour_ram_pointer_ea24" — computes colour-RAM pointer for the current line before writing colours

## Mnemonics
- STA
