# IEC Serial Bus — Practical TALK / LISTEN / SECOND Examples

**Summary:** Practical command sequences for the Commodore IEC serial bus showing TALK/LISTEN, SECOND (channel select), and role release (UNTALK/UNLISTEN); includes encoded command formulas ($40+$device, $20+$device, $60+$channel) and example bytes ($48, $62, $5F, $24, $67, $3F). Terms: TALK, LISTEN, SECOND, EOI, device-to-device transfer.

## Command semantics
- TALK and LISTEN assign the bus role for a target device: TALK makes the device transmit, LISTEN makes it receive.
- SECOND (encoded as $60 + channel) selects the logical channel (1–15) on the device after TALK/LISTEN.
- UNTALK and UNLISTEN release the TALK/LISTEN roles so the controller can resume bus control.
- Data transfer: when the controller (or a device) is reading from a TALKing device, it reads bytes until EOI (End-Of-Information). When writing to a LISTENing device, the controller sends bytes and signals EOI on the last byte.
- Command encoding (byte composition):
  - TALK = $40 + device_number
  - LISTEN = $20 + device_number
  - SECOND = $60 + channel_number
  - UNTALK = $5F
  - UNLISTEN = $3F

## Source Code
```text
Practical Command Sequence Examples:

  Reading from device 8, channel 2:
    $48  (TALK device 8:    $40 + 8)
    $62  (SECOND channel 2: $60 + 2)
    [controller reads bytes from device until EOI]
    $5F  (UNTALK)

  Writing to device 4, channel 7:
    $24  (LISTEN device 4:  $20 + 4)
    $67  (SECOND channel 7: $60 + 7)
    [controller sends bytes with final byte using EOI]
    $3F  (UNLISTEN)

  Device-to-device transfer (disk 8 to printer 4):
    $24  (LISTEN device 4:  $20 + 4)
    $48  (TALK device 8:    $40 + 8)
    $62  (SECOND channel 2: $60 + 2)
    [device 8 autonomously transmits to device 4]
    $5F  (UNTALK)
    $3F  (UNLISTEN)
```

## References
- "command_codes" — numeric encoding of commands (expands on $20/$40/$60 encodings)
- "byte_transfer_sequence" — how bytes are transmitted once roles are assigned (EOI/use of final byte)