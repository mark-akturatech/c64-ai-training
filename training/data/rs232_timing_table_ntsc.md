# RS232 Timing Table (NTSC) $FEC2-$FED4

**Summary:** NTSC RS232 NMI timing table stored at $FEC2-$FED4 in the KERNAL; contains 16-bit timer values (little-endian low byte, high byte) used to program the CIA Timer B for RS232 bit timing. Values are indexed by fixed baud rates and referenced by nmi_rs232_in / nmi_rs232_out.

**Description**
This table provides fixed 16-bit timer reload values used by the KERNAL RS232 NMI handlers to time serial bit periods on NTSC machines. Each table entry is a 2-byte little-endian word (low byte then high byte) suitable for writing to the CIA Timer B registers to generate the desired bit timing for receive or transmit.

Entries correspond to standard RS232 baud rates (approximate), arranged in ascending order from low to high baud. The KERNAL NMI handlers (see nmi_rs232_in and nmi_rs232_out) use these values to set the CIA timer for the next incoming or outgoing bit period.

Notes:
- Values are intended for NTSC timing; PAL machines use different table(s).
- The table begins at $FEC2 and ends at $FED4, containing ten 2-byte entries.
- The byte order is low then high (little-endian), matching CIA timer register writes.

## Source Code
```asm
; RS232 timing table (NTSC) - range $FEC2-$FED4
; Each entry: low byte, high byte -> 16-bit timer value for CIA Timer B

.FEC2  C1 27    ; 50 baud
.FEC4  3E 1A    ; 75 baud
.FEC6  C5 11    ; 110 baud
.FEC8  74 0E    ; 134.5 baud
.FECA  ED 0C    ; 150 baud
.FECC  45 06    ; 300 baud
.FECE  F0 02    ; 600 baud
.FED0  46 01    ; 1200 baud
.FED2  B8 00    ; 1800 baud
.FED4  71 00    ; 2400 baud
```

## References
- "nmi_rs232_in" — uses timing entries to set timer for next incoming bit
- "nmi_rs232_out" — uses timing entries to set timer for outgoing bit timing
