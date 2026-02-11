# CIA #2 Serial Data Register ($DD0C)

**Summary:** CIA #2 serial data register at $DD0C is an on-chip serial shift register (MSB first) used to send/receive a byte one bit at a time; operation is analogous to CIA #1's serial port at $DC0C. The C64 operating system does not use this CIA #2 facility.

## Description
The CIA (6526) contains an on-chip serial port implemented as a shift register. The register at $DD0C (CI2SDR) holds the serial data byte that is transmitted or received one bit at a time, with bit 7 (the most significant bit) transferred first. Functionally this serial facility is equivalent to the CIA #1 serial port — see the $DC0C entry for detailed operation and usage notes.

The C64's built-in operating system does not use CIA #2's serial port, so it is available for user programs but requires explicit software handling (timing, clocking, and handshaking) as described in CIA #1 documentation.

## Key Registers
- $DD0C - CIA 2 - Serial Data Port (CI2SDR): on-chip serial shift register, MSB first

## References
- "dc0c_serial_data_port_cia1" — detailed description of the serial data facility (CIA #1, $DC0C / decimal 56332)

## Labels
- CI2SDR
