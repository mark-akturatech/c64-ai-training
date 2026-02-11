# Voice 2 and Voice 3 Controls ($D407-$D414)

**Summary:** SID voice control registers at $D407-$D414 (SID chip) — Voice 2 and Voice 3 control registers mirror Voice 1 register structure; sync and ring-modulation bits differ: Voice 2 sync/ring link oscillators 1 & 2, Voice 3 sync/ring link oscillators 2 & 3.

## Description
The control registers mapped at $D407-$D414 implement the same functions and bit fields as the corresponding Voice 1 registers (voice waveform, gate, sync, ring modulation, test, ADSR control bits, etc.). Behavior, bit positions, and semantics match Voice 1 except for the routing of the sync and ring-modulation bits:

- Voice 2: sync and ring-modulation bits affect Oscillator 1 and Oscillator 2.
- Voice 3: sync and ring-modulation bits affect Oscillator 2 and Oscillator 3.

Use the Voice 1 register documentation for detailed bit layouts and timing; the only register-level functional difference you must account for is the oscillator pairing used by sync and ring-mod bits.

## Key Registers
- $D407-$D40D - SID - Voice 2 registers (control, frequency, pulse width, ADSR, etc.)
- $D40E-$D414 - SID - Voice 3 registers (control, frequency, pulse width, ADSR, etc.)

## References
- "voice1_frequency_control" — expands on Voice 1 reference for register structure and bit layouts