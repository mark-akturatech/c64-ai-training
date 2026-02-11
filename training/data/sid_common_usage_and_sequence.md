# SID — Typical usage sequence (Volume, Frequency, ADSR, Control/Gate)

**Summary:** Typical SID usage: set overall volume (Volume register, $D418), write a 16-bit frequency (two bytes), program ADSR via Attack/Decay and Sustain/Release registers, then select waveform and set the gate bit in the Control register to start the note; most SID registers are write-only (except the last four).

## Typical SID usage sequence
- Set overall output level using the Volume register (referenced as $D418 for overall volume and filter select).
- Set pitch by writing the two bytes that form the 16-bit Frequency register (low byte then high byte — 16-bit frequency value).
- Program the envelope by writing Attack/Decay and Sustain/Release registers (ADSR values determine attack/decay rates and sustain/release behavior).
- Select waveform(s) and start the oscillator by writing waveform bits plus the gate bit into the Control register. Writing a 1 to the gate bit starts the Attack→Decay→Sustain cycle; the output holds at the sustain level until the gate bit is cleared.
- When turning the gate bit from 1 to 0 to begin Release, keep the same waveform bit(s) set so the Release cycle runs — clearing the waveform bit as you clear gate will stop the sound immediately.
- Writing 0 to the Volume register or writing a 0 frequency will also silence the output.
- Note: with typical SID chips, most SID registers are write-only; only the final four SID registers are readable.

## Key Registers
- $D418 - SID - Overall volume and filter select (Volume Register)

## References
- "d418_sigvol_volume_and_filter_select" — expands on overall volume and filter select ($D418)
- "voice1_frequency_and_control" — expands on Voice 1 frequency and VCREG1 (frequency/control) details
