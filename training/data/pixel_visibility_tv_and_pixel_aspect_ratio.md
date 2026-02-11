# TV display considerations — pixel visibility, aspect ratio, multicolor, and sprite grids

**Summary:** Notes on TV electron‑gun response causing single‑pixel color loss, rectangular pixel aspect (4:3), multicolor double‑wide pixels, character/grid overlays, and sprite grid sizes; mentions SPRXSZ and SPRYSZ sprite size registers and VIC‑II-related layout concepts.

**Pixel visibility on televisions**
Single isolated pixels of a different color on a scan line may not be visible on a TV because the electron guns require time to switch brightness/color. To guarantee visible pixels on most sets, use at least two adjacent pixels of the same color on the same raster line so the TV has time to drive the beams and display the color change.

**Pixel aspect ratio and drawing geometry**
Bitmap pixels on the C64 are rectangular, not square. To draw geometric shapes correctly you must account for the pixel aspect ratio — use a 4/3 horizontal:vertical correction when generating geometry so shapes appear with the intended proportions on screen.

**Multicolor mode pixels**
In multicolor graphics each logical pixel is twice as wide as a standard bitmap pixel (double‑wide) because two bits determine the color (four colors per character block) rather than one bit for foreground/background. Because multicolor pixels are wider and still non‑square, take this into account when creating shapes and layouts.

**Character grid and color overlays**
The character‑graphics grid (Fig. 9‑3 in the source) is used to represent character mode layout and can also serve as an overlay to represent color memory blocks when working in bitmap modes. Use this grid to align artwork to character or color‑memory boundaries.

**Sprite grids and expansion**
Sprite design forms (Fig. 9‑4 through 9‑7 in the source) provide grids for the available sprite sizes. Four grid sizes correspond to the sprite X/Y multiplier options. If using expanded (scaled) sprites, modify your program to set the SPRXSZ and SPRYSZ registers to select the desired sprite size. The sprite grid dimensions match the background graphics grids so sprites can be previewed placed over the background to check alignment.

## Source Code
```text
Sprite Grid Sizes:

1. Standard Size (24x21 pixels):
   +------------------------+
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   +------------------------+

2. Double Width (48x21 pixels):
   +------------------------------------------------+
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   +------------------------------------------------+

3. Double Height (24x42 pixels):
   +------------------------+
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   |                        |
   +------------------------+

4. Double Width and Height (48x42 pixels):
   +------------------------------------------------+
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   |                                                |
   +------------------------------------------------+
```

## Key Registers
- **SPRXSZ**: Sprite X Size Register
- **SPRYSZ**: Sprite Y Size Register

## References
- "graphics_grid_figures" — expands on using the appropriate form for a chosen mode to account for pixel aspect and grid overlays.