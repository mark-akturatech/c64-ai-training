# SID Combined Waveforms (6581 vs 8580)

**Summary:** Combined waveform bits in the SID control registers produce a logical AND of selected waveforms; behavior differs between SID chip variants 6581 and 8580 ($D400-$D414 voice registers, control bytes at +4). Common masks: $30, $50, $60; avoid mixing Noise (locks LFSR).

## Description
- Setting multiple waveform bits in a voice control register produces a logical AND of the selected waveforms (i.e., output is the bitwise intersection of each waveform's output).
- 6581 behavior: Combined waveforms produce unique timbres (commonly metallic or bell-like). Triangle+Sawtooth is a widely used combination for soft metallic tones.
- 8580 behavior: Combined waveforms are much quieter than on the 6581 and some combinations may yield near silence depending on the mix.
- Common combinations (control-register byte masks as reported):
  - Triangle + Sawtooth — $30 : Soft, slightly metallic tone (6581)
  - Triangle + Pulse   — $50 : Mixed character
  - Sawtooth + Pulse   — $60 : Bright, edgy tone
- Avoid combining Noise with other waveform bits: mixing Noise with other waveforms can lock the SID’s LFSR (linear-feedback shift register), producing undesired or stuck noise behavior.

## Source Code
(omitted — no assembly/BASIC/register-map blocks in source)

## Key Registers
- $D400-$D414 - SID - Voice registers (three voices). Each voice's control register is at offset +4 within its 7-byte block (waveform bits set here; combined-waveform behavior described above).

## References
- "chip_variants_6581_8580" — expands on different combined waveform behavior on 6581 vs 8580
- "known_quirks" — expands on combined waveform differences and pitfalls