# Vibrato via Voice 3 oscillator read ($D41B)

**Summary:** Use SID voice 3 as a low-frequency modulation source by configuring Voice 3 (triangle, low F), muting its audio output (bit 7 of $D418), then reading the oscillator output at $D41B each frame and adding a scaled value to a target voice's 16-bit frequency registers to produce vibrato (depth = scaling/division).

## Implementation
1. Configure Voice 3 as the LFO:
   - Set Voice 3 frequency to the desired LFO rate (typical vibrato: 4–7 Hz).
   - Select the triangle waveform on Voice 3 (smooth bipolar waveform).
   - Mute Voice 3's audible output by setting bit 7 of $D418 = 1.

2. Modulation loop:
   - Each playback/frame update, read the oscillator output at $D41B (read-only).
   - Scale/divide the value read from $D41B to control vibrato depth.
   - Add the scaled value to the target voice's 16-bit frequency value (frequency registers are split low/high).
   - Write the adjusted low/high bytes back to the target voice frequency registers.

Notes:
- Use Voice 3's control register to select triangle waveform (Voice 3 control is within $D40E-$D414). (Frequency registers are 16-bit, split into low/high bytes.)
- Depth is determined by the scale/division applied to the raw $D41B reading; dividing reduces depth.
- This method performs frequency modulation (vibrato) without producing extra audible sound from the LFO because Voice 3 is muted.

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, PW, control, ADSR)
- $D407-$D40D - SID - Voice 2 registers (frequency low/high, PW, control, ADSR)
- $D40E-$D414 - SID - Voice 3 registers (frequency low/high, PW, control, ADSR) — configure LFO rate and waveform here
- $D415-$D418 - SID - Filter/volume registers (volume and filter enable; bit 7 of $D418 used to mute Voice 3 per source)
- $D41B - SID - Oscillator 3 output (read-only) — read this each frame for modulation source

## References
- "voice3_modulation_intro" — expands on muting Voice 3 and reading $D41B/$D41C
- "frequency_calculation" — expands on how added modulation affects Fn and Fout
