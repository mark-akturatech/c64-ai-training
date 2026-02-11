# $0298 — BITNUM (RS-232)

**Summary:** $0298 (BITNUM) — RS-232 register storing the number of zero bits to append to a data character to pad it to the word length set by the RS-232 control register at $0293.

## Description
This single-byte RAM location is used by the RS-232 routine to determine how many zero bits must be appended to a data character so that the transmitted/received bitstream matches the word length configured in the RS-232 control register at $0293. The value is consulted when preparing characters for serial transmission or when assembling received bits into characters.

The source text references the RS-232 control register at $0293 (word length setting). Timing for actual send/receive operations is handled separately (see cross-reference).

## Key Registers
- $0298 - RAM - RS-232: Number of zero bits to add to a data character to pad it to the word length set by the RS-232 control register ($0293)

## References
- "rs232_baud_prescaler" — timing for send/receive driven by CIA timers

## Labels
- BITNUM
