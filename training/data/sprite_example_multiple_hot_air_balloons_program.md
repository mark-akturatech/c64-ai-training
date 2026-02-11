# BASIC sprite example: sprites 0–5 enabled, pointers 2040–2045, expanded and moved

**Summary:** C64 BASIC program that enables VIC-II sprites 0..5 ($D015), sets sprite pointers at memory 2040..2045 ($07F8–$07FD) to pages 192/193 (sprite data at 192*64/$3000 and 193*64/$3040), expands sprites in X/Y, sets positions and colors ($D000-$D00F, $D027-$D02C), loads 64-byte sprite bitmaps from DATA into RAM pages, and animates sprites using 8-bit X registers plus the X MSB in $D010.

## Explanation
- Initialization
  - The program computes the VIC base: vic = 13*4096 = 53248 = $D000. All poke/peek references of the form poke vic + n map to $D000 + n.
  - poke vic+21,63 enables sprites 0–5 (writes 63 to $D015).
  - poke vic+33,14 sets background color (writes to $D021).
  - poke vic+23,3 and poke vic+29,3 set sprite expansion flags (the program uses two VIC registers to expand sprites in Y and X for sprites 0 and 1).
- Sprite pointers and sprite data layout
  - The program writes sprite pointer bytes into RAM locations 2040..2045 (decimal). Each pointer byte N selects sprite bitmap at address N*64 (decimal). Here pointer values alternate 192 and 193:
    - 192 * 64 = 12288 = $3000
    - 193 * 64 = 12352 = $3040
  - The loader loop:
    - for x = 192 to 193
    - for y = 0 to 63
    - read a : poke x*64 + y, a
    - This fills two 64-byte pages ($3000 and $3040) with the DATA blocks (multiple sprites share these pages).
- Positions and colors
  - Sprite X/Y positions are written to $D000..$D00F (poke vic+0..vic+11 in program for sprites 0..5 X/Y).
  - Sprite color registers are written in the $D027..$D02C range (the program uses vic+39..vic+44).
- Movement loop and X MSB handling
  - The code reads the low X byte for sprite 0 with x = peek(vic) (peek($D000)).
  - Because VIC-II stores the X coordinate as low byte in $D000..$D00E and the MSB bits for sprites are stored together in $D010 ($D000 + 16), the program tests and sets bits in vic+16 to handle wrapping and high-bit behavior:
    - It conditionally reverses dx when x reaches screen edges and when the X MSB bit (peek(vic+16) AND 1) differs.
    - For crossing the 8-bit boundary it sets x to -1 or 256 and writes a 'side' value into vic+16 to update the MSB(s) before poking the 8-bit X registers.
  - After adjusting x and y, the program writes:
    - poke vic, x        (sprite 0 X low byte)
    - poke vic+2, x      (sprite 1 X low byte — both sprites share the same X in this example)
    - poke vic+1, y      (sprite 0 Y)
    - poke vic+3, y      (sprite 1 Y)
  - The animation uses shared logic so multiple sprites use the same low-byte X and the MSB register to represent full horizontal position.
- DATA blocks
  - The program contains DATA statements for the sprite bitmaps; the loader reads these sequentially and stores them into the two 64-byte pages used by the pointers.

## Source Code
```basic
 10 rem sprite example 2...
 20 rem the hot air balloon again
 30 vic=13*4096:rem this is where the vic registers begin
 35 pokevic+21,63:rem enable sprites 0 thru 5
 36 pokevic+33,14:rem set background color to light blue
 37 pokevic+23,3:rem expand sprites 0 and 1 in y
 38 pokevic+29,3:rem expand sprites 0 and 1 in x
 40 poke2040,192:rem set sprite 0's pointer
 50 poke2041,193:rem set sprite 1's pointer
 60 poke2042,192:rem set sprite 2's pointer
 70 poke2043,193:rem set sprite 3's pointer
 80 poke2044,192:rem set sprite 4's pointer
 90 poke2045,193:rem set sprite 5's pointer
100 pokevic+4,30:rem set sprite 2's x position
110 pokevic+5,58:rem set sprite 2's y position
120 pokevic+6,65:rem set sprite 3's x position
130 pokevic+7,58:rem set sprite 3's y position
140 pokevic+8,100:rem set sprite 4's x position
150 pokevic+9,58:rem set sprite 4's y position
160 pokevic+10,100:rem set sprite 5's x position
170 pokevic+11,58:rem set sprite 5's y position
175 print"{white}{clear}"tab(15)"this is two hires sprites";
176 printtab(55)"on top of each other"
180 pokevic+0,100:rem set sprite 0's x position
190 pokevic+1,100:rem set sprite 0's y position
200 pokevic+2,100:rem set sprite 1's x position
210 pokevic+3,100:rem set sprite 1's y position
220 pokevic+39,1:rem set sprite 0's color
230 pokevic+41,1:rem set sprite 2's color
240 pokevic+43,1:rem set sprite 4's color
250 pokevic+40,6:rem set sprite 1's color
260 pokevic+42,6:rem set sprite 3's color
270 pokevic+44,6:rem set sprite 5's color
280 forx=192to193:rem the start of the loop that defines the sprites
290 fory=0to63:rem byte counter with sprite loop
300 reada:rem read in a byte
310 pokex*64+y,a:rem store the data in sprite area
320 nexty,x:rem close loops
330 dx=1:dy=1
340 x=peek(vic):rem look at sprite 0's x position
350 ify=50ory=208thendy=-dy:rem if y is on the edge of the...
370 rem screen, then reverse delta y
380 ifx=24and(peek(vic+16)and1)=0thendx=-dx:rem if sprite is...
390 rem touching the left edge, then reverse it
400 ifx=40and(peek(vic+16)and1)=1thendx=-dx:rem if sprite is...
410 rem touching the right edge, then reverse it
420 ifx=255anddx=1thenx=-1:side=3
430 rem switch to other side of the screen
440 ifx=0anddx=-1thenx=256:side=0
450 rem switch to other side of the screen
460 x=x+dx:rem add delta x to x
470 x=xand255:rem make sure x is in allowed range
480 y=y+dy:rem add delta y to y
485 pokevic+16,side
490 pokevic,x:rem put new x value into sprite 0's x position
500 pokevic+2,x:rem put new x value into sprite 1's x position
510 pokevic+1,y:rem put new y value into sprite 0's y position
520 pokevic+3,y:rem put new y value into sprite 1's y position
530 goto340
600 rem ***** sprite data *****
610 data0,255,0,3,153,192,7,24,224,7,56,224,14,126,112,14,126,112,14,126
620 data112,6,126,96,7,56,224,7,56,224,1,56,128,0,153,0,0,90,0,0,56,0
630 data0,56,0,0,0,0,0,0,0,0,126,0,0,42,0,0,84,0,0,40,0,0
640 data0,0,0,0,102,0,0,231,0,0,195,0,1,129,128,1,129,128,1,129,128
650 data1,129,128,0,195,0,0,195,0,4,195,32,2,102,64,2,36,64,1,0,128
660 data1,0,128,0,153,0,0,153,0,0,0,0,0,84,0,0,42,0,0,20,0,0
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0..7 X and Y low-byte positions (used: sprites 0..5)
- $D010 - VIC-II - Sprite X MSB / related MSB flags (vic+16 used for X MSB handling)
- $D015 - VIC-II - Sprite enable register (vic+21 used to enable sprites 0..5)
- $D021 - VIC-II - Background color (vic+33 used to set background)
- $D027-$D02C - VIC-II - Sprite color registers for sprites 0..5 (vic+39..vic+44)
- $07F8-$07FD (decimal 2040..2045) - RAM - Sprite pointer bytes (each pointer N => bitmap at address N*64)

## References
- "sprite_example_hot_air_balloon_program" — expands on single-sprite example and sprite DATA format
- "sprite_pointers_and_memory_location_formula" — expands on sprite pointer bytes (2040..2047) and N*64 bitmap formula