# COMMODORE 64 - SID Voice 2 register map and envelope controls (D407-D40D)

**Summary:** SID (MOS 6581/8580) Voice 2 registers $D407-$D40D: 16-bit frequency ($D407/$D408), 12-bit pulse width ($D409 + low nibble of $D40A), Control register $D40B (waveform enables, TEST, ring-mod, sync, GATE), and envelope controls Attack/Decay ($D40C) and Sustain/Release ($D40D).

## Voice 2 register overview
Voice 2 uses seven consecutive SID registers at $D407-$D40D. Frequency is a 16-bit value (little-endian) formed from the low byte at $D407 and the high byte at $D408. The pulse waveform width is a 12-bit value: the low 8 bits are in $D409 and the high 4 bits are in the low nybble of $D40A (bits 3-0). Bit 7-4 of $D40A are unused.

The control register at $D40B contains waveform enable bits (random/noise, pulse, sawtooth, triangle), a TEST bit, ring modulation enable, oscillator sync enable, and the GATE bit which starts the envelope (1 = start Attack/Decay/Sustain, 0 = start Release).

Envelope generator registers are nibbled fields:
- $D40C: Attack (bits 7-4) and Decay (bits 3-0), each 0-15 selecting their respective cycle durations.
- $D40D: Sustain (bits 7-4) and Release (bits 3-0), each 0-15.

Behavioral notes (from source):
- Gate (bit 0 of $D40B): writing 1 starts Attack→Decay→Sustain; writing 0 starts Release.
- Ring modulation (bit 2): oscillators 2 can be ring-modulated by oscillator 1 when set.
- Synchronize (bit 1): oscillator 2 can be synchronized to oscillator 1 frequency when set.
- TEST (bit 3): indicated as "1 = Disable Oscillator 1" in source.

## Source Code
```text
  D407       54279                 Voice 2: Frequency Control - Low-Byte
  D408       54280                 Voice 2: Frequency Control - High-Byte
  D409       54281                 Voice 2: Pulse Waveform Width - Low-Byte
  D40A       54282          7-4    Unused
                            3-0    Voice 2: Pulse Waveform Width - High-
                                     Nybble

  D40B       54283                 Voice 2: Control Register
                            7      Select Random Noise Waveform, 1 = On
                            6      Select Pulse Waveform, 1 = On
                            5      Select Sawtooth Waveform, 1 = On
                            4      Select Triangle Waveform, 1 = On
                            3      Test Bit: 1 = Disable Oscillator 1
                            2      Ring Modulate Osc. 2 with Osc. 1 Output,
                                     1 = On
                            1      Synchronize Osc.2 with Osc. 1 Frequency,
                                     1 = On
                            0      Gate Bit: 1 = Start Att/Dec/Sus,
                                             0 = Start Release

  HEX      DECIMAL        BITS                 DESCRIPTION
  -------------------------------------------------------------------------

  D40C       54284                 Envelope Generator 2: Attack / Decay
                                     Cycle Control
                            7-4    Select Attack Cycle Duration: 0-15
                            3-0    Select Decay Cycle Duration: 0-15

  D40D       54285                 Envelope Generator 2: Sustain / Release
                                     Cycle Control
                            7-4    Select Sustain Cycle Duration: 0-15
                            3-0    Select Release Cycle Duration: 0-15
```

## Key Registers
- $D407-$D40D - SID - Voice 2 registers (Frequency low/high, Pulse width low + high nybble, Control, Envelope A/D, Envelope S/R)

## References
- "sid_overview_and_voice1_registers" — SID overview and Voice 1 registers (D400-D406)
- "voice3_registers_and_envelopes" — Voice 3 registers and envelopes (D40E-D414)
- "sid_filter_and_misc_registers" — SID filter and miscellaneous registers (D415-D41C)