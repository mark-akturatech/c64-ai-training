# SID: SYNC (Bit 1) — Voice 1 Hard Sync to Voice 3

**Summary:** SYNC (Bit 1, mask $02) in the SID Voice 1 Control Register ($D404) enables hard sync of Oscillator 1 to Oscillator 3 (hard sync). When set, Oscillator 1's fundamental is forced to Oscillator 3's fundamental, producing synced harmonic spectra when O1 is varied relative to O3.

## Description
SYNC (Bit 1) — when set to 1 — synchronizes the fundamental frequency of Oscillator 1 to the fundamental frequency of Oscillator 3 (hard sync). The sonic effect: varying Oscillator 1's frequency relative to the locked Oscillator 3 produces complex harmonic structures in Voice 1 while the sounding pitch remains at Oscillator 3's frequency.

Requirements and behavior:
- Oscillator 3 must be set to a non-zero frequency for sync to occur; it is preferable for Oscillator 3 to be lower in frequency than Oscillator 1.
- Other Voice 3 parameters (pulse width, envelope, waveform selection, etc.) do not affect the sync relationship; only Oscillator 3's frequency matters for the locking behavior.
- Sync applies from Oscillator 3 onto Oscillator 1 (Voice 1 control bit). Ring modulation (Bit 2) is a separate interaction between Oscillators 1 and 3 and produces different effects (see referenced ring_mod_bit).

## Key Registers
- $D404 - SID - Voice 1 Control Register (SYNC = Bit 1, mask $02) 

## References
- "control_register_overview_and_gate" — expands on Control register and gating (Bit 0)
- "ring_mod_bit" — expands on RING MOD (Bit 2) — interaction between Oscillators 1 and 3 for different effects
