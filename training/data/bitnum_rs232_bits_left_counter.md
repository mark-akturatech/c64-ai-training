# BITNUM ($0298) — RS-232 bits remaining

**Summary:** BITNUM at $0298 (decimal 664) stores the number of bits left to be sent/received for the RS-232 handler and is used to determine how many zero bits to pad a data character to reach the word length configured in M51CTR ($0293).

## Description
BITNUM (location 664, $0298) — "RS-232: Number of Bits Left to be Sent/Received" — holds a count of remaining data bits for the current RS-232 character transfer. The value is used by the RS-232 code to determine how many zero bits must be appended (padded) to the data character so its transmitted/received length matches the word length configured in M51CTR (location 659, $0293).

Key facts preserved from the source:
- Location: decimal 664 = $0298.
- Purpose: number of bits remaining to be sent/received in RS-232 transfer.
- Interaction: padding with zero bits to meet the word length specified by M51CTR at 659 ($0293).

## Key Registers
- $0298 - RAM - BITNUM: RS-232 number of bits left to be sent/received; used to compute zero-bit padding to reach configured word length.
- $0293 - RAM - M51CTR (RS-232 control register): holds word-length configuration referenced by BITNUM.

## References
- "m51ctr_rs232_control_register" — expands on M51CTR word-length configuration used by BITNUM.

## Labels
- BITNUM
- M51CTR
