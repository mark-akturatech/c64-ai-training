# Serial output (KERNAL entry $FFA8 -> JMP $EDDD)

**Summary:** KERNAL ROM wrapper at $FFA8 (JMP $EDDD) implements serial-bus byte output with full handshaking. Caller must call LISTEN ($FFB1) first and place the byte in A; UNLISTEN ($FFAE) ends transfer — the routine buffers one character and sends it with EOI on UNLISTEN. Timeout is returned if no device is listening.

**Description**
This ROM entry implements sending a single data byte to a device on the C64 serial bus using the full IEEE-488-like handshaking protocol used by the C64 IEC bus.

- **Entry:** $FFA8 is a JMP instruction that vectors execution to $EDDD where the actual implementation resides.
- **Precondition:** The caller must issue LISTEN ($FFB1) to select the target device before calling this routine.
- **Input:** The byte to transmit must be loaded into the accumulator (A) before calling the routine.
- **Behavior:**
  - The routine performs full handshaking on the serial bus to place the byte on the bus.
  - The routine always buffers one character: when UNLISTEN ($FFAE) is later called to terminate the transmission, the buffered character is sent with the EOI (End-Or-Identify) line set, and then the UNLISTEN command is sent to the device.
  - If no device is listening when the byte is attempted, the status word will indicate a timeout.
- **Notes:**
  - $FFA8 itself is only a wrapper (JMP $EDDD); the detailed handshake implementation is at $EDDD.
  - LISTEN must be used before calling this routine; UNLISTEN triggers sending of the buffered byte with EOI.

## Source Code
```asm
.; KERNAL wrapper entry
.,FFA8 4C DD ED    JMP $EDDD       ; output byte to serial bus (actual routine at $EDDD)
```

## Key Registers
- $FFA8 - KERNAL ROM - Serial output wrapper (JMP to $EDDD)
- $EDDD - KERNAL ROM - Actual serial output implementation (target of $FFA8 JMP)
- $FFB1 - KERNAL ROM - LISTEN routine (select device to receive data)
- $FFAE - KERNAL ROM - UNLISTEN routine (end transmission; causes buffered char to be sent with EOI)

## References
- "serial_output_sequence" — expands on the $EDDD serial output implementation (external)

## Labels
- LISTEN
- UNLISTEN
