# SID per-voice registers (example: Voice 1)

**Summary:** Per-voice SID register names and concise function descriptions used by the Sound Editor: V1ATDC, V1SURL, V1FRLO, V1FRHI, V1PWLO, V1PWHI, V1CORG (SID, $D400-$D406 for voice 1). Describes nibble/byte assignments for attack/decay, sustain/release, 16-bit frequency, 12-bit pulse width (low byte + high nibble), and the control register.

**Description**

This chunk lists the per-voice SID registers as used by the Sound Editor, using voice #1 as the example. All three voices use the same register layout (voice 2 and 3 are identical, at higher SID addresses).

- **V1ATDC** ($D405) — Attack/Decay (one byte): high nibble = attack time, low nibble = decay time.
- **V1SURL** ($D406) — Sustain/Release (one byte): high nibble = sustain level, low nibble = release time.
- **V1FRLO** ($D400) — Frequency low byte (8 bits) of a 16-bit frequency value for the voice.
- **V1FRHI** ($D401) — Frequency high byte (8 bits) of the 16-bit frequency value.
- **V1PWLO** ($D402) — Pulse Width low byte (low 8 bits) of a 12-bit pulse width used when generating a pulse (square) waveform.
- **V1PWHI** ($D403) — Pulse Width high nibble (lower 4 bits of this register) contains the upper 4 bits of the 12-bit pulse width. (The high nibble of this register is used for other purposes or unused depending on implementation.)
- **V1CORG** ($D404) — Control register for the voice: selects waveform(s), controls synchronization mode (sync), and contains the channel enable (gate) bit.

Use voice 1 names as a template for voice 2 and 3 (identical semantics, different SID addresses).

## Source Code

```text
Register reference (voice 1 example):

V1ATDC ($D405)
  - Byte contains two 4-bit nibbles:
    - High nibble = Attack time
    - Low nibble  = Decay time

V1SURL ($D406)
  - Byte contains two 4-bit nibbles:
    - High nibble = Sustain level
    - Low nibble  = Release time

V1FRLO ($D400)
  - Low-order 8 bits of 16-bit frequency value for this voice.

V1FRHI ($D401)
  - High-order 8 bits of 16-bit frequency value for this voice.

V1PWLO ($D402)
  - Low-order 8 bits of a 12-bit pulse width value (used for pulse/square waveform).

V1PWHI ($D403)
  - Lower nibble contains high-order 4 bits of the 12-bit pulse width value.
  - (Upper nibble not specified in source text.)

V1CORG ($D404)
  - Control register for the voice:
    - Controls waveform selection and synchronization mode.
    - Contains enable (gate) bit for the channel.
    - (Detailed bit assignments for waveform, sync, ring/test/gate not provided in source.)
```

**V1CORG ($D404) Control Register Bit Assignments:**

| Bit | Function                     |
|-----|------------------------------|
| 7   | Noise waveform enable        |
| 6   | Pulse waveform enable        |
| 5   | Sawtooth waveform enable     |
| 4   | Triangle waveform enable     |
| 3   | Test bit                     |
| 2   | Ring modulation enable       |
| 1   | Synchronization enable       |
| 0   | Gate (voice on/off)          |

*Note: Multiple waveform bits can be set simultaneously to create combined waveforms.*

## Key Registers

- $D400-$D406 - SID - Voice 1 registers (Freq low/high, PulseWidth low/high-nibble, Control, Attack/Decay, Sustain/Release)
- $D407-$D40D - SID - Voice 2 registers (same layout as Voice 1)
- $D40E-$D414 - SID - Voice 3 registers (same layout as Voice 1)
- $D415-$D418 - SID - Global/filter registers (refer to "sid_global_filter_registers" for details)

## References

- "editor_ui_labels_and_intro_to_sid_registers" — Intro and location where these per-voice registers are introduced
- "sid_global_filter_registers" — Global SID registers that affect all three voices

## Labels
- V1ATDC
- V1SURL
- V1FRLO
- V1FRHI
- V1PWLO
- V1PWHI
- V1CORG
