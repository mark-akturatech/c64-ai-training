# Enable multicolor character mode and set character color (POKE 53270 / PRINT "<CTRL+3>")

**Summary:** Demonstrates enabling VIC-II multicolor character mode by setting bit 4 of $D016 (POKE 53270, PEEK(53270) OR 16) and using a PETSCII control code (PRINT "<CTRL+3>") to set the text color to red. Notes that the C= key plus the number keys can change characters to any color, including multicolor characters.

**Description**
The VIC-II character multicolor mode is enabled by setting bit 4 of register $D016 (decimal 53270). The example below sets that bit without disturbing other bits:

- `POKE 53270,PEEK(53270) OR 16`
  - 53270 decimal = $D016 (VIC-II control register 2)
  - OR 16 sets bit 4 (multicolor character mode) while preserving other bits

After enabling multicolor mode, printing a PETSCII color control character changes the current print color. The example uses the keyboard control sequence CTRL+3 (printed as "<CTRL+3>" in the example) to select red for multicolor characters. The built-in COLOR keys (used with the C= Commodore key) also let you insert color control characters to change the color of typed characters, including multicolor character pixels.

The example given:
- Enables multicolor mode
- Prints the PETSCII control code for red so subsequent text (including READY and typed input) appears in multicolor red

No additional code is required to make typed input show in the selected multicolor color once the VIC-II bit and the color control code have been applied.

## Source Code
```basic
POKE 53270,PEEK(53270) OR 16:PRINT"<CTRL+3>";: REM red / multi-color red
```

(53270 decimal = $D016; OR 16 sets bit 4 — multicolor character mode)

## Key Registers
- $D016 - VIC-II - Control register 2; bit 4 = multicolor character mode enable (set with OR 16 / POKE 53270,...)

## References
- "multi_color_character_mode_intro_and_enable_disable" — expands on enabling multicolor before printing

## Labels
- $D016
