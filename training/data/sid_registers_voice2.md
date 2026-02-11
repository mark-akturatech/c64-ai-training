# SID Voice 2 Registers ($D407-$D40D)

**Summary:** SID (MOS 6581/8580) voice 2 register block at $D407-$D40D — contains 16-bit frequency, 12-bit pulse width, control (waveform/modulation), and ADSR envelope (attack/decay, sustain/release). Registers are write-only.

**Description**
Voice 2 uses a contiguous 7-byte register block:

- **$D407-$D408** — 16-bit frequency control word for Voice 2 (little-endian; low byte at $D407, high byte at $D408). Range 0–65535.
- **$D409-$D40A** — Pulse-width for Voice 2 (12-bit). Low byte at $D409, high nibble of pulse-width stored in the low nibble of $D40A (high nibble of $D40A is unused/reserved).
- **$D40B** — Control register for Voice 2. Selects waveform(s) and contains modulation bits (gate/envelope start, sync, ring modulation, test, and waveform bits).
  - Bit 7: Gate (1 = Start Attack/Decay/Sustain cycle; 0 = Start Release cycle)
  - Bit 6: Sync (1 = Oscillator sync on)
  - Bit 5: Ring Modulation (1 = Ring modulation on)
  - Bit 4: Test (1 = Test mode on)
  - Bit 3: Triangle Wave (1 = Enable)
  - Bit 2: Sawtooth Wave (1 = Enable)
  - Bit 1: Pulse Wave (1 = Enable)
  - Bit 0: Noise Wave (1 = Enable)
- **$D40C** — Attack/Decay for Voice 2:
  - Bits 7–4: Attack rate (0–15)
  - Bits 3–0: Decay rate (0–15)
- **$D40D** — Sustain/Release for Voice 2:
  - Bits 7–4: Sustain level (0–15)
  - Bits 3–0: Release rate (0–15)

All registers in this block are write-only. Reading from these addresses returns undefined data, typically reflecting open-bus behavior, which may result in the last value read from another device on the data bus.

## Source Code
```text
SID Voice 2 register map (addresses, sizes, brief notes)

$D407  - VOICE2_FREQ_LOW   - Frequency low byte (16-bit frequency, little-endian)
$D408  - VOICE2_FREQ_HIGH  - Frequency high byte

$D409  - VOICE2_PW_LOW     - Pulse width low byte (bits 7-0 of 12-bit PW)
$D40A  - VOICE2_PW_HIGH    - Pulse width high nibble (bits 11-8 in low nibble); high nibble unused

$D40B  - VOICE2_CONTROL    - Waveform & modulation control (write-only)
                           - Bit 7: Gate
                           - Bit 6: Sync
                           - Bit 5: Ring Modulation
                           - Bit 4: Test
                           - Bit 3: Triangle Wave
                           - Bit 2: Sawtooth Wave
                           - Bit 1: Pulse Wave
                           - Bit 0: Noise Wave

$D40C  - VOICE2_AD         - Attack/Decay
                           - Bits 7-4: Attack rate (0-15)
                           - Bits 3-0: Decay rate  (0-15)

$D40D  - VOICE2_SR         - Sustain/Release
                           - Bits 7-4: Sustain level (0-15)
                           - Bits 3-0: Release rate  (0-15)
```

## Key Registers
- $D407-$D40D - SID - Voice 2 frequency / pulse width / control / ADSR (write-only)

## References
- "sid_registers_voice1" — expands on voice register layout similarity (Voice 1 registers and their bit layouts)

## Labels
- VOICE2_FREQ_LOW
- VOICE2_FREQ_HIGH
- VOICE2_PW_LOW
- VOICE2_PW_HIGH
- VOICE2_CONTROL
- VOICE2_AD
- VOICE2_SR
