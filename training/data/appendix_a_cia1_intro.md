# CIA #1 ($DC00-$DC0F)

**Summary:** CIA #1 registers at $DC00-$DC0F (decimal 56320–56335) provide two 8-bit I/O ports, two programmable interval timers (individually or chained), and an interrupt line wired to the 6510 IRQ; commonly used for keyboard scanning, joystick/paddle inputs, and tape timing/interrupts.

## CIA #1 overview
Locations $DC00-$DC0F are the register window for Complex Interface Adapter chip #1 (CIA #1). CIA #1 provides:
- Two bidirectional 8-bit data ports used for keyboard matrix rows/columns, joystick switches and paddles, and other peripheral I/O.
- Two programmable interval timers (Timer A and Timer B) that can run independently or be chained for longer intervals; they generate interrupts when they underflow.
- An interrupt line connected to the 6510 IRQ pin, allowing the timers and other CIA events to trigger CPU interrupts (used for periodic keyboard scans, 1/60s timing in many routines, and the more precisely timed interrupts used by tape read/write routines).

Common usages documented for CIA #1 include keyboard scanning, reading joystick and paddle fire buttons, and providing the timing/interrupt sources required by tape routines. The two timers support fine-grained timing (short intervals) and can be combined for much longer intervals.

## Source Code
```text
56320-56335 $DC00-$DC0F
Complex Interface Adapter (CIA) #1 Registers
```

## Key Registers
- $DC00-$DC0F - CIA #1 - full register range for data ports, timers, and interrupt/control registers

## References
- "cia1_timers_and_usage" — Detailed description of Timer registers and timing math
- "cia1_registers_and_interrupt_control" — Interrupt Control Register ($DC0D) and its bit meanings