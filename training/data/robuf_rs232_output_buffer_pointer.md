# ROBUF ($F9-$FA) — RS-232 Output Buffer Pointer

**Summary:** Pointer in zero page at $F9-$FA (decimal 249–250) pointing to the 256-byte RS-232 output buffer used by the KERNAL RS-232 driver for device #2; stored little-endian (low byte at $F9, high byte at $FA).

## Description
ROBUF is a two-byte pointer (low/high) located at zero-page addresses $F9-$FA. It contains the 16-bit start address of a 256-byte output buffer used by the Commodore KERNAL RS-232 driver to transmit data to RS-232 devices assigned as device number 2. The driver reads from this buffer when sending serial data; the buffer length is 256 bytes (wraps within that page/segment as the driver implements).

- Location: zero page $F9 (low), $FA (high)
- Purpose: address of the 256-byte RS-232 transmit/output buffer
- Used by: KERNAL RS-232 driver (device #2)
- Storage order: little-endian (low byte first at $F9)

## Key Registers
- $F9-$FA - KERNAL - Pointer to 256-byte RS-232 output buffer (low byte at $F9, high byte at $FA)

## References
- "ribuf_rs232_input_buffer_pointer" — expands on input/output buffer pair used by the RS-232 driver (device 2)

## Labels
- ROBUF
