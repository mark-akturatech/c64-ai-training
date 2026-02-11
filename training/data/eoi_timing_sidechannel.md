# IEC Serial Bus End-of-Information (EOI) Signaling

**Summary:** EOI on the Commodore IEC serial bus is implemented as a timing sidechannel on the DATA line (no dedicated EOI wire). The sender delays placing the first bit of the byte by ≥200 µs after receivers release DATA; receivers detect this delay and acknowledge by pulling DATA for 60 µs, then the final byte is transmitted normally.

## End-of-Information (EOI) Signaling
EOI is signalled by timing behavior on the DATA line rather than a separate physical signal. Sequence:

- Receivers indicate readiness by releasing (releasing pull on) the DATA line.
- If the sender intends this to be the final byte, it waits at least 200 µs after the receivers release DATA before placing the first data bit on the line. This ≥200 µs gap is the EOI marker.
- Receivers detect this extended idle period and acknowledge the EOI by briefly pulling DATA low for 60 µs.
- After the 60 µs acknowledgement pulse, the sender transmits the final byte using the normal bit timing.

Notes:
- This method avoids adding a dedicated wire for EOI but requires precise timing detection and generation (timing sidechannel).
- The timing thresholds are the functional indicators: ≥200 µs sender delay = final-byte intent; 60 µs receiver pull = acknowledgement.

## References
- "byte_transfer_sequence" — expands on normal byte flow vs EOI special-case
