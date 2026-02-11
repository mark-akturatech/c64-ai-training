# SID Voice 3 registers ($D40E-$D414)

**Summary:** SID (MOS6581/8580) Voice 3 registers at $D40E-$D414 define voice 3 frequency, pulse width, waveform/control, and envelope (attack/decay, sustain/release). These registers are write-only on the SID; related readback registers are documented separately ($D41B-$D41C).

## Voice 3 register descriptions
- $D40E-$D40F — Voice 3 Frequency: 16-bit frequency control (two-byte register pair). Sets waveform oscillator frequency for voice 3.
- $D410-$D411 — Voice 3 Pulse: 16-bit pulse width control (two-byte register pair). Controls the duty/pulse width for pulse waveform on voice 3.
- $D412 — Voice 3 Control: Waveform selection and modulation controls for voice 3 (write-only).
- $D413 — Voice 3 A/D: Attack and Decay lengths for the amplitude envelope (write-only).
- $D414 — Voice 3 S/R: Sustain level and Release length for the amplitude envelope (write-only).

Notes:
- Frequency and Pulse registers are implemented as two consecutive bytes (low then high), forming 16-bit values.
- All listed SID voice 3 registers are documented as write-only on the SID; readback behavior and shadow/read registers are covered elsewhere (see References).

## Source Code
```text
Voice 3 ($D40E-$D414):

$D40E-$D40F  Voice 3 Freq       Frequency register (write-only)
$D410-$D411  Voice 3 Pulse      Pulse width (write-only)
$D412   Voice 3 Control         Waveform and modulation control (write-only)
$D413   Voice 3 A/D             Attack and Decay length (write-only)
$D414   Voice 3 S/R             Sustain volume and Release length (write-only)
```

## Key Registers
- $D40E-$D414 - SID - Voice 3 frequency, pulse width, control, envelope (write-only)

## References
- "sid_paddle_and_readback" — expands on voice 3 readback registers at $D41B-$D41C

## Labels
- V3_FREQ_LO
- V3_FREQ_HI
- V3_PW_LO
- V3_PW_HI
- V3_CONTROL
- V3_AD
- V3_SR
