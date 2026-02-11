# MUSIC NOTE VALUES — Notes 33–81 (SID frequency HI/LOW bytes)

**Summary:** Table of musical Note# 33–81 (approx. octaves C#-2 through C#-5) giving the 16-bit SID oscillator frequency (decimal) and the corresponding HI/LOW register byte values for writing to SID frequency registers ($D400 family). Decimal frequency = (HI * 256) + LOW; write LOW then HI to the SID (LSB first).

## Details
This chunk lists Note numbers 33 through 81 with:
- Octave label (musical pitch),
- Decimal oscillator frequency (16-bit SID frequency word),
- HI and LOW bytes (decimal) — the high and low 8-bit parts of that 16-bit value.

Use the LOW byte at the low-address SID frequency register and the HI byte at the high-address frequency register. For example:
- Frequency word = HI * 256 + LOW
- Write sequence (LSB first): STA $D400 (LOW), STA $D401 (HI) for Voice 1 (example).

Voice frequency register address pairs (per voice) are given in Key Registers below.

## Source Code
```text
+-------+---------+---------+-----+-----+
| NOTE# | OCTAVE  | DECIMAL | HI  | LOW |
+-------+---------+---------+-----+-----+
|   33  |  C#-2   |   1136  |  4  | 112 |
|   34  |  D-2    |   1204  |  4  | 180 |
|   35  |  D#-2   |   1275  |  4  | 251 |
|   36  |  E-2    |   1351  |  5  |  71 |
|   37  |  F-2    |   1432  |  5  | 152 |
|   38  |  F#-2   |   1517  |  5  | 237 |
|   39  |  G-2    |   1607  |  6  |  71 |
|   40  |  G#-2   |   1703  |  6  | 167 |
|   41  |  A-2    |   1804  |  7  |  12 |
|   42  |  A#-2   |   1911  |  7  | 119 |
|   43  |  B-2    |   2025  |  7  | 233 |
|   48  |  C-3    |   2145  |  8  |  97 |
|   49  |  C#-3   |   2273  |  8  | 225 |
|   50  |  D-3    |   2408  |  9  | 104 |
|   51  |  D#-3   |   2551  |  9  | 247 |
|   52  |  E-3    |   2703  | 10  | 143 |
|   53  |  F-3    |   2864  | 11  |  48 |
|   54  |  F#-3   |   3034  | 11  | 218 |
|   55  |  G-3    |   3215  | 12  | 143 |
|   56  |  G#-3   |   3406  | 13  |  78 |
|   57  |  A-3    |   3608  | 14  |  24 |
|   58  |  A#-3   |   3823  | 14  | 239 |
|   59  |  B-3    |   4050  | 15  | 210 |
|   64  |  C-4    |   4291  | 16  | 195 |
|   65  |  C#-4   |   4547  | 17  | 195 |
|   66  |  D-4    |   4817  | 18  | 209 |
|   67  |  D#-4   |   5103  | 19  | 239 |
|   68  |  E-4    |   5407  | 21  |  31 |
|   69  |  F-4    |   5728  | 22  |  96 |
|   70  |  F#-4   |   6069  | 23  | 181 |
|   71  |  G-4    |   6430  | 25  |  30 |
|   72  |  G#-4   |   6812  | 26  | 156 |
|   73  |  A-4    |   7217  | 28  |  49 |
|   74  |  A#-4   |   7647  | 29  | 223 |
|   75  |  B-4    |   8101  | 31  | 165 |
|   80  |  C-5    |   8583  | 33  | 135 |
|   81  |  C#-5   |   9094  | 35  | 134 |
+-------+---------+---------+-----+-----+
```

## Key Registers
- $D400-$D401 - SID (6581/8580) Voice 1 frequency low/high (LOW => $D400, HI => $D401)
- $D407-$D408 - SID Voice 2 frequency low/high (LOW => $D407, HI => $D408)
- $D40E-$D40F - SID Voice 3 frequency low/high (LOW => $D40E, HI => $D40F)
- $D400-$D406 - SID Voice 1 registers (freq, pw, control, ADSR)
- $D407-$D40D - SID Voice 2 registers (freq, pw, control, ADSR)
- $D40E-$D414 - SID Voice 3 registers (freq, pw, control, ADSR)

## References
- "music_note_values_intro_and_low_octaves" — previous page: Note# 0–32 and table header
- "music_note_values_high_octaves" — next page: Note# 82–123 and table completion