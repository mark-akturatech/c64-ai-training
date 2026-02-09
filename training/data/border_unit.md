# VIC-II border unit (main and vertical border flip‑flops)

**Summary:** VIC-II border generation uses two flip‑flops (main border and vertical border) controlled by exact X/Y comparators and selectable comparison targets (CSEL/RSEL). Controls border color ($D020), the graphics sequencer output, and interacts with the DEN bit in $D011.

**Border unit description**
The VIC-II implements the display border with two flip‑flops:

- **Main border flip‑flop**
  - When set: the VIC displays the color in register $D020 (border color).
  - When clear: the VIC displays pixels from the graphics/sprite priority multiplexer.
  - The main border has the highest display priority and overlays text/bitmap graphics and sprites.

- **Vertical border flip‑flop**
  - When set: prevents the main border flip‑flop from being reset (locks border on for top/bottom regions).
  - Controls the graphics data sequencer output: if vertical flip‑flop is set, the sequencer outputs background color instead of graphics (prevents sprite/graphics collisions in the border).
  - Vertical flip‑flop is tested at two points per raster line (cycle 63 and when X reaches the left comparison value — see rules).

**Comparators and comparison targets**
- Each flip‑flop is driven by two X and two Y comparators. Comparator targets are hardwired values selected by the CSEL (horizontal) and RSEL (vertical) control bits.
- Comparisons match only on precise equality (not intervals): the X or Y coordinate must exactly equal the selected comparison value.
- The Y coordinate is checked:
  - once at cycle 63 of the raster line, and
  - again if/when the X coordinate reaches the left comparison value during that line.

**Opening/manipulating the border**
- By switching the CSEL/RSEL selection bits you can move the comparison targets so the raster never hits them, preventing the flip‑flops from switching and thereby partially or completely removing (opening) the border. (See referenced "hyperscreen" technique and display dimension notes.)

## Source Code
```text
Horizontal comparison values:
       |   CSEL=0   |   CSEL=1
 ------+------------+-----------
 Left  |  31 ($1F)  |  24 ($18)
 Right | 335 ($14F) | 344 ($158)

Vertical comparison values:
        |   RSEL=0  |  RSEL=1
 -------+-----------+----------
 Top    |  55 ($37) |  51 ($33)
 Bottom | 247 ($F7) | 251 ($FB)

Flip‑flop switching rules:
1. If the X coordinate reaches the right comparison value, the main border flip‑flop is set.
2. If the Y coordinate reaches the bottom comparison value in cycle 63, the vertical border flip‑flop is set.
3. If the Y coordinate reaches the top comparison value in cycle 63 and the DEN bit in register $D011 is set, the vertical border flip‑flop is reset.
4. If the X coordinate reaches the left comparison value and the Y coordinate reaches the bottom one, the vertical border flip‑flop is set.
5. If the X coordinate reaches the left comparison value and the Y coordinate reaches the top one and the DEN bit in register $D011 is set, the vertical border flip‑flop is reset.
6. If the X coordinate reaches the left comparison value and the vertical border flip‑flop is not set, the main border flip‑flop is reset.

Notes:
- Comparisons are equality checks (exact cycle/pixel).
- The graphics sequencer outputs only when the vertical flip‑flop is clear; otherwise it outputs background color.
- By selecting CSEL/RSEL targets outside the raster reach, border comparators can be prevented from matching.
```

## Key Registers
- $D020 - VIC-II - Border color register (value displayed when main border flip‑flop is set)
- $D011 - VIC-II - Control register 1; contains DEN (Display ENable) bit used in vertical flip‑flop reset rules
- $D016 - VIC-II - Control register 2; contains CSEL (Column Select) bit for horizontal comparison target selection

## References
- "display_generation_dimensions" — expands on CSEL/RSEL effect on window size and border positions
- "hyperscreen" — technique to open the border by manipulating CSEL/RSEL