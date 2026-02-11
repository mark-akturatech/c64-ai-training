# Raster interrupts (VIC-II)

**Summary:** Raster interrupts (VIC-II) let the C64 CPU be signalled on a specified scan line so an interrupt routine can perform mid-frame changes (for example, change background color). Commonly controlled via the raster register $D012, the VIC-II interrupt enable ($D01A) and IRQ/status ($D019).

## Overview
The VIC-II can generate an interrupt when the current raster (scan) line equals a value you specify — a raster interrupt. Using a raster interrupt allows your interrupt routine to gain the CPU at a defined point during screen drawing so you can perform mid-frame changes such as changing background or border colors, altering character/sprite pointers, split-screen scrolling, or other effects that must occur at a particular vertical position.

Typical sequence (hardware-level):
- write the desired raster line number to the VIC-II raster register,
- enable the raster-interrupt bit in the VIC-II interrupt-enable register,
- when the raster match occurs the VIC-II sets the IRQ flag and (if enabled) pulses the IRQ line to the CPU,
- the interrupt handler must acknowledge/clear the VIC-II IRQ flag so further interrupts can occur.

Timing note: the interrupt is tied to the VIC-II raster counter; precise cycle timing matters for some effects (color changes can show smear if not timed to pixel boundaries).

## Key Registers
- $D012 - VIC-II - Raster counter (low 8 bits) / value to compare for raster interrupt
- $D01A - VIC-II - Interrupt Enable Register (enable raster interrupt bit)
- $D019 - VIC-II - Interrupt Status / IRQ register (read status; write 1 to clear interrupt bits)

## References
- "interrupts_for_animation" — expands on why interrupts are necessary for smooth animation  
- "raster_timing_and_color_smear" — expands on visible artifacts when changing colors with raster interrupts
