# IEC Serial Bus — Error Conditions and Timeouts

**Summary:** IEC serial bus error conditions: device-not-present, receiver timeout, and sender timeout. Key signals: DATA and CLK (open-collector, active-low); time thresholds are 256 µs, 1000 µs, and 512 µs respectively.

## Error Conditions and Timeouts
- Device-not-present  
  - Condition: DATA line remains unpulled after 256 µs.  
  - Meaning: a device expected to pull DATA low did not respond within 256 µs, indicating the target device is absent or not driving the line.

- Receiver timeout  
  - Condition: No pull of DATA within 1000 µs after a byte was sent.  
  - Meaning: the receiving side did not drive DATA within 1000 µs following transmission of a byte, signaling a receive-side timeout/error.

- Sender timeout  
  - Condition: CLK line is not pulled within 512 µs for an empty stream.  
  - Meaning: when the stream is empty (no DATA bits pending), the expected clock pull did not occur within 512 µs, indicating a sender-side timeout/error.

These thresholds are used for timing-based error detection during IEC byte-transfer sequences and determine presence/absence and responsiveness of devices on the serial bus.

## References
- "byte_transfer_sequence" — expands on timing-based error detection during transfers