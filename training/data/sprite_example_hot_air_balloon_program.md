# BASIC sprite example — hot-air-balloon (page146.prg)

**Summary:** BASIC program for the C64 that enables and displays a single VIC-II sprite (sprite 0), points its sprite pointer via POKE 2040, stores 64 bytes of sprite bitmap at pointer*64, sets sprite color and X/Y expansion bits ($D017/$D01D), and animates a bouncing/expanding hot-air-balloon by reading/writing VIC-II registers ($D000..$D02E).

## Description
This is a line-numbered BASIC program that:

- Sets the VIC-II base with vic = 13*4096 (=> $D000).
- Enables sprite 0 with POKE vic+21,1 (VIC $D015, bit0).
- Sets the screen background color with POKE vic+33,14 (VIC $D021 = light blue).
- Enables sprite expansion:
  - Vertical (double-height) via POKE vic+23,1 (VIC $D017, bit0).
  - Horizontal (double-width) via POKE vic+29,1 (VIC $D01D, bit0).
- Assigns sprite pointer for sprite 0 with POKE 2040,192. The sprite pointer table resides at decimal 2040 ($07F8); a pointer value N points to memory address N*64 (here 192*64 = 12288 = $3000).
- Loads 64 bytes of sprite bitmap data into memory starting at 192*64 (the program reads DATA and POKEs into that block).
- Sets initial sprite position and color:
  - POKE vic+0,100 sets sprite 0 X low byte ($D000).
  - POKE vic+1,100 sets sprite 0 Y ($D001).
  - POKE vic+39,1 sets sprite 0 color ($D027).
- Main loop:
  - Reads current X/Y with PEEK(vic) and PEEK(vic+1).
  - Reverses vertical delta (dy) when Y reaches screen edges (checks Y==50 or Y==208).
  - Uses the X MSB register (PEEK(vic+16), VIC $D010) to detect whether sprite 0 is on the high side of X (X >= 256). Tests (PEEK(vic+16) AND 1).
  - Reverses horizontal delta (dx) when touching left or right edges by combining X low value checks (24 and 40) with the X MSB bit for sprite 0.
  - Handles wrap-around across the 8-bit X low boundary by toggling a side flag and POKING vic+16 (VIC $D010) with side (0/1) to set/clear the sprite-0 X MSB bit.
  - Updates sprite X/Y by POKEs back to vic and vic+1.
- Uses a GOTO loop to animate continuously.

Notes:
- The program writes the entire VIC $D010 register with side (0 or 1) via POKE vic+16,side. That clears other bits in $D010; this is a simple approach suitable when only sprite 0 MSB matters, but it will overwrite MSBs for other sprites if they are used.
- Sprite bitmap area is treated as 64 bytes (y=0 to 63) and stored at pointer*64.

## Source Code
```basic
10 rem sprite example 1... the hot air balloon
30 vic=13*4096:rem this is where the vic registers begin
35 pokevic+21,1:rem enable sprite 0
36 pokevic+33,14:rem set background color to light blue
37 pokevic+23,1:rem expand sprite 0 in y
38 pokevic+29,1:rem expand sprite 0 in x
40 poke2040,192:rem set sprite 0's pointer
180 pokevic+0,100:rem set sprite 0's x position
190 pokevic+1,100:rem set sprite 0's y position
220 pokevic+39,1:rem set sprite 0's color
250 fory=0to63:rem byte counter with sprite loop
300 reada:rem read in a byte
310 poke192*64+y,a:rem store the data in sprite area
320 nexty:rem close loop
330 dx=1:dy=1
340 x=peek(vic):rem look at sprite 0's x position
350 y=peek(vic+1):rem look at sprite 0's y position
360 ify=50ory=208thendy=-dy:rem if y is on the edge of the...
370 rem screen, then reverse delta y
380 ifx=24and(peek(vic+16)and1)=0thendx=-dx:rem if sprite is touching...
390 rem the left edge(x=24 and the msb for sprite 0 is 0), reverse it
400 ifx=40and(peek(vic+16)and1)=1thendx=-dx:rem if sprite is touching...
410 rem the right edge (x=40 and the msb for sprite 0 is 1), reverse it
420 ifx=255anddx=1thenx=-1:side=1
430 rem switch to other side of the screen
440 ifx=0anddx=-1thenx=256:side=0
450 rem switch to other side of the screen
460 x=x+dx:rem add delta x to x
470 x=xand255:rem make sure x is in allowed range
480 y=y+dy:rem add delta y to y
485 pokevic+16,side
490 pokevic,x:rem put new x value into sprite 0's x position
510 pokevic+1,y:rem put new y value into sprite 0's y position
530 goto340
600 rem ***** sprite data *****
610 data0,127,0,1,255,192,3,255,224,3,231,224
620 data7,217,240,7,223,240,7,217,240,3,231,224
630 data3,255,224,3,255,224,2,255,160,1,127,64
640 data1,62,64,0,156,128,0,156,128,0,73,0,0,73,0
650 data0,62,0,0,62,0,0,62,0,0,28,0,0
```

## Key Registers
- $07F8-$07FF - Sprite pointer table (decimal 2040-2047). POKE 2040 sets sprite 0 pointer (pointer*N = address N*64).
- $D000-$D00F - VIC-II - Sprite 0..7 X (even offsets) and Y (odd offsets) low-byte positions.
- $D010 - VIC-II - Sprite X MSB register (bits 0-7 are MSB for sprites 0-7).
- $D015 - VIC-II - Sprite enable register (bits 0-7 enable sprites 0-7).
- $D017 - VIC-II - Sprite Y expansion bits (bits 0-7; POKE vic+23 in source).
- $D01D - VIC-II - Sprite X expansion bits (bits 0-7; POKE vic+29 in source).
- $D021 - VIC-II - Background color register (POKE vic+33,14 in source).
- $D027-$D02E - VIC-II - Sprite color registers for sprites 0..7 (POKE vic+39 sets sprite 0 color).

## References
- "sprite_pointers_and_memory_location_formula" — expands on uses POKE 2040 to point sprite 0 to a sprite data block
- "sprite_expansion_horizontal_vertical" — expands on examples setting expand bits via vic+23 and vic+29