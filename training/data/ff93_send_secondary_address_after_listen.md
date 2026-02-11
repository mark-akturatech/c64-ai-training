# $FF93 — Send secondary address after LISTEN

**Summary:** KERNAL vector $FF93 sends a secondary address to a device after a prior LISTEN call; secondary addresses are used for setup/command information and must be ORed with $60 when placed on the C64 serial bus. This routine cannot be used after TALK.

## Description
This KERNAL routine transmits a secondary address to an I/O device that has previously been put into LISTEN state with the LISTEN command. Secondary addresses typically carry device setup or command information and are sent after the initial device listen sequence. The routine is not valid for use following a TALK call.

When sending a secondary address over the C64 serial bus the byte must first be ORed with $60 (bit pattern required by the serial protocol).

## Key Registers
- $FF93 - KERNAL ROM - Send secondary address after LISTEN (cannot be used after TALK)

## References
- "ffb1_command_listen" — expands on the LISTEN command and device addressing
- "ff96_send_secondary_address_after_talk" — expands on sending secondary addresses for TALK devices

## Labels
- SEND_SECONDARY_ADDRESS_AFTER_LISTEN
