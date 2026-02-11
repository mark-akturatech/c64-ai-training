# SID Voice 3 Register Map and Envelope Controls ($D40E-$D414)

**Summary:** SID (MOS 8580/6581) Voice 3 register map for frequency ($D40E/$D40F), pulse waveform width ($D410/$D411), control bits (waveform enables, test, ring-mod, sync, gate) at $D412, and envelope generator controls (attack/decay $D413, sustain/release $D414). Includes bit-role descriptions and addresses.

## Overview
Voice 3 on the SID uses a 16-bit frequency register, a 12-bit pulse-width register (low byte + high 4-bit nybble), a control register that selects waveforms and oscillator behaviors, and two envelope registers encoded as two 4-bit fields each (attack/decay and sustain/release). Gate = 1 starts the attack/decay/sustain cycle; Gate = 0 starts the release cycle. Ring modulation and oscillator sync are per-voice control bits in the control register.

## Register functions (concise)
- $D40E/$D40F: 16-bit frequency (low byte / high byte) for Voice 3.
- $D410/$D411: Pulse waveform width (low 8 bits in $D410, high 4-bit nybble in $D411 bits 3-0). ($D411 bits 7-4 unused.)
- $D412: Control register selecting waveforms (noise, pulse, sawtooth, triangle), Test bit (oscillator test), ring modulation with voice 2, oscillator sync with voice 2, and Gate bit to start/stop envelope phases.
- $D413: Envelope Attack (bits 7-4) and Decay (bits 3-0).
- $D414: Envelope Sustain (bits 7-4) and Release (bits 3-0).

## Source Code
```text
D40E       54286                 Voice 3: Frequency Control - Low-Byte
D40F       54287                 Voice 3: Frequency Control - High-Byte
D410       54288                 Voice 3: Pulse Waveform Width - Low-Byte
D411       54289          7-4    Unused
                          3-0    Voice 3: Pulse Waveform Width - High-Nybble

D412       54290                 Voice 3: Control Register
                          7      Select Random Noise Waveform, 1 = On
                          6      Select Pulse Waveform, 1 = On
                          5      Select Sawtooth Waveform, 1 = On
                          4      Select Triangle Waveform, 1 = On
                          3      Test Bit: 1 = Disable Oscillator 1
                          2      Ring Modulate Osc. 3 with Osc. 2 Output, 1 = On
                          1      Synchronize Osc. 3 with Osc.2 Frequency, 1 = On
                          0      Gate Bit: 1 = Start Att/Dec/Sus, 0 = Start Release

D413       54291                 Envelope Generator 3: Attack/Decay Cycle Control
                          7-4    Select Attack Cycle Duration: 0-15
                          3-0    Select Decay Cycle Duration: 0-15

D414       54285                 Envelope Generator 3: Sustain / Release Cycle Control
                          7-4    Select Sustain Cycle Duration: 0-15
                          3-0    Select Release Cycle Duration: 0-15
```

## Key Registers
- $D40E-$D414 - SID (Voice 3) - Frequency low/high, pulse width low/high-nybble, control bits (waveforms, test, ring mod, sync, gate), envelope A/D and S/R.

## References
- "sid_overview_and_voice1_registers" — SID overview and Voice 1 registers ($D400-$D406)
- "voice2_registers_and_envelopes" — Voice 2 registers and envelope controls ($D407-$D40D)
- "sid_filter_and_misc_registers" — SID filter, ADC and RNG registers ($D415-$D41C)