# Hyperscreen (opening the border) — VIC-II CSEL / RSEL technique

**Summary:** Hyperscreen (VIC-II) uses CSEL/RSEL bit toggling so border comparators never match, allowing graphics (primarily sprites and idle-state graphics) to appear in the border area; involves timed toggles around specific raster lines (RASTER $D012) and exact cycle timing for horizontal border (cycle 56 / 17). Terms: VIC-II, CSEL, RSEL, hyperscreen, raster.

## Hyperscreen overview
The VIC-II generates the visible screen border by comparing beam coordinates to start/stop positions selected by the CSEL/RSEL bits; the border is turned on/off when those comparators match. By switching CSEL and RSEL so those comparisons never become true, the VIC never sets the border flip-flops and the normally-covered border area becomes visible — this is called "hyperscreen" or "opening the border".

Limitations:
- Graphics in the opened border are mostly limited to sprites because the graphics data sequencer is in idle state outside Y coordinates $30-$f7 (no Bad Lines occur there). Some useful idle-state graphics are possible, but sprite work is the primary use.
- CSEL/RSEL here refer to the VIC-II comparator select bits (column/row select).

## Disabling upper/lower border (RSEL toggling)
Procedure (preserves original behavior and timing from the VIC):
1. In the upper screen area, set RSEL to select the 25-line border mode (start with RSEL=1).
2. Wait until the RASTER value reaches roughly 248–250. The vertical border flip-flop is still cleared because the comparator for RSEL=1 would set at line 251.
3. Clear RSEL (switch to RSEL=0). The comparator now would set the vertical flip-flop at line 247, but that line has already passed — the VIC therefore "forgets" to turn the vertical border on.
4. After raster 251, set RSEL back to 1 and repeat the sequence to keep the upper/lower border turned off.

Notes:
- If you switch RSEL from 0→1 in the raster range 52–54, the border will never turn off and will cover the whole screen (same behaviour occurs when DEN is cleared, though Bad Lines still occur). This makes some switch points counterproductive.
- This method opens only the vertical (upper/lower) border; the left/right border remains active in the opened vertical area unless separately handled.

## Disabling left/right border (CSEL toggling) — timing-critical
- The left/right border can be opened by toggling CSEL similarly, but horizontal timing is far more critical.
- To prevent the horizontal border from turning on you must change CSEL from 1→0 exactly in cycle 56 of the raster line.
- Conversely, switching CSEL from 0→1 in cycle 17 will prevent the horizontal border from turning off.
- The precise cycle timing (not just raster line) is required because horizontal comparator evaluation is tied to beam column timing.

## Interaction of vertical and horizontal border flip-flops
- The vertical flip-flop (upper/lower border) affects how the main border flip-flop can be reset: the main border flip-flop can only be reset if the vertical flip-flop is not set.
- Therefore, to open the left/right border inside the already opened upper/lower border area you must either:
  - Start opening the horizontal border before the vertical flip-flop becomes set (i.e., outside the vertical border area), or
  - Also open the vertical border (use the RSEL method above) so the main flip-flop can be reset.
- The two approaches produce different visible results because the vertical flip-flop also controls the graphics data sequencer output:
  - If horizontal border is opened before the vertical flip-flop is set (first method), only the background color is visible in the opened upper/lower border area.
  - If you open both (second method), the idle-state graphics from the sequencer are visible in that area.

## Practical visible differences
- Sprites: generally visible in opened border regions regardless, so hyperscreen is commonly used for sprite effects extending into the border.
- CPU/graphics state: when the graphics sequencer is in idle state (outside $30–$f7), only limited non-Bad-Line graphics are available; which graphics appear depends on the flip-flop state and on whether the sequencer is allowed to run (see interaction notes above).

## References
- "border_unit" — expands on comparators and CSEL/RSEL values used to control border flip-flops
- "idle_state_mode_details" — expands on graphics sequencer behaviour when border opened into areas that are normally idle

## Labels
- CSEL
- RSEL
