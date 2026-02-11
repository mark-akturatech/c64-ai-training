# $D415-$D418 — SID Filter Controls

**Summary:** Registers $D415-$D418 in the SID chip control the filter's cutoff frequency, resonance, and routing of internal voices and external audio through the filter. The cutoff frequency is an 11-bit value (0–2047) formed from a high byte and 3 low bits, with the approximate frequency in Hz calculated as: FREQUENCY = (REGISTER_VALUE * 5.8) + 30.

**Filter Overview**

The SID provides configurable filtering for its internal voices and an external audio input. Available filter types include:

- **Low-pass:** Attenuates frequencies above the cutoff (≈12 dB/octave).
- **High-pass:** Attenuates frequencies below the cutoff (≈12 dB/octave).
- **Band-pass:** Emphasizes frequencies near the cutoff (≈6 dB/octave attenuation on the sides).
- **Notch (reject):** Formed by combining low- and high-pass to reduce frequencies near the cutoff.

Resonance (Q) increases the level of frequency components near the cutoff, producing a peak at or near the cutoff frequency.

Cutoff frequency range and calculation:

- Cutoff is an 11-bit value: 0–2047.
- The 11 bits are composed of an 8-bit high byte and 3 low bits (low 3 bits stored separately).
- Compute the combined register value as: REGISTER_VALUE = (HighByte * 8) + (Low3Bits).
- Approximate frequency (Hz): FREQUENCY = (REGISTER_VALUE * 5.8) + 30.
- The mapped audible range runs from about 30 Hz up to ≈12,000 Hz.

Routing:

- Any one, any combination, or all three internal voices may be routed through the filter.
- An external signal can be routed into the SID filter via the monitor jack (pin 5).

**Register Bit Assignments**

The SID filter controls are mapped to the following registers:

- **$D415 (Cutoff Frequency Low):** Bits 2–0 hold the low 3 bits of the 11-bit cutoff frequency value.
- **$D416 (Cutoff Frequency High):** Bits 7–0 hold the high 8 bits of the 11-bit cutoff frequency value.
- **$D417 (Resonance and Routing):**
  - Bits 7–4: Resonance control (0000 = minimum, 1111 = maximum).
  - Bits 3–0: Voice filter routing.
    - Bit 3: Voice 3 filter enable (1 = enabled).
    - Bit 2: Voice 2 filter enable (1 = enabled).
    - Bit 1: Voice 1 filter enable (1 = enabled).
    - Bit 0: External input filter enable (1 = enabled).
- **$D418 (Mode and Volume):**
  - Bits 7–4: Filter mode selection.
    - Bit 7: Notch filter enable (1 = enabled).
    - Bit 6: Band-pass filter enable (1 = enabled).
    - Bit 5: High-pass filter enable (1 = enabled).
    - Bit 4: Low-pass filter enable (1 = enabled).
  - Bit 3: Filter enable (1 = filter active).
  - Bit 2: Mute voice 3 (1 = muted).
  - Bits 1–0: Master volume control (00 = minimum, 11 = maximum).

## Key Registers

- **$D415-$D418:** SID Filter Controls.

## References

- "Commodore 64 Programmer's Reference Guide" — Detailed information on SID registers and programming.
- "MOS 6581 SID Datasheet" — Technical specifications and register descriptions.

## Labels
- D415
- D416
- D417
- D418
