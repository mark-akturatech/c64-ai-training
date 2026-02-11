# SID Voice 1 — TEST (Bit 3)

**Summary:** TEST bit (bit 3) in the SID Voice 1 control register ($D404) forces Oscillator 1 to reset and lock at zero, resets the Noise output, and holds the Pulse output at a DC level; mask $08. Used for testing or synchronizing Oscillator 1 to external events for real‑time waveform control.

## Behavior and use
- Location: TEST is bit 3 of the Voice 1 Control Register (SID base $D400, control register $D404).
- Binary/mask: bit 3 = %00001000, mask $08.
- Effect when set:
  - Oscillator 1 (voice 1) is reset and held at zero phase until the TEST bit is cleared.
  - The Noise waveform output produced by Oscillator 1 is reset.
  - The Pulse waveform output from Oscillator 1 is held at a DC level (the pulse generator does not toggle).
- Typical uses:
  - Hardware/firmware testing of voice output and signal routing.
  - Synchronization: can lock Oscillator 1 to an external event so software can advance or release it to produce complex, real-time controlled waveforms.
- Interaction notes:
  - TEST affects waveform outputs selected by the waveform bits (triangle/triangle‑dependent features, pulse, noise); see referenced waveform-selection documentation for details.
  - Related to ring modulation behavior (Bit 2) when triangle waveform selection is involved — see ring_mod_bit reference.

## Key Registers
- $D400-$D406 - SID - Voice 1 (Frequency Lo/Hi, Pulse Width Lo/Hi, Control (TEST = bit 3), Attack/Decay, Sustain/Release)

## References
- "ring_mod_bit" — expands on RING MOD (Bit 2) and triangle waveform interactions
- "waveform_selection_bits_and_output_behavior" — expands on Waveform outputs (Bits 4-7) and how TEST affects them

## Labels
- TEST
