# MOS 6581 (SID) — Voice 1 registers ($D400-$D406) and device range

**Summary:** SID (MOS 6581) device range $D400-$D7FF with Voice 1 register map at $D400-$D406: frequency low/high ($D400/$D401), pulse width low/high nybble ($D402/$D403), control register waveform bits and control flags ($D404), and envelope A/D and S/R controls ($D405/$D406).

## Voice 1 Register Details
- Device range: $D400-$D7FF (MOS 6581 SID).
- Voice 1 registers occupy $D400-$D406.

Registers:
- $D400 ($D400 / 54272) — Voice 1 Frequency Control, low byte.
- $D401 ($D401 / 54273) — Voice 1 Frequency Control, high byte.
  - 16-bit frequency value = $D401 (high) << 8 | $D400 (low).
- $D402 ($D402 / 54274) — Voice 1 Pulse Waveform Width, low byte.
- $D403 ($D403 / 54275) — Bits 7-4 unused; bits 3-0 = Voice 1 pulse waveform width high nybble.
  - Pulse width is a 12-bit value formed from $D403 (low 4 bits) as high nybble and $D402 as low byte.
- $D404 ($D404 / 54276) — Voice 1 Control Register:
  - Bit 7 — Select Random/Noise waveform, 1 = on.
  - Bit 6 — Select Pulse waveform, 1 = on.
  - Bit 5 — Select Sawtooth waveform, 1 = on.
  - Bit 4 — Select Triangle waveform, 1 = on.
  - Bit 3 — Test bit: 1 = disable oscillator 1 (test mode).
  - Bit 2 — Ring modulate oscillator 1 with oscillator 3 output, 1 = on.
  - Bit 1 — Synchronize oscillator 1 with oscillator 3 frequency, 1 = on.
  - Bit 0 — Gate bit: 1 = start attack/decay/sustain phases; 0 = start release.
- $D405 ($D405 / 54277) — Envelope Generator 1 Attack/Decay control:
  - Bits 7-4 — Attack time selector (0–15).
  - Bits 3-0 — Decay time selector (0–15).
- $D406 ($D406 / 54278) — Envelope Generator 1 Sustain/Release control:
  - Bits 7-4 — Sustain level selector (0–15).
  - Bits 3-0 — Release time selector (0–15).

Behavioral details preserved from source:
- Frequency is a 16-bit value split into low/high bytes at $D400/$D401.
- Pulse waveform width is 12-bit (low byte + high nybble).
- Waveform selection bits (triangle/saw/pulse/noise) are independent and can be combined.
- Control bits (test, ring, sync, gate) are in the low nibble of $D404 and control oscillator/test/envelope behavior.
- Envelope selectors are 4-bit fields selecting attack/decay/sustain/release times or levels (0–15).

## Source Code
```text
  D400-D7FF  54272-55295     MOS 6581 SOUND INTERFACE DEVICE (SID)

  D400       54272                 Voice 1: Frequency Control - Low-Byte
  D401       54273                 Voice 1: Frequency Control - High-Byte
  D402       54274                 Voice 1: Pulse Waveform Width - Low-Byte
  D403       54275          7-4    Unused
                            3-0    Voice 1: Pulse Waveform Width - High-
                                     Nybble

  D404       54276                 Voice 1: Control Register
                            7      Select Random Noise Waveform, 1 = On
                            6      Select Pulse Waveform, 1 = On
                            5      Select Sawtooth Waveform, 1 = On
                            4      Select Triangle Waveform, 1 = On

   HEX      DECIMAL        BITS                 DESCRIPTION
  -------------------------------------------------------------------------

                            3      Test Bit: 1 = Disable Oscillator 1
                            2      Ring Modulate Osc. 1 with Osc. 3 Output,
                                     1 = On
                            1      Synchronize Osc.1 with Osc.3 Frequency,
                                     1 = On
                            0      Gate Bit: 1 = Start Att/Dec/Sus,
                                             0 = Start Release

  D405       54277                 Envelope Generator 1: Attack/Decay Cycle
                                     Control
                            7-4    Select Attack Cycle Duration: 0-15
                            3-0    Select Decay Cycle Duration: 0-15

  D406       54278                 Envelope Generator 1: Sustain/Release
                                     Cycle Control
                            7-4    Select Sustain Cycle Duration: 0-15
                            3-0    Select Release Cycle Duration: 0-15
```

## Key Registers
- $D400-$D7FF - SID (MOS 6581) - device register range (SID registers and mirrored region).
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width low/high-nybble, control, envelope A/D and S/R).

## References
- "voice2_registers_and_envelopes" — Voice 2 registers ($D407-$D40D) and envelopes
- "voice3_registers_and_envelopes" — Voice 3 registers ($D40E-$D414) and envelopes
- "sid_filter_and_misc_registers" — SID filter, A/D, RNG and other registers ($D415-$D41C)