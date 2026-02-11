# SID Oscillator Waveform Selection — Logical ANDing and Noise Lock-up

**Summary:** SID oscillator waveforms are NOT additive; selecting multiple waveforms causes a logical AND of outputs (not summation). Selecting other waveform(s) while Noise is on can cause the Noise output to lock up (remain silent) until cleared by the TEST bit or by pulling RES (pin 5) low.

## Behavior
- Waveform selection on a SID voice combines outputs by logical AND, not by arithmetic addition. Multiple waveform control bits set simultaneously will produce the bitwise/logic-combination result rather than a sum of the individual waveforms.
- This ANDing can yield additional composite waveforms beyond the basic set, but the technique must be used with care because behavior is non‑linear and hardware-dependent.
- Interaction with Noise: if Noise is enabled and any other waveform bit is selected concurrently, the Noise output can "lock up" — i.e., the Noise output remains silent and does not produce noise until the lock-up is cleared.
- Clearing the Noise lock-up: toggle the TEST bit (resets oscillator state) or bring the SID RES line (pin 5) low to reset the Noise output.

## References
- "envelope_generator_attack_decay_sustain_release_and_rates" — expands on Envelope generator registers and behavior (ATTACK/DECAY, SUSTAIN/RELEASE, rate table)
- "voice2_sync_and_ring_mod" — expands on Voice-specific waveform and modulation features (SYNC/RING MOD)
- "filter_cutoff_resonance_and_routing" — expands on How waveform outputs may be routed through the filter (FILT bits)
