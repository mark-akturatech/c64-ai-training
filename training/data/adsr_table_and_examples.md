# SID (Voice 1) ADSR rate table and example POKE settings

**Summary:** Attack/Decay/Release numeric table for SID ADSR values 0–15 with approximate time constants; explains encoding (ATTACK*16 + DECAY, SUSTAIN*16 + RELEASE) and provides BASIC POKE examples for voice 1 (SID registers $D405/$D406), plus sample waveform/pulse-width settings.

## ADSR encoding and meanings
Registers for voice 1 ADSR are stored in two SID bytes (nybble = 4 bits):
- Attack/Decay: high nybble = ATTACK (0–15), low nybble = DECAY (0–15) — stored at $D405 (SID base $D400 + $05).
- Sustain/Release: high nybble = SUSTAIN level (0–15), low nybble = RELEASE rate (0–15) — stored at $D406 (SID base $D400 + $06).

Encoding formulas:
- Attack/Decay byte = ATTACK*16 + DECAY
- Sustain/Release byte = SUSTAIN*16 + RELEASE

SUSTAIN is a level (proportion of peak volume). ATTACK, DECAY and RELEASE values map to approximate time constants (see table in Source Code). (nybble = 4 bits)

Sample sound types and their intent (POKE examples are in Source Code):
- Violin-like: moderate attack/decay, mid sustain/release values.
- Xylophone-like: fast attack, short sustain, noticeable decay/release.
- Piano-like: short attack, short sustain/release, use square waveform and short pulse-width.
- Experimental/synth: various ADSR combos and waveform choices (triangle/sawtooth/square) and pulse-width adjustments.

## Source Code
```text
ADSR value table (VALUE = 0..15)
VALUE  ATTACK RATE (time/cycle)    DECAY/RELEASE RATE (time/cycle)
0      2 ms                        6 ms
1      8 ms                        24 ms
2      16 ms                       48 ms
3      24 ms                       72 ms
4      38 ms                       114 ms
5      56 ms                       168 ms
6      68 ms                       204 ms
7      80 ms                       240 ms
8      100 ms                      300 ms
9      250 ms                      750 ms
10     500 ms                      1.5 s
11     800 ms                      2.4 s
12     1 s                         3 s
13     3 s                         9 s
14     5 s                         15 s
15     8 s                         24 s
```

```basic
' Examples as given (POKES+N are offsets from SID base variable POKES)
' Violin-type
20 POKES+5,88:POKES+6,89:REM A=5;D=8;S=5;R=9

' Xylophone-type (triangle waveform)
20 POKES+5,9:POKES+6,9:REM A=0;D=9;S=0;R=9
70 POKES+4,17
90 POKES+4,16:FORT=1TO50:NEXT

' Piano-type (square waveform, pulse-width set)
15 POKES+3,8:POKES+2,0
20 POKES+5,9:POKES+6,0: REM A=0;D=9;S=0;R=0
70 POKES+4,65
90 POKES+4,64:FORT=1TO50:NEXT
```

Notes on the numeric examples:
- Example 1: ATTACK=5, DECAY=8 -> 5*16 + 8 = 88 (decimal) -> POKE to Attack/Decay register.
- Example 2: ATTACK=0, DECAY=9 -> 0*16 + 9 = 9.
- POKES+4 is the voice 1 control/waveform register; POKES+2/POKES+3 set pulse-width low/high.

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse-width low/high, control/waveform, Attack/Decay @ $D405, Sustain/Release @ $D406)

## References
- "envelope_generator_and_example_program_4" — expands on register encoding and example program that sets ADSR

## Labels
- $D405
- $D406
