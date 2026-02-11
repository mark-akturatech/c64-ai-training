# Dual-raster ISR alternation (mid-screen / bottom)

**Summary:** Demo uses VIC-II raster interrupts (raster counter $D012, IRQ control $D019/$D01A) and background color writes ($D021) plus swapping the CPU IRQ vector to alternate two ISR entry points; a RAST macro schedules the second interrupt at the bottom of the screen so two ISRs can alternate different actions on each half.

## How it works
- System setup completes once; the main program then loops idly. All runtime changes are driven by interrupts.
- ISR1 (first raster interrupt) is scheduled at mid-screen via the RAST macro (uses the VIC-II raster counter). When ISR1 runs it:
  - changes the background color (write to background color register),
  - programs a new raster interrupt for the bottom of the screen using the RAST facility,
  - updates the IRQ entry point (the stored IRQ handler address) to point to ISR2.
- ISR2 (second raster interrupt) is scheduled for the bottom of the screen. When ISR2 runs it:
  - performs the mirror actions for the other half of the screen,
  - programs the raster back to the mid-screen position,
  - updates the IRQ entry point to point back to ISR1.
- By swapping the IRQ entry address between two handlers and reprogramming the raster each time, the two ISRs alternate on successive raster interrupts and can perform different screen/timing changes for the top and bottom halves of the display.

## Key Registers
- $D012 - VIC-II - Raster counter (compare value for raster interrupts)
- $D019 - VIC-II - Interrupt status register (read/clear interrupt flags)
- $D01A - VIC-II - Interrupt enable register (enable raster IRQs)
- $D021 - VIC-II - Background color register (write to change paper color)

## References
- "raster_interrupts_overview" — expands on Using raster interrupts to control timing on the screen
- "raster_timing_and_color_smear" — expands on Timing artifacts visible at the color change boundary
