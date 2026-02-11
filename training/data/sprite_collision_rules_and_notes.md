# Sprite Collision Rules and Behavior (VIC-II)

**Summary:** Sprite collision behavior for the VIC‑II ($D01E‑$D01F) — rules for sprite-sprite and sprite-background collisions, multicolor bit‑pair exceptions, invisible-sprite behavior, border/offscreen detection, and ambiguity when more than two sprites overlap.

## Collision rules
- Sprite graphics are 24 × 21 = 504 dots. Only dots that represent nonzero sprite graphics can participate in collisions; data bits equal to 0 (or multicolor bit‑pairs equal to 00) are treated as background and never collide.
- A collision requires a sprite-dot whose shape data bit is 1 to touch another dot of nonzero graphics data (another sprite dot or foreground display dot).
- Multicolor mode uses bit‑pairs. Nonzero bit‑pairs (except the special 01 pair) are treated as nonbackground and can cause collisions. The 01 multicolor bit‑pair is treated as background and its dots never participate in collisions.
- A sprite whose shape data bytes are all zero (even if enabled and colored) can never be involved in collisions because it presents no nonzero dots.
- A sprite filled with bytes of all 1 bits (e.g. $FF) will present nonzero dots and can participate in collisions even if its color matches the background (i.e., visually invisible due to color).

## Ambiguity and detecting exact pairings
- The VIC‑II collision registers report which sprites were involved in a collision but do not identify which specific sprite touched which other sprite when multiple sprites overlap.
- Example: three sprites A (left), B (middle), C (right) touching only their immediate neighbors will set bits for A, B, and C in the Sprite‑Sprite Collision register; the registers do not indicate whether A touched C directly.
- To determine exact collision pairings, you must check sprite positions and, per display scanline, compute whether sprites of the given sizes overlap (positional and per-line overlap checks). This is the only reliable method to disambiguate multi‑sprite collisions.

## Border / offscreen behavior
- Collisions can be detected even in areas covered by the screen border. Sprite-sprite collisions can occur while sprites are offscreen; sprite ↔ foreground collisions can occur where foreground display data is in an area that is covered by the border (e.g., when the visible area is reduced to 38 columns or 24 rows).
- In other words, border clipping does not prevent collision detection by the VIC‑II.

## Key Registers
- $D01E-$D01F - VIC-II - Sprite collision registers (Sprite‑Sprite and Sprite‑Background collision flags; bits indicate which sprites were involved)

## References
- "sprite_collision_detection_registers_intro" — expands on where to read which sprites were involved ($D01E-$D01F)

## Labels
- D01E
- D01F
