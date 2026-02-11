# UNLSTN ($FFAE)

**Summary:** KERNAL vector UNLSTN ($FFAE) sends the UNLISTEN command on the IEC serial bus to end a LISTEN session; it uses the A register. Real implementation address: $EDFE.

## Description
UNLSTN issues the UNLISTEN command on the Commodore IEC serial bus to terminate a previously established LISTEN session. The routine is invoked via the KERNAL vector at $FFAE and uses the A register (caller-supplied value). The documented real implementation entry point for this KERNAL function is $EDFE.

This function is the complement to LISTEN ($FFB1) and is referenced/used by CLRCHN ($FFCC) when CLRCHN must issue UNTALK/UNLISTEN as part of clearing channels.

Call details provided by the source:
- Vector: $FFAE
- Uses: A register
- Purpose: Send UNLISTEN on IEC serial bus to end a LISTEN session
- Real implementation address: $EDFE

## Key Registers
- $FFAE - KERNAL ROM - UNLSTN vector (caller uses A)
- $EDFE - KERNAL ROM - UNLSTN real implementation entry point

## References
- "listen" — expands on complements LISTEN ($FFB1)
- "clrchn" — expands on CLRCHN issues UNTALK/UNLISTEN as needed (CLRCHN $FFCC)

## Labels
- UNLSTN
