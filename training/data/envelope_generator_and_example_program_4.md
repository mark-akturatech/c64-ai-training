# Commodore 64 SID ADSR (Voice 1 — $D405/$D406)

**Summary:** Definitions of the ADSR envelope (Attack, Decay, Sustain, Release) and how they shape amplitude over time; SID register mapping for Voice 1 ADSR ($D405 = Attack/Decay, $D406 = Sustain/Release); example BASIC POKE values (POKE s+5,88 and POKE s+6,195) with nibble decoding.

**The Envelope Generator**

ADSR describes the four phases of a note's amplitude envelope:

- **Attack** — time for amplitude to rise from 0 to peak when a note begins.
- **Decay** — time for amplitude to fall from peak to the sustain level.
- **Sustain** — the steady amplitude level held while the note is sustained.
- **Release** — time for amplitude to fall from sustain level to 0 when the note ends.

On the SID (MOS 6581/8580), each voice's ADSR is programmed with two 8-bit registers:

- **Attack/Decay register (voice n)**: high nibble = Attack (0–15), low nibble = Decay (0–15).
- **Sustain/Release register (voice n)**: high nibble = Sustain level (0–15), low nibble = Release (0–15).

Values are 4-bit (0..15). The SID uses these 4-bit fields to index internal time/level constants. Changing these nibbles alters the envelope shape and perceived articulation of the note.

The following table provides the approximate timing constants for each ADSR value:

| Value | Attack Time | Decay Time | Release Time |
|-------|-------------|------------|--------------|
| 0     | 2 ms        | 6 ms       | 6 ms         |
| 1     | 8 ms        | 24 ms      | 24 ms        |
| 2     | 16 ms       | 48 ms      | 48 ms        |
| 3     | 24 ms       | 72 ms      | 72 ms        |
| 4     | 38 ms       | 114 ms     | 114 ms       |
| 5     | 56 ms       | 168 ms     | 168 ms       |
| 6     | 68 ms       | 204 ms     | 204 ms       |
| 7     | 80 ms       | 240 ms     | 240 ms       |
| 8     | 100 ms      | 0.3 s      | 0.3 s        |
| 9     | 0.25 s      | 0.75 s     | 0.75 s       |
| 10    | 0.5 s       | 1.5 s      | 1.5 s        |
| 11    | 0.8 s       | 2.4 s      | 2.4 s        |
| 12    | 1 s         | 3 s        | 3 s          |
| 13    | 3 s         | 9 s        | 9 s          |
| 14    | 5 s         | 15 s       | 15 s         |
| 15    | 8 s         | 24 s       | 24 s         |

*Note: These values assume a clock rate of 1 MHz. Actual times may vary slightly depending on the system's clock rate.*

Example from the provided BASIC program (s = 54272 decimal = $D400):

- `POKE s+5,88` sets $D405 = 88 decimal = $58 hex → Attack = 0x5 = 5, Decay = 0x8 = 8.
- `POKE s+6,195` sets $D406 = 195 decimal = $C3 hex → Sustain = 0xC = 12, Release = 0x3 = 3.

The program uses these pokes to modify Voice 1's waveform/envelope at runtime. The control register and waveform bits (e.g., gate bit to start/stop note) are elsewhere in the voice register set (see register map in Key Registers).

## Source Code

```basic
5 s=54272
10 for l = s to s+24 : poke l,0 : next
20 poke s+5,88 : poke s+6,195
30 poke s+24,15
40 read hf,lf,dr
50 if hf<0 then end
60 poke s+1,hf : poke s,lf
70 poke s+4,33
80 for t=1 to dr : next
90 poke s+4,32 : for t=1 to 50 : next
100 goto 40
110 data 25,177,250,28,214,250
120 data 25,177,250,25,177,250
130 data 25,177,125,28,214,125
140 data 32,94,750,25,177,250
150 data 28,214,250,19,63,250
160 data 19,63,250,19,63,250
170 data 21,154,63,24,63,63
180 data 25,177,250,24,63,125
190 data 19,63,250,-1,-1,-1
```

ASCII sketch of ADSR:

```text
                              +
                             / \
                            /   \
                           /     \
         SUSTAIN LEVEL . ./. . . .+--------+
                         /                  \
                        /                    \
                       /                      \

                       |      |   |        |   |
                       |   A  | D |    S   | R |
```

## Key Registers

- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width low/high, control, Attack/Decay, Sustain/Release)

## References

- "adsr_table_and_examples" — attack/decay/release numeric table and example settings
- "example_program_1_code_and_explanation" — base program where ADSR changes are applied