# KERNAL wrapper: UNTALK at $FFAB (JMP $EDEF)

**Summary:** KERNAL entry at $FFAB (bytes 4C EF ED) is a single-instruction wrapper that JMPs to $EDEF to send an UNTALK command on the CBM serial bus, causing devices previously set to TALK to stop transmitting.

## Description
This ROM entry is a convenience wrapper: a one-instruction JMP located at $FFAB that transfers execution to the actual UNTALK transmitter routine at $EDEF. The JMP opcode (4C) is followed by the little-endian address bytes EF ED, which form the target address $EDEF. The routine at $EDEF performs the serial-bus UNTALK operation (stops devices in TALK mode).

This entry is part of the C64 KERNAL ROM API and provides a stable vector for code (ROM or user) to issue the UNTALK command without inlining the bus protocol.

## Source Code
```asm
; command serial bus to UNTALK
; this routine will transmit an UNTALK command on the serial bus. All devices
; previously set to TALK will stop sending data when this command is received.
.,FFAB 4C EF ED JMP $EDEF       command serial bus to UNTALK
```

## References
- "serial_bus_control" — expands on the UNTALK implementation and serial bus protocol (external)