# Multicolor bitmap plotting — addressing formula, bit-pairs & BASIC demo

**Summary:** Addresses and formulas for plotting pixels in the Commodore 64 VIC-II multicolor bitmap (bitmap base addressing, bit-pair masks, BY = BASE+(Y AND 248)*40+(Y AND 7)+(2*X AND 504)), plus a BASIC example that sets VIC-II bitmap/multicolor bits ($D016, $D018, $D011) and draws multicolor sine waves.

## Multicolor bitmap addressing
The byte containing a pixel at integer horizontal X (0..159) and vertical Y (0..199) in a VIC-II multicolor bitmap (160×200 visible) can be found with:

BY = BASE + (Y AND 248) * 40 + (Y AND 7) + (2*X AND 504)

- BASE is the start address of the bitmap area in RAM (e.g. 8192 decimal = 2*4096 in the BASIC example).
- (Y AND 248)*40 groups rows into blocks of 8 scanlines (8 scanlines × 40 bytes per row).
- (Y AND 7) selects the scanline row within that 8-line block.
- (2*X AND 504) selects the correct byte–each VIC-II byte holds four multicolor "bit-pairs" across two adjacent bytes; horizontal resolution is 160 pixels (4 pixels per byte-pair arrangement).

## Bit-pair masks and setting a pixel
Multicolor bitmap pixels are encoded as 2-bit values (0..3) per dot; these are arranged in bit-pairs inside bytes. Use an array of bit masks for the four possible bit-pair positions within the byte:

CA(0)=1, CA(1)=4, CA(2)=16, CA(3)=64

To set the pixel at (X,Y) to color CO (0..3), compute the bit-pair index BI from X and replace that bit-pair in the bitmap byte:

BI = (NOT X) AND 3
POKE BY, PEEK(BY) AND (NOT 3*CA(BI)) OR (CO*CA(BI))

- The calculation clears the target bit-pair (AND with NOT mask) and ORs in the new 2-bit color value shifted by CA(BI).
- CO is 0..3 (color chosen from available color sources — color RAM, background, multicolor registers, or shared color register depending on mode).

## BASIC demonstration
The provided BASIC program:
- Initializes CA array,
- Sets the bitmap base and enables bitmap/multicolor modes via VIC-II registers,
- Clears the hi-res screen,
- Loops CO=1..3 to draw three multicolor sine waves by computing X from a sine function and plotting using the BY formula and bit-pair POKE.

Full program and formula listing are in the Source Code section.

## Source Code
```basic
10 CA(0)=1:CA(1)=4:CA(2)=16:CA(3)=64:REM ARRAY FOR BIT PAIRS
20 BASE=2*4096:POKE53272,PEEK(53272)OR8:REM PUT BIT MAP AT 8192
30 POKE53265,PEEK(53265)OR32:POKE53270,PEEK(53270)OR16:REM MULTI-COLOR BIT MAP
40 A$="":FOR I=1 TO 37:A$=A$+"C":NEXT:PRINT CHR$(19);
50 FOR I=1 TO 27:PRINT A$;:NEXT:POKE 2023,PEEK(2022): REM SET COLOR MAP
60 A$="":FOR I=1 TO 128:A$=A$+"@":NEXT:FOR I=32 TO 63 STEP 2
70 POKE648,I:PRINTCHR$(19);A$;A$;A$;A$:NEXT:POKE648,4:REM CLR HI-RES SCREEN
80 FOR CO=1TO3:FOR Y=0TO199STEP.5:REM FROM THE TOP OF THE SCREEN TO THE BOTTOM
90 X=INT(10*CO+15*SIN(CO*45+Y/10)): REM SINE WAVE SHAPE
100 BY=BASE+40*(Y AND 248)+(Y AND 7)+(X*2 AND 504): REM FIND HI-RES BYTE
110 BI=(NOT X AND 3):POKE BY,PEEK(BY) AND (NOT 3*CA(BI)) OR(CO*CA(BI))
120 NEXT Y,CO
130 GOTO 130: REM LET IT STAY ON SCREEN
```

Reference formulas (copyable):
```text
BY = BASE + (Y AND 248) * 40 + (Y AND 7) + (2*X AND 504)
CA = {1,4,16,64}   ; CA(0)=1, CA(1)=4, CA(2)=16, CA(3)=64
BI = (NOT X) AND 3
POKE BY, PEEK(BY) AND (NOT 3*CA(BI)) OR (CO*CA(BI))
```

## Key Registers
- $D000-$D02E - VIC-II - All VIC-II registers (bitmap and display control area)
- $D018 - VIC-II - Memory control register (selects character/bitmap/screen memory pointers)
- $D011 - VIC-II - Control register 1 (vertical fine scroll, Y-scroll bits among others)
- $D016 - VIC-II - Control register 2 (multicolor mode / bitmap enable bits)

## References
- "d016_bit4_multicolor_mode_text_and_bitmap" — expands on Color sources & plotting rules for multicolor bitmap
- "bitmap_basic_sample_program" — hi-res plotting example for comparison