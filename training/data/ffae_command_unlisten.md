# C64 KERNAL $FFAE — UNLISTEN (command serial bus to UNLISTEN)

**Summary:** KERNAL routine at $FFAE that transmits an UNLISTEN command on the IEC/serial bus to stop devices previously commanded to LISTEN from receiving data; used after finishing data transmission to clear output listeners.

## Description
This KERNAL entry sends the UNLISTEN command over the C64 serial (IEC) bus. Calling $FFAE causes an UNLISTEN sequence to be transmitted; only devices that were previously commanded to LISTEN will be affected. Typical usage is after the computer finishes sending data to external devices: sending UNLISTEN tells the listening device(s) to release the bus so it can be reused.

(UNLISTEN and LISTEN are IEC serial-bus command states.)

## References
- "ffa8_output_byte_to_serial_bus" — expands on UNLISTEN sends buffered char with EOI  
- "ffcc_close_channels" — expands on closing channels will UNLISTEN where needed

## Labels
- UNLISTEN
