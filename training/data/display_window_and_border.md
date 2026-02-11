# VIC-II (MOS 6567/6569) — Display window, border, display column and blanking intervals

**Summary:** Describes the VIC-II fixed, centered display window and surrounding border, the display column concept (vertical extension of the window), division of the border into upper/lower and left/right parts, horizontal/vertical blanking intervals (beam off), and the X=0 reference at the left edge of the display column. Mentions border color register $D020 and VIC-II (6567/6569) raster framing concepts.

## Display window and border
The VIC-II displays graphics in a fixed, centered rectangle called the display window. The area outside that window is the screen border and is filled with the border color (register $D020). The display window is not freely movable — its horizontal and vertical placement are fixed relative to the visible screen area (modifications possible only via specific hardware tweeks, see RSEL/CSEL-related material).

The border can be conceptually split into:
- Upper border and lower border: the regions above and below the display window (vertical extension).
- Left border and right border: the regions to the sides of the display window (horizontal extension).

The display window is part of a larger display column: the vertical linear extension of the display window up and down across the frame. The display column establishes the left edge used as the X coordinate 0 reference for many graphics/sprite placement systems (sprite-based X coordinate system and raster-timed X positioning).

## Blanking intervals and raster returns
The visible screen area is surrounded by blanking intervals in which the video signal is turned off (no visible pixels are output) while the electron beam returns to the start of the next scanline (horizontal blanking) or the start of the next frame (vertical blanking). Behavior:
- Horizontal blanking: beam is turned off while retracing from end of visible pixels on a line back to the start of the next line.
- Vertical blanking: beam is turned off while retracing from the last visible scanline back to the first visible scanline of the next frame.

These blanking intervals define where visible pixels/line begin and end, and where the upper/lower border regions lie relative to the visible lines. Raster numbering differences between VIC-II variants are typically shown in diagrams (e.g., labels for raster line 0 may differ between 6569 and 6567 implementations).

## Source Code
```text
                Visible pixels/line
     ____________________|___________________
    /                                        \

+------------------------------------------------+  <- Raster line 0 (6569)
|       .                                .       |
|       .   Vertical blanking interval   .       |
|       .                                .       |
+---+---+--------------------------------+---+---+  \
|   |   |                                |   |   |  |
| H |   |          Upper border          |   | H |  |
| o |   |                                |   | o |  |
| r |   +--------------------------------+   | r |  |
| i |   |                                |   | i |  |
| z |   |                                |   | z |  |
| o |   |                                |   | o |  |
| n |   |                                |   | n |  |
| t |   |                                |   | t |  |
| a |   |                                |   | a |  |
| l | l |                                |   | l |  |
|   | e |                                | g |   |  |
| b | f |                                | h | b |  |
| l | t |                                | t | l |  |
| a |   |         Display window         |   | a |  |- Visible lines
| n | b |                                | b | n |  |
| k | o |                                | o | k |  |
| i | r |                                | r | i |  |
| n | d |                                | d | n |  |
| g | e |                                | e | g |  |
|   | r |                                | r |   |  |
| i |   |                                |   | i |  |
| n |   |                                |   | n |  |
| t |   |                                |   | t |  |
| e |   |                                |   | e |  |
| r |   |                                |   | r |  |
| v |   +--------------------------------+   | v |  |
| a |   |                                |   | a |  |
| l |   |          Lower border          |   | l |  | <- Raster line 0 (6567)
|   |   |                                |   |   |  |
+---+---+--------------------------------+---+---+  /
|       .                                .       |
|       .   Vertical blanking interval   .       |
|       .                                .       |
+------------------------------------------------+
 
      ^ \________________________________/
      |                 |
      |           Display column
      |
 X coordinate 0
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (VIC-II control, raster, sprite and timing registers)
- $D020 - VIC-II - Border color (screen border fill color)

## References
- "frame_building_and_coordinate_system" — expands on raster/Y and sprite-based X coordinate system used to specify positions and timings
- "rsel_csel_display_window_sizes" — expands on how the display window size and border placement are modified by RSEL and CSEL

## Labels
- D020
