# SID ADSR envelope generators

**Summary:** Explanation of the SID chip four-part ADSR envelope (Attack, Decay, Sustain, Release), with concrete numerical settings (hex values like $A/$F) and approximate times (ms). Covers typical envelopes for violin/strings, percussion (drums/cymbals), piano/harpsichord, organ, and an exotic "backwards" envelope; notes GATE behavior and creative combinations with harmonic content.

## Overview
The SID ADSR is a four-stage amplitude envelope: Attack (rise to peak), Decay (fall from peak to sustain level), Sustain (level held while GATE is set), and Release (fall to zero after GATE is cleared). Attack/Decay/Release are controlled by rate values (0–15, often shown hex $0–$F) which map to approximate times; Sustain is a level (0–15). For percussion-like sounds the decay can proceed to zero regardless of GATE; for sustained instruments the envelope holds at the SUSTAIN level while GATE remains true (GATE = key-on signal).

## Instrument example envelopes and behaviors
- Violin / sustained strings:
  - Slow attack to peak, decay to an intermediate sustain level, sustain can be held indefinitely while GATE is set, then slow release when GATE cleared.
  - Example rates from source: Attack $A (10) ≈ 500 ms; Decay 8 ≈ 300 ms; Sustain $A (10); Release 9 ≈ 750 ms.
  - Use case: models bowing where amplitude builds then holds at intermediate level.

- Percussion (drums, cymbals, gongs):
  - Nearly instantaneous attack to full volume, immediate decay to zero; decay continues regardless of GATE.
  - Example rates: Attack 0 ≈ 2 ms; Decay 9 ≈ 750 ms; Sustain 0; Release 9 ≈ 750 ms.
  - Use case: models struck percussive behavior with no sustain.

- Piano / harpsichord:
  - Instant full volume on key strike, amplitude immediately decays slowly while key is depressed; if key is released before decay finishes, amplitude drops rapidly to zero.
  - Example rates: Attack 0 ≈ 2 ms; Decay 9 ≈ 750 ms; Sustain 0; Release 0 ≈ 6 ms.
  - Note: decay phase occurs while GATE remains set; Release is fast when GATE is cleared.

- Organ:
  - Instant attack to full volume and held; instant drop to zero on key release.
  - Example rates: Attack 0 ≈ 2 ms; Decay 0 ≈ 6 ms; Sustain $F (15) (maximum); Release 0 ≈ 6 ms.
  - Use case: on/off steady tone.

- "Backwards" / exotic envelope:
  - Slow attack and rapid decay (produces a reverse-tape-like sound).
  - Example rates: Attack $A (10) ≈ 500 ms; Decay 0 ≈ 6 ms; Sustain $F (15); Release 3 ≈ 72 ms.
  - Use case: creates non-acoustic, experimental textures.

## Creative sound design
Combining ADSR shapes with different harmonic content (oscillator waveforms, ring-mod, sync, filtering) allows creation of novel timbres. Applying one instrument's envelope shape to another instrument's harmonic structure often yields recognizable yet distinct sounds. Experimentation with envelope rates and harmonic content is necessary to achieve target timbres.

## Source Code
```text
Violin / Sustained string envelope (ASCII snapshot from source):

    PEAK AMPLITUDE ---      +  <- SUSTAIN  ->
                           / \     PERIOD
                         A/  D\      S         R
                         /     +------------+
                        /       INTERMEDIATE +
                       /            LEVEL      +
    ZERO AMPLITUDE ---+                           +--

Violin example rates:
ATTACK:  10 ($A)     500 ms
DECAY:    8          300 ms
SUSTAIN: 10 ($A)
RELEASE:  9          750 ms

GATE behavior:
GATE+--------------+
  --+              +-----

Percussion (cymbal) envelope (ASCII snapshot):

ATTACK:   0       2 ms                        +
DECAY:    9     750 ms                        |+
SUSTAIN:  0                                   |  +
RELEASE:  9     750 ms                    ----+     +--
                                           A    D

Percussion example rates:
ATTACK: 0 (≈2 ms)
DECAY: 9 (≈750 ms)
SUSTAIN: 0
RELEASE: 9 (≈750 ms)

Piano / harpsichord envelope (ASCII snapshot):

ATTACK:   0       2 ms                        +
DECAY:    9     750 ms                        |+
SUSTAIN:  0                                   |  +
RELEASE:  0       6 ms                    ----+  +-----
                                               A  D R

Piano example rates:
ATTACK: 0 (≈2 ms)
DECAY: 9 (≈750 ms)
SUSTAIN: 0
RELEASE: 0 (≈6 ms)

Organ envelope (ASCII snapshot):

                                                +----+
ATTACK:   0       2 ms                        |    |
DECAY:    0       6 ms                        |    |
SUSTAIN: 15 ($F)                              |    |
RELEASE:  0       6 ms                    ----+    +---
                                               A   S  R

Organ example rates:
ATTACK: 0 (≈2 ms)
DECAY: 0 (≈6 ms)
SUSTAIN: $F (15)
RELEASE: 0 (≈6 ms)

Backwards envelope (ASCII snapshot):

ATTACK: 10 ($A) 500 ms                       A /           | R
DECAY:   0        6 ms                        /            +
SUSTAIN: 15 ($F)                             /              +
RELEASE:  3      72 ms                    --+                 +--

Backwards example rates:
ATTACK: $A (10) ≈ 500 ms
DECAY: 0 ≈ 6 ms
SUSTAIN: $F (15)
RELEASE: 3 ≈ 72 ms
```

## References
- "equal_tempered_musical_scale_values" — expands on oscillator frequency values and note generation
- "sid_pin_descriptions_pins_25_28" — expands on Volume control and audio output considerations