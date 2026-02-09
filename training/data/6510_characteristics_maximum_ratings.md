# 6510 CHARACTERISTICS

**Summary:** 6510 (MOS 6502-family CPU variant) electrical and absolute-maximum ratings: VCC/Vin limits, operating and storage temperature ranges, input protection note, DC electrical characteristics at VCC=5.0V ±5% VSS=0, Ta=0–+70°C including input high/low thresholds (/RES, P0–P7, /IRQ, Data, pins 01/02), input leakage and three-state currents, output high/low levels, power supply current (Icc), and input/output capacitances (Cin/Cout, C01/C02).

## Maximum Ratings
Maximum absolute ratings for the 6510 supply, inputs and temperature. Device contains input protection against high static voltages or fields, but voltages above maximum ratings must be avoided.

- Supply voltage (Vcc): -0.3 to +7.0 VDC
- Input voltage (Vin): -0.3 to +7.0 VDC
- Operating temperature (Ta): 0 to +70 °C
- Storage temperature (Tstg): -55 to +150 °C

Note: This device contains input protection against damage due to high static voltages or electric fields; however, precautions should be taken to avoid application of voltages higher than the maximum rating.

## Electrical characteristics (conditions)
DC characteristics measured with VCC = 5.0 V ±5% (nominal 5.0 V), VSS = 0, ambient Ta = 0 to +70 °C unless otherwise noted.

Key DC items (see Source Code for full tabulated values):
- Input High Voltage (Vih)
  - pins 01, 02 (inputs): Vih min = VCC - 0.2 V; max = VCC + 1.0 V
  - /RES, P0–P7, /IRQ, Data: Vih min = VSS + 2.0 V (no specified max)
- Input Low Voltage (Vil)
  - pins 01, 02 (inputs): Vil min = VSS - 0.3 V; Vil max = VSS + 0.2 V
  - /RES, P0–P7, /IRQ, Data: Vil max = VSS + 0.8 V (no specified min)
- Input leakage currents (Vin = 0 to 5.25 V, VCC = 5.25 V)
  - Logic inputs: Iin max = 2.5 µA
  - pins 01, 02 (inputs): Iin max = 100 µA
- Three-state (off-state) input current (Vin = 0.4 to 2.4 V, VCC = 5.25 V)
  - Data lines (itsi) max = 10 µA
- Output high voltage (Voh) (Ioh = -100 µA, VCC = 4.75 V)
  - Data, A0–A15, R/W, P0–P7: Voh min = VSS + 2.4 V
- Output low voltage (Vol) (Iol = 1.6 mA, VCC = 4.75 V)
  - Data, A0–A15, R/W, P0–P7: Vol max = VSS + 0.4 V
- Power supply current (Icc) typical = 125 mA
- Capacitances (Vin = 0, Ta = 25 °C, f = 1 MHz)
  - Logic, P0–P7 Cin max = 10 pF
  - Data Cin max = 15 pF
  - A0–A15, R/W Cout max = 12 pF
  - 01: C01 typ = 30 pF, max = 50 pF
  - 02: C02 typ = 50 pF, max = 80 pF

## Source Code
```text
6510 CHARACTERISTICS

MAXIMUM RATINGS
+--------------------------+------------+-----------------+-------------+
|          RATING          |   SYMBOL   |      VALUE      |    UNIT     |
+--------------------------+------------+-----------------+-------------+
|  SUPPLY VOLTAGE          |    Vcc     |   -0.3 to +7.0  |     VDC     |
|  INPUT VOLTAGE           |    Vin     |   -0.3 to +7.0  |     VDC     |
|  OPERATING TEMPERATURE   |    Ta      |    0 to +70     |   Celsius   |
|  STORAGE TEMPERATURE     |    Tstg    |   -55 to +150   |   Celsius   |
+--------------------------+------------+-----------------+-------------+

NOTE: This device contains input protection against damage due to high
static voltages or electric fields; however, precautions should be
taken to avoid application of voltages higher than the maximum rating.

ELECTRICAL CHARACTERISTICS  (VCC=5.0V +-5%, VSS=0, Ta=0 to +70 Celsius)
+------------------------------------+--------+-------+---+-------+-----+
|           CHARACTERISTIC           | SYMBOL |  MIN. |TYP|  MAX. |UNIT |
+------------------------------------+--------+-------+---+-------+-----+
| Input High Voltage                 |        |       |   |       |     |
|   01, 02(in)                       |  Vih   |Vcc-0.2| - |Vcc+1.0| VDC |
| Input High Voltage                 |        |       |   |       |     |
| /RES, P0-P7, /IRQ, Data            |        |Vss+2.0| - |   -   | VDC |
+------------------------------------+--------+-------+---+-------+-----+
| Input Low Voltage                  |        |       |   |       |     |
| 01,02(in)                          |  Vil   |Vss-0.3| - |Vss+0.2| VDC |
| /RES, P0-P7, /IRQ, Data            |        |   -   | - |Vss+0.8| VDC |
+------------------------------------+--------+-------+---+-------+-----+
| Input Leakage Current              |        |       |   |       |     |
|   (Vin=0 to 5.25V, Vcc=5.25V       |        |       |   |       |     |
|   Logic                            |  Iin   |   -   | - |  2.5  |  uA |
|   01, 02(in)                       |        |   -   | - |  100  |  uA |
+------------------------------------+--------+-------+---+-------+-----+
| Three State(Off State)Input Current|        |       |   |       |     |
| (Vin=0.4 to 2.4V, Vcc=5.25V)       |        |       |   |       |     |
|   Data Lines                       |  Itsi  |   -   | - |   10  |  uA |
+------------------------------------+--------+-------+---+-------+-----+
| Output High Voltage                |        |       |   |       |     |
| (Ioh=-100uADC, Vcc=4.75V)          |        |       |   |       |     |
|   Data, A0-A15, R/W, P0-P7         |  Voh   |Vss+2.4| - |   -   | VDC |
+------------------------------------+--------+-------+---+-------+-----+
| Out Low Voltage                    |        |       |   |       |     |
| (Iol=1.6mADC, Vcc=4.75V)           |        |       |   |       |     |
|   Data, A0-A15, R/W, P0-P7         |   Vol  |   -   | - |Vss+0.4| VDC |
+------------------------------------+--------+-------+---+-------+-----+
| Power Supply Current               |   Icc  |   -   |125|       |  mA |
+------------------------------------+--------+-------+---+-------+-----+
| Capacitance                        |   C    |       |   |       |  pF |
| (Vin=0, Ta=25 Celsius, f=1MHz)     |        |       |   |       |     |
|   Logic, P0-P7                     |   Cin  |   -   | - |   10  |     |
|   Data                             |        |   -   | - |   15  |     |
|   A0-A15, R/W                      |   Cout |   -   | - |   12  |     |
|   01                               |   C01  |   -   | 30|   50  |     |
|   02                               |   C02  |   -   | 50|   80  |     |
+------------------------------------+--------+-------+---+-------+-----+
```

## References
- "clock_timing_and_timing_diagrams" — Clock timing section and data/transfer timing diagrams that depend on the electrical characteristics
- "ac_characteristics_and_read_write_timing_tables" — Detailed AC timing values (1 MHz and 2 MHz) that supplement the DC electrical characteristics