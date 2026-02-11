# VIC-II Light Pen (LP) — LPX/LPY behavior and software triggering ($D013, $D014, $DC01/$DC03)

**Summary:** The light pen's negative edge latches the raster beam position into the VIC-II registers LPX ($D013) and LPY ($D014). LPX holds the upper 8 bits of the 9-bit X position (horizontal resolution = 2 pixels). The LP input is shared with the keyboard matrix and can be driven by software via CIA1 Port B ($DC01/$DC03) to measure X; the VIC can optionally generate a one-shot LP interrupt per frame.

**Light-pen behavior and register contents**

- On a negative edge at the VIC-II LP input, the current raster beam coordinates are latched into:
  - **LPX ($D013):** Upper 8 bits of the 9-bit X position (horizontal resolution = 2 pixels).
  - **LPY ($D014):** Lower 8 bits of the 9-bit Y position (vertical position).
- Only one negative edge is recognized per frame; subsequent edges are ignored. The LP trigger is held until the following vertical-blank interval.
- The LP latch reference point is the end of the video cycle in which the LP line is triggered. For example, triggering LP in cycle 20 produces LPX = $1E, corresponding to a sprite-style X coordinate of $03C (LPX × 2 = sprite X, reflecting the 2-pixel horizontal resolution).
- The VIC can optionally generate an interrupt on the LP negative edge; this interrupt is one-shot per frame.

**Software control via CIA (measuring X)**

- The LP input is wired into the keyboard matrix (and joystick lines) and can be driven by software.
- Bit 4 of CIA1 Port B is used to assert/release the LP line. By toggling this bit, you can generate a negative edge and then read LPX to determine the current X position of the raster beam—useful for cycle-exact raster synchronization (since the VIC has no direct register for instantaneous X).
- Typical use: trigger LP via CIA1 Port B, wait for the LP latch, then read $D013 to obtain the upper 8 bits of X (multiply by 2 for sprite-style X coordinate).

## Source Code

```text
Timing Diagram for Light Pen Triggering:

| Signal       | Cycle 18 | Cycle 19 | Cycle 20 | Cycle 21 | Cycle 22 |
|--------------|----------|----------|----------|----------|----------|
| Raster Beam  |          |          |          |          |          |
| LP Input     | High     | High     | Low      | Low      | Low      |
| LPX Register |          |          | $1E      |          |          |
| LPY Register |          |          |          |          |          |

- At cycle 20, the LP input goes low (negative edge), latching the raster beam position into LPX and LPY.
- LPX holds the upper 8 bits of the X position; multiply by 2 to get the full 9-bit X coordinate.
```

## Key Registers

- **$D013 - VIC-II - LPX:** Light-pen latched X (upper 8 bits of 9-bit X; horizontal resolution = 2 pixels).
- **$D014 - VIC-II - LPY:** Light-pen latched Y (lower 8 bits of 9-bit Y).
- **$D019 - VIC-II - Interrupt Register:** Bit 3 (LP): Light pen interrupt flag.
- **$D01A - VIC-II - Interrupt Enable Register:** Bit 3 (LP): Light pen interrupt enable.
- **$DC01 - CIA1 - Port B Data Register:** Bit 4: Light pen input control.
- **$DC03 - CIA1 - Port B Data Direction Register:** Bit 4: Direction control for light pen input.

## References

- "x_coordinates" — expands on measuring X position by triggering LP and reading LPX.
- "vic_interrupts" — expands on LP interrupt source bit and latching behavior.

## Labels
- LPX
- LPY
- LP
