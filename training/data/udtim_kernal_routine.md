# UDTIM (KERNAL $FFEA / 65514) — Update system clock

**Summary:** KERNAL call UDTIM at $FFEA (65514) updates the system clock (normally invoked by IRQ every 1/60s). No parameters or communication registers; call with JSR $FFEA. Stack requirement: 2. STOP-key handling requires calling the STOP routine after UDTIM when replacing the IRQ handler.

## Description
UDTIM updates the system time counters maintained by the KERNAL. The normal KERNAL IRQ handler calls UDTIM once per 1/60th of a second; if a program installs its own IRQ handler it must also call UDTIM periodically (typically each IRQ) to keep the system clock correct. To preserve the STOP key behavior, the STOP key handling routine must also be invoked (see referenced STOP routine).

- Call address: $FFEA (65514)
- Invocation: JSR $FFEA (or JSR UDTIM if symbols available)
- Purpose: increment/maintain KERNAL timebase (1/60s ticks)
- Communication registers: none (no A/X input)
- Preparatory routines: none required
- Error returns: none
- Stack requirements: 2
- Registers noted in source: A, X

**[Note: Source may contain an error — one place states "A,X not used" while the routine summary lists "Registers affected: A, X". Treat A and X as possibly clobbered; preserve caller-saved registers if unsure.]**

How to use:
1) From an IRQ or elsewhere, call JSR $FFEA each 1/60s to update the system clock.
2) If implementing a custom IRQ handler and you want the STOP key to remain functional, call the KERNAL STOP handling routine after UDTIM (see "stop_kernal_routine" reference).

## Key Registers
- $FFEA - KERNAL - UDTIM (Update system clock) call address

## References
- "stop_kernal_routine" — covers calling the STOP key handler after UDTIM to check for <STOP> key functionality

## Labels
- UDTIM
