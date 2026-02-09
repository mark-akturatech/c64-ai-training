# compute_colour_ram_pointer (EA24)

**Summary:** Computes the colour-RAM pointer for the current screen line by reading zero-page screen-line pointer bytes ($00D1/$00D2), storing the low byte to $00F3, masking the high byte to the line page (AND #$03), ORing with the colour memory page (ORA #$D8), and saving the resulting high byte to $00F4. Uses RTS to return.

**Purpose**
This routine builds a 16-bit pointer to the colour RAM location for the current screen line and stores it in two zero-page bytes ($00F3 = low, $00F4 = high). It:

- Loads the current screen-line pointer low byte from $00D1 and saves it to $00F3.
- Loads the current screen-line pointer high byte from $00D2, keeps only its two least-significant bits (line page index) via AND #$03, forces the high byte to the colour-RAM page by ORA #$D8, and saves the result to $00F4.
- Returns with RTS.

This pointer can then be used to access the colour RAM address range $D800-$DBFF (high byte $D8).

**[Note: Source may contain an error — the inline binary comment "1101 01xx" does not match the value #$D8 (binary 1101 1000) used by ORA #$D8.]**

**Operation details**
- $00D1: low byte of the current screen-line pointer (copied unchanged to $00F3).
- $00D2: high byte of the current screen-line pointer. Only the low two bits are preserved (AND #$03) to select the line page within a 4-page range; then ORA #$D8 forces the high byte to the colour-RAM page ($D8).
- Resulting 16-bit pointer in $00F3/$00F4 points into the colour RAM page (effectively $D800 + ($00F3)) for the active screen line.

## Source Code
```asm
                                *** calculate the pointer to colour RAM
.,EA24 A5 D1    LDA $D1         get current screen line pointer low byte
.,EA26 85 F3    STA $F3         save pointer to colour RAM low byte
.,EA28 A5 D2    LDA $D2         get current screen line pointer high byte
.,EA2A 29 03    AND #$03        mask 0000 00xx, line memory page
.,EA2C 09 D8    ORA #$D8        set  1101 1000, colour memory page
.,EA2E 85 F4    STA $F4         save pointer to colour RAM high byte
.,EA30 60       RTS
```

## Key Registers
- $00D1 - Zero page - current screen-line pointer low byte (source)
- $00D2 - Zero page - current screen-line pointer high byte (source)
- $00F3 - Zero page - stored colour-RAM pointer low byte (destination)
- $00F4 - Zero page - stored colour-RAM pointer high byte (destination)
- $D800 - Colour RAM page (implied target page via ORA #$D8)

## References
- "shift_screen_line_up_down" — this routine is called (JSR) by the line-shift routine to set colour pointers
- "clear_screen_line_x" — used when clearing a line to compute where to store colours
- "print_and_store_char_and_colour_at_cursor" — used to compute the colour RAM pointer before storing the colour at the cursor