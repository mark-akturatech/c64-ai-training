# Color RAM ($D800-$DBFF)

**Summary:** $D800-$DBFF is the 1KB Color RAM area (only 1000 bytes used) that stores foreground color nybbles (low 4 bits) for the 40x25 text screen; reads must be masked (AND 15). Color values 0–15 map to the standard C64 color names (BLACK, WHITE, RED, ... LIGHT GRAY).

## Color RAM ($D800-$DBFF)
The C64 uses a parallel Color RAM area to hold the foreground color for each character cell on the text screen. Although 1024 bytes are allocated ($D800–$DBFF), only the first 1000 bytes affect the visible 40×25 screen (first byte = upper-left character, then left-to-right, top-to-bottom).

Only the low 4 bits of each Color RAM byte are implemented (Color RAM "nybbles"). Writing to the high bits will not affect the low 4 bits; when read, the high bits typically return unpredictable values (random), though on a few machines they may return a constant value. Therefore always mask reads with AND 15 to get a valid color 0–15.

Example read (from BASIC, as in the source):
- Read first Color RAM byte: CR = PEEK(55296) AND 15  (55296 = $D800)

Color RAM is distinct from VIC-II color registers (border/background/sprite registers). Color RAM is a fixed memory area used by text mode character display; consult VIC-II documentation for hardware color registers.

## Source Code
```basic
REM Example: read first Color RAM entry (upper-left character)
CR = PEEK(55296) AND 15
```

```text
Memory region:
$D800-$DBFF   Color RAM (1024 bytes allocated; 1000 bytes used for 40x25 text)

Notes:
- Only low 4 bits (bits 0-3) are connected; bits 4-7 read back as random/undefined on most units.
- To read reliably, mask with AND 15 (0x0F).
- Writing to bits 4-7 has no effect on displayed color.
- First byte ($D800) = upper-left character; subsequent bytes map left-to-right, top-to-bottom across 40 columns and 25 rows.
```

```text
Color values (0..15) -> color name
0  - BLACK
1  - WHITE
2  - RED
3  - CYAN (light blue-green)
4  - PURPLE
5  - GREEN
6  - BLUE
7  - YELLOW
8  - ORANGE
9  - BROWN
10 - LIGHT RED
11 - DARK GRAY
12 - MEDIUM GRAY
13 - LIGHT GREEN
14 - LIGHT BLUE
15 - LIGHT GRAY
```

## Key Registers
- $D800-$DBFF - Color RAM - 1KB area (only 1000 bytes used) storing foreground color nybbles (low 4 bits) for each character cell (first byte = upper-left, row-major across 40×25).

## References
- "vicii_color_registers_border_bg_and_sprite_colors" — expands on how VIC-II hardware color registers differ from Color RAM (Color RAM is a fixed memory area)