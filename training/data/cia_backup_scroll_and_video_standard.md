# System Area $02A1-$02FF (CIA backups, scroll, PAL/NTSC, unused)

**Summary:** System-area bytes $02A1-$02FF store CIA interrupt/timer backup bytes ($02A1-$02A4), the scroll line count ($02A5), the PAL/NTSC switch flag ($02A6, 0=NTSC, 1=PAL), and unused space ($02A7-$02FF). Searchable terms: $02A1, $02A5, $02A6, CIA backup, scroll line count, PAL/NTSC.

## Description
This System Area region (addresses $02A1–$02FF) is used by the C64 KERNAL/OS to hold small runtime state:

- $02A1 — CIA2 Interrupt Backup: backup copy of CIA #2 interrupt control register (used for restoring interrupt mask/state).
- $02A2 — CIA1 Timer A Backup: backup copy of CIA #1 Timer A control register.
- $02A3 — CIA1 Interrupt Backup: backup copy of CIA #1 interrupt control register.
- $02A4 — CIA1 Timer B Backup: backup copy of CIA #1 Timer B control register.
  (CIA = 6526 Complex Interface Adapter, handles timers and interrupts.)
- $02A5 — Scroll Line Count: stores the current raster line number being scrolled (used by screen-scroll routines).
- $02A6 — PAL/NTSC Switch: video-standard flag; 0 = NTSC, 1 = PAL. (Affects VIC-II timing, raster lines, and bank selection.)
- $02A7–$02FF — Unused: 89 bytes reserved/unused in this area.

These bytes are small persistence/working storage used by system routines to save/restore CIA state during interrupt handling and vertical scrolling operations. The PAL/NTSC flag here is consulted by routines that must adapt to VIC-II differences between standards (see referenced vic_bank_selection material for VIC-II effects).

## Source Code
(omitted — no assembly/BASIC listings or register maps in source)

## Key Registers
- $02A1-$02A4 - System RAM - CIA backup bytes (CIA2 interrupt; CIA1 Timer A; CIA1 interrupt; CIA1 Timer B)
- $02A5 - System RAM - Scroll line count (current scrolled raster line)
- $02A6 - System RAM - PAL/NTSC switch flag (0=NTSC, 1=PAL)
- $02A7-$02FF - System RAM - Unused (89 bytes)

## References
- "vic_bank_selection" — expands on PAL/NTSC effects on VIC-II behavior (timing/bank implications)