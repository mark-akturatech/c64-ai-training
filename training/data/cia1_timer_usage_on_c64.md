# CIA #1 Timers (C64): Timer A IRQ, keyboard scan, tape timing

**Summary:** CIA #1 Timer A ($DC04-$DC05) generates the IRQ used for keyboard scanning and software clock updates; both CIA #1 timers (Timer A and Timer B, $DC04-$DC07) are used for cassette/tape timing. Includes typical Timer A latch values (low=149, high=66 → 17045) and the timing formula using the 1,022,730 Hz CIA clock.

## Behavior and usage
- On the Commodore 64, CIA #1 Timer A is normally run continuously and used to generate the IRQ that drives the keyboard scanning routine and updates the software clock.
- Typical Timer A latch used for the IRQ is low byte = 149 and high byte = 66, giving a 16-bit latch value of 17045. Using the CIA clock of 1,022,730 Hz, the timer underflows every:
  - period = latch / 1,022,730 seconds = 17045 / 1,022,730 ≈ 0.0166667 s ≈ 1/60 second (NTSC).
- Tape (cassette) I/O routines take over the IRQ vectors while active. Although tape write output uses the on‑chip I/O port at location 1 (port bit wiring to cassette motor/head), both CIA #1 Timer A and Timer B are used by the tape routines for precise timing of read and write pulses.
- Typical operational notes preserved from source: Timer A is set for continuous operation for IRQ; both timers are used by tape routines which override IRQ handling while performing tape I/O.

## Source Code
```text
56324         $DC04          TIMALO
Timer A (low byte)

56325         $DC05          TIMAHI
Timer A (high byte)

56326         $DC06          TIMBLO
Timer B (low byte)

56327         $DC07          TIMBHI
Timer B (high byte)

Normally, Timer A is latched with low=149 and high=66 for a total Latch Value of 17045.
It is set to count to 0 every 17045/1022730 seconds (≈ 1/60 second on NTSC).
```

## Key Registers
- $DC04-$DC07 - CIA #1 - Timer A low/high ($DC04/$DC05) and Timer B low/high ($DC06/$DC07) used for IRQ generation (keyboard/clock) and tape timing

## References
- "cia_timers_register_behavior_and_timing" — expands on timer latch and timing formula  
- "irq_handler_and_keyscan" — expands on IRQ-driven keyboard scanning and software clock update