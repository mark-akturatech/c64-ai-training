# UNTALK ($FFAB)

**Summary:** KERNAL function UNTALK at $FFAB (real address $EDEF) — sends the UNTALK command on the serial IEC bus to end a TALK session.

**Description**
Sends the IEC serial bus UNTALK command to terminate a device's TALK session. The routine is reached via the KERNAL vector $FFAB; the actual implementation resides at $EDEF. This routine does not require any parameters and does not use the A register for input.

Call: JSR $FFAB  (vector entry), real address $EDEF.

Complementary KERNAL calls: TALK ($FFB4) and UNLISTEN ($FFAE).

## References
- "talk" — expands on complements TALK ($FFB4)
- "unlstn" — expands on complements UNLISTEN ($FFAE)

## Labels
- UNTALK
