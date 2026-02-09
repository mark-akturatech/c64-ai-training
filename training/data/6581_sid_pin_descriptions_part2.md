# 6581 SID — Pins: D0–D7, POTX/POTY, VCC, EXT IN, AUDIO OUT, VDD

**Summary:** Describes 6581 SID physical-pin behavior: bidirectional data bus D0–D7 (Pins 15–22), POTX/POTY A/D timing and recommended R/C (R=470 kΩ, C=1000 pF), VCC/VDD bypass recommendations, EXT IN analog input impedance and coupling, and AUDIO OUT levels and recommended coupling/resistor.

## D0–D7 (Pins 15–22)
- Bidirectional TTL-compatible data bus between SID and CPU.
- In input mode (typical during Write), SID data buffers are high-impedance and the microprocessor drives the lines.
- In output mode (Read), SID enables its data buffers and can drive up to two TTL loads.
- Pins are normally tied directly to the microprocessor data lines.

## POTX, POTY (Pins 24, 23)
- Inputs to the internal A/D converters that digitize potentiometer positions.
- Conversion is based on the RC time constant of a capacitor from the POT pin to ground charged via the potentiometer to +5 V.
- Design equation (time constant target):
  RC = 4.7E-4 (seconds)
- Recommended component values:
  - R (maximum pot resistance) = 470 kΩ
  - C = 1000 pF (1 nF)
- Use separate potentiometer and capacitor for each POT pin.
- Larger C reduces POT-value jitter.

## VCC (Pin 25)
- Provide a dedicated +5 VDC trace to SID VCC to minimize noise (separate from general board power).
- Place a bypass capacitor close to the VCC pin.

## EXT IN (Pin 26)
- Analog input for external audio to be mixed with SID audio or processed through the filter.
- Input impedance ≈ 100 kΩ.
- DC operating point for signals applied directly to the pin: 6 V.
- Maximum recommended signal amplitude: 3 V peak-to-peak.
- Recommended coupling: AC-couple external sources with an electrolytic capacitor in the 1–10 µF range to prevent DC-level interference.
- With FILTEX = 0 (direct path unity gain), EXT IN may be used to mix outputs from multiple SID chips by daisy-chaining; practical limit depends on allowable noise/distortion.
- Note: the SID output Volume control affects both internal voices and external inputs.

## AUDIO OUT (Pin 27)
- Final audio output combining the three voices, filter, and any EXT IN contribution.
- Output characteristics:
  - Maximum amplitude: approximately 2 V peak-to-peak
  - DC level: approximately 6 V
- A source resistor from AUDIO OUT to ground is required for proper operation; recommended value: 1 kΩ (provides standard output impedance).
- AC-couple to downstream audio amplifiers with an electrolytic capacitor in the 1–10 µF range.

## VDD (Pin 28)
- Provide a dedicated +12 VDC trace to SID VDD and use a bypass capacitor close to the pin to minimize noise.

## References
- "6581_sid_pin_descriptions_part1" — complements pin descriptions (CAP, RES, other pin functions)
- "6581_sid_characteristics_and_electrical_tables" — absolute maximum ratings and electrical characteristics