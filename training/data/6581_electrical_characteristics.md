# 6581 SID — Electrical characteristics (Vdd=12 V ±5%, Vcc=5 V ±5%, Ta=0–70 °C)

**Summary:** Electrical-characteristics table for the MOS 6581 SID: input thresholds (Vih, Vil), input leakage and three-state leakage (Iin, Itsi), output levels/currents (Voh, Vol, Ioh, Iol), input capacitance (Cin), POT trigger/sink (Vpot, Ipot), EXT IN impedance and audio input DC/AC limits, AUDIO OUT DC/AC levels, power-supply currents (Idd, Icc) and total power dissipation (Pd).

## Overview
Conditions: Vdd = 12 VDC ±5%, Vcc = 5 VDC ±5%, ambient temperature Ta = 0–70 °C.  
Measurements reference the SID pin groups named in the source (RES, φ2, R/W, CS, A0–A4, D0–D7, POTX/POTY, EXT IN, AUDIO OUT). The full tabulated min/typ/max values and measurement notes are provided in the Source Code section below.

Key typical values (from the table):
- AUDIO OUT DC bias: ≈ 6.0 VDC (typical)
- AUDIO OUT AC level (1 kΩ load, volume max): one voice ≈ 0.5 VAC typ; all voices ≈ 1.5 VAC typ
- EXT IN input impedance: 100–150 kΩ
- POT sink current (POTX, POTY): 500 µA
- Power supply currents: Idd (VDD) ≈ 20 mA typ; Icc (VCC) ≈ 70 mA typ
- Total power dissipation: Pd ≈ 600 mW typical

## Source Code
```text
ELECTRICAL CHARACTERISTICS (Vdd=12 VDC ±5%, Vcc=5 VDC ±5%, Ta=0 to 70 °C)

+---------------------------------------------------------------------------------------------+
| CHARACTERISTIC                                         SYMBOL   MIN   TYP   MAX    UNITS     |
+---------------------------------------------------------------------------------------------+
| Input High Voltage (RES, φ2, R/W, CS, A0-A4, D0-D7)  Vih      2     -     Vcc    VDC      |
| Input Low Voltage  (A0-A4, D0-D7)                     Vil     -0.3   -     0.8    VDC      |
+---------------------------------------------------------------------------------------------+
| Input Leakage Current (RES, φ2, R/W, CS, A0-A4;      Iin      -     -     2.5    µA       |
| Vin = 0–5 VDC)                                                                         |
| Three-State (Off) (D0-D7; Vcc = max)                    Itsi   -     -     10     µA       |
+---------------------------------------------------------------------------------------------+
| (row header: "Input Leakage Current Vin=0.4–2.4 VDC")  (no numeric entries in source)            |
+---------------------------------------------------------------------------------------------+
| Output High Voltage (D0-D7; Vcc = min, Iload=200 µA)  Voh     2.4   -   Vcc-0.7  VDC     |
| Output Low Voltage  (D0-D7; Vcc = max, Iload=3.2 mA)  Vol     GND   -     0.4    VDC     |
+---------------------------------------------------------------------------------------------+
| Output High Current (D0-D7; sourcing, Voh = 2.4 VDC)  Ioh     200   -      -     µA      |
| Output Low Current  (D0-D7; sinking, Vol = 0.4 VDC)   Iol     3.2   -      -     mA      |
+---------------------------------------------------------------------------------------------+
| Input Capacitance (RES, φ2, R/W, CS, A0-A4, D0-D7)    Cin     -     -     10     pF      |
+---------------------------------------------------------------------------------------------+
| Pot Trigger Voltage (POTX, POTY)                      Vpot    -    Vcc/2   -     VDC     |
| Pot Sink Current (POTX, POTY)                         Ipot   500    -      -     µA      |
+---------------------------------------------------------------------------------------------+
| Input Impedance (EXT IN)                              Rin    100   150     -    kohms    |
+---------------------------------------------------------------------------------------------+
| Audio Input Voltage (EXT IN)                          Vin    5.7    6    6.3   VDC      |
|                                                       (AC)    -    0.5    3    VAC      |
+---------------------------------------------------------------------------------------------+
| Audio Output Voltage (AUDIO OUT; 1 kΩ load, volume=max) Vout 5.7    6    6.3   VDC    |
|   One Voice on:                                       (AC)   0.4   0.5   0.6   VAC     |
|   All Voices on:                                      (AC)   1.0   1.5   2.0   VAC     |
+---------------------------------------------------------------------------------------------+
| Power Supply Current (VDD)                            Idd     -    20    25    mA      |
| Power Supply Current (VCC)                            Icc     -    70   100    mA      |
| Power Dissipation (Total)                             Pd      -   600  1000    mW      |
+---------------------------------------------------------------------------------------------+
```

## References
- "sid_pin_descriptions_pins_25_28" — expands on Pin-level usage (EXT IN, AUDIO OUT) and recommended coupling/resistors  
- "6581_absolute_maximum_ratings" — expands on Absolute maximum voltages and temperatures