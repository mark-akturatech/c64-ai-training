# SID Voice 1 — Envelope Generator (ATTACK/DECAY $D405, SUSTAIN/RELEASE $D406)

**Summary:** Description of SID (6581/8580) Voice 1 envelope controls: ATTACK/DECAY (register $D405) and SUSTAIN/RELEASE (register $D406). Explains bit assignments (nibbles for attack/decay/sustain/release), how to form register bytes, gating behavior, and the full envelope-rate table (Table 2).

## Envelope register functions and bit layout
- ATTACK/DECAY (byte written to $D405): bits 7–4 select one of 16 ATTACK rates (ATK3..ATK0); bits 3–0 select one of 16 DECAY rates (DCY3..DCY0). The ATTACK rate controls time to rise from zero to peak when the Gate is set; the DECAY rate controls time to fall from peak to the chosen SUSTAIN level.
- SUSTAIN/RELEASE (byte written to $D406): bits 7–4 select one of 16 linear SUSTAIN levels (0..15); bits 3–0 select one of 16 RELEASE rates (RLS3..RLS0). SUSTAIN is a linear amplitude step (0 = silence, 15 = peak). RELEASE rates are identical to DECAY rates.
- Byte construction:
  - $D405 = (ATTACK_nibble << 4) | DECAY_nibble
  - $D406 = (SUSTAIN_nibble << 4) | RELEASE_nibble
- Gating behavior: the Gate bit in the Voice 1 Control Register (voice control at $D404) may be set/reset at any time. If the Gate is cleared during ATTACK or SUSTAIN, the RELEASE cycle begins immediately from the current amplitude; reasserting Gate restarts ATTACK from the current amplitude. This allows real-time sculpting of complex amplitude envelopes.
- Timing base and scaling: tabled envelope times are given per cycle for a 1.0 MHz 6502 clock. For systems with a different 6502 clock, multiply times by (1 MHz / clock).

## Source Code
```text
Register map (SID base $D400, Voice 1 region $D400-$D406):
  $D400 - Voice 1 FREQ LO
  $D401 - Voice 1 FREQ HI
  $D402 - Voice 1 PW LO
  $D403 - Voice 1 PW HI
  $D404 - Voice 1 CONTROL (includes Gate bit)
  $D405 - Voice 1 ATTACK/DECAY (ATK3..ATK0 = bits 7-4, DCY3..DCY0 = bits 3-0)
  $D406 - Voice 1 SUSTAIN/RELEASE (STN3..STN0 = bits 7-4, RLS3..RLS0 = bits 3-0)

Example byte construction:
  ; Set Attack = $2, Decay = $3  -> $D405 := %0010 0011 = $23
  ; Set Sustain = $8, Release = $5 -> $D406 := %1000 0101 = $85

Table 2. Envelope Rates (value -> Attack time / Decay-Release time)
+-------+----------------------+-----------------------+
| HEX   | ATTACK (time/cycle)  | DECAY/RELEASE         |
+-------+----------------------+-----------------------+
| 0 (0) | 2 ms                 | 6 ms                  |
| 1 (1) | 8 ms                 | 24 ms                 |
| 2 (2) | 16 ms                | 48 ms                 |
| 3 (3) | 24 ms                | 72 ms                 |
| 4 (4) | 38 ms                | 114 ms                |
| 5 (5) | 56 ms                | 168 ms                |
| 6 (6) | 68 ms                | 204 ms                |
| 7 (7) | 80 ms                | 240 ms                |
| 8 (8) | 100 ms               | 300 ms                |
| 9 (9) | 250 ms               | 750 ms                |
| A (10)| 500 ms               | 1.5 s                 |
| B (11)| 800 ms               | 2.4 s                 |
| C (12)| 1 s                  | 3 s                   |
| D (13)| 3 s                  | 9 s                   |
| E (14)| 5 s                  | 15 s                  |
| F (15)| 8 s                  | 24 s                  |
+-------+----------------------+-----------------------+

Notes from source:
- Rates assume 1.0 MHz 6502 clock; for other clocks multiply each listed time by (1 MHz / clock).
- Times are "per cycle" (i.e., the total ATTACK time to reach peak; DECAY/RELEASE times are to fall from peak to zero).
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency, pulse width, control, ATTACK/DECAY $D405, SUSTAIN/RELEASE $D406)

## References
- "oscillator_waveform_selection_and_noise_lock" — waveform selection and noise interactions
- "voice2_sync_and_ring_mod" — Voice 2 envelope controls and SYNC/RING MOD exceptions
- "filter_cutoff_resonance_and_routing" — how envelopes interact with the filter when voices are routed through it

## Labels
- VOICE1_ATTACK_DECAY
- VOICE1_SUSTAIN_RELEASE
- VOICE1_CONTROL
