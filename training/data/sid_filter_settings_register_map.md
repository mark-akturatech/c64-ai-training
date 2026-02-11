# SID Filter Settings ($D415–$D418)

**Summary:** SID filter configuration registers and bitfields for the C64 SID chip (addresses $D415–$D418 / decimal 54293–54296). Defines Low cutoff (3-bit LSB), High cutoff (8-bit MSB), Resonance and per-voice filter enables, Filter type bits (HP/BP/LP), and global volume (4 bits).

**Description**

This chunk documents the four SID registers used to configure the filter:

- Two registers form the 11-bit cutoff frequency: a 3-bit low part (0–7) and an 8-bit high part (0–255). Together they make the filter cutoff value (11-bit).
- A register holds resonance (4 bits) plus per-voice filter enable bits (voice 1 = bit 0, voice 2 = bit 1, voice 3 = bit 2, external input = bit 3).
- A register holds filter type selection bits and global output volume (4 bits).

Bit/field summary:

- **Low cutoff:** value 0–7 (3 bits, LSB part of cutoff)
- **High cutoff:** value 0–255 (8 bits, MSB part of cutoff)
- **Resonance:** bits 4–7 (4-bit resonance)
- **Filter voice enables:**
  - bit 0 = voice 1
  - bit 1 = voice 2
  - bit 2 = voice 3
  - bit 3 = external input
- **Filter types:**
  - bit 6 = High pass
  - bit 5 = Bandpass
  - bit 4 = Low pass
- **Volume:** bits 0–3 (4-bit global volume)

**Note:** The correct addresses for the SID filter settings are $D415–$D418 (decimal 54293–54296).

## Source Code

```text
                              FILTER SETTINGS
               +------------+--------------------------------+
               |  Location  |            Contents            |
               +------------+--------------------------------+
               |    54293   |  Low cutoff frequency (0–7)    |
               |    54294   |  High cutoff frequency (0–255) |
               |    54295   |  Resonance (bits 4–7)          |
               |            |  Filter voice 3 (bit 2)        |
               |            |  Filter voice 2 (bit 1)        |
               |            |  Filter voice 1 (bit 0)        |
               |            |  External input (bit 3)        |
               |    54296   |  High pass (bit 6)             |
               |            |  Bandpass (bit 5)              |
               |            |  Low pass (bit 4)              |
               |            |  Volume (bits 0–3)             |
               +------------+--------------------------------+
```

## Key Registers

- $D415–$D418 – SID – Filter cutoff low, cutoff high, resonance + per-voice filter enables, filter type bits (HP/BP/LP), and global volume

## References

- "music_note_values_high_octaves" — oscillator frequency / note-to-frequency table referenced by the preceding appendix content