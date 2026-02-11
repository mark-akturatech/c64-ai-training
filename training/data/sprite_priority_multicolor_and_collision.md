# C64 Sprite priority, multi‑color pixel‑pair mapping, and collision detection

**Summary:** Sprite display priority (lower sprite numbers appear in front), VIC‑II multi‑color sprite mode uses pixel pairs (each pair selects Background, Multi‑Color 1, Sprite Color, or Multi‑Color 2) and sprite collision flags are read from VIC registers (PEEK(V+30) / PEEK(V+31) in BASIC, bitmask 1..128 for sprites 0..7).

## Priority
Sprites with lower numbers have higher display priority: sprite 0 is in front of all others, sprite 1 is in front of sprites 2–7, ..., sprite 7 has lowest priority. When two sprites occupy the same screen position the lower‑numbered sprite is shown in front; the higher‑numbered sprite will be obscured or appear behind.

## Multi‑color mode (pixel‑pair color mapping)
- In multi‑color sprite mode each horizontal "dot" is two hardware pixels wide: bytes still encode eight pixel positions (bits with weights 128..1), but interpretation is by pairs (bits 7+6, 5+4, 3+2, 1+0).
- Each pixel pair maps to one of four colors depending on which bit(s) in the pair are set:
  - 00 (both pixels blank) → Background color (transparent for the sprite)
  - 01 (right pixel set only) → Multi‑Color 1
  - 10 (left pixel set only) → Sprite Color (single‑sprite color)
  - 11 (both pixels set) → Multi‑Color 2
- To build the sprite data byte for an 8‑pixel horizontal block, set the individual bits for the single‑pixel pattern (weights 128, 64, 32, 16, 8, 4, 2, 1) and add them. In multi‑color mode you usually set bits so that the resulting pairs form the desired pair values above.
- Example (from source): an 8‑pixel block whose set bits correspond to weights 16, 8, 2, and 1 produces value 16+8+2+1 = 27; POKE that into the sprite memory byte for that row.

## Collision detection (BASIC usage)
- Sprite‑to‑sprite collisions: read the VIC collision register via BASIC with PEEK(V+30). Test for a collision involving a particular sprite N by using the sprite bitmask X = 2^N (1,2,4,8,16,32,64,128 for sprites 0..7):
  - IF PEEK(V+30) AND X = X THEN [action]
- Sprite‑to‑background collisions: read PEEK(V+31) and test with the same bitmask:
  - IF PEEK(V+31) AND X = X THEN [action]
- The collision registers are cumulative and set bits remain until cleared by the VIC (or by reading/clearing the register as appropriate per VIC behavior); test accordingly in your program.

## Source Code
```text
Bit weights for an 8‑pixel block (left → right):
|128| 64| 32| 16|  8|  4|  2|  1|

Example sprite byte: bits set at 16,8,2,1 -> 16+8+2+1 = 27
BASIC example (from source):
POKE 832,27

ASCII diagrams from source (visual mapping):

+---+---+---+---+---+---+---+---+
|   |   |   |@@ |@@ |   |@@ |@@ |
|   |   |   |@@ |@@ |   |@@ |@@ |
+---+---+---+---+---+---+---+---+

Looks like this in sprite:
+-------+-------+-------+-------+
|BACKGR.|MULTI- |SPRITE |MULTI- |
| COLOR |COLOR 1| COLOR |COLOR 2|
+-------+-------+-------+-------+
```

```basic
BASIC collision test examples (from source):

' sprite-to-sprite test for sprite N (X = 2^N)
IF PEEK(V+30) AND X = X THEN [action]

' sprite-to-background test
IF PEEK(V+31) AND X = X THEN [action]

' sprite bitmasks:
' sprite 0 -> X = 1
' sprite 1 -> X = 2
' sprite 2 -> X = 4
' sprite 3 -> X = 8
' sprite 4 -> X = 16
' sprite 5 -> X = 32
' sprite 6 -> X = 64
' sprite 7 -> X = 128
```

## Key Registers
- $D000-$D02E - VIC‑II - all VIC sprite and display registers (VIC register block)
- $D01E-$D01F - VIC‑II - collision registers: sprite‑to‑sprite ($D01E) and sprite‑to‑background ($D01F)

## References
- "spritemaking_chart" — expands on registers for multicolor mode (V+28) and multi‑color registers (V+37,V+38)