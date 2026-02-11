# Minimal C64 Datasette Pulse Measurement (CIA timers)

**Summary:** Defines three datasette pulse types (Short 352 µs, Medium 512 µs, Long 672 µs) and the measurement principle using CIA timers (CIA1 $DC00 / CIA2 $DD00) that count PAL clock cycles; Timer A underflows can be counted by Timer B to extend the measurable range.

## Pulse encoding and measurement principle
All information is carried in pulse duration on the tape signal. The loader distinguishes three discrete pulse lengths:

- Short:  352 microseconds
- Medium: 512 microseconds
- Long:   672 microseconds

Measurement principle (as provided):
- Use one of the CIA timers to measure pulse length. The CIA timers count cycles of the C64 base (PAL) clock (each cycle is on the order of a microsecond).
- Timers are used as 16-bit down-counters: load a 16-bit start value and let the timer count down while the pulse is present; the remaining/count difference gives the duration.
- For an extended timing range, configure Timer A to underflow and have Timer B count the number of Timer A underflows (Timer B increments on Timer A underflow). This lets you combine Timer A's 16-bit resolution with Timer B as an overflow counter to measure longer intervals.

Cross-reference notes:
- A known helper technique is to configure the CIA timer input or prescaler (see "cia_timer_divide_by_8_setup") to divide the clock (divide-by-8 example) when needed to shift measurement ranges or reduce resolution.
- The detailed read routine that samples pulses using the CIA timers is covered in "get_pulse_routine".

## References
- "cia_timer_divide_by_8_setup" — expands on timer configuration example that divides the clock by 8
- "get_pulse_routine" — expands on reading pulse durations using the timers
