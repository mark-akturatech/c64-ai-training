# SID Voice 2 Registers ($D407-$D40D)

**Summary:** SID (6581/8580) Voice 2 register map for $D407-$D40D: Frequency low/high, Pulse Width low/high, Control ($D40B) with RING MOD (bit 2) and SYNC (bit 1), and the ADSR pair Attack/Decay ($D40C) and Sustain/Release ($D40D). All registers are write-only.

## Description
Voice 2 uses the same register layout and behavior as Voice 1; these registers control oscillator frequency, pulse width, modulation/synchronization, and the envelope (ADSR).

- Frequency ($D407/$D408): 16-bit frequency word (low byte at $D407, high byte at $D408). Write the low byte then the high byte to set the oscillator frequency for Voice 2.
- Pulse Width ($D409/$D40A): 12-bit pulse width value. The low byte is at $D409; the high register $D40A contains the upper 4 bits (pulse width bits 8–11) in its low nibble. Values outside the 12-bit range are masked by the SID hardware.
- Control register ($D40B): write-only control flags for Voice 2. Bit 2 (RING MOD) enables ring modulation of Voice 2 with Voice 1 oscillator. Bit 1 (SYNC) synchronizes Voice 2 oscillator to Voice 1 (hard-sync behavior). All other bits have the same meanings as Voice 1 control bits (see voice1_registers for the full bitfield).
- Attack/Decay ($D40C): 8-bit ADSR register where the high nibble = Attack rate (0–15) and the low nibble = Decay rate (0–15).
- Sustain/Release ($D40D): 8-bit ADSR register where the high nibble = Sustain level (0–15) and the low nibble = Release rate (0–15).

Behavior notes:
- All listed registers are write-only.
- RING MOD (bit 2) multiplies/modulates Voice 2 with Voice 1 oscillator output (enables cross-voice ring modulation).
- SYNC (bit 1) forces Voice 2 oscillator phase to restart when Voice 1 oscillator completes a cycle (synchronization), causing hard-sync timbral effects when waveforms differ.
- ADSR nibbles are interpreted by the SID envelope generator hardware; rates and levels use the SID’s internal timing and scaling (see voice1_registers or SID timing references for numerical rate-to-time mapping).

## Source Code
```text
$D407 / 54279 - VOICE 2: FREQUENCY LOW BYTE (Write-only)
$D408 / 54280 - VOICE 2: FREQUENCY HIGH BYTE (Write-only)
$D409 / 54281 - VOICE 2: PULSE WIDTH LOW BYTE (Write-only)
$D40A / 54282 - VOICE 2: PULSE WIDTH HIGH BYTE (Write-only)
$D40B / 54283 - VOICE 2: CONTROL REGISTER (Write-only)
  Bit 2: RING MOD  - Ring modulate Voice 2 with Voice 1 oscillator
  Bit 1: SYNC      - Synchronize Voice 2 with Voice 1 oscillator
  (All other bits identical to Voice 1)
$D40C / 54284 - VOICE 2: ATTACK / DECAY (Write-only)
$D40D / 54285 - VOICE 2: SUSTAIN / RELEASE (Write-only)
```

## Key Registers
- $D407-$D40D - SID - Voice 2 registers: Frequency low/high, Pulse Width low/high, Control, Attack/Decay, Sustain/Release

## References
- "voice1_registers" — full bitfield and behavior of Voice control bits
- "synchronization" — details on SYNC and RING MOD interaction between voices