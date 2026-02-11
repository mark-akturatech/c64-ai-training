# MUSIC NOTE VALUES — Notes 82–123 (SID oscillator bytes)

**Summary:** Table of MUSIC note numbers 82–123 with decimal oscillator frequency values and the corresponding SID 16-bit frequency register bytes (HI = high byte, LOW = low byte). Includes data usable for writing the frequency low/high bytes into SID voice frequency registers at $D400-$D414.

**Oscillator frequency table (notes 82–123)**

This chunk reproduces the completed portion of the oscillator frequency table for note numbers 82 through 123 (approx. octaves D-5 through B-7). The "DECIMAL" column lists the 16-bit oscillator frequency value as a decimal (phase increment value). "LOW" and "HI" are the low and high bytes of that 16-bit value (LOW = least significant byte, HI = most significant byte). These bytes are the ones written to a SID voice's frequency registers (write LOW then HI to the voice's FREQ registers).

No code or register maps are repeated here — see the Source Code section for the exact table text.

## Source Code

```text
  +-----------------------------+-----------------------------------------+
  |        MUSICAL NOTE         |             OSCILLATOR FREQ             |
  +-------------+---------------+-------------+-------------+-------------+
  |     NOTE    |    OCTAVE     |   DECIMAL   |      HI     |     LOW     |
  +-------------+---------------+-------------+-------------+-------------+
  |      82     |      D-5      |     9634    |      37     |     162     |
  |      83     |      D#-5     |    10207    |      39     |     223     |
  |      84     |      E-5      |    10814    |      42     |      62     |
  |      85     |      F-5      |    11457    |      44     |     193     |
  |      86     |      F#-5     |    12139    |      47     |     107     |
  |      87     |      G-5      |    12860    |      50     |      60     |
  |      88     |      G#-5     |    13625    |      53     |      57     |
  |      89     |      A-5      |    14435    |      56     |      99     |
  |      90     |      A#-5     |    15294    |      59     |     190     |
  |      91     |      B-5      |    16203    |      63     |      75     |
  |      92     |      C-6      |    17167    |      67     |      15     |
  |      93     |      C#-6     |    18188    |      71     |      12     |
  |      94     |      D-6      |    19269    |      75     |      69     |
  |      95     |      D#-6     |    20415    |      79     |     191     |
  |      96     |      E-6      |    21629    |      84     |     125     |
  |      97     |      F-6      |    22915    |      89     |     131     |
  |      98     |      F#-6     |    24278    |      94     |     214     |
  |      99     |      G-6      |    25721    |     100     |     121     |
  |     100     |      G#-6     |    27251    |     106     |     115     |
  |     101     |      A-6      |    28871    |     112     |     199     |
  |     102     |      A#-6     |    30588    |     119     |     124     |
  |     103     |      B-6      |    32407    |     126     |     151     |
  |     104     |      C-7      |    34334    |     134     |      30     |
  |     105     |      C#-7     |    36376    |     142     |      24     |
  |     106     |      D-7      |    38539    |     150     |     139     |
  |     107     |      D#-7     |    40830    |     159     |     126     |
  |     108     |      E-7      |    43258    |     168     |     250     |
  |     109     |      F-7      |    45830    |     179     |       6     |
  |     110     |      F#-7     |    48556    |     189     |     172     |
  |     111     |      G-7      |    51443    |     200     |     243     |
  |     112     |      G#-7     |    54502    |     212     |     230     |
  |     113     |      A-7      |    57743    |     225     |     143     |
  |     114     |      A#-7     |    61176    |     238     |     248     |
  |     115     |      B-7      |    64814    |     253     |      46     |
  +-------------+---------------+-------------+-------------+-------------+
```

## Key Registers

- $D400-$D406 - SID (Voice 1 registers; FREQ LO at $D400, FREQ HI at $D401)
- $D407-$D40D - SID (Voice 2 registers; FREQ LO at $D407, FREQ HI at $D408)
- $D40E-$D414 - SID (Voice 3 registers; FREQ LO at $D40E, FREQ HI at $D40F)
- $D415-$D418 - SID (Filter and global SID registers)

## References

- "music_note_values_mid_octaves" — earlier portion of the oscillator frequency table (Note# 33–81)
- "sid_filter_settings_register_map" — related SID control and filter register mappings