# VIC-II X coordinates and LPX ($D013) measurement

**Summary:** The VIC-II has no readable X register; the lightpen X latch LPX ($D013) captures the current internal X on the negative LP edge. Absolute X positions within a raster line are measured by driving the VIC IRQ to the LP input and reading LPX at the raster-line start; memory-access/display units are separate and the displayed pixel data is delayed (~12 pixels).

## The X coordinates
The VIC-II does not provide a direct software-readable X coordinate register equivalent to the raster (Y) register. Internally the VIC does track horizontal X (used for sprite positioning), and the lightpen mechanism provides a way to read it: a pulse on the LP (lightpen) input latches the current horizontal position into LPX ($D013) on the negative-going LP edge.

Because the VIC has separate units for memory access and display generation, the graphics data read from memory is not output immediately — there is a display delay of approximately 12 pixels between when data is fetched and when it appears on screen. Therefore, you cannot infer memory-access X positions simply by placing a sprite or character at a known X and reading that character on screen without accounting for this delay and the separate timing domains.

Measurement method used:
- The VIC IRQ output was wired to the LP input.
- The VIC was programmed for a raster-line interrupt.
- The negative edge of IRQ (used as line start reference) produces the LP negative edge, which latches LPX.
- Reading LPX at that moment yields the absolute X coordinate of the raster-line start.
- Using that absolute reference, other X events within the line were determined relatively (including the negative edge of BA during a Bad Line).
- Measured positions for BA, IRQ and other events were consistent and used to build a per-line X timing map.

This method implicitly assumes LPX coordinates equal the sprite X coordinates (i.e., that the latched X corresponds to the internal horizontal position used for sprite placement). The source gives no indication that they differ, and such identity would be the simplest circuit design.

## Key Registers
- $D013 - VIC-II - LPX (Lightpen X latch) — latches current internal X on negative LP edge
- $D012 - VIC-II - Raster register (current raster Y)

## References
- "lightpen" — expands on LPX/LPY registers and usage to measure X positions  
- "timing_of_raster_line" — expands on detailed per-cycle X coordinate timings and where BA/AEC/IRQ occur

## Labels
- LPX
- RASTER
