# Extended Background Color Mode

**Summary:** Extended background color mode (VIC-II) uses the two most significant bits of the character code to select one of four background color registers (BCOL0..BCOL3). Enable by setting bit 6 of YSCRL ($D011); disable by clearing bit 6. Only the first 64 characters of the character set may be used; foreground color still comes from color RAM.

## Description
This mode trades character-set size for additional per-character background colors without losing screen resolution. The two most significant bits (bits 6–7 of the 8-bit character code) index one of four background color registers (BCOL0..BCOL3). Because those two bits are taken from the character code, only character codes $00–$3F (first 64 characters) are usable when this mode is active.

Foreground color for each character is provided by the color RAM as in normal text mode; the background color for each character is selected via the character-code MSBs and the BCOL0..BCOL3 registers.

Enable/disable:
- Set bit 6 of the YSCRL register ($D011) to enable extended background color mode.
- Clear bit 6 of $D011 to disable it.

Mapping of the two MSBs of the character code to BCOL registers: see Source Code section.

## Source Code
```text
Extended background color mapping (two most significant bits of character code):

Bit pair  Register
00        BCOL0
01        BCOL1
10        BCOL2
11        BCOL3
```

## Key Registers
- $D011 - VIC-II - YSCRL / control register (bit 6 enables/disables extended background color mode)

## References
- "text_mode_multicolor_mode" — alternative way to get more colors without losing resolution

## Labels
- YSCRL
- BCOL0
- BCOL1
- BCOL2
- BCOL3
