# SID Voice 2 (Registers $07–$0D / $D407–$D40D)

**Summary:** Voice 2 SID registers at $D407–$D40D control Oscillator/Envelope parameters (same register roles as Voice 1: frequency, pulse width, waveform/control, envelope) and include two voice-specific features: SYNC (sync Oscillator 2 to Oscillator 1) and RING MOD (replace Oscillator 2 triangle output with ring-modulated Osc1/2). Envelope stages (ATTACK/DECAY and SUSTAIN/RELEASE) are handled the same as Voice 1.

## Overview
Registers offsets $07–$0D (SID base $D400 → $D407–$D40D) implement the same functional controls as Voice 1’s $00–$06 set: oscillator frequency, pulse width, waveform selection and control bits, and the ADSR envelope controls. The two voice-specific differences called out in the source are:

- SYNC: when the SYNC bit is selected for Voice 2, Oscillator 2 is synchronized to Oscillator 1 (Osc2 restarts/locks phase relative to Osc1, producing hard-sync tonal effects).
- RING MOD: when the RING MOD bit is selected for Voice 2, the Triangle output of Oscillator 2 is replaced by the ring-modulated combination of Oscillator 2 and Oscillator 1 (producing bell-like and inharmonic timbres).

Envelope behavior (ATTACK/DECAY and SUSTAIN/RELEASE) for Voice 2 is controlled identically to Voice 1. Voice 2 can also be routed through the SID filter using the FILT 2 routing bit (see filter documentation referenced below).

## Key Registers
- $D407-$D40D - SID - Voice 2 control registers (correspond to Voice 1 registers $D400-$D406 in function and layout)

## References
- "envelope_generator_attack_decay_sustain_release_and_rates" — expands on Voice envelopes (ATTACK/DECAY and SUSTAIN/RELEASE)
- "voice3_sync_ring_mod_and_voice_usage" — expands on Voice 3; analogous SYNC / RING MOD behavior and voice usage
- "filter_cutoff_resonance_and_routing" — expands on filter cutoff/resonance and routing; includes FILT 2 routing for Voice 2
