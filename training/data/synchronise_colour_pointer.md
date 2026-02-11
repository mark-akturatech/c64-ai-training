# Synchronise Colour Pointer (KERNAL $EA24)

**Summary:** Sets up the KERNAL colour-RAM pointer by copying zero-page screen-line address bytes ($D1/$D2) into USER pointer bytes ($F3/$F4), masking and ORing the high byte so subsequent writes target the $D800 colour RAM page.

## Description
This KERNAL routine (at $EA24–$EA30) prepares the two-byte pointer used for colour RAM accesses. It:

- Loads the low byte of the current screen-line address from zero page $D1 and stores it into USER low-byte $F3. This becomes the low byte of the colour-RAM pointer.
- Loads the high byte from zero page $D2, ANDs it with #$03 (keeping only the low two bits), ORs the result with #$D8, and stores that into USER high-byte $F4. The effect is to produce a high byte in the range $D8–$DB, selecting the correct $D8xx colour-RAM page for the current screen line (colour RAM area $D800).
- Returns with RTS.

This ensures subsequent KERNAL code that uses the USER pointer at $F3/$F4 will address the intended $D800 colour RAM area for operations such as printing, clearing, or moving a screen line.

## Source Code
```asm
.,EA24 A5 D1    LDA $D1         ; copy screen line low byte
.,EA26 85 F3    STA $F3         ; to colour RAM low byte
.,EA28 A5 D2    LDA $D2         ; read'n modify the hi byte
.,EA2A 29 03    AND #$03
.,EA2C 09 D8    ORA #$D8
.,EA2E 85 F4    STA $F4         ; to suite the colour RAM
.,EA30 60       RTS
```

## Key Registers
- $D1 - Zero page - screen line low byte (current screen address low)
- $D2 - Zero page - screen line high byte (current screen address high)
- $F3 - Zero page - USER pointer low byte (colour-RAM pointer low)
- $F4 - Zero page - USER pointer high byte (colour-RAM pointer high; masked/ORed to $D8–$DB)
- $D800 - Colour RAM base (target area for pointer)

## References
- "print_to_screen" — expands on calls that sync colour pointer before printing a character
- "clear_screen_line" — expands on use for positioning colour writes when clearing a line
- "move_a_screen_line" — expands on preparing colour pointer prior to moving a line
- "synchronise_colour_transfer" — expands on a lower-level call that also uses this pointer setup