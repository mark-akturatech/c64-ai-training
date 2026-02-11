# SID 6581/8580 — Read-only registers $D419–$D41C (Paddle X/Y, Voice 3 outputs)

**Summary:** Read-only SID registers $D419–$D41C provide Paddle X/Y analog samples and Voice 3 real-time outputs (oscillator upper 8 bits and ADSR envelope 0–255). Useful for software modulation (LFO/vibrato/tremolo) and envelope-following; paddles update every 512 cycles.

**Read-only registers $D419–$D41C**

$D419–$D41C are read-only SID registers providing external analog input samples and instantaneous Voice 3 output values:

- **$D419 — PADDLE X**
  - 8-bit value (bits 7–0). Current analog sample from Paddle X input.
  - Update rate: updated every 512 cycles.

- **$D41A — PADDLE Y**
  - 8-bit value (bits 7–0). Current analog sample from Paddle Y input.
  - Update rate: updated every 512 cycles.

- **$D41B — VOICE 3 OSCILLATOR OUTPUT (upper 8 bits)**
  - 8-bit value (bits 7–0). Upper 8 bits of the Voice 3 waveform generator instantaneous output.
  - Waveform mappings:
    - Sawtooth: ramps 0 → 255 repeatedly
    - Triangle: ramps 0 → 255 then 255 → 0
    - Pulse: alternates between 0 and 255
    - Noise: pseudo-random values
  - Intended use: software modulation sources (LFO, vibrato, tremolo) or waveform sampling.

- **$D41C — VOICE 3 ENVELOPE OUTPUT**
  - 8-bit value (bits 7–0). Current value of Voice 3's ADSR envelope generator (0–255).
  - Independent from oscillator output; useful for envelope-following and modulation (e.g., filter sweeps driven by envelope amplitude).

**Timing notes:**

- **Paddle registers ($D419, $D41A):** Updated every 512 cycles.
- **Voice 3 registers ($D41B, $D41C):** Provide instantaneous values of the oscillator and envelope outputs. The SID's internal oscillator and envelope generators operate continuously, and these registers reflect their current states at the moment of reading. No explicit update/sample-rate or synchronization details are specified for these registers in the available documentation.

## Source Code

```text
3.5 READ-ONLY REGISTERS ($D419–$D41C)

$D419 / 54297 - PADDLE X (Read-only)
  Bits 7–0: Current analog value from Paddle X input (updated every 512 cycles)

$D41A / 54298 - PADDLE Y (Read-only)
  Bits 7–0: Current analog value from Paddle Y input (updated every 512 cycles)

$D41B / 54299 - VOICE 3 OSCILLATOR OUTPUT (Read-only)
  Bits 7–0: Upper 8 bits of Voice 3 oscillator waveform output
  Returns the current instantaneous value of Voice 3's waveform generator.
  This value reflects the selected waveform shape:
    Sawtooth:  Ramps 0 to 255 repeatedly
    Triangle:  Ramps 0 to 255 then 255 to 0
    Pulse:     Alternates between 0 and 255
    Noise:     Random values
  Useful for software-based modulation effects (LFO, vibrato, tremolo).

$D41C / 54300 - VOICE 3 ENVELOPE OUTPUT (Read-only)
  Bits 7–0: Current value of Voice 3's ADSR envelope generator (0–255)
  Independent of oscillator output.
  Useful for envelope-following and modulation effects.
```

## Key Registers

- $D419–$D41C - SID - Read-only: Paddle X/Y samples, Voice 3 oscillator upper 8 bits, Voice 3 ADSR envelope output

## References

- "voice3_modulation_source" — expands on using $D41B/$D41C for vibrato/tremolo/filter sweeps
- "complete_register_map_intro" — expands on which registers are read-only vs write-only

## Labels
- PADDLE_X
- PADDLE_Y
- VOICE3_OSC
- VOICE3_ENV
