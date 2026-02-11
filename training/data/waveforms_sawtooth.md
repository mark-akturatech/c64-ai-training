# SAWTOOTH (SID 6581/8580)

**Summary:** Sawtooth waveform for the SID (6581/8580): a linear-rise/instant-drop ramp containing all harmonics (odd and even) with amplitudes proportional to 1/n; selected via each voice's control (waveform) bits in the SID control registers ($D404, $D407, $D40E).

## Description
- Time-domain shape: linear ramp that rises linearly and then drops sharply to start a new cycle.
- Spectral content: contains all harmonics (both odd and even). Harmonic amplitude ∝ 1/n (n = harmonic number).
- Timbre: very bright, buzzy, "brassy" tone; the richest harmonic content among common periodic waveforms.
- Typical uses: brass, strings, pads, and any patch requiring strong high-frequency content.
- Implementation note: each SID voice has a Control register containing waveform-select bits; the sawtooth is one of the selectable waveforms. See voice control/register documentation for exact bit encoding.

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency, pulse width, control/waveform, attack/decay, sustain/release)
- $D407-$D40D - SID - Voice 2 registers (frequency, pulse width, control/waveform, attack/decay, sustain/release)
- $D40E-$D414 - SID - Voice 3 registers (frequency, pulse width, control/waveform, attack/decay, sustain/release)
- $D415-$D418 - SID - Filter and global control registers

## References
- "voice1_registers" — expands on the control register bit that selects sawtooth (voice control mapping)
- "combined_waveforms" — discusses combining sawtooth with triangle/pulse for timbral variation