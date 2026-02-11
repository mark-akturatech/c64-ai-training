# TALKSA ($FF96)

**Summary:** KERNAL function TALKSA at $FF96 transmits a TALK secondary address over the IEC serial bus (requires a prior TALK call). Uses the A register for the secondary address; actual ROM routine entry is at $EDC7.

## Description
TALKSA transmits a TALK secondary address on the IEC bus after the device has already been selected as a talker via the TALK KERNAL call. The byte placed in the A register is sent as the secondary address. This routine is a KERNAL entry point at $FF96; the ROM implementation resides at $EDC7.

Usage notes:
- Precondition: a successful TALK call (device primary address) must have been made before calling TALKSA.
- Input: A = secondary address (value supplied in A register).
- Effects: transmits the secondary address over the serial IEC bus; A is used by the routine (clobbered).
- After addressing a device as talker, read data from the bus using the IECIN KERNAL function ($FFA5).

## References
- "talk" — covers the required TALK call (selecting device as talker)
- "iecin" — covers reading bytes from the IEC bus after addressing (IECIN $FFA5)

## Labels
- TALKSA
