# Sprite multiplexing: virtual → physical mapping (round-robin and priority orders)

**Summary:** Mapping strategy for VIC-II sprite multiplexing: map sorted virtual sprites (top-to-bottom) cyclically onto the eight physical sprites (1–8) so virtual 1..8 → physical 1..8, virtual 9→physical1, etc.; alternative mapping orders implement priority classes (example: BOFH uses different search orders for LOW, MEDIUM, HIGH priorities). Covers the definition of a "free" physical sprite (Y separation, typically >= 21 pixels) and example mapping orders.

**Mapping strategy (round-robin)**
Virtual sprites are sorted by Y (top-to-bottom). The basic mapping is cyclic: assign the first 8 virtual sprites to physical sprites 1–8; then continue wrapping around so virtual sprite 9 maps to physical 1, 10→2, etc. This ensures every virtual sprite is given a physical sprite in sequence until all are displayed for the frame.

An alternate simple variant reverses the physical order (1st virtual → physical 8, 2nd → 7, …) to change implicit priority without per-sprite classing.

This mapping is purely an allocation strategy; actual multiplexing requires updating the physical sprite registers (position, pointer, control bits) at appropriate raster times so each physical sprite displays the intended virtual sprite row.

**Priority-based mapping (BOFH example)**
Instead of strict round-robin, sprites can be assigned using different physical search orders per priority class. BOFH:Servers Under Siege implements three classes with these search orders (search picks the first "free" physical sprite according to the order):

- LOW priority (bodies, items): search order 8,7,6,5,4,3,2,1
- MEDIUM priority (player, enemies): search order 5,4,6,3,7,2,8,1
- HIGH priority (fire, explosions): search order 1,2,3,4,5,6,7,8

Using class-specific search orders allows more important sprites to be mapped to preferred physical indices (for deterministic overlap resolution or timing constraints).

**Definition of "free" physical sprite**
A "free" physical sprite is one whose previously-mapped virtual sprite is sufficiently far from the new virtual sprite in the Y axis so that their on-screen vertical extents do not collide when remapped. Practically, a safe threshold used in many implementations is a Y separation of at least 21 pixels, corresponding to the standard sprite height. This ensures that the raster beam has completed drawing the previous sprite before the same physical sprite is reused. The exact safe distance depends on sprite height (24/21/12 pixels) and update timing; use the sprite height in pixels plus any extra margin required by your raster update scheduling.

**Example mapping scenario (Green Beret)**
The text gives an example layout where multiple two-sprite enemies, the player, and a lingering flamethrower occupy the screen; a round-robin mapping would cycle physical sprites across virtual sprites so visible clusters are assigned physical sprites in cyclic order. The example ASCII diagram (below) illustrates relative sprite placement and mapping collisions — see Source Code for the original diagram.

## Source Code
```text
                          1
                4         2       3
              __5_____         ________
             /       6\       /     7
       _____/________8_\_____/______1__
      /           2            3
     /____________4____________5_______
```

## References
- "rejecting_ninth_sprite_on_row" — discusses rejecting sprites that would be the 9th on a rasterline
- "true_sprite_multiplexing_overview" — broader overview where mapping is a core part of general multiplexing