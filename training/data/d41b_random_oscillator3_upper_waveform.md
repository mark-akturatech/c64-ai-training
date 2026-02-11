# SID $D41B — RANDOM / Oscillator 3 MSB

**Summary:** $D41B is the SID read register for Oscillator 3 (upper 8 bits of the waveform output) and can be used as a 0–255 random number source or for modulation of other voices. Related control is Bit 7 of $D418 (Volume & Filter Select) to disconnect voice 3 audio when using the oscillator for modulation.

## Description
This read-only register returns the upper eight bits of Oscillator 3's waveform output. The values returned depend on the waveform selected for Oscillator 3:

- Sawtooth: sequential ramp 0..255, then wrap to 0.
- Triangle: ramps 0..255 then down 255..0 (up/down).
- Pulse: outputs either 255 or 0 (on/off).
- Noise: outputs a pseudo-random sequence of values 0..255.

The rate at which the values change is determined by Oscillator 3's frequency. Uses:
- Random number source for games or effects (noise waveform).
- Modulation source: the register value may be added to or otherwise modulate frequency, filter cutoff, or pulse width of other voices (e.g., vibrato when triangle is used).

Operational notes from the source:
- When using Oscillator 3 for modulation, audio output of voice 3 is normally turned off by setting Bit 7 of the Volume and Filter Select Register ($D418) to 1.
- It is not necessary to gate Bit 0 of Control Register 3 to use the oscillator — Oscillator 3's output (as read from $D41B) is not affected by the ADSR envelope cycle.

## Key Registers
- $D41B - SID - RANDOM: read upper 8 bits of Oscillator 3 waveform output (0–255)
- $D418 - SID - Volume & Filter Select: Bit 7 disconnects voice 3 audio when using Oscillator 3 for modulation

## References
- "d418_sigvol_volume_and_filter_select" — expands on Bit 7 which can disconnect voice 3 output
- "d41c_env3_envelope_generator_3_output" — expands on Envelope output from voice 3 and related modulation information

## Labels
- RANDOM
