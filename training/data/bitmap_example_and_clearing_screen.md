# BASIC example: set bitmap base and enable HI-RES bitmap on C64

**Summary:** Example C64 BASIC to place the VIC-II bitmap/character memory at BASE (BASE=2*4096 = 8192), enable bitmap mode via VIC-II registers ($D018, $D011), clear the 8,000‑byte bitmap area, and initialize screen/color memory (POKEs to 53272/$D018, 53265/$D011, and screen/color RAM 1024–2023).

**What this does**
- Sets BASE = 2*4096 (8192) to position the character/bitmap memory bank.
- POKEs $D018 (decimal 53272) with OR 8 to select the desired memory bank for character/bitmap data.
- POKEs $D011 (decimal 53265) with OR 32 (bit 5) to enter VIC-II bitmap mode.
- Clears the 8,000‑byte bitmap area from BASE to BASE+7999 with zeros (CLR does not clear bitmap memory).
- Initializes screen memory (1024–2023) with color index 3 (cyan on black in standard palettes).

Notes:
- The high-resolution (HI-RES) bitmap area must be explicitly zeroed; PRINTing CLR does not affect bitmap RAM.
- The code uses decimal addresses as typical in BASIC (53272 = $D018, 53265 = $D011).

## Source Code
```basic
5 BASE=2*4096:POKE53272,PEEK(53272)OR8:REM PUT BIT MAP AT 8192
10 POKE53265,PEEK(53265)OR32:REM ENTER BIT MAP MODE

20 FOR I=BASE TO BASE+7999:POKE I,0:NEXT:REM CLEAR BITMAP AREA
30 FOR I=1024 TO 2023:POKE I,3:NEXT:REM SET SCREEN COLORS TO CYAN (3)
```

Additional variant with RUN/STOP & RESTORE suggestion (as in original):
```basic
5 BASE=2*4096:POKE53272,PEEK(53272)OR8
10 POKE53265,PEEK(53265)OR32
20 FORI=BASETOBASE+7999:POKEI,0:NEXT
30 FORI=1024TO2023:POKEI,3:NEXT
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register range (context: VIC-II controls bitmap/screen/character memory)
- $D018 (53272) - VIC-II - Memory control (selects character/bitmap/screen memory banks; used here with OR 8 to place bitmap/char memory at BASE=8192)
- $D011 (53265) - VIC-II - Control register 1 (bit 5 set with OR 32 to enable bitmap mode)

## References
- "bitmap_mode_how_it_works_and_color_memory_usage" — expands on clearing bitmap area and initializing screen colors