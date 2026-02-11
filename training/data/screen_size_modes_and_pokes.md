# Enter 38-column / 24-row modes by clearing bit 3 of $D016 / $D011

**Summary:** Change C64 text column/row count by toggling bit 3 of VIC-II registers $D016 (53270) and $D011 (53265) using POKE/PEEK; clear bit 3 (AND 247 / AND %11110111) to enable 38 columns or 24 rows, set it (OR 8 / OR %00001000) to return to 40 columns or 25 rows.

## Description
The VIC-II contains control bits that change the visible text area size. Two registers are used here:

- $D016 (decimal 53270) — clearing bit 3 (value 8) selects 38-column text mode; setting bit 3 returns to 40-column mode.
- $D011 (decimal 53265) — clearing bit 3 selects 24-row text mode; setting bit 3 returns to 25-row mode.

Use PEEK to preserve other bits when changing only bit 3. The AND mask 247 (decimal) equals %11110111 (clears bit 3). The OR mask 8 equals %00001000 (sets bit 3). These operations are safe for toggling that single bit without disturbing other control bits in the same register.

## Source Code
```basic
REM 38-column mode (clear bit 3 of $D016 / 53270)
POKE 53270, PEEK(53270) AND 247    : REM 247 = %11110111

REM Return to 40-column mode (set bit 3)
POKE 53270, PEEK(53270) OR 8       : REM 8 = %00001000

REM 24-row mode (clear bit 3 of $D011 / 53265)
POKE 53265, PEEK(53265) AND 247

REM Return to 25-row mode (set bit 3)
POKE 53265, PEEK(53265) OR 8
```

## Key Registers
- $D011 (53265) - VIC-II (register range $D000-$D02E) - Control Register 1: bit 3 = 24/25 row select (clear=24 rows, set=25 rows)
- $D016 (53270) - VIC-II (register range $D000-$D02E) - Control Register 2: bit 3 = 38/40 column select (clear=38 columns, set=40 columns)

## References
- "smooth_scrolling_overview_and_steps" — expands on modes used to provide covered areas for smooth scrolling

## Labels
- D011
- D016
