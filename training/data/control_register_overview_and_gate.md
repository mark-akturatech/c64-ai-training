# SID Control Register (Voice 1) — Register 04 (GATE, Bit 0)

**Summary:** SID Control Register for Voice 1 at $D404 (register offset 04) — GATE (Bit 0) controls the Voice 1 Envelope Generator (start ATTACK/DECAY/SUSTAIN vs start RELEASE); envelope output gates oscillator amplitude and must be set for audible output.

**Register Overview**

This control register contains eight control bits selecting options for Oscillator (Voice) 1. Bit 0 is the GATE bit which directly controls the Voice 1 Envelope Generator:

- **GATE (Bit 0):** Writing a 1 gates (triggers) the Envelope Generator and initiates the ATTACK → DECAY → SUSTAIN cycle. Writing a 0 releases the envelope and begins the RELEASE cycle. The Envelope Generator modulates the amplitude of Oscillator 1 at the audio output; therefore, the GATE bit must be set (and appropriate envelope parameters selected) for the oscillator output to be audible.

- **SYNC (Bit 1):** When set to 1, synchronizes Oscillator 1 with Oscillator 3, resetting Oscillator 1's phase to match Oscillator 3's phase.

- **RING MOD (Bit 2):** When set to 1, enables ring modulation of Oscillator 1 with Oscillator 3, producing complex waveforms.

- **TEST (Bit 3):** When set to 1, resets Oscillator 1, forcing its output to 0.

- **Waveform Selection (Bits 4–7):** These bits select the waveform for Oscillator 1:

  - **Bit 4 (NOISE):** When set to 1, selects the noise waveform.

  - **Bit 5 (PULSE):** When set to 1, selects the pulse waveform.

  - **Bit 6 (SAWTOOTH):** When set to 1, selects the sawtooth waveform.

  - **Bit 7 (TRIANGLE):** When set to 1, selects the triangle waveform.

  Note: Multiple waveform bits can be set simultaneously to combine waveforms, though not all combinations produce useful results.

**Envelope Generator**

The Envelope Generator shapes the amplitude of the sound over time using four parameters:

- **ATTACK:** Time taken for the amplitude to rise from 0 to maximum.

- **DECAY:** Time taken for the amplitude to decrease from maximum to the sustain level.

- **SUSTAIN:** The amplitude level maintained after decay until the key is released.

- **RELEASE:** Time taken for the amplitude to fall from the sustain level to 0 after the key is released.

These parameters are controlled by the following registers:

- **Attack/Decay Register ($D405):**

  - **Bits 4–7:** Attack rate (0–15).

  - **Bits 0–3:** Decay rate (0–15).

- **Sustain/Release Register ($D406):**

  - **Bits 4–7:** Sustain level (0–15).

  - **Bits 0–3:** Release rate (0–15).

Each rate value corresponds to a specific time duration, and each level value corresponds to a specific amplitude level. Refer to the SID datasheet for exact timing and level values.

## Source Code

```text
Register: Control Register (Register 04 for Oscillator 1)

This register contains eight control bits which select various options
on Oscillator 1.

Bit 0: GATE
  - 1: Triggers the Envelope Generator (initiates ATTACK/DECAY/SUSTAIN cycle).
  - 0: Starts the RELEASE cycle.

Bit 1: SYNC
  - 1: Synchronizes Oscillator 1 with Oscillator 3.

Bit 2: RING MOD
  - 1: Enables ring modulation with Oscillator 3.

Bit 3: TEST
  - 1: Resets Oscillator 1.

Bits 4–7: Waveform Selection
  - Bit 4: NOISE
  - Bit 5: PULSE
  - Bit 6: SAWTOOTH
  - Bit 7: TRIANGLE
  - Multiple bits can be set simultaneously to combine waveforms.
```

## Key Registers

- **$D400–$D406:** SID Voice 1 registers (frequency, pulse width, control register $D404, Attack/Decay, Sustain/Release).

- **$D404:** SID Voice 1 Control Register (GATE = Bit 0).

## References

- "control_register_header" — expands on Control register heading.

- "sync_bit" — expands on SYNC (Bit 1) — oscillator synchronization.

- "waveform_selection_bits_and_output_behavior" — expands on Waveform selection and final output amplitude behavior.