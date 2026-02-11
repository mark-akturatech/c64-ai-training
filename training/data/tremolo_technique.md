# Tremolo (Amplitude Modulation) via SID Voice 3 LFO

**Summary:** Use SID (6581/8580) Voice 3 as a low-frequency triangle LFO and read $D41B to obtain the modulation value; apply that value to master volume ($D418) or a voice's sustain level to produce tremolo (amplitude modulation).

## Technique
Configure SID Voice 3 as a low-frequency triangle oscillator and prevent it from producing audible output (mute it). Continuously read the SID read-only modulator value at $D41B and use that byte to adjust amplitude parameters in real time:
- Set Voice 3 frequency very low and select triangle waveform (voice kept inaudible so it acts purely as an LFO).
- Poll/read $D41B each frame (or at desired update rate) to get the current LFO value (read-only).
- Scale or map the read value to the desired amplitude control:
  - write scaled value to the master volume register to modulate overall output level, or
  - modify the target voice's sustain level (ADSR sustain) to vary that voice's amplitude over time.

(Example single-instruction read in prose: use LDA $D41B to fetch the current modulator byte.)

## Key Registers
- $D40E-$D414 - SID - Voice 3 registers (frequency, pulse-width, control, ADSR)
- $D415-$D418 - SID - Filter and global control (master volume is at $D418)
- $D41B - SID - Read-only modulator / LFO value (used as tremolo source)

## References
- "vibrato_technique" — similar setup but modulates frequency instead of amplitude
- "read_only_registers" — details on reading $D41B and other read-only SID registers
