# TAP file pulse encoding (C64 cassette TAP format)

**Summary:** TAP format (Per Håkan Sundell, 1997) encodes each nonzero data byte as a single pulse length for C64 cassette data; conversion uses C64 PAL frequency (985248 Hz) with formula Tap Byte = pulse(s) * 985248 / 8 (equivalently pulse(µs) * 0.123156). Example CBM pulse values: short $2B, medium $3F, long $53; leader short-pulse sequence is used for synchronization.

## Tap Format
Designed by Per Håkan Sundell (author of the CCS64 emulator) in 1997 to reproduce C64 cassette tape data pulse-for-pulse. Unlike a WAV sample, the TAP file stores a sequence of pulse-duration bytes rather than sampled waveform amplitudes.

- Each nonzero byte in the TAP data area represents the time length of a single pulse (the interval between two negative edges of the received square wave).
- Conversion from a measured pulse length to the TAP data byte uses the C64 PAL clock rate and an 8‑sample scaling factor.

Conversion formula (exact):
Tap Data Byte = Pulse length (seconds) * C64 PAL Frequency / 8

where C64 PAL Frequency = 985248 Hz.

Equivalent microsecond form (precomputed constant):
Tap Data Byte = Pulse length (microseconds) * 0.123156

Notes:
- The TAP byte is a quantized representation: multiple distinct pulse lengths may map to the same TAP byte value (information alteration due to quantization).
- The C64 OS/read routines tolerate large tape speed variation by using the leader's short-pulse sequence to synchronize timing to the tape during loading.
- Historical note: imports of older tapes tend to match the canonical CBM pulse values more closely than newer recordings; loader routines include timing tolerance/correction.

## References
- "data_encoding_pulses" — expands on Pulse durations used in the conversion examples
