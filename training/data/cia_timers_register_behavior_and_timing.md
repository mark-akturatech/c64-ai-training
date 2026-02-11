# CIA Timer Registers ($DC04-$DC07) — Timers A & B (low/high)

**Summary:** CIA (6526) timer registers $DC04-$DCDC07 (decimal 56324–56327) are the low/high latch and counter bytes for 16-bit Timer A and Timer B; reads return the current 16-bit counter, writes store the timer latch. Timers decrement once per 6510/CPU cycle (NTSC/PAL clock rates referenced), underflow sets ICR bits or toggles Port B, and timers reload/stop depending on control register mode (CRA/CRB $DC0E/$DC0F).

## Description
- Registers $DC04-$DC07 hold the low and high bytes for Timers A and B. Format is little-endian: VALUE = TIMER_LOW + 256 * TIMER_HIGH.
- Read behavior: reading these registers returns the current Timer Counter (counts down).
- Write behavior: writing stores the value into the Timer Latch; the latch is transferred to the counter when the Force Load bit in the corresponding Control Register (CRA/CRB at $DC0E/$DC0F) is used.
- Counting rate: timers decrement once per microprocessor clock cycle. The source lists two slightly different NTSC values (see note below) and a PAL value:
  - NTSC (reported): 1,022,730 Hz (also appears as 1,022,370 Hz in the source).
  - PAL (reported): 985,250 Hz.
  - TIME = LATCH_VALUE / CLOCK_SPEED (use appropriate clock rate).
- Underflow behavior:
  - When Timer A or B reaches 0, it sets Bit 0 or Bit 1 (respectively) in the Interrupt Control Register (ICR) at $DC0D. If the interrupt is enabled, an IRQ occurs and the high bit of the ICR is set.
  - Optionally (if configured via Port B control), the timer can drive Port B output: the underflow will pulse or toggle Port B bit 6 (Timer A) or bit 7 (Timer B).
  - After underflow the timer reloads from its latch and either stops or continues depending on one-shot vs continuous mode (Bit 3 in the corresponding Control Register CRA/CRB).
- Timer sources:
  - Timer A: may count CPU cycles or external pulses on CNT (user port pin 4).
  - Timer B: may count CPU cycles, CNT pulses, Timer A underflows, or Timer A underflows only when CNT pulses are present — enabling a linked 32-bit timer mode.
- Linked 32-bit timer: by configuring Timer A to count CPU cycles and Timer B to count Timer A underflows, the two timers form a 32-bit timer (low 16 = Timer A, high 16 = Timer B), with long maximum interval (source notes up to ~70 minutes with C64 timing, accuracy within ~1/15 second).
- Control interaction:
  - Force Load (in CRA/CRB at $DC0E/$DC0F) moves timer latch into counter.
  - Bit 3 of CRA/CRB selects one-shot vs continuous reload.

**[Note: Source may contain an error — two different NTSC clock values are present (1,022,730 Hz and 1,022,370 Hz). Use authoritative timing reference if exact value required.]**

## Source Code
```text
Register map (reference)

$DC04 (56324) - Timer A Low (write -> latch low byte; read -> counter low byte)
$DC05 (56325) - Timer A High (write -> latch high byte; read -> counter high byte)
$DC06 (56326) - Timer B Low (write -> latch low byte; read -> counter low byte)
$DC07 (56327) - Timer B High (write -> latch high byte; read -> counter high byte)

Notes:
- 16-bit timer value = LOW + 256 * HIGH
- Writing: value is stored to Timer Latch. Use Force Load in CRA/CRB ($DC0E/$DC0F) to transfer latch -> counter.
- Reading: returns current counting-down counter value.
- Underflow sets ICR bits: Timer A -> ICR bit 0, Timer B -> ICR bit 1 ($DC0D).
- Port B outputs: Timer A underflow can affect Port B bit 6; Timer B underflow can affect Port B bit 7 (when configured).
- Control registers referenced:
  $DC0D - Interrupt Control Register (ICR)
  $DC0E - Control Register A (CRA)
  $DC0F - Control Register B (CRB)
```

## Key Registers
- $DC04-$DC07 - CIA 1 - Timer A/B low and high bytes (latch on write, counter on read)
- $DC0D - CIA 1 - Interrupt Control Register (ICR) — timer underflow sets bits 0/1, high bit set on IRQ
- $DC0E-$DC0F - CIA 1 - Control Register A/B (CRA/CRB) — Force Load, one-shot/continuous (Bit 3), source selection

## References
- "timalo_timahi_timblo_timbhi_list" — expands on timer low/high byte register addresses
- "ciaicr_interrupt_control" — expands on timer underflow setting interrupt bits in ICR

## Labels
- ICR
- CRA
- CRB
