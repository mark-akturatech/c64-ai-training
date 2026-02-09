# IEC Serial Bus — ATN (Attention) Command Mode

**Summary:** ATN (Attention) on the Commodore IEC serial bus forces all devices into receiver (command) mode; command bytes are transmitted using the same byte mechanics as data transfer and EOI is not used. Devices typically respond within 1000 µs (ATN response timing).

## ATN (Attention) command mode
- Controller asserts (pulls) the ATN line to broadcast commands to all devices on the IEC bus.
- As soon as ATN is asserted, ALL devices are forced into receiver (command) mode regardless of their prior state.
- Command bytes use identical byte-transmission mechanics to normal data transfer (the same physical/frame mechanics).
- End Or Identify (EOI) signaling is NOT used for ATN command transmissions.
- Devices typically provide a response within 1000 µs (1 ms) after command transmission (ATN response timing).

## Key Registers
(omit — this chunk documents protocol behavior, not C64 hardware registers)

## References
- "layer3_overview" — expands on controller broadcast behavior and role orchestration  
- "command_codes" — lists LISTEN/TALK/SECOND/OPEN/CLOSE command opcodes used under ATN