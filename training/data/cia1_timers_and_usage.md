# CIA #1 Timers (Timers A & B) — behavior, ports, and timing ($DC00–$DC0F)

**Summary:** CIA #1 timer registers $DC04–$DC07 are 16-bit interval timers (low/high byte) whose reads return the live counter and writes update the latch; they tick once per CPU clock (≈1.023 MHz NTSC, 985.25 kHz PAL). Timer underflow sets bits in the Interrupt Control Register ($DC0D), can toggle Port B bits ($DC01 bit 6/7) instead of IRQs, and timers can be linked to form a 32-bit timer.

**Overview**
CIA #1 provides two interval timers (Timer A and Timer B) used for system timing (keyboard interrupt, software clock) and tape I/O timing. Each timer has a 16-bit latch and a 16-bit counter (low byte, high byte at $DC04–$DC07). Timers decrement once per microprocessor clock cycle (one count per CPU cycle) when running.

Timer A can be clocked from either the CPU clock or external pulses on the CNT line (User Port pin 4). Timer B can be clocked from the CPU clock, from external pulses, or from Timer A underflows (making Timer B increment once per Timer A zero — enabling a linked 32-bit timer).

**Read vs Write semantics (Counter vs Latch)**
- Reads from the timer low/high registers return the current Timer Counter value (the live down-counting value).
- Writes to the timer low/high registers store the value into the Timer Latch. The Timer Counter is not immediately replaced by the latch unless the force-load mechanism is applied (Control Register A/B Force Load) or the timer is restarted per control register rules.

Format: 16-bit value = LOW + 256 * HIGH.

**Timing calculation**
- The timer decrements once per CPU clock cycle. Use TIME = LATCH / CLOCK_SPEED.
- Typical clock speeds:
  - NTSC (C64): ~1,022,727 cycles/sec.
  - PAL (C64): ~985,248 cycles/sec.
- Example: LATCH = 17045 (low=149, high=66) → period ≈ 17045 / 1,022,727 ≈ ~1/60 sec (used for 60 Hz software clock).

**Underflow behavior: interrupts and Port B output**
- When a timer counter reaches zero:
  - It sets its corresponding bit in the Interrupt Control Register ($DC0D): Timer A sets bit 0, Timer B sets bit 1.
  - If the timer interrupt is enabled in the ICR, an IRQ will be requested; the ICR high bit (bit 7) is set to indicate an interrupt event.
  - Optionally (depending on control-register mode), instead of or in addition to causing an IRQ, the timer can change an output on Data Port B: Timer A can drive Bit 6, Timer B can drive Bit 7. The output action can be a one-machine-cycle pulse or a toggle (1→0 or 0→1), depending on timer control bits.
- After underflow, the Timer Counter reloads from the Timer Latch and either stops (one-shot) or continues counting (continuous mode). One-shot vs continuous is controlled by bit 3 of the Control Register (A or B).

**Timer linking (32-bit operation)**
- Timer B can be configured to count the number of Timer A underflows. If Timer A counts CPU cycles and reloads and Timer B counts each Timer A zero, the two form a linked 32-bit timer (Timer B receives an event on each Timer A zero). This allows very long intervals (example: up to ~70 minutes with given clock rates, with about 1/15 s resolution per the original description).

**Common C64 usage notes (from source)**
- CIA #1 Timer A is used for the IRQ that reads the keyboard and updates the software clock (typical continuous latch 17045 → ~1/60s).
- Tape routines use both Timer A and Timer B for timing reads/writes; tape read/write code takes over IRQ vectors. Data output to the cassette uses the on-chip I/O port at location 1 (CPU port), but CIA timers provide the timing.

## Source Code
```text
Location Range: 56320–56321 ($DC00–$DC01)
CIA #1 Data Ports A and B

Data Port B can be used as an output by either Timer A or B. It is possible to set a mode in which the timers do not cause an interrupt when they run down (see the descriptions of Control Registers A and B at 56334–5 ($DC0E–F)). Instead, they cause the output on Bit 6 or 7 of Data Port B to change. Timer A can be set either to pulse the output of Bit 6 for one machine cycle, or to toggle that bit from 1 to 0 or 0 to 1. Timer B can use Bit 7 of this register for the same purpose.

Location Range: 56324–56327 ($DC04–$DC07)
Timers A and B Low and High Bytes

These four timer registers (two for each timer) have different functions depending on whether you are reading from them or writing to them. When you read from these registers, you get the present value of the Timer Counter (which counts down from its initial value to 0). When you write data to these registers, it is stored in the Timer Latch, and from there it can be used to load the Timer Counter using the Force Load bit of Control Register A or B (see 56334–5 ($DC0E–F) below).

These interval timers can hold a 16-bit number from 0 to 65535, in normal 6510 low-byte, high-byte format (VALUE=LOW BYTE+256*HIGH BYTE). Once the Timer Counter is set to an initial value, and the timer is started, the timer will count down one number every microprocessor clock cycle. Since the clock speed of the 64 (using the American NTSC television standard) is 1,022,727 cycles per second, every count takes approximately a millionth of a second. The formula for calculating the amount of time it will take for the timer to count down from its latch value to 0 is:

TIME=LATCH VALUE/CLOCK_SPEED

where LATCH VALUE is the value written to the low and high timer registers (LATCH VALUE=TIMER LOW+256*TIMER HIGH), and CLOCK SPEED is 1,022,727 cycles per second for American (NTSC) standard television monitors, or 985,248 for European (PAL) monitors.

When Timer Counter A or B gets to 0, it will set Bit 0 or 1 in the Interrupt Control Register at 56333 ($DC0D). If the timer interrupt has been enabled (see 56333 ($DC0D)), an IRQ will take place, and the high bit of the Interrupt Control Register will be set to 1. Alternately, if the Port B output bit is set, the timer will write data to Bit 6 or 7 of Port B. After the timer gets to 0, it will reload the Timer Latch Value, and either stop or count down again, depending on whether it is in one-shot or continuous mode (determined by Bit 3 of the Control Register).

Although usually a timer will be used to count the microprocessor cycles, Timer A can count either the microprocessor clock cycles or external pulses on the CNT line, which is connected to pin 4 of the User Port.

Timer B is even more versatile. In addition to these two sources, Timer B can count the number of times that Timer A goes to 0. By setting Timer A to count the microprocessor clock, and setting Timer B to count the number of times that Timer A zeros, you effectively link the two timers into one 32-bit timer that can count up to 70 minutes with accuracy within 1/15 second.

In the 64, CIA #1 Timer A is used to generate the interrupt which drives the routine for reading the keyboard and updating the software clock. Both Timers A and B are also used for the timing of the routines that read and write tape data. Normally, Timer A is set for continuous operation, and latched with a value of 149 in the low byte and 66 in the high byte, for a total Latch Value of 17045. This means that it is set to count to 0 every 17045/1,022,727 seconds, or approximately 1/60 second.

For tape reads and writes, the tape routines take over the IRQ vectors. Even though the tape write routines use the on-chip I/O port at location 1 for the actual data output to the cassette, reading and writing to the cassette uses both CIA #1 Timer A and Timer B for timing the I/O routines.
```

## Key Registers
- $DC00–$DC01 - CIA #1 - Data Port A and Data Port B (Port B bits 6/7 usable as timer-driven outputs)
- $DC04–$DC07 - CIA #1 - Timer A/B low and high bytes (Timer A: $DC04/$DC05, Timer B: $DC06/$DC07)
- $DC0D - CIA #1 - Interrupt Control Register (Timer A underflow → bit 0; Timer B underflow → bit 1; ICR high bit indicates interrupt)
- $DC0E–$DC0F - CIA #1 - Control Register A and Control Register B (one-shot/continuous bit 3, Force Load control; other control bits affect start/stop and output behavior)

## References
- "figuring_out_threshold_value" — using timers to measure pulse widths and thresholds
- "cia1_control_register_a" — Control register bits used to start/force-load timers