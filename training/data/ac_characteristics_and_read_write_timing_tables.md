# Commodore 64 — AC characteristics and read/write timing (1 MHz / 2 MHz)

**Summary:** AC timing tables for the C64 6510 CPU environment: cycle times, clock pulse widths (φ1, φ2), rise/fall times, inter-clock delays, and detailed READ/WRITE timing and data/address setup/hold values (Trws, Tads, Tacc, Tdsu, Thr, Thw, Tmds, Tha, Thrw) plus φ2-related delays (Taew, Tedr, Tdsu, Twe, Tpdw), peripheral data setup (Tpdsu) and Address Enable setup (Taes). Operating conditions: VCC = 5.0 V ±5%, VSS = 0 V, Ta = 0–70 °C.

## AC CHARACTERISTICS — notes
- Tables give numeric timing for two operating modes (Tcyc = 1000 ns → 1 MHz, Tcyc = 500 ns → 2 MHz). Clock pulse widths are measured at VCC − 0.2 V; rise/fall times are measured 0.2 V → VCC − 0.2 V.
- Read/write timing entries include memory/peripheral timing and bus setup/hold windows relevant to the 6510 CPU and C64 bus transactions.
- Timing symbols are listed in the reference tables; see the Source Code section for the complete numerical tables.
- **[Note: Source may contain an error — the text refers to "6508" in some timing rows and "6510" elsewhere; the C64 uses the MOS 6510 CPU.]**

## Source Code
```text
ELECTRICAL CHARACTERISTICS (Vcc=5V ±5%, Vss=0V, Ta=0-70 °C)

CLOCK TIMING                       1 MHz TIMING       2 MHz TIMING
+---------------------------------+------+----+---+---+---+---+---+-----+
| CHARACTERISTIC                  |SYMBOL|MIN.|TYP|MAX|MIN|TYP|MAX|UNITS|
+---------------------------------+------+----+---+---+---+---+---+-----+
| Cycle Time                      | Tcyc |1000| - | - |500| - | - | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Clock Pulse Width 01            |PWH01 | 430| - | - |215| - | - | ns  |
| (Measured at Vcc-0.2V) 02       |PWH02 | 470| - | - |235| - | - | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Fall Time, Rise Time            |      |    |   |   |   |   |   |     |
| (Measured from 0.2V to Vcc-0.2V)|Tf, Tr|  - | - | 25| - | - | 15| ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Delay Time between Clocks       |      |    |   |   |   |   |   |     |
| (Measured at 0.2V)              |  Td  |  0 | - | - | 0 | - | - | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+

READ/WRITE TIMING (LOAD=1TTL)            1 MHz TIMING       2 MHz TIMING
+---------------------------------+------+----+---+---+---+---+---+-----+
| CHARACTERISTIC                  |SYMBOL|MIN.|TYP|MAX|MIN|TYP|MAX|UNITS|
+---------------------------------+------+----+---+---+---+---+---+-----+
| Read/Write Setup Time from 6508 | Trws |  - |100|300| - |100|150| ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Address Setup Time from 6508    | Tads |  - |100|300| - |100|150| ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Memory Read Access Time         | Tacc |  - | - |575| - | - |300| ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Data Stability Time Period      | Tdsu | 100| - | - | 50|   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Data Hold Time-Read             | Thr  |    | - | - |   |   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Data Hold Time-Write            | Thw  |  10| 30| - | 10| 30|   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Data Setup Time from 6510       | Tmds |  - |150|200| - | 75|100| ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Address Hold Time               | Tha  |  10| 30| - | 10| 30|   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| R/W Hold Time                   | Thrw |  10| 30| - | 10| 30|   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+

Delay timings related to φ2 transitions and peripherals
+---------------------------------+------+----+---+---+---+---+---+-----+
| Delay Time, Address valid to    |      |    |   |   |   |   |   |     |
| 02 positive transition          | Taew | 180| - | - |   |   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Delay Time, 02 positive         |      |    |   |   |   |   |   |     |
| transition to Data valid on bus | Tedr |  - | - |395|   |   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Delay Time, data valid to 02    |      |    |   |   |   |   |   |     |
| negative transition             | Tdsu | 300| - | - |   |   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Delay Time, R/W negative        |      |    |   |   |   |   |   |     |
| transition to 02 positive trans.| Twe  | 130| - | - |   |   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Delay Time, 02 negative trans.  |      |    |   |   |   |   |   |     |
| to Peripheral data valid        | Tpdw |  - | - | 1 |   |   |   | us  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Peripheral Data Setup Time      | Tpdsu| 300| - | - |   |   |   | ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
| Address Enable Setup Time       | Taes |    |   | 60|   |   | 60| ns  |
+---------------------------------+------+----+---+---+---+---+---+-----+
```

## References
- "clock_timing_and_timing_diagrams" — graphical timing waveforms corresponding to numeric AC values
- "signal_descriptions" — signal roles and interactions (φ1/φ2, R/W, φ2 transitions)