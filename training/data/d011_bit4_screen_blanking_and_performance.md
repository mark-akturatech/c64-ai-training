# D011 Bit 4 — Screen Blanking (VIC-II / 6510 bus contention)

**Summary:** $D011 (53265) bit 4 controls screen blanking on the VIC-II (0 = blank entire screen to border color from $D020). Clearing this bit disables many VIC-II memory fetches, eliminating VIC-induced bus contention and allowing the 6510 CPU to run at full speed (useful for tape I/O and loading from older 1540 drives).

## Description
Bit 4 of $D011 (decimal 53265) is the VIC-II screen blanking control. When bit 4 = 0 the VIC-II does not display character/bitmap data and the whole visible area is filled with the border color defined by $D020 (53280). This is a hardware blank — the video chip stops fetching most display data.

Why this matters: the VIC-II and the 6510 share the system data bus and must time their memory accesses to avoid conflicts. The VIC-II normally performs many fetches during parts of the 6510 cycle where the CPU is not using the bus, but some display operations (fetching the 40 screen codes per text line, sprite data, etc.) require additional fetches that force the VIC-II to delay the 6510 briefly. Those extra fetches become bus contention delays that slow the 6510 by a measurable amount.

Clearing D011 bit 4 removes those additional VIC-II fetches (no screen data to fetch), eliminating the short delays and letting the 6510 run without those video-induced stalls. Measured effect in the original text: leaving the screen on made the CPU about 7% slower than with the screen blanked. This behavior explains:
- Why tape I/O timing may be sensitive to video-induced delays (tape routines need stable timing).
- Why an unmodified 1540 (designed for the VIC-20, which doesn't generate these delays) could fail with a C64 unless the screen was blanked or the drive/software adjusted timing.
- Newer 1541 drives transfer more slowly by default (compatible with C64 contention) and can be set to the faster VIC-20 rate if needed.

To blank the screen programmatically, clear bit 4 of $D011 (mask bit = 16). Example clearing operation: POKE 53265, PEEK(53265) AND 239 (239 = 0xEF clears bit 4).

**[Note: Source may contain an error — the original text had "PEEEK"; corrected to PEEK.]**

## Source Code
```basic
10 PRINT CHR$(147);TAB(13);"TIMING TEST":PRINT:TI$="000000":GOTO 30
20 FOR I=1 TO 10000:NEXT I:RETURN
30 GOSUB 20:DISPLAY=TI$
40 POKE 53265,11:TI$="000000"
50 GOSUB 20:NOSCREEN=TI$:POKE 53265,27
60 PRINT "THE LOOP TOOK";DISPLAY;" JIFFIES"
70 PRINT "WITH NO SCREEN BLANKING":PRINT
80 PRINT "THE LOOP TOOK";NOSCREEN;" JIFFIES"
90 PRINT "WITH SCREEN BLANKING":PRINT
100 PRINT "SCREEN BLANKING MAKE THE PROCESSOR"
110 PRINT "GO";DISPLAY/NOSCREEN*100-100;"PERCENT FASTER"
```

Notes on the demo values:
- 53265 = $D011. Values 11 and 27 (decimal) differ by 16 (bit 4), so one sets bit 4 = 0 and the other sets bit 4 = 1.
- Example one-liner to clear bit 4: POKE 53265, PEEK(53265) AND 239
  - 239 decimal = $EF (1110 1111) — clears bit 4 (mask 16).

Register map excerpt (reference):
```text
$D011 ($D011 / 53265) — VIC-II control register (vertical fine scrolling + flags)
  bit 4: Screen blanking (0 = screen blanked to border color at $D020; 1 = normal display)
```

## Key Registers
- $D011 - VIC-II - control register (bit 4 = screen blanking)
- $D020 - VIC-II - border color register (used as fill color when screen is blanked)

## References
- "d011_vertical_fine_scrolling_bits0_2_and_demo" — expands on D011 bits 0-2 and contains a demo

## Labels
- D011
- D020
