# Commodore IEC Serial Bus (Standard Serial) — Historical context and preserved IEEE-488 properties

**Summary:** Commodore's Standard Serial (IEC) bus is a serialized form of IEEE-488 (HP-IB) used on PET/CBM and later home systems; key searchable terms: IEC, IEEE-488, HP-IB, Standard Serial, daisy-chaining, single controller (host), one-to-many transmission, multi-channel devices, byte-stream, open-collector.

## Historical Context
Commodore adopted the IEEE-488-style interface concept for the PET (1977) to allow multiple drives and printers on a single port. IEEE-488 (aka HP-IB, IEC-625 internationally) originated in the late 1960s for test equipment and printers. Commodore's Standard Serial (IEC) is a serialization of the IEEE-488 parallel protocol to a compact, simpler physical/signalling scheme suitable for consumer microcomputers and peripherals.

## Standard Serial (IEC) — preserved IEEE-488 properties
The Standard Serial (IEC) bus preserves these IEEE-488 behaviors and architectural constraints:
- Daisy-chained device connections (devices connected in series on the bus).
- Single computer controller (host/CPU) manages the bus and devices (host-centric arbitration).
- Support for up to 31 devices managed by the single controller (IEEE-488 addressing model preserved).
- One-to-many transmission capability (host can transmit to multiple devices).
- Multi-channel support per device (devices may present multiple logical channels).
- Byte-stream data transmission (stream-oriented transfers rather than block with separate framing semantics).
- Open-collector logic on all signal lines (bus signals are wired-OR/wired-AND with pull-ups).

Note: the electrical serialization of IEEE-488 signals to the IEC 5-line connector and exact pin functions are documented separately (see references).

## References
- "series_structure_and_overview" — expands on document part map and structure of the series
- "iec_layer1_electrical" — describes serialization of IEEE-488 signals to the IEC 5-line physical layer