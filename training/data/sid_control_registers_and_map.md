# COMMODORE 64 - SID control registers (6581)

**Summary:** 6581 SID register map (29 × 8-bit registers) at base $D400 ($D400–$D41C). Lists write-only (WO) voice registers (Freq, Pulse, Control, Envelope), filter registers (cutoff, resonance, mode/volume), and read-only (RO) POT/OSC/ENV readbacks.

**SID control registers overview**
The SID contains 29 eight-bit registers (either write-only or read-only) arranged as Voice 1–3, Filter, and Miscellaneous read registers. Each voice has frequency low/high, pulse width low/high, waveform/control, and envelope ADSR (Attack/Decay and Sustain/Release). The filter uses an 11-bit cutoff (FC0..FC10), a resonance/FILTEX register, and a MODE/VOLUME register containing HP/BP/LP enable bits and the global volume. Miscellaneous read registers expose paddles/potentiometers (POT X/Y), oscillator 3 output/random, and envelope 3 readback.

Register addresses are offsets $00–$1C from the SID base ($D400). Types are given as WO (write-only) or RO (read-only).

## Source Code
```text
Table 1. SID Register Map            WO=WRITE-ONLY  RO=READ-ONLY
REG#   (HEX)  D7    D6    D5    D4    D3    D2    D1    D0   REG NAME       REG TYPE

Voice 1
00     00    F7    F6    F5    F4    F3    F2    F1    F0   FREQ LO         WO
01     01    F15   F14   F13   F12   F11   F10   F9    F8   FREQ HI         WO
02     02    PW7   PW6   PW5   PW4   PW3   PW2   PW1   PW0  PW LO           WO
03     03     -     -     -     -   PW11  PW10   PW9   PW8  PW HI           WO
04     04  NOISE PULSE  SAW TRIANG TEST  RING  SYNC  GATE  CONTROL REG     WO
05     05  ATK3  ATK2  ATK1  ATK0  DCY3  DCY2  DCY1  DCY0  ATTACK/DECAY    WO
06     06  STN3  STN2  STN1  STN0  RLS3  RLS2  RLS1  RLS0  SUSTAIN/RELEASE WO

Voice 2
07     07    F7    F6    F5    F4    F3    F2    F1    F0   FREQ LO         WO
08     08    F15   F14   F13   F12   F11   F10   F9    F8   FREQ HI         WO
09     09    PW7   PW6   PW5   PW4   PW3   PW2   PW1   PW0  PW LO           WO
0A     0A     -     -     -     -   PW11  PW10   PW9   PW8  PW HI           WO
0B     0B  NOISE PULSE  SAW TRIANG TEST  RING  SYNC  GATE  CONTROL REG     WO
0C     0C  ATK3  ATK2  ATK1  ATK0  DCY3  DCY2  DCY1  DCY0  ATTACK/DECAY    WO
0D     0D  STN3  STN2  STN1  STN0  RLS3  RLS2  RLS1  RLS0  SUSTAIN/RELEASE WO

Voice 3
0E     0E    F7    F6    F5    F4    F3    F2    F1    F0   FREQ LO         WO
0F     0F    F15   F14   F13   F12   F11   F10   F9    F8   FREQ HI         WO
10     10    PW7   PW6   PW5   PW4   PW3   PW2   PW1   PW0  PW LO           WO
11     11     -     -     -     -   PW11  PW10   PW9   PW8  PW HI           WO
12     12  NOISE PULSE  SAW TRIANG TEST  RING  SYNC  GATE  CONTROL REG     WO
13     13  ATK3  ATK2  ATK1  ATK0  DCY3  DCY2  DCY1  DCY0  ATTACK/DECAY    WO
14     14  STN3  STN2  STN1  STN0  RLS3  RLS2  RLS1  RLS0  SUSTAIN/RELEASE WO

Filter
15     15     -     -     -     -     -    FC2   FC1   FC0  FC LO           WO
16     16  FC10   FC9   FC8   FC7   FC6   FC5   FC4   FC3  FC HI           WO
17     17  RES3  RES2  RES1  RES0 FILTEX FILT3 FILT2 FILT1 RES/FILT        WO
18     18  3OFF   HP    BP    LP   VOL3  VOL2  VOL1  VOL0  MODE/VOL        WO

Misc. read
19     19   PX7   PX6   PX5   PX4   PX3   PX2   PX1   PX0  POT X           RO
1A     1A   PY7   PY6   PY5   PY4   PY3   PY2   PY1   PY0  POT Y           RO
1B     1B   O7    O6    O5    O4    O3    O2    O1    O0   OSC3/RANDOM     RO
1C     1C   E7    E6    E5    E4    E3    E2    E1    E0   ENV3            RO

Block Diagram of the MOS Technology SID (6581/6582):

       +-------------------+
       |                   |
       |   Control Logic   |
       |                   |
       +-------------------+
                |
                v
       +-------------------+
       |                   |
       |   Oscillator 1    |
       |                   |
       +-------------------+
                |
                v
       +-------------------+
       |                   |
       |   Envelope Gen 1  |
       |                   |
       +-------------------+
                |
                v
       +-------------------+
       |                   |
       |   Filter & Mixer  |
       |                   |
       +-------------------+
                |
                v
       +-------------------+
       |                   |
       |   Output Stage    |
       |                   |
       +-------------------+

       (Similar blocks exist for Oscillator 2 and 3)
```

## Key Registers
- $D400-$D406 - SID (6581) - Voice 1: FREQ LO/HI, PW LO/HI, CONTROL, ATTACK/DECAY, SUSTAIN/RELEASE (WO)
- $D407-$D40D - SID (6581) - Voice 2: FREQ LO/HI, PW LO/HI, CONTROL, ATTACK/DECAY, SUSTAIN/RELEASE (WO)
- $D40E-$D414 - SID (6581) - Voice 3: FREQ LO/HI, PW LO/HI, CONTROL, ATTACK/DECAY, SUSTAIN/RELEASE (WO)
- $D415-$D418 - SID (6581) - Filter: FC LO/HI (11-bit cutoff), RES/FILT (resonance/FILTEX), MODE/VOL (HP/BP/LP/mode/volume) (WO)
- $D419-$D41C - SID (6581) - Misc RO: POT X, POT Y, OSC3/RANDOM, ENV3 (RO)

## References
- "sid_chip_overview" — high-level behavior explained by these control registers (voices, envelope, filter, oscillator/readouts)
- "sid_block_diagram_placeholder" — visual block diagram placeholder for the 6581

## Labels
- MODE_VOL
- RES_FILT
- POTX
- POTY
- OSC3
- ENV3
