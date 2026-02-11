# SID (Sound Interface Device) Overview

**Summary:** The SID chip (Sound Interface Device) is a 3-voice synthesizer integrated into the Commodore 64, offering:
- Frequency control spanning more than six octaves.
- Per-voice ADSR envelope controls (Attack, Decay, Sustain, Release).
- Multiple waveforms: triangle, sawtooth, pulse (with pulse-width modulation), and noise.
- Channel 3 noise mode exposes a changing amplitude value the CPU can read as a random number.

**Overview**

The SID is a 3-voice synthesizer integrated into the Commodore 64. Each voice provides:
- Frequency control spanning more than six octaves.
- An ADSR envelope (Attack, Decay, Sustain, Release) to shape amplitude over time.
- Independent waveform selection per voice.

These features enable a wide range of timbres, making the SID a versatile sound generator.

**Waveforms**

The SID offers four primary waveforms:

- **Triangle:** Produces a smooth, soft tone, approximating a sine wave with relatively low harmonic content.
- **Sawtooth:** Generates a brighter tone with stronger harmonics due to its sharp edges.
- **Pulse (Square):** Offers a biting tone; the SID provides pulse-width modulation to vary the waveform's symmetry, altering its harmonic content.
- **Noise:** Produces a random signal at the oscillator frequency, useful for non-tonal effects like explosions or wind.

Below are ASCII representations of these waveforms:

## Source Code

```text
Triangle Waveform:
   /\
  /  \
 /    \
/      \
```

```text
Sawtooth Waveform:
    /|
   / |
  /  |
 /   |
/    |
```

```text
Pulse (Square) Waveform:
____    ____
    |  |
    |  |
    |  |
```

```text
Noise Waveform:
|\/|\/|\/|\/|\/|\/|\/|\/|
```


**Noise and CPU-readable Random Values**

When channel 3 is set to produce noise, the instantaneous amplitude of that waveform can be read by the CPU at any time. Because the noise amplitude is continually changing at the oscillator rate, the read value serves as a source of (pseudo)random numbers for software.

## References

- "sid_filters_and_subtractive_synthesis" — expands on sending voices through SID filters for richer timbres
- "sound_generator_demo" — demo of SID waveforms and envelopes