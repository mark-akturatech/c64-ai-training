# KERNAL $FFEA — Increment real-time clock

**Summary:** KERNAL routine at $FFEA increments the system real-time clock by one jiffy ($FFEA, KERNAL, real-time clock, jiffy, STOP-key). Normally called by the KERNAL interrupt handler every 1/60 s; user programs that handle interrupts must call this to keep the clock and STOP-key working.

## Description
This ROM routine increments the system clock by one jiffy (1/60 second). It is part of the C64 KERNAL vector table and is invoked to update the internal timekeeping used by BASIC and system routines.

- Intended use: invoked once per vertical interrupt (1/60 s) by the standard KERNAL interrupt handler.
- If a user program replaces or handles interrupts itself, it must call this routine regularly (once per jiffy) to maintain the system clock and STOP-key functionality.
- The STOP key handling is separate but must also be invoked (the source states "the STOP key routine must be called") if the STOP key is to remain functional when the user program manages interrupts.

(Calling convention: call via JSR to $FFEA — standard KERNAL entry method.)

## Key Registers
- $FFEA - KERNAL - Increment real-time clock (advance system clock by one jiffy)

## References
- "ffdb_set_the_realtime_clock" — expands on manually set clock value
- "ffd5_load_ram_from_device" — expands on interrupts and I/O interactions
