# BASIC sprite multicolor toggle example (page148.prg)

**Summary:** BASIC program for the C64 (VIC-II $D000) that loads a 64-byte sprite into $3000, sets the sprite pointer at $07F8, and lets the user toggle sprite multicolor mode at runtime via POKE $D01C (vic+28). Uses VIC-II multicolor registers ($D025/$D026) and sprite color ($D027).

## Description
This BASIC listing demonstrates:
- Setting VIC-II base in a variable (vic = 53248 = $D000) and addressing VIC registers with vic+offset.
- Enabling sprite 0, expanding it in X/Y, positioning it, and assigning its color.
- Pointing sprite 0 to sprite data at $3000 by writing a pointer byte to memory $07F8 (2040 decimal). The pointer byte is multiplied by 64 by the VIC-II to form the sprite data address (192 * 64 = 12288 = $3000).
- Turning on global sprite multicolor mode with POKE vic+28 (POKE $D01C). Multicolor palette registers for sprites are set via vic+37 and vic+38 (POKE $D025/$D026). Sprite color is set via vic+39 (POKE $D027).
- Loading 64 bytes of sprite data with READ/POKE into $3000.
- Moving the sprite around the screen by reading/modifying sprite X/Y positions at vic and vic+1 (POKE/PEEK of $D000/$D001) and handling screen-edge wrapping and expansion flags.
- Reading keyboard input with GET A$ and toggling multicolor mode: press "m" to set multicolor (POKE vic+28,1) or "h" to set high-resolution (POKE vic+28,0).

Addresses used in the code (converted from vic+offset):
- vic = 53248 = $D000 (VIC-II base)
- vic+28 = $D01C — sprite multicolor mode (0 = hi-res sprites, 1 = multicolor sprites)
- vic+37 = $D025 — multicolor register 0 (shared multicolor)
- vic+38 = $D026 — multicolor register 1 (shared multicolor)
- vic+39 = $D027 — sprite 0 color
- vic / vic+1 = $D000/$D001 — sprite 0 X/Y positions
- Memory $07F8 (2040 decimal) — sprite pointer table; entry for sprite 0 set to 192 to point to $3000
- Sprite data loaded at $3000 (12288 decimal)

Behavioral notes:
- The program uses GET A$ and simple key testing to toggle the multicolor bit at runtime without restarting.
- Sprite pointers are page-based: pointer value N points to address N * 64.
- Multicolor mode is global for sprites; enabling it affects sprite rendering modes and uses the shared multicolor registers.

## Source Code
```basic
10 REM sprite example 3...
20 REM the hot air gorf
30 vic = 53248 : REM this is where the vic registers begin
35 POKE vic+21,1 : REM enable sprite 0
36 POKE vic+33,14 : REM set background color to light blue
37 POKE vic+23,1 : REM expand sprite 0 in Y
38 POKE vic+29,1 : REM expand sprite 0 in X

40 POKE 2040,192 : REM set sprite 0's pointer (192 * 64 = 12288 = $3000)
50 POKE vic+28,1 : REM turn on multicolor (vic+28 = $D01C)
60 POKE vic+37,7 : REM set multicolor 0 (vic+37 = $D025)
70 POKE vic+38,4 : REM set multicolor 1 (vic+38 = $D026)
180 POKE vic+0,100 : REM set sprite 0's X position ($D000)
190 POKE vic+1,100 : REM set sprite 0's Y position ($D001)
220 POKE vic+39,2 : REM set sprite 0's color (vic+39 = $D027)
290 FOR y = 0 TO 63 : REM byte counter with sprite loop
300 READ a : REM read in a byte
310 POKE 12288 + y, a : REM store the data in sprite area ($3000)
320 NEXT y : REM close loop
330 dx = 1 : dy = 1
340 x = PEEK(vic) : REM look at sprite 0's X position ($D000)
350 y = PEEK(vic+1) : REM look at sprite 0's Y position ($D001)
360 IF y = 50 OR y = 208 THEN dy = -dy : REM reverse Y on vertical edges
370 REM screen, then reverse delta y
380 IF x = 24 AND (PEEK(vic+16) AND 1) = 0 THEN dx = -dx : REM left edge check
390 REM touching the left edge, then reverse it
400 IF x = 40 AND (PEEK(vic+16) AND 1) = 1 THEN dx = -dx : REM right edge check
410 REM touching the right edge, then reverse it
420 IF x = 255 AND dx = 1 THEN x = -1 : side = 1 : REM switch to other side
430 REM of the screen
440 IF x = 0 AND dx = -1 THEN x = 256 : side = 0 : REM switch to other side
450 REM of the screen
460 x = x + dx : REM add delta x to x
470 x = x AND 255 : REM keep x in 0..255 range
480 y = y + dy : REM add delta y to y
485 POKE vic+16, side : REM MSB/X high bit for sprites (vic+16 = $D010)
490 POKE vic, x : REM put new X value into sprite 0's X position ($D000)
510 POKE vic+1, y : REM put new Y value into sprite 0's Y position ($D001)
520 GET A$ : REM get a key from the keyboard
521 IF A$ = "m" THEN POKE vic+28,1 : REM user selected multicolor
522 IF A$ = "h" THEN POKE vic+28,0 : REM user selected high resolution
530 GOTO 340
600 REM ***** sprite data *****
610 DATA 64,0,1,16,170,4,6,170,144,10,170,160,42,170,168,41,105,104,169
620 DATA 235,106,169,235,106,169,235,106,170,170,170,170,170,170,170,170
630 DATA 170,170,170,170,166,170,154,169,85,106,170,85,170,42,170,168,10
640 DATA 170,160,1,0,64,1,0,64,5,0,80,0
```

## Key Registers
- $D000-$D02E - VIC-II - full VIC register range (sprite enable, sprite X/Y positions, multicolor control, multicolor color registers, sprite colors, expansion and control bits)
- $07F8-$07FF - Memory (sprite pointer table) - sprite pointer bytes for sprite 0-7 (program uses 2040 = $07F8 for sprite 0)
- $3000 (12288 decimal) - Memory - sprite data load address (pointer value 192 -> 192*64 = 12288)

## References
- "sprite_multicolor_mode_bit_pairs" — explains sprite multicolor behavior and registers