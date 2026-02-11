# Send secondary address after TALK (ROM wrapper $FF96 -> $EDC7)

**Summary:** ROM wrapper at $FF96 that JMPs to $EDC7 to send a secondary address on the C64 serial bus; call with accumulator A = 4..31 after a TALK (not after a LISTEN).

## Description
This ROM entry transmits a secondary address command on the IEC serial bus for a device already addressed as TALK. Call convention: place a number between 4 and 31 in the accumulator (A) before invoking the routine. The routine sends that value as a secondary address over the serial bus. It is only valid immediately after calling the TALK routine; it does not function after a LISTEN.

This entry at $FF96 is a simple JMP wrapper that transfers control to the actual transmit routine at $EDC7.

## Source Code
```asm
.,FF96 4C C7 ED JMP $EDC7       send secondary address after TALK
```

## References
- "serial_bus_secondary_address_send" — expands on secondary address transmit routine ($EDC7) (external)

## Labels
- SERIAL_BUS_SECONDARY_ADDRESS_SEND
