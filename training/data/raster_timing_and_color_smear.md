# Visible Timing Artifacts When Changing Colors with Raster Interrupts

**Summary:** Raster-interrupt color changes (VIC-II raster interrupts, e.g., $D012) can produce a visible smeared transition because the 6502 CPU must finish its current instruction before servicing the interrupt. Instruction-length latency (2–7 machine cycles) and the electron beam movement (~3 pixels per cycle) can produce an ~21-pixel smear. VIC-II timing inconsistencies can further enlarge the visible area.

**Explanation**

When a raster interrupt is generated, the CPU cannot begin the interrupt service until it finishes the instruction it is currently executing. Instructions take roughly 2–7 machine cycles (6502 machine cycles), and the electron beam moves about three pixels per machine cycle. In the worst case, this instruction-completion latency lets the color change smear across approximately 21 pixels (7 cycles × ~3 pixels/cycle). Because the point where the color changes depends on which CPU instruction is in progress when the interrupt fires, the visible transition point can appear to move between frames. Any timing inconsistencies in the VIC-II's interrupt timing (jitter in the moment it notifies the CPU) will increase the width of the affected area beyond the calculated smear.

## References

- "interrupt_flow_two_routines" — expands on where the color changes are being made in the demo
- "delay_in_isr_to_hide_artifact" — expands on how to move the color-change artifact into the border
