# SID Voice 1 — Pulse (rectangular) waveform width control

**Summary:** Describes SID voice 1 pulse-width control via registers $D402 (Lpw) and $D403 (Hpw), defines the 12-bit PWn value (PWn = Hpw*256 + Lpw), gives pulse output formula PWout = (PWn/40.95) %, and shows that PWn = 2048 (Hpw=8, Lpw=0) produces a square wave. Includes example BASIC POKE line to set pulse width.

## Pulse Width (PW) control
The SID pulse (rectangular) waveform duty is set per voice by a 12-bit pulse-width value (PWn). For voice 1 the low and high parts are stored in the two SID registers:

- Lpw (low byte) = register 2 (0–255)
- Hpw (high 4 bits) = register 3 (0–15)

Combine them to form the 12-bit PWn:

PWn = Hpw * 256 + Lpw

The audible pulse duty (percentage of each cycle that is high) is:

PWout = (PWn / 40.95) %

A value of PWn = 2048 (Hpw = 8, Lpw = 0) yields a 50% duty — the square wave. Changing Hpw and/or Lpw alters the timbre markedly; e.g. changing register 3 from 8 to 1 produces a much narrower pulse portion and a dramatically different sound.

The original example instructs adding a line to a BASIC program to set voice 1 pulse width and to change loop start/stop values to hear the effect.

## Source Code
```basic
15 POKES+3,8:POKES+2,0
```

(Original instruction: add the above line to your program, then change the start number in line 70 to 65 and the stop number in line 90 to 64, and RUN. Then change the high pulse width (register 3 in line 15) from 8 to 1 to hear the difference.)

Register map excerpt for SID voice 1 (reference):
```text
SID base $D400
$D400 - Voice 1 Frequency Low (freq lo)
$D401 - Voice 1 Frequency High (freq hi)
$D402 - Voice 1 Pulse Width Low  (Lpw, low 8 bits)
$D403 - Voice 1 Pulse Width High (Hpw, high 4 bits; upper nibble)
$D404 - Voice 1 Control/Status
$D405 - Voice 1 Attack/Decay
$D406 - Voice 1 Sustain/Release
```

Examples:
```text
PWn = Hpw*256 + Lpw
PWout = (PWn / 40.95) %
PWn = 2048 -> Hpw=8, Lpw=0 -> PWout ≈ 50% (square wave)
```

## Key Registers
- $D402-$D403 - SID - Voice 1 pulse width low/high (Lpw/Hpw, 12-bit PWn)

## References
- "run_results_triangle_and_pulse" — expands on context for changing pulse width in a running program
- "white_noise_selection" — expands on other available waveform (white noise) and how to select it

## Labels
- LPW
- HPW
- PWN
