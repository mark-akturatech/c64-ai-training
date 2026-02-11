# Send secondary address after LISTEN — wrapper at $FF93

**Summary:** Wrapper JMP at $FF93 to $EDB9 implements "send secondary address after LISTEN" on the serial bus; used after the LISTEN routine and requires the secondary address to be ORed with $60 (not usable after TALK). Contains ROM entry point and behavior notes.

## Description
This ROM wrapper is a single JMP entry at $FF93 that forwards execution to the secondary-address transmit routine at $EDB9. It is intended to send a secondary address to a device on the C64 IEEE-488-like serial bus after the device has been instructed to LISTEN. A secondary address is typically sent to give setup information to the device before subsequent I/O operations.

Key behavioral points:
- Use only after a LISTEN command has been issued to the device; this routine does not apply after TALK.
- The secondary address byte must be ORed with $60 before being sent (address | $60).
- $FF93 is a ROM wrapper; the actual transmit implementation is at $EDB9.

## Source Code
```text
send secondary address after LISTEN
this routine is used to send a secondary address to an I/O device after a call to
the LISTEN routine is made and the device commanded to LISTEN. The routine cannot
be used to send a secondary address after a call to the TALK routine.
A secondary address is usually used to give set-up information to a device before
I/O operations begin.
When a secondary address is to be sent to a device on the serial bus the address
must first be ORed with $60.
```

```asm
.,FF93 4C B9 ED JMP $EDB9       send secondary address after LISTEN
```

## References
- "serial_bus_secondary_address_send" — secondary address transmit routine ($EDB9) (external)

## Labels
- SEND_SECONDARY_ADDRESS_AFTER_LISTEN
