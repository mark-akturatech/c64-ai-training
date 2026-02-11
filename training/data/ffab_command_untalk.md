# C64 KERNAL: $FFAB — Command serial bus to UNTALK

**Summary:** Transmit an UNTALK command on the Commodore IEC serial bus (KERNAL vector $FFAB). Stops devices previously set to TALK from sending data.

## Description
JSR entry point at address $FFAB in the C64 KERNAL transmits an UNTALK command onto the IEC/serial bus. When a device on the bus receives this UNTALK command, any device previously placed in the TALK state will cease sending data. This routine is the complement to the TALK command in the KERNAL serial-control set.

## References
- "ffb4_command_talk" — expands on entering and ending TALK states

## Labels
- UNTALK
