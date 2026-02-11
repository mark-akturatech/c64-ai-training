# MUSIC NOTE VALUES — SID frequency bytes (notes 0–32)

**Summary:** Table of Note#, musical note name, decimal SID oscillator frequency, and the HI/LOW bytes to POKE into the SID frequency registers (HI = MSB, LOW = LSB). Searchable terms: SID, $D400, $D401, oscillator frequency, HI FREQ, LOW FREQ.

**Overview**
This chunk is the start of the oscillator frequency table listing Note# 0 through 32 (C-0 through C-2 start). Each row provides:
- Note# — index used in the original table
- Musical note and octave (e.g., C-0, C#-0)
- Decimal oscillator frequency (the 16-bit frequency value)
- HI and LOW bytes (the two bytes that form the 16-bit frequency value)

Use the HI and LOW bytes as the two bytes to write into a SID voice frequency register pair (HI = most significant byte, LOW = least significant byte). (Combine as (HI << 8) + LOW = decimal frequency.)

## Source Code
```text
+-----------------------------+-----------------------------------------+
|        MUSICAL NOTE         |             OSCILLATOR FREQ             |
+-------------+---------------+-------------+-------------+-------------+
|     NOTE    |    OCTAVE     |   DECIMAL   |      HI     |     LOW     |
+-------------+---------------+-------------+-------------+-------------+
|       0     |      C-0      |     268     |       1     |      12     |
|       1     |      C#-0     |     284     |       1     |      28     |
|       2     |      D-0      |     301     |       1     |      45     |
|       3     |      D#-0     |     318     |       1     |      62     |
|       4     |      E-0      |     337     |       1     |      81     |
|       5     |      F-0      |     358     |       1     |     102     |
|       6     |      F#-0     |     379     |       1     |     123     |
|       7     |      G-0      |     401     |       1     |     145     |
|       8     |      G#-0     |     425     |       1     |     169     |
|       9     |      A-0      |     451     |       1     |     195     |
|      10     |      A#-0     |     477     |       1     |     221     |
|      11     |      B-0      |     506     |       1     |     250     |
|      12     |      C-1      |     536     |       2     |      24     |
|      13     |      C#-1     |     568     |       2     |      56     |
|      14     |      D-1      |     602     |       2     |      90     |
|      15     |      D#-1     |     637     |       2     |     125     |
|      16     |      E-1      |     675     |       2     |     163     |
|      17     |      F-1      |     716     |       2     |     204     |
|      18     |      F#-1     |     758     |       2     |     246     |
|      19     |      G-1      |     803     |       3     |      35     |
|      20     |      G#-1     |     851     |       3     |      83     |
|      21     |      A-1      |     902     |       3     |     134     |
|      22     |      A#-1     |     955     |       3     |     187     |
|      23     |      B-1      |    1012     |       3     |     244     |
|      24     |      C-2      |    1072     |       4     |      48     |
|      25     |      C#-2     |    1136     |       4     |     112     |
|      26     |      D-2      |    1204     |       4     |     180     |
|      27     |      D#-2     |    1274     |       4     |     250     |
|      28     |      E-2      |    1349     |       5     |      69     |
|      29     |      F-2      |    1428     |       5     |     148     |
|      30     |      F#-2     |    1509     |       5     |     229     |
|      31     |      G-2      |    1594     |       6     |      54     |
|      32     |      G#-2     |    1683     |       6     |     147     |
+-------------+---------------+-------------+-------------+-------------+
```

## Key Registers
- $D400-$D401 - SID - Voice 1 frequency low/high (LOW = LSB at $D400, HI = MSB at $D401)
- $D407-$D408 - SID - Voice 2 frequency low/high (analogous pair for voice 2)
- $D40E-$D40F - SID - Voice 3 frequency low/high (analogous pair for voice 3)

## References
- "music_note_values_mid_octaves" — continuation of oscillator frequency table (next note ranges)