# SID 6581/8580 — Triangle waveform (TRIANGLE bit)

**Summary:** Triangle waveform on the SID (TRIANGLE bit in each voice control register) produces a linear up/down ramp with only odd harmonics (3rd, 5th, 7th...), harmonic amplitudes ∝ 1/n^2, yielding a soft flute-like tone; it can be used for ring modulation (with the RING MOD bit) and as a smooth LFO source (commonly on Voice 3).

## Description
- Waveform: linear ramp up then down (triangle).
- Spectral content: contains only ODD harmonics (fundamental plus 3rd, 5th, 7th, ...). Harmonic amplitudes fall off proportional to 1/(n^2) where n is the harmonic number.
- Timbre: produces a soft, flute-like tone because higher harmonics drop quickly.
- Ring modulation: the SID supports ring modulation when the RING MOD bit is set; the TRIANGLE waveform is commonly used in ring-modulation configurations (the TRIANGLE bit must be enabled on the voice participating in ring modulation).
- Modulation/LFO: triangle is useful as a smooth modulation source (low-frequency triangle gives continuous linear up/down modulation); Voice 3 is often used as a modulation source for other voices.

## Source Code
```text
SID Voice Control register (per-voice) - bit map (write-only)
Bit 7  Bit 6   Bit 5    Bit 4    Bit 3   Bit 2     Bit 1   Bit 0
-----------------------------------------------
Noise  Pulse   Sawtooth Triangle  Test    RingMod   Sync    Gate
0x80   0x40    0x20     0x10     0x08    0x04      0x02    0x01

Notes:
- TRIANGLE bit = 0x10
- RING MOD bit = 0x04
- GATE (bit0) starts envelope; TEST (bit3) affects oscillator/testing functions.
- Multiple waveform bits may be set simultaneously (e.g., pulse + triangle).
```

```asm
; Example: enable Triangle + Gate on Voice 1, and set Ring Mod on Voice 2
; (illustrative; write-only registers)
    LDA #$11        ; 0x10 = TRIANGLE, 0x01 = GATE
    STA $D404       ; Voice 1 control register

    LDA #$04        ; 0x04 = RING MOD
    STA $D40B       ; Voice 2 control register (set ring-mod bit)
```

## Key Registers
- $D400-$D406 - SID (Voice 1) - frequency, pulse, control (TRIANGLE bit at $D404)
- $D407-$D40D - SID (Voice 2) - frequency, pulse, control (RING MOD bit at $D40B)
- $D40E-$D414 - SID (Voice 3) - frequency, pulse, control (often used as LFO; TRIANGLE bit at $D412)
- $D415-$D418 - SID - filter and global controls

## References
- "ring_modulation" — ring modulation details and requirements
- "voice3_modulation_source" — using Voice 3 triangle as a smooth LFO source