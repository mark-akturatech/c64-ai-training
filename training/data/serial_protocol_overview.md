# 256-Byte Autostart Fast Loader — Two-bits-per-cycle Serial Protocol

**Summary:** A C64↔1541 autostart fast-loader protocol that uses synchronized CPU clocks to send two data bits per cycle, reducing byte transfer steps from eight to four and repurposing former handshaking signal lines to increase throughput.

**Protocol Overview**

This protocol moves away from traditional clocked handshaking and instead relies on both devices sharing a synchronized CPU clock. On each synchronized cycle, the 1541 drives two data bits in parallel to the C64; the receiver consumes two bits per cycle, so a single byte is completed in four cycles instead of eight. The design explicitly reassigns lines that were previously reserved for handshaking to carry the second data bit, yielding much higher effective bandwidth for the 256-byte autostart block.

Key points:

- **Direction:** Data flows from the 1541 (disk) to the C64 (host).
- **Per-cycle transfer:** 2 data bits transmitted simultaneously, halving the number of cycles per byte compared to serial 1-bit-per-clock schemes.
- **Clocking:** Requires synchronized CPU-clock-derived timing between the two units (no conventional per-bit handshaking).
- **Hardware implication:** The `CLK` line, traditionally used for handshaking, is repurposed to carry the second data bit alongside the `DATA` line. This necessitates precise timing and synchronization between the C64 and 1541.
- **Complementary code required on both sides:** A 1541-side encoder that outputs the paired bits, and a C64-side receiver that samples the two-bit bus at the agreed clock phase.

## Source Code

```text
Timing Diagram for Two-Bits-Per-Cycle Serial Protocol:

C64 CPU Cycles: | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
                |---|---|---|---|---|---|---|---|
1541 CPU Cycles:| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
                |---|---|---|---|---|---|---|---|
DATA Line:      | D0| D2| D4| D6|   |   |   |   |
                |---|---|---|---|---|---|---|---|
CLK Line:       | D1| D3| D5| D7|   |   |   |   |
                |---|---|---|---|---|---|---|---|

Legend:
- D0 to D7 represent the bits of a byte being transmitted.
- Each cycle, two bits are transmitted: one on the DATA line and one on the CLK line.
- The C64 samples both lines simultaneously each cycle to reconstruct the byte over four cycles.
```

## Key Registers

- **C64:**
  - `DD00` ($DD00): CIA 2 Data Port A. Used to read the state of the `DATA` and `CLK` lines.
- **1541:**
  - `1C01` ($1C01): VIA 2 Data Port A. Used to set the state of the `DATA` and `CLK` lines.

## References

- "receiving_code_c64" — C64-side implementation details for the optimized receive routine.
- "sending_code_1541" — 1541-side encoding and transmit routine that complements this protocol.

## Labels
- DD00
- 1C01
