# TV Raster Scanning and Commodore 64 Display Timing

**Summary:** Explains raster scanning, horizontal and vertical sync pulses, nominal 262.5 scan lines per frame, Commodore 64 specifics (200 visible scan lines + 62 border), 60 Hz refresh, and the timing relation that the 6502 CPU travels ≈6 pixels per machine cycle.

## Raster scanning and pixels
The screen face is coated with phosphors that glow when struck by an electron beam; each glow point is a pixel (the smallest area the system can control). On color displays three electron beams and three colored phosphors combine to form one color pixel.

The electron beam scans left-to-right across the screen. By varying beam intensity during each left-to-right pass, different points on a scan line get different brightness (and, on a color CRT, color through separate beams).

## Sync pulses and frame construction
- Horizontal sync pulse: when the beam reaches the right edge, a horizontal sync pulse cuts beam intensity and returns the beam to the left side to start the next scan line down.
- Vertical sync pulse: after the last scan line of a frame, a vertical sync pulse returns the beam to the upper-left to begin the next frame.

A nominal NTSC-style frame consists of 262.5 scan lines (the source states 262-1/2); the half-line is part of interlacing timing in broadcast standards.

On the Commodore 64 the video hardware provides the horizontal and vertical sync pulses automatically; programmers do not generate them manually.

## Commodore 64 visible area, border, and refresh
- Total nominal scan lines per frame: 262.5 (nominal).
- C64 visible text/graphics scan lines: 200.
- C64 border scan lines: 62.
- Frame repetition: 60 times per second (≈60 Hz), giving a flicker-free display.

## CPU timing relation to beam position
There is a timing correlation between the 6502 CPU and the raster position: during one 6502 machine cycle the beam advances approximately 6 pixels across the display. This allows mid-frame changes (raster effects) by altering display parameters on the fly in sync with the beam.

## References
- "chapter1_introduction_tv_and_gaming" — expands on motivation for understanding the display
- "working_with_interrupts_and_raster" — expands on using raster interrupts to change display mid-frame
