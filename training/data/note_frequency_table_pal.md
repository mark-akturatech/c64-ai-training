# SID 6581/8580 — Note Frequency Table (PAL)

**Summary:** 16-bit SID frequency register values (PAL clock 985248 Hz) for notes C–B across octaves 0–7, with the precise-frequency formula Fn = round((NoteHz * 16777216) / 985248) and example A4 = 440 Hz -> Fn = $1CC8 (7368).

## Overview
This packet provides approximate 16-bit SID frequency register (Fn) values for each chromatic note C..B across octaves 0–7 using the PAL master clock 985248 Hz. Values are given as 16-bit register words (hex). For exact tuning compute Fn from the note frequency in Hz using the provided formula (the SID phase increment uses a 24-bit accumulator scale factor 2^24 = 16,777,216).

Example: standard tuning A4 = 440.0 Hz:
Fn = round((440 * 16777216) / 985248) = 7368 decimal = $1CC8.

Use the formula with your desired NoteHz (Hz for the intended pitch) to get a precise 16-bit frequency register value.

## Source Code
```text
6.2 NOTE FREQUENCY TABLE (PAL)

Octave 0-7, 16-bit SID frequency register values (PAL clock = 985248 Hz):

Note    Oct 0   Oct 1   Oct 2   Oct 3   Oct 4   Oct 5   Oct 6   Oct 7
------  ------  ------  ------  ------  ------  ------  ------  ------
C       0x0112  0x0224  0x0448  0x0890  0x1120  0x2240  0x4480  0x8900
C#/Db   0x0123  0x0245  0x048B  0x0915  0x122A  0x2454  0x48A8  0x9151
D       0x0134  0x0268  0x04D0  0x09A1  0x1341  0x2682  0x4D04  0x9A08
D#/Eb   0x0146  0x028D  0x0519  0x0A33  0x1466  0x28CC  0x5198  0xA330
E       0x015A  0x02B3  0x0567  0x0ACE  0x159C  0x2B39  0x5672  0xACE4
F       0x016E  0x02DC  0x05B8  0x0B70  0x16E0  0x2DC0  0x5B80  0xB700
F#/Gb   0x0184  0x0308  0x060F  0x0C1E  0x183C  0x3078  0x60F0  0xC1E0
G       0x019B  0x0335  0x066A  0x0CD4  0x19A8  0x3350  0x66A1  0xCD42
G#/Ab   0x01B3  0x0366  0x06CB  0x0D97  0x1B2E  0x365C  0x6CB8  0xD970
A       0x01CD  0x0399  0x0732  0x0E64  0x1CC8  0x3990  0x7320  0xE640
A#/Bb   0x01E8  0x03CF  0x079F  0x0F3E  0x1E7C  0x3CF8  0x79F0  0xF3E0
B       0x0204  0x0409  0x0811  0x1023  0x2046  0x408C  0x8119  0xFF32

Note: These values are approximate. For precise tuning, calculate using the
formula: Fn = round((NoteHz * 16777216) / 985248)

Standard tuning reference: A4 = 440 Hz -> Fn = $1CC8 (7368)
```

## Key Registers
- $D400-$D406 - SID (Voice 1) - Frequency low/high, Pulse Width low/high, Control, Envelope
- $D407-$D40D - SID (Voice 2) - Frequency low/high, Pulse Width low/high, Control, Envelope
- $D40E-$D414 - SID (Voice 3) - Frequency low/high, Pulse Width low/high, Control, Envelope
- $D415-$D418 - SID - Filter and global registers

## References
- "frequency_calculation" — expands on formula used to compute table values