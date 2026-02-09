# MOS 6526 (CIA) — Electrical Characteristics (Vcc ±5%, Vss=0V, Ta=0–70°C)

**Summary:** Tabulated electrical characteristics for the MOS 6526 Complex Interface Adapter (CIA) including Vih/Vil, input leakage (Iin), port input pull-up resistance (Rpi), high‑Z output leakage (Itsi), Voh/Vol with test conditions and affected pins (PAx, PBx, D0–D7, /PC, etc.), output currents (Ioh/Iol), input/output capacitances (Cin/Cout), and power supply current (Icc).

## Overview
This chunk reproduces the chip electrical specification table(s) for the 6526 CIA under the stated conditions (Vcc ±5%, Vss = 0V, ambient 0–70°C). Pin names referenced (PA0–PA7, PB0–PB7, D0–D7, SP, CNT, /IRQ, /PC) are the 6526 package pins; values include MIN, TYP, MAX and units, plus test conditions as shown in the source tables.

## Source Code
```text
ELECTRICAL CHARACTERISTICS (Vcc +-5%, Vss=0V, Ta=0-70 Celsius)

+-------------------------------+--------+-------+-------+-------+------+
| CHARACTERISTIC                | SYMBOL | MIN.  | TYP.  | MAX.  | UNIT |
+-------------------------------+--------+-------+-------+-------+------+
| Input High Voltage            |  Vih   | +2.4  |   -   |  Vcc  |   V  |
+-------------------------------+--------+-------+-------+-------+------+
| Input Low Voltage             |  Vil   | -0.3  |   -   |   -   |   V  |
+-------------------------------+--------+-------+-------+-------+------+
| Input Leakage Current;        |  Iin   |   -   |  1.0  |  2.5  |  uA  |
| Vin=Vss+5V                    |        |       |       |       |      |
| (TOD, R/W, /FLAG, 02,         |        |       |       |       |      |
| /RES, RS0-RS3, /CS)           |        |       |       |       |      |
+-------------------------------+--------+-------+-------+-------+------+

+-------------------------------+--------+-------+-------+-------+------+
| CHARACTERISTIC                | SYMBOL | MIN.  | TYP.  | MAX.  | UNIT |
+-------------------------------+--------+-------+-------+-------+------+
| Port Input Pull-up Resistance |  Rpi   |  3.1  |  5.0  |   -   | kohms|
+-------------------------------+--------+-------+-------+-------+------+
| Output Leakage Current for    |  Itsi  |   -   |+-1.0  |+-10.0 |  uA  |
| High Impedance State (Three   |        |       |       |       |      |
| State); Vin=4V to 2.4V;       |        |       |       |       |      |
| (D0-D7, SP, CNT, /IRQ)        |        |       |       |       |      |
+-------------------------------+--------+-------+-------+-------+------+
| Output High Voltage           |  Voh   | +2.4  |   -   |  Vcc  |   V  |
| Vcc=MIN, Iload <              |        |       |       |       |      |
| -200uA (PA0-PA7, /PC,         |        |       |       |       |      |
| PB0-PB7, D0-D7)               |        |       |       |       |      |
+-------------------------------+--------+-------+-------+-------+------+
| Output Low Voltage            |  Vol   |   -   |   -   | +0.40 |   V  |
| Vcc=MIN, Iload < 3.2 mA       |        |       |       |       |      |
+-------------------------------+--------+-------+-------+-------+------+
| Output High Current (Sourcing)|  Ioh   | -200  | -1000 |   -   |  uA  |
| Voh > 2.4V (PA0-PA7,          |        |       |       |       |      |
| PB0-PB7, /PC, D0-D7           |        |       |       |       |      |
+-------------------------------+--------+-------+-------+-------+------+
| Output Low Current (Sinking); |  Iol   |  3.2  |   -   |   -   |  mA  |
| Vol <  .4V (PA0-PA7, /PC,     |        |       |       |       |      |
| PB0-PB7, D0-D7                |        |       |       |       |      |
+-------------------------------+--------+-------+-------+-------+------+
| Input Capacitance             |  Cin   |   -   |    7  |   10  |  pf  |
+-------------------------------+--------+-------+-------+-------+------+
| Output Capacitance            |  Cout  |   -   |    7  |   10  |  pf  |
+-------------------------------+--------+-------+-------+-------+------+
| Power Supply Current          |  Icc   |   -   |   70  |  100  |  mA  |
+-------------------------------+--------+-------+-------+-------+------+
```

## References
- "6526_maximum_ratings_and_protection_comment" — expands on maximum ratings and comments about absolute maximums
- "6526_block_diagram_placeholder" — related block diagram placeholder for overall device context