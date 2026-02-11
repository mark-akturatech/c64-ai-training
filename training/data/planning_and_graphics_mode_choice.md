# Graphics planning — choose mode and colors before entering pixels

**Summary:** Plan graphics mode, sprite/character colors, and pixel layout before entering data; use pixel-proportional layout sheets (character cell grid, fine pixel grid) for Commodore 64 graphics where the screen is 25 lines of 40 characters and multicolor sprites share common colors.

**Graphics planning**

Decide the graphics mode and exact colors before entering graphics data. For multicolor sprites, each sprite may have one unique color and may also use two colors that are common across all sprites—plan which sprites use the shared colors and which use their unique sprite color so the palette you need is available.

Design all character shapes and color usage up front (character mode, multicolor sprite mode, or standard bitmap) so you can be sure required shared colors are reserved and available.

Use the provided pixel-accurate layout sheets when drawing:

- **Fine grid**: Proportional to a TV-screen pixel.
- **Heavy grid**: One character cell; the C64 screen is 25 rows × 40 columns.

There are distinct sheet types for standard bitmap, multicolor, and character modes. These sheets help maintain accuracy in pixel placement and color planning, ensuring that the artwork aligns with the chosen graphics mode's constraints.

Keep artwork consistent with the chosen mode’s pixel aspect and the heavy-character grid to avoid rework when converting drawings into character/sprite data.

## Source Code

```text
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
```

*Figure 9-1: Sample graphics layout sheet with heavy character-cell grid.*

```text
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
```

*Figure 9-2: Sample graphics layout sheet with fine pixel-proportional grid.*

```text
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
```

*Figure 9-3: Standard bitmap mode layout sheet.*

```text
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
```

*Figure 9-4: Multicolor mode layout sheet.*

```text
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
```

*Figure 9-5: Character mode layout sheet.*

```text
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
```

*Figure 9-6: Multicolor sprite mode layout sheet.*

```text
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
```

*Figure 9-7: Standard sprite mode layout sheet.*

## References

- "graphics_grid_figures" — expands on different sheet types for standard, multicolor, and character modes.