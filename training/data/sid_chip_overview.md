# MOS 6581 (SID) — High-level overview

**Summary:** The MOS 6581 SID is a three-voice synthesizer featuring tone oscillators, waveform generators, envelope generators, amplitude modulators, programmable ADSR envelopes, a subtractive filter, readable third oscillator/envelope for modulation or random number generation, two A/D inputs for potentiometers, and support for external audio processing.

**Description**

The 6581 SID is a three-voice sound synthesizer. Each voice contains:

- **Tone Oscillator / Waveform Generator:** Controls pitch across a wide range and produces four selectable waveforms—triangle, sawtooth, pulse (with variable duty cycle), and noise—to shape tone color.

- **Envelope Generator:** Produces a triggered amplitude envelope with programmable rates for Attack, Decay, Sustain, and Release (ADSR).

- **Amplitude Modulator:** Applies the envelope to the oscillator output to control volume dynamics.

A programmable analog filter is provided for subtractive synthesis, allowing dynamic timbral changes by removing harmonics from one or more voice outputs.

The chip permits the CPU to read the instantaneous output of the third oscillator and the third envelope generator. These readable signals can be used as modulation sources (e.g., for vibrato or frequency sweeps), or the third oscillator can serve as a pseudo-random source for game logic.

Two A/D converters are included for interfacing with potentiometers, commonly used for paddles or front-panel controls in synthesizer setups.

SID supports processing of external audio signals, allowing multiple SID chips or external audio sources to be chained or mixed for expanded polyphony and complex audio routing.

## Source Code

```text
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|  Oscillator 1     |       |  Oscillator 2     |       |  Oscillator 3     |
|  Waveform Gen.    |       |  Waveform Gen.    |       |  Waveform Gen.    |
|                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
          |                           |                           |
          v                           v                           v
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|  Envelope Gen.    |       |  Envelope Gen.    |       |  Envelope Gen.    |
|                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
          |                           |                           |
          v                           v                           v
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|  Amplitude Mod.   |       |  Amplitude Mod.   |       |  Amplitude Mod.   |
|                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
          |                           |                           |
          +-----------+---------------+---------------+-----------+
                      |                               |
                      v                               v
              +-------------------+           +-------------------+
              |                   |           |                   |
              |   Analog Filter    |<--EXT IN--| External Audio In |
              |                   |           |                   |
              +-------------------+           +-------------------+
                      |
                      v
              +-------------------+
              |                   |
              |    Audio Output    |
              |                   |
              +-------------------+
```

This block diagram illustrates the internal architecture of the MOS 6581 SID chip, highlighting the three independent voices, each comprising an oscillator, envelope generator, and amplitude modulator. The outputs of these voices are mixed and processed through an analog filter, with provisions for external audio input and final audio output.

## Key Registers

The MOS 6581 SID chip is controlled through a series of memory-mapped registers, each responsible for specific parameters of sound generation and modulation. Below is a summary of these registers:

- **Voice 1 Registers:**
  - **$D400 (54272):** Frequency Control Low Byte
  - **$D401 (54273):** Frequency Control High Byte
  - **$D402 (54274):** Pulse Width Low Byte
  - **$D403 (54275):** Pulse Width High Byte (only lower 4 bits used)
  - **$D404 (54276):** Control Register
    - **Bits 0-3:** Waveform selection
    - **Bit 4:** Test bit
    - **Bit 5:** Ring modulation enable
    - **Bit 6:** Synchronization enable
    - **Bit 7:** Gate (start/stop envelope)
  - **$D405 (54277):** Attack/Decay
    - **Bits 0-3:** Decay rate
    - **Bits 4-7:** Attack rate
  - **$D406 (54278):** Sustain/Release
    - **Bits 0-3:** Release rate
    - **Bits 4-7:** Sustain level

- **Voice 2 Registers:** (Offsets $D407 to $D40C)
  - Same structure as Voice 1 registers.

- **Voice 3 Registers:** (Offsets $D40D to $D412)
  - Same structure as Voice 1 registers.

- **Filter and Volume Control:**
  - **$D415 (54293):** Filter Cutoff Low Byte
  - **$D416 (54294):** Filter Cutoff High Byte (only lower 3 bits used)
  - **$D417 (54295):** Filter Resonance and Voice Routing
    - **Bits 0-3:** Resonance control
    - **Bits 4-6:** Voice filter select
    - **Bit 7:** External input filter enable
  - **$D418 (54296):** Mode and Volume
    - **Bits 0-3:** Volume control
    - **Bits 4-6:** Filter mode select (low-pass, band-pass, high-pass)
    - **Bit 7:** Notch filter enable

- **Potentiometer and Oscillator Read Registers:**
  - **$D419 (54297):** Potentiometer X input
  - **$D41A (54298):** Potentiometer Y input
  - **$D41B (54299):** Oscillator 3 output
  - **$D41C (54300):** Envelope 3 output

These registers provide comprehensive control over the SID's sound generation capabilities, allowing for intricate sound design and modulation.

## References

- Commodore 64 Programmer's Reference Guide
- MOS 6581 SID Datasheet