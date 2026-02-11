# C64: System default IRQ vector and jiffy clock (IRQ, $DC0D, $0314/$0315)

**Summary:** On power-up the IRQ vector ($0314/$0315, decimal 788/789) is set to the built‑in hardware timer/jiffy-clock routine (which also services the keyboard). To disable the periodic jiffy interrupt write 127 to $DC0D (decimal 56333) — otherwise you must preserve and chain the original IRQ vector when installing a custom raster ISR.

## Default behavior and disabling the hardware timer (jiffy clock)
When the C64 is first powered, the IRQ vector points to the system routine that advances the jiffy clock and reads the keyboard. That routine is the same IRQ vector used for raster interrupts, so installing your own IRQ handler without handling the jiffy clock/keyboard will break those facilities.

If you do not need the hardware timer/jiffy interrupt, disable it by writing the value 127 to $DC0D (decimal 56333) in CIA1. This prevents the jiffy-clock interrupt from firing and frees the IRQ vector for your ISR without requiring chaining.

If you do want the keyboard and jiffy clock to keep functioning while your custom raster ISR runs, preserve the current IRQ vector (locations 788 and 789 decimal, i.e. $0314/$0315) before overwriting them. Your ISR must call/jump to the original IRQ routine exactly once per screen refresh (once every 1/60 second) so the jiffy-clock and keyboard servicing continue to operate correctly.

Notes:
- The IRQ vector bytes are at decimal 788/789 (hex $0314/$0315).
- CIA1 control region contains the jiffy-clock/interrupt control; $DC0D is the byte commonly written to disable the timer interrupt.

## Key Registers
- $0314-$0315 - System - IRQ vector low/high (stores IRQ handler address on power-up)
- $DC00-$DC0F - CIA1 - timer/interrupt control registers (write 127 to $DC0D to disable jiffy-clock interrupt)

## References
- "installing_raster_irq_steps" — expands on where to write the new IRQ vector (locations 788-789)
- "raster_interrupt_example_basic_and_data_listing" — example ISR and how to chain to the original interrupt routine
