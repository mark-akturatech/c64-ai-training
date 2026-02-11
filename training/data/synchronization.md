# SID Oscillator Synchronization (6581 / 8580)

**Summary:** Oscillator synchronization on the SID (6581/8580) forces a voice's phase accumulator to reset whenever its synchronizing voice completes a cycle, producing complex harmonics; SYNC control bits are in the voice control registers at $D404, $D40B and $D412 (bit 1 = $02).

## Behavior
Oscillator sync causes the synced voice's phase accumulator to be reset each time the synchronizing voice completes a cycle, effectively forcing the synced voice to share the synchronizing voice's fundamental frequency while retaining a harmonic structure determined by the ratio of the two frequencies. The synced voice's waveform therefore has the same base pitch as the sync source but can contain rich harmonic content (non-integer frequency ratios produce more complex spectra).

Hard-wired pairing (control bits in voice control registers):
- Voice 1 is synced to Voice 3 (SYNC bit is bit 1 of $D404).
- Voice 2 is synced to Voice 1 (SYNC bit is bit 1 of $D40B).
- Voice 3 is synced to Voice 2 (SYNC bit is bit 1 of $D412).

Practical notes from examples in the source:
- Mosquito effect: set Voice 1 to a high-frequency triangle, set Voice 3 to a slightly different high frequency, enable Voice 1 SYNC — the result is a buzzing/complex harmonic tone.
- Sweeping technique: sweep the frequency (FREQ registers) of the synced voice while keeping the sync source frequency fixed to produce dramatic timbral changes.

## Key Registers
- $D404 - SID - Voice 1 Control register (bit 1 = SYNC for Voice 1, syncs to Voice 3)
- $D40B - SID - Voice 2 Control register (bit 1 = SYNC for Voice 2, syncs to Voice 1)
- $D412 - SID - Voice 3 Control register (bit 1 = SYNC for Voice 3, syncs to Voice 2)

## References
- "voice1_registers" — expands on SYNC bit location in control register
- "ring_modulation" — related modulation techniques for complex timbres
