# VIC-II sprite registers — Easy Sprite‑Making Chart (V+ offsets → $D000)

**Summary:** Maps VIC‑II sprite control offsets (V+n where V = $D000) to their functions: sprite enable ($D015), sprite pointers in memory (2040–2047 → pointer values 192–199 → sprite blocks 12288–12798), sprite X low / X MSB ($D000/$D010), Y positions ($D001..), color registers ($D025-$D02E), expansion and multicolor bits ($D017, $D01D, $D01C), and collision registers ($D01E, $D01F).

## Sprite control summary
This chart uses "V+N" where V = $D000 (VIC‑II base). Key facts and how the fields map:

- Sprite enable bits: write bit mask to $D015 (V+21) to turn sprites 0–7 on (bit 0 = sprite 0, bit 7 = sprite 7).
- Sprite pointers: system memory locations 2040–2047 (decimal) hold the 8‑bit sprite pointer values (192–199 in the chart). Each pointer value is a 64‑byte block index; block N starts at N*64 (e.g., 192*64 = 12288).
- Sprite pixel data locations: pointer values 192..199 correspond to memory ranges 12288..12798 as shown in the table.
- X positions (low 8 bits): even VIC offsets starting at $D000 (V+0, V+2, ... V+14) are the low 8 bits of the sprite X position for sprites 0–7.
- X MSB / right‑side X bits: $D010 (V+16) contains the MSB bits for X positions (bit per sprite); used to place sprites past the low‑byte range (right side).
- Y positions: odd VIC offsets starting at $D001 (V+1, V+3, ... V+15) are the sprite Y positions for sprites 0–7.
- Expansion (double size):
  - Vertical expansion bits: $D017 (V+23) — one bit per sprite for vertical doubling.
  - Horizontal expansion bits: $D01D (V+29) — one bit per sprite for horizontal doubling.
- Multicolor:
  - Per‑sprite multicolor enable bits: $D01C (V+28) — bit per sprite selects multicolor sprite mode.
  - Multicolor shared colors: $D025 (V+37) = M‑Color 1, $D026 (V+38) = M‑Color 2 (used by all multicolor sprites).
- Sprite color registers: $D027..$D02E (V+39..V+46) — one color register per sprite (0..7).
- Collisions:
  - Sprite‑to‑sprite collision register: $D01E (V+30). Test with PEEK($D01E) AND mask.
  - Sprite‑to‑background collision register: $D01F (V+31). Test with PEEK($D01F) AND mask.
- Sprite priority: lower‑numbered sprites have hardware priority over higher‑numbered sprites (sprite 0 in front of all others).

## Source Code
```text
  EASY SPRITEMAKING CHART
  +----------+------+------+------+------+-------+-------+-------+--------+
  |          |SPRT 0|SPRT 1|SPRT 2|SPRT 3|SPRT 4 |SPRT 5 |SPRT 6 | SPRT 7 |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Turn on   |V+21,1|V+21,2|V+21,4|V+21,8|V+21,16|V+21,32|V+21,64|V+21,128|
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Put in mem| 2040,| 2041,| 2042,| 2043,| 2044, | 2045, | 2046, | 2047,  |
  |set point.|  192 |  193 |  194 |  195 |  196  |  197  |  198  |  199   |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Locations | 12288| 12352| 12416| 12480| 12544 | 12608 | 12672 | 12736  |
  |for Sprite|  to  |  to  |  to  |  to  |  to   |  to   |  to   |  to    |
  |Pixel     | 12350| 12414| 12478| 12542| 12606 | 12670 | 12734 | 12798  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Color     |V+39,C|V+40,C|V+41,C|V+42,C|V+43,C |V+44,C |V+45,C |V+46,C  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Set LEFT X| V+0,X| V+2,X| V+4,X| V+6,X| V+8,X |V+10,X |V+12,X |V+14,X  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Set RIGHT |V+16,1|V+16,2|V+16,4|V+16,8|V+16,16|V+16,32|V+16,64|V+16,128|
  |X position| V+0,X| V+2,X| V+4,X| V+6,X| V+8,X |V+10,X |V+12,X |V+14,X  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Set Y pos.| V+1,Y| V+3,Y| V+5,Y| V+7,Y| V+9,Y |V+11,Y |V+13,Y |V+15,Y  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Exp. Horiz|V+29,1|V+29,2|V+29,4|V+29,8|V+29,16|V+29,32|V+29,64|V+29,128|
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Exp. Vert.|V+23,1|V+23,2|V+23,4|V+23,8|V+23,16|V+23,32|V+23,64|V+23,128|
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Multi-Col.|V+28,1|V+28,2|V+28,4|V+28,8|V+28,16|V+28,32|V+28,64|V+28,128|
  +----------+------+------+------+------+-------+-------+-------+--------+
  |M-Color 1 |V+37,C|V+37,C|V+37,C|V+37,C|V+37,C |V+37,C |V+37,C |V+37,C  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |M-Color 2 |V+38,C|V+38,C|V+38,C|V+38,C|V+38,C |V+38,C |V+38,C |V+38,C  |
  +----------+------+------+------+------+-------+-------+-------+--------+
  |Priority  | The rule is that lower numbered sprites always have display|
  |of sprites| priority over higher numbered sprites. For example, sprite |
  |          | 0 has priority over ALL other sprites, sprite 7 has last   |
  |          | priority. This means lower numbered sprites always appear  |
  |          | to move IN FRONT OF or ON TOP OF higher numbered sprites.  |
  +----------+------------------------------------------------------------+
  |S-S Collis| V+30   IF PEEK(V+30)ANDX=X THEN [action]                   |
  +----------+------------------------------------------------------------+
  |S-B Collis| V+31   IF PEEK(V+31)ANDX=X THEN [action]                   |
  +----------+------+------+------+------+-------+-------+-------+--------+
```

## Key Registers
- $D000-$D00F - VIC‑II - Sprite X low / Y positions (even offsets = X low for sprites 0–7; odd offsets = Y positions for sprites 0–7)
- $D010 - VIC‑II - Sprite X MSB / right‑side X bits (bits 0–7 = MSB for sprites 0–7)
- $D015 - VIC‑II - Sprite enable bits (turn sprites 0–7 on/off)
- $D017 - VIC‑II - Vertical expansion bits (double‑height control per sprite)
- $D01C - VIC‑II - Per‑sprite multicolor enable bits
- $D01D - VIC‑II - Horizontal expansion bits (double‑width control per sprite)
- $D01E - VIC‑II - Sprite‑to‑sprite collision register (read; bit per collision)
- $D01F - VIC‑II - Sprite‑to‑background collision register (read; bit per sprite)
- $D025-$D026 - VIC‑II - Shared multicolor registers M‑Color 1 ($D025) and M‑Color 2 ($D026)
- $D027-$D02E - VIC‑II - Sprite colour registers for sprites 0–7 (one byte each)

## References
- "spritemaking_notes" — expands on alternative pointer locations and memory reservation
- "dancing_mouse_line_explanations" — practical example using V+21, 2040, V+39, V+16