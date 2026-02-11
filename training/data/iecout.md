# IECOUT ($FFA8) — KERNAL: Send byte on IEC serial bus

**Summary:** IECOUT ($FFA8) is a KERNAL vector that sends one byte on the C64 IEC serial bus; input: A = byte to send. Real ROM entry: $EDDD. Requires prior LISTEN/LSTNSA addressing (device/secondary selected).

## Description and usage
IECOUT writes a single data byte to the serial IEC bus (CBM serial: ATN/CLK/DATA lines). The calling convention is:
- Input: A = byte to send.
- Call: JSR $FFA8 (KERNAL vector) — real ROM entry at $EDDD.

Preconditions:
- A LISTEN (device select) sequence must have been performed for the target device (see LISTEN / LSTNSA routines). IECOUT only transmits the data byte after proper addressing; calling it without a prior LISTEN/LSTNSA will not route the byte to the intended device.

Related operations:
- Use LISTEN / LSTNSA to open a listener channel before sending bytes.
- Use UNTALK ($FFAB) to end a TALK session (see reference).

No return value or status is specified in the source text.

## Key Registers
- $FFA8 - KERNAL ROM - IECOUT vector (JSR entry to send one byte on IEC)
- $EDDD - KERNAL ROM - Real address of IECOUT implementation

## References
- "lstnsa" — expands on requiring LISTEN/LSTNSA before IECOUT
- "untalk" — describes ending a TALK session (UNTALK $FFAB)

## Labels
- IECOUT
