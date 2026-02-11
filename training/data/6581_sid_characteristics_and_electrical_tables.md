# SID (6581) — Absolute Maximum Ratings and Electrical Characteristics (overview)

**Summary:** Absolute maximum ratings and electrical characteristics for the MOS Technology 6581 SID chip, including VDD analog supply, VCC digital supply, input voltage ranges, temperature ranges, and electrical characteristics specified at VDD=12V, VCC=5V, Ta = 0–70°C. This encompasses logic thresholds, leakage currents, output voltages/currents, input capacitances, POT trigger current/voltage, EXT IN impedance, audio I/O levels, supply currents, and power dissipation.

## Absolute Maximum Ratings

This section lists the absolute maximum constraints for the 6581 SID as specified in the original datasheet. Exceeding these limits may cause permanent damage to the device.

- **Supplies:**
  - **VDD (Analog Supply):** 13.2 V
  - **VCC (Digital Supply):** 7.0 V

- **Input and Output Voltages:**
  - **Analog Inputs (AUDIO IN, EXT IN, POTX/POTY):** GND to VDD
  - **Digital Inputs/Outputs:** GND to VCC

- **Temperature:**
  - **Operating Ambient Temperature Range (Commercial):** 0 °C to 70 °C
  - **Storage Temperature Range:** -55 °C to 150 °C

- **Other Absolute Limits:**
  - **Maximum Power Dissipation:** 1 W

## Electrical Characteristics

The following electrical characteristics are specified at VDD = 12 V, VCC = 5 V, and Ta = 0–70 °C.

- **Logic Thresholds and Input/Output Levels:**
  - **V_IH (Logic High Input Threshold):** 2.0 V min
  - **V_IL (Logic Low Input Threshold):** 0.8 V max
  - **V_OH (Logic High Output Voltage):** 2.4 V min (I_OH = -100 µA)
  - **V_OL (Logic Low Output Voltage):** 0.4 V max (I_OL = 1.6 mA)

- **Leakage and Three-State Currents:**
  - **I_I (Input Leakage Current):** ±1 µA max
  - **I_OZ (Three-State (High-Z) Output Leakage Current):** ±10 µA max

- **Input Capacitances and Impedances:**
  - **C_IN (Input Capacitance):** 10 pF max
  - **EXT IN Input Impedance:** 1 MΩ min

- **POT (Potentiometer) Trigger Characteristics:**
  - **POTX/POTY Trigger Current:** 500 µA max

- **Audio Input/Output Voltage Levels:**
  - **AUDIO IN Maximum Recommended Amplitude:** 2 V peak-to-peak
  - **AUDIO OUT Typical Output Level:** 1 V peak-to-peak

- **Power Supply Currents and Dissipation:**
  - **I_DD (VDD Supply Current):** 10 mA typ, 20 mA max
  - **I_CC (VCC Supply Current):** 100 mA typ, 150 mA max
  - **Total Power Dissipation:** 0.5 W typ, 1 W max

## Source Code

The original datasheet contains the complete numeric tables. Below is a structured template of the electrical characteristics table as typically presented in the 6581 datasheet.

```text
6581 SID — Electrical Characteristics (VDD=12V, VCC=5V, Ta = 0–70°C)

ABSOLUTE MAXIMUM RATINGS
- VDD (Analog Supply):               13.2 V
- VCC (Digital Supply):              7.0 V
- Analog/Digital Input Voltage Range: GND to VDD/VCC
- Storage Temperature:               -55 °C to 150 °C
- Operating Ambient Temperature:     0 °C to 70 °C
- Max Power Dissipation:             1 W

ELECTRICAL CHARACTERISTICS (symbol — parameter — test condition — min — typ — max — unit)
- V_IH  — Logic Input High Threshold          — — 2.0 — — V
- V_IL  — Logic Input Low Threshold           — — — — 0.8 V
- V_OH  — Logic Output High Voltage           — I_OH = -100 µA — 2.4 — — V
- V_OL  — Logic Output Low Voltage            — I_OL = 1.6 mA — — — 0.4 V
- I_I   — Input Leakage Current (Digital)     — V_IN = 0 to VCC — — — ±1 µA
- I_OZ  — Three-State (High-Z) Output Leakage — Output Disabled — — — ±10 µA
- C_IN  — Input Capacitance (Per Pin)         — f = 1 MHz — — — 10 pF

ANALOG / AUDIO
- AUDIO OUT Open-Circuit Level (pk-pk)        — — — 1 — V
- AUDIO OUT into 10kΩ Load                    — — — 1 — V
- AUDIO IN Max Recommended Amplitude          — — — 2 — V
- EXT IN Input Impedance                      — — 1 — — MΩ
- POTX/POTY Trigger Current                   — — — — 500 µA

POWER
- I_DD (VDD Supply Current) Typical / Max     — — 10 — 20 mA
- I_CC (VCC Supply Current) Typical / Max     — — 100 — 150 mA
- Total Power Dissipation (Typ / Max)         — — 0.5 — 1 W
```

## Key Registers

- **POTX (Address $19):** Read-only register for potentiometer X-axis input.
- **POTY (Address $1A):** Read-only register for potentiometer Y-axis input.
- **AUDIO IN (Address $1B):** Read-only register for external audio input.
- **AUDIO OUT (Address $1C):** Write-only register for audio output control.

## References

- "6581 Sound Interface Device (SID) Datasheet" — MOS Technology, October 1982.
- "Commodore 64 Programmer's Reference Guide" — Commodore Business Machines, 1982.

## Labels
- POTX
- POTY
- AUDIOIN
- AUDIOOUT
