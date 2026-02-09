# SID ADSR Envelope Generator (per-voice)

**Summary:** ADSR envelope operation for the SID 6581/8580 per voice (Attack, Decay, Sustain, Release), timing table mapping ADSR nibble values (0–15) to approximate Attack/Decay/Release times, retrigger behavior, and PAL/NTSC / internal counter caveats.

## ADSR envelope generator
Each SID voice has an independent ADSR envelope generator with these stages:
- Attack — when the GATE bit is set to 1 the amplitude rises from 0 to peak (255) at the selected Attack rate.
- Decay — after peak, amplitude falls toward the Sustain level at the selected Decay rate.
- Sustain — a LEVEL (0–15), not a rate; Sustain holds while GATE = 1. 15 = full volume.
- Release — when GATE is cleared (0) amplitude falls from the current level to 0 at the Release rate.

Behavioral details preserved from the source:
- Attack time is measured 0 → 255. Decay and Release times are measured peak (255) → 0.
- Re-trigger behavior: setting GATE = 1 again before a Release finishes restarts the Attack phase from the current amplitude level (not necessarily from 0).
- The envelope counter uses non-linear internal rate counting, producing the SID’s characteristic exponential-like decay/release curves.
- Actual times vary slightly with clock rate (PAL vs NTSC) and due to the internal non-linear counters.

## Source Code
```text
ADSR TIMING TABLE (nibble 0-15 -> approximate times)

Value | Attack Time | Decay Time  | Release Time
------+-------------+-------------+--------------
  0   |     2 ms    |     6 ms    |     6 ms
  1   |     8 ms    |    24 ms    |    24 ms
  2   |    16 ms    |    48 ms    |    48 ms
  3   |    24 ms    |    72 ms    |    72 ms
  4   |    38 ms    |   114 ms    |   114 ms
  5   |    56 ms    |   168 ms    |   168 ms
  6   |    68 ms    |   204 ms    |   204 ms
  7   |    80 ms    |   240 ms    |   240 ms
  8   |   100 ms    |   300 ms    |   300 ms
  9   |   250 ms    |   750 ms    |   750 ms
 10   |   500 ms    |   1.5 s     |    1.5 s
 11   |   800 ms    |   2.4 s     |    2.4 s
 12   |     1 s     |     3 s     |      3 s
 13   |     3 s     |     9 s     |      9 s
 14   |     5 s     |    15 s     |     15 s
 15   |     8 s     |    24 s     |     24 s

Notes:
- Attack: time from 0 to peak amplitude (255).
- Decay & Release: times measured from peak (255) to 0.
- Times are approximate; PAL vs NTSC clock differences and internal non-linear rate counting cause variations and the observed exponential-like curves.
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency, pulse width, control, Attack/Decay, Sustain/Release)
- $D407-$D40D - SID - Voice 2 registers (frequency, pulse width, control, Attack/Decay, Sustain/Release)
- $D40E-$D414 - SID - Voice 3 registers (frequency, pulse width, control, Attack/Decay, Sustain/Release)
- $D415-$D418 - SID - Filter and global control registers

## References
- "adsr_bug" — expands on known ADSR bug and workarounds
- "voice1_registers" — expands on ADSR register encodings $D405/$D406