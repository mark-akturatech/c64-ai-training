# CIA 6526 Time-of-Day (TOD) Clock — Offsets $08-$0B

**Summary:** TOD registers at offsets $08-$0B (CIA 6526) implement a BCD time-of-day clock with 1/10 second resolution, clocked from the external TOD pin. CRA bit 7 selects 50/60 Hz input frequency. TOD uses BCD storage; read/write latching rules prevent inconsistent reads/writes; CRB bit 7 enables ALARM write mode, and the TOD alarm sets ICR bit 2.

**Overview**
The CIA TOD is a BCD-based clock with 1/10 second resolution. It is driven by the TOD input pin synchronized to mains frequency (50 Hz PAL or 60 Hz NTSC). All four TOD registers ($08-$0B) store values in BCD.

Key behaviors:
- Reading the Hours register ($0B) latches the current TOD into $0B/$0A/$09/$08 so subsequent reads return a consistent snapshot. Reading $08 (tenths) releases the latch.
- Writing the Hours register ($0B) stops the TOD clock until $08 (tenths) is written; this allows atomic updates of the full time.
- When CRB bit 7 (ALARM write mode) is set, writes to $08-$0B set the TOD alarm time rather than the running clock time.
- When the running TOD equals the alarm time, the CIA sets the TOD alarm interrupt flag (ICR bit 2), if enabled.

**Note:** The TOD clock operates in 12-hour format. Bit 7 of the Hours register ($0B) serves as the AM/PM indicator (0 = AM, 1 = PM). ([commodore.ca](https://www.commodore.ca/commodore-manuals/commodore-64-programmers-reference-guide/?utm_source=openai))

**Register details (behavior)**
- Storage: BCD for all fields (each decimal digit encoded in 4 bits).
- Clock source: TOD pin; CRA bit 7 selects whether the pin is interpreted as 50 Hz or 60 Hz.
- Latching (read): Read $0B (Hours) to latch; subsequent reads of $0A/$09/$08 return latched values; read $08 to release latch.
- Write sequencing: Write $0B (Hours) to stop the clock for setting; write $08 (Tenths) to restart the clock. If CRB bit 7 is set, writes affect the ALARM registers instead of the running clock.
- Alarm: Matching TOD to the stored alarm time triggers ICR bit 2 (ALRM) if interrupts are enabled.

## Source Code
```text
; CIA TOD register map (offsets relative to CIA base: $00-$0F)
; Offsets $08-$0B: Time-of-Day (TOD)

$08 - TOD 10THS (Tenths of seconds)
  Bits 0-3 : Tenths of seconds (BCD 0-9)
  Bits 4-7 : Not used (read as 0 / ignored on write)

$09 - TOD SEC (Seconds)
  Bits 0-3 : Seconds ones digit (BCD 0-9)
  Bits 4-6 : Seconds tens digit (BCD 0-5)
  Bit 7    : Not used

$0A - TOD MIN (Minutes)
  Bits 0-3 : Minutes ones digit (BCD 0-9)
  Bits 4-6 : Minutes tens digit (BCD 0-5)
  Bit 7    : Not used

$0B - TOD HR (Hours)
  Bits 0-3 : Hours ones digit (BCD 0-9)
  Bit 4    : Hours tens digit (BCD 0-1)
  Bits 5-6 : Not used
  Bit 7    : AM/PM flag (0 = AM, 1 = PM)
```

## Key Registers
- $DC08-$DC0B - CIA1 - TOD 10ths / Seconds / Minutes / Hours (BCD, read/write with latching rules)
- $DD08-$DD0B - CIA2 - TOD 10ths / Seconds / Minutes / Hours (BCD, read/write with latching rules)

## References
- "control_register_a" — CRA bit 7 selects TOD input frequency (50/60 Hz)
- "control_register_b" — CRB bit 7 toggles ALARM write mode for TOD
- "interrupt_control_register_icr" — TOD alarm flag appears in ICR (ALRM, bit 2)

## Labels
- TOD_10THS
- TOD_SEC
- TOD_MIN
- TOD_HR
