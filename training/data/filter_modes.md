# SID 6581/8580 Filter Modes (bits 4–6 of $D418)

**Summary:** The SID chip's filter mode bits in register $D418 control the Low-pass (LP, bit 4), Band-pass (BP, bit 5), and High-pass (HP, bit 6) filter behaviors on the 6581/8580 models. These filters can be combined to produce various audio effects:

- **LP (Low-pass):** Passes frequencies below the cutoff and attenuates those above, resulting in warm, muffled tones.
- **BP (Band-pass):** Passes frequencies around the cutoff, creating a nasal or "wah-wah" effect.
- **HP (High-pass):** Passes frequencies above the cutoff, producing thin, tinny sounds.

Combining these filters can yield notch filtering, resonance emphasis, or phase-shift effects.

**Filter Modes**

Detailed descriptions of each filter mode and their combinations:

- **Low-pass (LP — bit 4 of $D418)**
  - Passes frequencies below the cutoff and attenuates those above.
  - Rolloff: 12 dB/octave.
  - Typical use: Produces warm, muffled tones; emulates acoustic low-frequency rolloff.

- **Band-pass (BP — bit 5 of $D418)**
  - Passes a narrow band centered on the cutoff and attenuates other frequencies.
  - Produces nasal or "wah-wah" character; sweeping the cutoff gives classic sweep effects.
  - Emphasizes frequencies near the cutoff; resonance affects prominence.

- **High-pass (HP — bit 6 of $D418)**
  - Passes frequencies above the cutoff and attenuates lower frequencies.
  - Produces thin, tinny sounds by reducing lower-tone energy.

- **Combined Modes (multiple bits set simultaneously)**
  - **LP + HP (Notch/Band-reject)**
    - Attenuates frequencies near the cutoff while passing both above and below; yields phasing-like character.
  - **LP + BP**
    - Produces a wider low-pass-style response with emphasis (resonance) at the cutoff.
  - **HP + BP**
    - Produces a wider high-pass-style response with resonance emphasis.
  - **LP + BP + HP**
    - Approximates an all-pass behavior—primarily phase shifting rather than strong amplitude filtering.

## Source Code

```text
SID filter register summary (filter group):
  Register range: $D415–$D418 (SID filter/cutoff/resonance registers)

  $D415 - Filter Cutoff Low Byte:
    bits 0–7: Lower 8 bits of the 11-bit cutoff frequency value.

  $D416 - Filter Cutoff High Byte:
    bits 0–2: Upper 3 bits of the 11-bit cutoff frequency value.
    bits 3–7: Unused.

  $D417 - Filter Resonance and Voice Routing:
    bits 0–3: Resonance control (0–15).
    bit 4: Filter enable for Voice 3 (1 = enabled).
    bit 5: Filter enable for Voice 2 (1 = enabled).
    bit 6: Filter enable for Voice 1 (1 = enabled).
    bit 7: Filter enable for External Input (1 = enabled).

  $D418 - Filter Mode and Volume:
    bits 0–3: Volume control (0–15).
    bit 4: Low-pass filter enable (1 = enabled).
    bit 5: Band-pass filter enable (1 = enabled).
    bit 6: High-pass filter enable (1 = enabled).
    bit 7: Not used; on the 6581, writing a 1 here can cause audible clicks due to a DC offset change.

  Note: Cutoff frequency and resonance are controlled by the filter register group within $D415–$D418.
```

## Key Registers

- **$D415–$D418**: SID filter registers (cutoff/resonance/mode group; $D418 contains LP/BP/HP mode bits).

## References

- "resonance_control" — expands on resonance impact on filter sound.
- "filter_cutoff_frequency" — expands on how cutoff value affects these modes.

## Labels
- $D415
- $D416
- $D417
- $D418
