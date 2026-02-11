# VIC-II $D011 Bit 6 — Extended Background Color Mode

**Summary:** VIC-II $D011 (53265) Bit 6 enables "extended background color" mode, mapping character code ranges to background color registers $D021-$D024 so each text character can have an independent background; enable with POKE 53265,PEEK(53265) OR 64 and disable with POKE 53265,PEEK(53265) AND 191.

## Description
Setting bit 6 of the VIC-II control register at $D011 (decimal 53265) turns on extended background color mode. In this mode the foreground (character glyph) and background colors can be selected separately per character, increasing effective background-color variety by partitioning character codes into four ranges, each using a different background color register.

Behavior summary:
- Normal mode: background color for the whole screen comes from Background Color Register 0 ($D021 / decimal 53281).
- Extended background color mode:
  - Only the first 64 character shapes (display codes 0–63) are available for use as glyphs on screen. All displayed glyphs are selected from this 0–63 set regardless of the character code printed.
  - Character codes are still stored 0–255; the glyph chosen is from 0–63 but the background color comes from a register determined by the character's code range.
  - Mapping of display-code ranges to background registers:
    - Codes 0–63  → Background register $D021 (Background Color 0)
    - Codes 64–127 → Background register $D022 (Background Color 1)
    - Codes 128–191 → Background register $D023 (Background Color 2)
    - Codes 192–255 → Background register $D024 (Background Color 3)

Enabling/disabling:
- Enable: POKE 53265,PEEK(53265) OR 64 (sets bit 6; same as OR $40)
- Disable: POKE 53265,PEEK(53265) AND 191 (clears bit 6; same as AND $BF)

Practical effects:
- Characters with codes outside 0–63 will display a glyph from 0–63, but their background color will be taken from the register mapped to their 64-code window (see mapping above). This is commonly used to create multiple background colors in text-mode windows or colorful status rows while using a reduced glyph set.

**[Note: Source may contain an error — it names $D024 as "register 4" (decimal 53284) which is actually the fourth background register typically called Background Color 3. The addresses given (53281–53284) are correct.]**

## Source Code
```basic
10 REM Put four different letter codes into screen memory and set colors
20 FOR I=0 TO 3:POKE 1230+(I*8),I*64+I:POKE 55502+(I*8),1:NEXT
30 REM Set other background color registers: black, red, green
40 POKE 53282,0:POKE 53283,2:POKE 53284,5
50 REM Activate extended background color mode (set bit 6 of $D011)
60 POKE 53265,PEEK(53265) OR 64
70 REM To disable extended color mode:
80 REM POKE 53265,PEEK(53265) AND 191
```

```text
Quick reference addresses (decimal / hex)
53265  = $D011  (VIC-II control register with Bit 6 = extended background color)
53281  = $D021  (Background Color Register 0)
53282  = $D022  (Background Color Register 1)
53283  = $D023  (Background Color Register 2)
53284  = $D024  (Background Color Register 3)
```

## Key Registers
- $D011 - VIC-II - Bit 6: enable/disable extended background color mode
- $D021-$D024 - VIC-II - Background Color Registers 0–3 (used by code ranges 0–63, 64–127, 128–191, 192–255 respectively)

## References
- "bgcolor_registers" — expands on Background Color Registers $D021-$D024  
- "extended_background_color_utilities" — subroutines/programs using extended background for windows

## Labels
- D011
- D021
- D022
- D023
- D024
