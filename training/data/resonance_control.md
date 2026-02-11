# SID $D417 — Resonance (bits 7-4)

**Summary:** Bits 7-4 of SID register $D417 set the filter resonance (0–15). Resonance emphasizes frequencies at the cutoff; high settings produce pronounced peaks and can cause self-oscillation on the 6581 (usable as a crude fourth oscillator); the 8580 is less prone to self-oscillation.

## Resonance
Bits 7-4 of $D417 control the amount of resonance applied by the SID filter. Resonance creates a peak in the filter's frequency response at the cutoff frequency; increasing the 4-bit value increases the peak magnitude.

- 0: No resonance — flat response through the filter.
- 8: Moderate resonance — noticeable emphasis at cutoff.
- 15: Maximum resonance — strong peak; on the 6581 this can cause the filter to self-oscillate (producing a sine-like tone at the cutoff frequency even without voice input).

Behavioral notes:
- 6581: High resonance values may produce self-oscillation; this behaviour is commonly exploited as a crude fourth oscillator.
- 8580: The filter has different characteristics and is generally less prone to self-oscillation at equivalent resonance settings.

Interaction:
- Resonance interacts with the cutoff frequency (see referenced "filter_cutoff_frequency" chunk) — the emphasized peak is centered on the set cutoff. Changes to cutoff and resonance together determine the apparent timbre and the potential for self-oscillation.

## Source Code
```text
Register $D417 (SID) - Resonance control (bits 7-4)

Bit layout (this chunk specifies only bits 7-4):
  bit 7 : R3  (highest resonance bit)
  bit 6 : R2
  bit 5 : R1
  bit 4 : R0  (lowest resonance bit)
  bits 3-0 : other bits / uses (not specified in this chunk)

Resonance value (bits 7-4 interpreted as a 4-bit unsigned integer):
  0   -> No resonance (flat response)
  1-7 -> Increasing emphasis (progressively larger peak)
  8   -> Moderate resonance (noticeable emphasis)
  9-14-> Strong emphasis
  15  -> Maximum resonance (strong peak; on 6581 may self-oscillate)

Behavioral reminder:
- Self-oscillation produces a sine-like tone at the cutoff frequency even when no voices are feeding the filter.
- 6581: self-oscillation easier to achieve.
- 8580: self-oscillation harder to achieve due to different filter design.
```

## Key Registers
- $D417 - SID - Filter resonance amount (bits 7-4, 4-bit value 0–15)

## References
- "filter_cutoff_frequency" — cutoff + resonance interaction
- "chip_variants_6581_8580" — 6581 self-oscillation tendency vs 8580