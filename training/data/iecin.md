# IECIN ($FFA5) — KERNAL serial input

**Summary:** KERNAL function IECIN at $FFA5 (implementation at $EE13) reads a single byte from the Commodore serial (IEC) bus after the device has been placed in TALK/TALKSA mode; result returned in the A register.

## Function
IECIN reads one byte from the IEC serial bus. The caller must previously have addressed the device as a talker (via TALK or TALKSA). On return the received byte is placed in the A register. The documented vector is $FFA5; the real implementation address is $EE13. Related KERNAL functions handle addressing and device status (see References).

## References
- "talksa" — expands on requiring TALK/TALKSA before IECIN
- "readst" — device status reading related to IEC transfers (READST $FFB7)

## Labels
- IECIN
