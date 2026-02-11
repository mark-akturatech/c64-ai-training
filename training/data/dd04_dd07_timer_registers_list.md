# CIA 2 Timer Registers ($DD04-$DD07)

**Summary:** CIA 2 timer registers at $DD04-$DD07 are the 16-bit little-endian Timer A and Timer B counters (low/high bytes) used for system timing, interrupts, and RS-232/serial timing on the C64.

## Timer registers (overview)
$DD04-$DD07 map to the two 16-bit timers in the MOS 6526 (CIA) mapped at $DD00 (CIA #2). Each timer is split into a low byte and a high byte (little-endian). Software and the C64 OS use these registers for timekeeping, timeout generation, IRQ-driven intervals, and serial/RS-232 timing.

Important points (summary, conservative facts only):
- The two timers are named Timer A and Timer B; each uses two byte registers:
  - Low byte: lower 8 bits of the 16-bit counter
  - High byte: upper 8 bits of the 16-bit counter
- Typical uses include system delays, interval interrupts, and baud/timing for serial/RS‑232 routines.
- Timer behavior (start/stop, clock source selection, cascade mode for Timer B) is controlled by the CIA control registers; these control bits determine whether the timer runs from the system clock, an external CNT input, or cascades via the other timer. (Control-register details are implemented elsewhere in the CIA register map.)

## Source Code
```text
$DD04        TI2ALO       Timer A (low byte)
$DD05        TI2AHI       Timer A (high byte)
$DD06        TI2BLO       Timer B (low byte)
$DD07        TI2BHI       Timer B (high byte)
```

## Key Registers
- $DD04-$DD07 - CIA 2 - Timer A/B low/high bytes (16-bit little-endian counters)

## References
- "dd04_dd07_timers_overview" — Use of these registers by the C64 OS and RS-232 timing

## Labels
- TI2ALO
- TI2AHI
- TI2BLO
- TI2BHI
