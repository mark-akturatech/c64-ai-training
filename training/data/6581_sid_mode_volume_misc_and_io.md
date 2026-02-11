# SID MODE/VOL, POTX/POTY, OSC3/RANDOM, ENV3 (Registers $D418-$D41C)

**Summary:** Covers SID register MODE/VOL at $D418 (Filter output bits LP/BP/HP, 3OFF, and Volume nibble VOL0–VOL3), POTX/POTY A/D read registers ($D419/$D41A) and their update timing, and OSC3/RANDOM ($D41B) and ENV3 ($D41C) read behavior and uses (modulation, random generation, gating requirements).

## MODE/VOL (overview)
- The MODE/VOL register controls filter output routing and the chip master volume.
- Filter output bits are additive: LP (low‑pass), BP (bandpass), and HP (high‑pass) may be enabled simultaneously to produce combined responses (e.g., LP+HP = notch/band‑reject).
- At least one filter output must be selected and at least one voice routed through the filter for the filter to affect audio.
- Bit 7 (3 OFF) disconnects Voice 3 from the direct audio path; combined with voice‑3 filter routing this allows using Voice 3 purely as a modulation source without producing audible output.
- Bits 0–3 select a 4‑bit linear volume level (0..15); a non‑zero volume must be selected for any audible output.

## POTX / POTY (A/D read registers)
- POTX and POTY return an 8‑bit value (0..255) representing the external potentiometer position on the POTX and POTY pins.
- The value is always valid for reads and is updated periodically.
- Update timing: the register is updated every 512 φ2 clock cycles. **[Note: source text read "512 (02 clock cycles" — interpreted as 512 φ2 clock cycles.]**
- See SID pin descriptions for recommended pot and capacitor wiring and values.

## OSC3 / RANDOM (usage and character)
- OSC3 read register returns the upper 8 bits of Oscillator 3 output; its numerical behavior depends on the waveform selected:
  - Sawtooth: returns incrementing values 0..255 at oscillator rate.
  - Triangle: increments 0..255 then decrements 255..0 (triangular ramp).
  - Pulse: toggles between 0 and 255 (square/pulse extremes).
  - Noise: produces pseudo‑random values suitable for random number generation.
- Primary uses: modulation source (add the OSC3 output in software to other oscillator frequency, filter cutoff, or pulse width in real time), timing/sequencing source, and a random generator when Noise is selected.
- Common techniques: add OSC3 sawtooth to another oscillator's frequency for siren effects; use OSC3 triangle near ≈7 Hz for vibrato (scaled); use OSC3 noise for sample‑and‑hold style modulation.
- When using OSC3 as a modulation source, remove Voice 3 audio output (set 3 OFF) if you do not want audible Voice 3.

## ENV3 (usage)
- ENV3 returns the current output of Voice 3's envelope generator.
- ENV3 is only updated when the Voice 3 envelope generator is gated (i.e., the voice is triggered and its envelope is running).
- ENV3 can be added to filter cutoff or oscillator frequency for harmonic envelope effects (wah‑wah, phaser‑like effects).
- OSC3 is not affected by the envelope generator; ENV3 is.

## Source Code
```text
MODE/VOL (Register $18)  -> SID absolute $D418
  Bits 4-7 select Filter mode/output:
    Bit 4 LP  - Low‑Pass output selected; passes frequencies below cutoff,
                 attenuates above cutoff at 12 dB/octave.
    Bit 5 BP  - Band‑Pass output selected; attenuates above and below cutoff
                 at 6 dB/octave.
    Bit 6 HP  - High‑Pass output selected; passes frequencies above cutoff,
                 attenuates below cutoff at 12 dB/octave.
    Bit 7 3 OFF - When set, Voice 3 is disconnected from the direct audio path.
                 (If FILT3 = 0 and 3 OFF = 1, Voice 3 will not reach audio output.)
  NOTE: Filter output modes ARE additive; multiple modes may be selected
        simultaneously. At least one Filter output must be selected and at
        least one Voice must be routed through the Filter for audible effect.
  Bits 0-3 VOL0-VOL3 - 4‑bit overall volume (0..15 / $0..$F), linear steps.
                       Some non‑zero volume must be selected for any sound.

POTX (Register $19)  -> SID absolute $D419
  Read: 8‑bit value 0..255 from POTX (pin 24). Value is always valid.
  Updated every 512 φ2 clock cycles.
  See pin descriptions for pot and capacitor values.

POTY (Register $1A)  -> SID absolute $D41A
  Same as POTX for POTY (pin 23).

OSC 3 / RANDOM (Register $1B)  -> SID absolute $D41B
  Read: upper 8 bits of Oscillator 3 output.
  Waveform behavior:
    Sawtooth -> values increment 0..255 at oscillator frequency.
    Triangle -> 0..255 then 255..0 (triangular ramp).
    Pulse -> jumps between 0 and 255.
    Noise -> produces random numbers (useful as RNG).
  Uses: modulation source (add to oscillator/filter/pulse width), timing,
        sequencing, random generation. When used for modulation, typically
        disable Voice 3 audio (3 OFF = 1).

ENV 3 (Register $1C)  -> SID absolute $D41C
  Read: current output of Voice 3 Envelope Generator.
  Requires Voice 3 envelope to be gated to produce output.
  Use for harmonic envelopes, wah‑wah, phaser effects by adding to filter
  cutoff or oscillator frequency.
```

## Key Registers
- $D418-$D41C - SID - MODE/VOL ($D418), POTX ($D419), POTY ($D41A), OSC3/RANDOM ($D41B), ENV3 ($D41C)

## References
- "6581_sid_envelopes_and_voice2_voice3_filter" — expands on filter routing and voice routing bits
- "6581_sid_pin_descriptions_part1" — expands on hardware pins (POTX/POTY, EXT IN, AUDIO OUT) for these functions

## Labels
- MODE/VOL
- POTX
- POTY
- OSC3/RANDOM
- ENV3
