# 6526 (CIA) interface signals and timing characteristics

**Summary:** 6526 (MOS 6526 CIA) interface signals (/CS, R/W, RS3-RS0, DB7-DB0, IRQ, /RES, CNT, SP, TOD) and comprehensive timing characteristics for 1MHz and 2MHz operation referenced to the 02 clock (02 cycle times, write/read cycle timing parameters, data access/release times, and measurement notes: Tacc, Tco, Twcs).

## Interface signals (concise, technical)

- 02 Clock Input
  - TTL compatible input used for internal device operation and as the timing reference for communication with the system data bus (referred to as "02" in timing parameters).

- /CS — Chip Select Input
  - Active low. When /CS is low while 02 is high, the 6526 responds to R/W and address (RS3-RS0) lines. When /CS is high these lines do not control the device. /CS is normally asserted (low) at 02 by the system address decoding.

- R/W — Read/Write Input
  - Driven by the CPU. High = read (data out of 6526). Low = write (data into 6526).

- RS3–RS0 — Address Inputs
  - Select internal registers per the Register Map (register map not included here). These are sampled for register selection during bus cycles.

- DB7–DB0 — Data Bus I/O
  - 8-bit bidirectional data pins. High-impedance except when /CS is low and R/W and 02 are high to perform a read; during that read the data output buffers are enabled to drive the system bus.

- IRQ — Interrupt Request Output
  - Open-drain output. Normally off (high impedance). Active low when asserting an interrupt. External pull-up required; multiple IRQ outputs may be tied together.

- /RES — Reset Input
  - Active low. Resets internal registers: port pins set as inputs and port registers cleared to zero (reads of port pins will return highs because of passive pull-ups). Timer control registers cleared to zero, timer latches set to all ones, all other registers reset to zero.

- Other pins mentioned (CNT, SP, TOD)
  - CNT (count input), SP (serial port), TOD (time-of-day) — functional pins on the 6526 used by corresponding internal features. (Only named here; register/function details are in the Register Map.)

## Measurement notes and definitions (from source)

- All timings are referenced to Vil max and Vih min on inputs and Vol max and Voh min on outputs.
- Twcs (write/read) is measured from the later of 02 high or /CS low. /CS must remain low at least until the end of 02 high.
- Tco is measured from the later of 02 high or /CS low. Valid data is available only after the later of Tacc or Tco.
- Units in the timing tables are nanoseconds (ns).

## Source Code
```text
6526 TIMING CHARACTERISTICS

+--------+-----------------------+---------------+---------------+------+
|        |                       |      1MHz     |      2MHz     |      |
|        |                       +-------+-------+-------+-------+      |
| Symbol |    Characteristic     |  MIN  |  MAX  |  MIN  |  MAX  | Unit |
+--------+-----------------------+-------+-------+-------+-------+------+
|        | 02 CLOCK              |       |       |       |       |      |
| Tcyc   | Cycle Time            |  1000 |20,000 |   500 |20,000 |  ns  |
| Tr, Tf | Rise and Fall Time    |   -   |    25 |   -   |    25 |  ns  |
| Tchw   | Clock Pulse Width     |       |       |       |       |      |
|        |   (High)              |   420 |10,000 |   200 |10,000 |  ns  |
| Tclw   | Clock Pulse Width     |       |       |       |       |      |
|        |   (Low)               |   420 |10,000 |   200 |10,000 |  ns  |
+--------+-----------------------+-------+-------+-------+-------+------+
|        | WRITE CYCLE           |       |       |       |       |      |
| Tpd    | Output Delay From 02  |    -  |  1000 |   -   |   500 |  ns  |
| Twcs   | /CS low while 02 high |   420 |   -   |   200 |   -   |  ns  |
| Tads   | Address Setup Time    |     0 |   -   |     0 |   -   |  ns  |
| Tadh   | Address Hold Time     |    10 |   -   |     5 |   -   |  ns  |
| Trws   | R/W Setup Time        |     0 |   -   |     0 |   -   |  ns  |
| Trwh   | R/W Hold Time         |     0 |   -   |     0 |   -   |  ns  |
| Tds    | Data Bus Setup Time   |   150 |   -   |    75 |   -   |  ns  |
| Tdh    | Data Bus Hold Time    |     0 |   -   |     0 |   -   |  ns  |
+--------+-----------------------+-------+-------+-------+-------+------+
|        | READ CYCLE            |       |       |       |       |      |
| Tps    | Port Setup Time       |   300 |   -   |   150 |   -   |  ns  |
| Twcs(2)| /CS low while 02 high |   420 |   -   |    20 |   -   |  ns  |
| Tads   | Address Setup Time    |     0 |   -   |     0 |   -   |  ns  |
| Tadh   | Address Hold Time     |    10 |   -   |     5 |   -   |  ns  |
| Trws   | R/W Setup Time        |     0 |   -   |     0 |   -   |  ns  |
| Trwh   | R/W Hold Time         |     0 |   -   |     0 |   -   |  ns  |
+--------+-----------------------+-------+-------+-------+-------+------+
| Tacc   | Data Access from      |       |       |       |       |  ns  |
|        | RS3-RS0               |   -   |   550 |   -   |   275 |  ns  |
| Tco(3) | Data Access from /CS  |   -   |   320 |   -   |   150 |  ns  |
| Tdr    | Data Release Time     |    50 |   -   |    25 |   -   |  ns  |
+--------+-----------------------+-------+-------+-------+-------+------+

NOTES:
1 - All timings are referenced from Vil max and Vih min on inputs and Vol max and Voh min on outputs.
2 - Twcs is measured from the later of 02 high or /CS low. /CS must be low at least until the end of 02 high.
3 - Tco is measured from the later of 02 high or /CS low. Valid data is available only after the later of Tacc or Tco.
```

## References
- "6526_timing_diagrams_and_interface_overview" — expands on timing diagram placeholders related to these timing parameters
- "6526_register_map_and_functional_description" — expands on register map and functional descriptions addressed by these signals
