# SID Voice 1 — Waveform select bits (Bits 4-7)

**Summary:** Waveform select bits (Bits 4–7) in the Voice 1 control register determine which SID waveform(s) are routed from Oscillator 1: Triangle, Sawtooth, Pulse, and Noise. Final audible amplitude is governed by the Envelope Generator (GATE/ADSR); deselecting waveforms is not required to silence the voice.

## Waveform select bits (Bits 4-7)
(Bit 4) Triangle
- When Bit 4 = 1 the Triangle waveform of Oscillator 1 is selected.
- Character: low in harmonics, mellow / flute-like.

(Bit 5) Sawtooth
- When Bit 5 = 1 the Sawtooth waveform of Oscillator 1 is selected.
- Character: rich in even and odd harmonics, bright / brassy.

(Bit 6) Pulse
- When Bit 6 = 1 the Pulse waveform of Oscillator 1 is selected.
- Harmonic content is adjusted by the Pulse Width registers (Pulse Width low/high); pulse-width modulation (sweeping PW) produces phasing/motion. Rapid changes in pulse width produce shifting harmonic sequences.

(Bit 7) Noise
- When Bit 7 = 1 the Noise waveform of Oscillator 1 is selected.
- Noise is a random signal updated at Oscillator 1 frequency; varying Oscillator 1 frequency changes noise timbre from low rumble to high hiss. Useful for explosions, percussion, wind, surf and other unpitched effects; sweeping frequency with Noise creates rushing effects.

Final output amplitude
- At least one waveform must be selected for Oscillator 1 to be audible, but clearing waveform bits is not required to silence Voice 1.
- The final output amplitude of Voice 1 is controlled solely by the Envelope Generator (ADSR / GATE).

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (Frequency low/high, Pulse Width low/high, Control register $D404 with waveform bits 4–7, Attack/Decay $D405, Sustain/Release $D406)

## References
- "pw_lo_hi_registers" — details on Pulse Width low/high registers and pulse-width behavior  
- "control_register_overview_and_gate" — overview of Control register bits (including GATE) and Envelope Generator control