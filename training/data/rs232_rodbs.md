# $029D RODBS: RS-232 index to Start of Transmit Buffer

**Summary:** $029D (RODBS) is an RS-232 driver RAM byte that holds the index to the start of the 256-byte RS-232 transmit buffer; used by the driver to remove bytes from the transmit FIFO (wraps modulo 256).

## Description
RODBS is a single-byte RAM pointer that points to the starting byte within the 256-byte RS-232 transmit buffer. The RS-232 transmit buffer is managed as a circular FIFO; RODBS indicates where the next byte should be removed (consumed) from the buffer. When the driver removes a byte for transmission, it increments RODBS (wraparound modulo 256) so it always references the current start of the FIFO.

RODBS is complementary to the pointer used when adding data into the transmit buffer (see rs232_rodbe); together they implement the producer/consumer indices for the RS-232 wraparound buffer.

## Key Registers
- $029D - RS-232 - Index to start of 256-byte RS-232 transmit buffer; used to remove bytes from transmit FIFO

## References
- "rs232_fifo_overview" — expands on wraparound FIFO buffer management
- "rs232_rodbe" — expands on where transmit data is added

## Labels
- RODBS
