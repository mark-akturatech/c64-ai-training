# SID Filter — FC LO/FC HI ($15,$16) and RES/FILT ($17)

**Summary:** SID filter cutoff is set by FC LO/FC HI (registers $15,$16) as an 11-bit value and controls Cutoff/Center Frequency (~30 Hz–12 kHz). RES/FILT ($17) contains resonance (RES0–RES3, bits 4–7) and routing bits (FILT1, FILT2, FILT3, FILTEX, bits 0–3) that select which signals are passed through the filter or bypass it.

## Filter registers and behavior
FC LO/FC HI (Registers $15, $16)
- Together these two registers form an 11-bit value that linearly controls the filter Cutoff (or Center) Frequency. The effective Cutoff frequency range is approximately 30 Hz to 12 kHz.
- Note from source: bits 3–7 of FC LO are not used (i.e., only FC LO bits 0–2 participate in the 11-bit value).

RES/FILT (Register $17)
- Bits 4–7 (RES0–RES3) select resonance (peaking at the cutoff). There are 16 resonance settings, linear from 0 (no resonance) to 15 ($F, maximum resonance).
- Bits 0–3 control routing (per-signal filter enable/bypass):
  - FILT1 (bit 0): 0 = Voice 1 bypasses the filter and goes directly to audio output; 1 = Voice 1 is processed by the filter.
  - FILT2 (bit 1): same for Voice 2.
  - FILT3 (bit 2): same for Voice 3.
  - FILTEX (bit 3): same for External audio input (pin 26).

## Key Registers
- $D415-$D417 - SID - Filter registers: FC LO ($15 / $D415), FC HI ($16 / $D416), RES/FILT ($17 / $D417) — Cutoff value, resonance, and per-source filter routing.

## References
- "voice3_sync_ring_mod_and_voice_usage" — expands on Voices' outputs and routing through filter
- "voice2_sync_and_ring_mod" — expands on Voice 2 routing (FILT2) and modulation interaction with filter
- "envelope_generator_attack_decay_sustain_release_and_rates" — expands on how Filter settings interact with voice envelopes to shape final sound

## Labels
- FCLO
- FCHI
- RESFILT
