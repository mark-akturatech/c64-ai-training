# CIA 6526 Complex Interface Adapter — C64 KERNAL Usage (Quick Reference)

**Summary:** CIA1 ($DC00) Timer A is used by the KERNAL for the system IRQ (~60 Hz) with default timer values $4025 (PAL, 16421) and $4295 (NTSC, 17045) driving cursor blink, keyboard scan and periodic tasks. CIA1 Timer B and TOD are available to user programs/BASIC (TI/TI$), and CIA2 ($DD00) timers/TOD are used by the KERNAL for RS‑232 bit timing and also available to user programs.

## KERNAL CIA usage (quick reference)
- CIA1 Timer A
  - Used by the C64 KERNAL as the system IRQ source (approx. 60 Hz).
  - Default timer reload values used by the KERNAL: $4025 (16421 decimal) for PAL, $4295 (17045 decimal) for NTSC.
  - Drives cursor blink, keyboard scanning, and other periodic system tasks.
- CIA1 Timer B
  - Available to user programs.
  - Combined with Timer A, used by Commodore BASIC to implement the TI/TI$ (jiffy clock).
- CIA1 Time‑Of‑Day (TOD) clock
  - Used by BASIC to supply TI/TI$ real‑time clock variables.
- CIA2 timers and TOD
  - Used by the KERNAL for RS‑232 bit timing.
  - Also available for use by user programs.

## Key Registers
- $DC00-$DC0F - CIA1 - contains Timer A/B registers, TOD, I/O ports and interrupts (KERNAL uses Timer A/TOD as described)
- $DD00-$DD0F - CIA2 - contains Timer A/B registers, TOD, I/O ports and interrupts (KERNAL uses for RS‑232 timing)

## References
- "timer_a_16bit" — expands on CIA1 Timer A default values and KERNAL uses
- "timer_b_16bit" — expands on CIA1 Timer B availability and BASIC uses (jiffy clock)
- "time_of_day_clock" — expands on CIA1 TOD used by BASIC for TI/TI$ real-time variables
- "cia2_detailed_connections" — expands on CIA2 timers and TOD used for RS-232 timing
