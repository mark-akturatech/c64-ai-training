# C64 BASIC: Hi‑Res Bitmap Plotting Example (BI array + BY address formula)

**Summary:** Demonstrates bitmap mode initialization (POKE 53272/$D018, 53265/$D011), creation of a BI array of powers-of-two for fast bit masks, and the BY address formula used to POKE individual hi‑res bytes. Includes color map setup and screen clearing.

**Description**
This BASIC listing illustrates how to set up the C64 in bitmap mode, prepare a lookup array of bit masks to avoid repeated exponentiation, clear the hi‑res screen, set the color map, and plot a sine wave by computing the target byte address (BY) and setting the appropriate bit with a POKE.

Key operations and formulas in the program:
- `BI(I)=2^I` for I=0..7: precomputes bit masks 1,2,4,8,...,128 to replace repeated 2^I evaluations.
- `BASE=2*4096` sets the bitmap base address to 8192 ($2000).
- `POKE 53272, PEEK(53272) OR 8` sets the VIC memory pointers to place the bitmap at 8192 ($D018 modification).
- `POKE 53265, PEEK(53265) OR 32` enables bitmap mode (VIC control bits at $D011).
- The BY computation used to locate the hi‑res byte for coordinates (X,Y):
  `BY = BASE + 40*(Y AND 248) + (Y AND 7) + (X AND 504)`
  - BASE: start of bitmap (8192)
  - 40*(Y AND 248): row block offset (40 bytes per character row × row group)
  - (Y AND 7): row within the character (0–7)
  - (X AND 504): byte column offset (X rounded down to byte boundary)
- `POKE BY, PEEK(BY) OR (BI(NOT X AND 7))` sets the bit within the byte corresponding to X:
  - (NOT X AND 7) yields the bit index (0–7) for that X position (bit order used by this routine).
- Screen clear and color map setup steps appear before plotting. The program loops to continuously plot the sine wave and leaves it onscreen.

The program uses decimal addresses in the listing (e.g., 53272, 53265). These correspond to VIC-II registers $D018 and $D011 respectively.

## Source Code
```basic
10 FOR I=0 TO 7:BI(I)=2^I:NEXT: REM SET UP ARRAY OF POWERS OF 2 (BIT VALUE)
20 BASE=2*4096:POKE53272,PEEK(53272)OR8:REM PUT BIT MAP AT 8192
30 POKE53265,PEEK(53265)OR32:REM ENTER BIT MAP MODE
40 A$="":FOR I=1 TO 37:A$=A$+"C":NEXT:PRINT CHR$(19);
50 FOR I=1 TO 27:PRINTA$;:NEXT:POKE2023,PEEK(2022): REM SET COLOR MAP
60 A$="":FOR I=1 TO 27:A$=A$+"@":NEXT:FOR I=32 TO 63 STEP 2
70 POKE648,I:PRINT CHR$(19);A$;A$;A$;A$:NEXT:POKE648,4:REM CLEAR HI-RES SCREEN
80 FORY=0TO199STEP.5:REM FROM THE TOP OF THE SCREEN TO THE BOTTOM
90 X=INT(160+40*SIN(Y/10)): REM SINE WAVE SHAPE
100 BY=BASE+40*(Y AND 248)+(Y AND 7)+(X AND 504): REM FIND HI-RES BYTE
110 POKEBY,PEEK(BY)OR(BI(NOT X AND 7)):NEXT Y:REM POKE IN BIT VALUE
120 GOTO 120: REM LET IT STAY ON SCREEN
```

## Key Registers
- $D011 (53265) - VIC-II - control register (vertical fine scroll / bitmap mode bit used to enable bitmap)
- $D018 (53272) - VIC-II - memory control / screen and bitmap base pointer (used to place bitmap at 8192)

## References
- "bitmap_addressing_and_plotting" — expands on BY address formula, BI array usage, and bitmap addressing details

## Labels
- D011
- D018
