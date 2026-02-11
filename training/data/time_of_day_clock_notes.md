# CIA 6526 — Time‑Of‑Day (TOD) Clock — Practical Usage Notes

**Summary:** TOD clock (CIA 6526) runs independently from the CPU, clocked by the TOD pin (mains). Procedures and register addresses: TOD registers $DC08‑$DC0B / $DD08‑$DD0B; Control Register B (CRB) bit7 selects alarm write vs clock write; ICR ALRM indicates TOD alarm interrupt.

## Time‑Of‑Day (TOD) clock — behavior and procedures
- The TOD oscillator runs independently, driven by the TOD input (mains frequency). The CPU reads/writes four TOD registers (hours, minutes, seconds, tenths).
- CRB bit 7 selects whether writes go to the clock or the alarm:
  - CRB bit 7 = 0 → writes set the clock (normal TOD write).
  - CRB bit 7 = 1 → writes set the alarm.
- Writing the hours register stops/latches the TOD for a multi‑byte write; writing the tenths register restarts/releases as described below.

Setting the TOD clock (clock write mode: CRB bit 7 = 0)
1. Ensure CRB bit 7 = 0 (clear bit 7 in Control Register B).
2. Write hours first ($DC0B / $DD0B) — writing hours stops the clock for a multi‑byte update.
3. Write minutes ($DC0A / $DD0A).
4. Write seconds ($DC09 / $DD09).
5. Write tenths ($DC08 / $DD08) — writing tenths restarts the clock.

Setting the TOD alarm (alarm write mode: CRB bit 7 = 1)
1. Set CRB bit 7 = 1 (set bit 7 in Control Register B) to select alarm registers.
2. Write alarm hours, minutes, seconds, tenths to $0B/$0A/$09/$08 (CIA1: $DC0B..$DC08; CIA2: $DD0B..$DD08).
3. Clear CRB bit 7 = 0 to return to normal TOD writes.

Reading the TOD clock (latch behavior)
1. Read hours ($DC0B / $DD0B) — reading hours latches all TOD registers.
2. Read minutes ($DC0A / $DD0A) — returns latched minutes.
3. Read seconds ($DC09 / $DD09) — returns latched seconds.
4. Read tenths ($DC08 / $DD08) — reading tenths releases the latch (allows TOD to continue updating).

BCD format and hour PM bit
- TOD values are stored in BCD.
- Hour register format: lower 7 bits hold BCD hour; bit 7 indicates PM when set (12‑hour format).
  - Example from source: 12:30:00.5 PM is stored as:
    - TOD HR = $92  (bit7=1 for PM, $12 BCD)
    - TOD MIN = $30 (BCD)
    - TOD SEC = $00 (BCD)
    - TOD 10THS = $05 (BCD)

## Key Registers
- $DC08-$DC0B - CIA 1 - TOD registers: tenths ($DC08), seconds ($DC09), minutes ($DC0A), hours ($DC0B)
- $DC0D - CIA 1 - Interrupt Control Register (ICR) — ALRM bit indicates TOD alarm interrupt
- $DC0F - CIA 1 - Control Register B (CRB) — bit 7 selects alarm write (1) vs clock write (0)
- $DD08-$DD0B - CIA 2 - TOD registers: tenths ($DD08), seconds ($DD09), minutes ($DD0A), hours ($DD0B)
- $DD0D - CIA 2 - Interrupt Control Register (ICR) — ALRM bit indicates TOD alarm interrupt
- $DD0F - CIA 2 - Control Register B (CRB) — bit 7 selects alarm write (1) vs clock write (0)

## References
- "time_of_day_clock" — expands on TOD register formats and latching behavior ($08-$0B)
- "control_register_b" — expands on CRB bit 7 selects alarm write mode
- "interrupt_control_register_icr" — expands on ICR ALRM bit indicates TOD alarm interrupt

## Labels
- TOD_10THS
- TOD_SECONDS
- TOD_MINUTES
- TOD_HOURS
- ICR
- CRB
