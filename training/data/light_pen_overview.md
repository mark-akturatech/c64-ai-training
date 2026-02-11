# Light Pen Registers ($D013-$D014)

**Summary:** VIC-II light-pen registers at $D013-$D014 (decimal 53283–53284) record the horizontal and vertical screen coordinates when a light pen on joystick port 1 detects the raster beam; values are latched once per frame (60 Hz) and should be averaged across samples for accuracy.

## Operation
A light pen connected to joystick control port #1 closes the joystick trigger switch at the instant the CRT electron beam (raster) illuminates the pen's sensor. The VIC-II senses this event and latches the current beam position into two registers:

- $D013 — horizontal screen coordinate (light-pen X)
- $D014 — vertical screen coordinate (light-pen Y)

The VIC-II updates these registers once per screen frame (60 times per second, per source). When the trigger closes, the VIC-II records the beam coordinates and latches them for that frame; subsequent trigger closures during the same frame do not overwrite the latched values. Programs can read these registers to obtain the pen position on the screen.

Because a physical light pen and a human operator may introduce noise and jitter, it is recommended to sample the registers multiple times and average the returned positions for increased accuracy (especially in machine-language routines).

## Key Registers
- $D013-$D014 - VIC-II - Light pen horizontal and vertical screen coordinates (joystick port 1)

## References
- "d013_lpenx_horizontal_position" — expands on Light Pen horizontal ($D013)
- "d014_lpeny_vertical_position" — expands on Light Pen vertical ($D014)