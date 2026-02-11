# LINES 100–109 — Sprite DATA (three 63‑byte shapes, pointer animation)

**Summary:** This section details the DATA statements containing three 63‑byte VIC‑II sprite shapes, the BASIC program's method of reading these DATA blocks into three 64‑byte memory pages, and the animation technique achieved by cycling the VIC sprite pointer for sprite 0 (located at address 2040 or $07F8) through the three 64‑byte blocks.

**What the DATA lines contain**

The DATA statements define three sprite shapes sequentially:

- First 63 bytes = sprite shape #1
- Next 63 bytes = sprite shape #2
- Final 63 bytes = sprite shape #3

Each sprite shape is 24×21 pixels, with each scan line requiring 3 bytes, totaling 63 bytes per sprite. These 63‑byte definitions are stored in separate 64‑byte pages in RAM, as VIC‑II sprite data is addressed in 64‑byte blocks.

**How the program loads the DATA**

The BASIC program reads the numeric DATA values and POKEs them into three consecutive 64‑byte blocks in RAM. Each 63‑byte definition occupies the first 63 bytes of a 64‑byte page, leaving the 64th byte unused. This method ensures that the sprite data is permanently stored in memory, eliminating the need to reread the DATA for animation purposes.

**How animation is produced (pointer swapping)**

VIC‑II sprite pointers are single-byte values that select the 64‑byte page containing the sprite data; the pointer value multiplied by 64 gives the starting address of the sprite image. The sprite pointer for sprite 0 is located at memory address 2040 decimal ($07F8). Writing a byte P to 2040 selects the 64‑byte page P for sprite 0: `POKE 2040,P`.

The program cycles a pointer variable (P) through the three page numbers corresponding to the three loaded shapes and POKEs 2040 with P for sprite 0. Switching the pointer to different pages changes the sprite image instantly, producing animation. This technique animates by swapping pointers rather than rewriting sprite data each frame.

**Experimentation note**

Modifying the DATA values alters the sprite's appearance. For instance, changing the first three DATA numbers in LINE 100 to 255, 255, 255 will affect the sprite's display. Since each sprite definition is confined to a 64‑byte page and referenced by page number, multiple frames can be stored, and pointers can be switched to animate.

## Source Code

Below is the BASIC listing for the READ/POKE loop and the pointer‑cycling routine:

```basic
10 V=53248
20 POKE V+21,1 : REM ENABLE SPRITE 0
30 POKE 2040,192 : REM SET SPRITE 0 POINTER TO PAGE 192
40 FOR I=0 TO 62
50   READ A
60   POKE 12288+I,A : REM STORE SPRITE DATA IN MEMORY STARTING AT 12288
70 NEXT I
80 POKE V+39,1 : REM SET SPRITE 0 COLOR TO WHITE
90 POKE V,100 : REM SET SPRITE 0 X POSITION
100 POKE V+1,100 : REM SET SPRITE 0 Y POSITION
110 FOR P=192 TO 194
120   POKE 2040,P : REM CYCLE SPRITE POINTER
130   FOR T=1 TO 100 : NEXT T : REM DELAY LOOP
140 NEXT P
150 GOTO 110
160 DATA 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
170 DATA 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
180 DATA 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
```

In this program:

- Line 20 enables sprite 0.
- Line 30 sets the sprite pointer for sprite 0 to page 192 (starting at memory address 12288).
- Lines 40–70 read the sprite data from the DATA statements and store it in memory starting at address 12288.
- Line 80 sets the sprite color to white.
- Lines 90 and 100 position the sprite on the screen.
- Lines 110–150 cycle the sprite pointer through pages 192 to 194, creating the animation effect.

The DATA statements (lines 160–180) contain the sprite shape definitions. Each set of 63 values represents a sprite shape, with the 64th byte in each 64‑byte block remaining unused.

## Key Registers

- $07F8–$07FF (2040–2047) – VIC‑II sprite pointer table (sprite 0–7 pointers; POKE 2040 is sprite 0 pointer)
- $D000–$D00F (53248–53263) – VIC‑II sprite position registers
- $D015 (53269) – VIC‑II sprite enable register
- $D027–$D02E (53287–53294) – VIC‑II sprite color registers

## References

- "increment_pointer_and_wrap_three_sprite_shapes" — expands on how P cycles through three pointers to reference the DATA blocks
- "poke_sprite_pointer_poke2040_and_delay_loop" — expands on where P is written into the VIC sprite pointer register (POKE 2040,P) and the timing/delay loop used between swaps