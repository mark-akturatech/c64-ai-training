# COMMODORE 64 - Voice 3 control overview (registers $0E–$14)

**Summary:** SID voice 3 control registers (offsets $0E–$14, absolute $D40E–$D414) set frequency, pulse width, waveform/effects (SYNC, RING MOD), and ADSR envelope; Gate bit controls note on/off. SYNC and RING MOD behavior for voice 3 references oscillator 2.

## Voice 3 (registers $0E–$14)
Registers $0E–$14 control Voice 3 and are functionally identical to the voice control registers at offsets $00–$06, with two voice-specific exceptions:

- SYNC (when enabled) synchronizes Oscillator 3 to Oscillator 2.
- RING MOD (when enabled) replaces Oscillator 3's Triangle output with the ring‑modulated result of Oscillator 3 combined with Oscillator 2.

Typical operation:
- Set the voice parameters: frequency (coarse/fine), waveform selection, effects bits (SYNC, RING MOD), and envelope rates (attack/decay, sustain/release).
- Gate the voice (set the Gate bit) to start the sound; holding the Gate bit sustains the voice, clearing the Gate bit releases/ends it.
- Voices may be triggered and controlled independently, or used together (unison) to produce a single, richer sound by detuning or setting musical intervals between oscillators.

Notes:
- The register set and behavior are the same as Voice 1/Voice 2 except for the SYNC destination and RING MOD interaction described above.
- This chunk does not list individual bit assignments; consult a full SID register map for bit-level control details.

## Key Registers
- $D40E-$D414 - SID - Voice 3 registers (frequency low/high, pulse width low/high, control/waveform/effects, Attack/Decay, Sustain/Release)

## References
- "voice2_sync_and_ring_mod" — expands on Voice 2 and Voice 3 having analogous SYNC/RING MOD relationships but synchronizing to different oscillators  
- "envelope_generator_attack_decay_sustain_release_and_rates" — expands on envelope controls (ATTACK/DECAY, SUSTAIN/RELEASE) for each voice  
- "filter_cutoff_resonance_and_routing" — expands on routing voices through the filter to alter harmonic content