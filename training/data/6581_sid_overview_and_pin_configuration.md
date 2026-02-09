# 6581 SID (Sound Interface Device) — Overview & Pinout

**Summary:** 6581 SID (Sound Interface Device) — single-chip, 3-voice synthesizer with 3 oscillators, 4 waveforms (triangle, sawtooth, variable pulse, noise), 3 envelope generators, programmable filter, master volume, A/D pot inputs, random generator, and external audio input; includes 28-pin DIP pin configuration (diagram and pin list included).

## Concept
The 6581 SID is a single-chip, 3-voice electronic music synthesizer/sound-effects generator compatible with 65XX microprocessor families. It provides wide-range, high-resolution control of pitch (frequency), tone color (harmonic content), and dynamics (volume) with specialized control circuitry to minimize software overhead for realtime audio in games and low-cost instruments.

The chip is packaged in a 28-pin DIP; the full pin configuration and ASCII diagram are provided in the Source Code section.

**[Note: Pin labeled "02" in the source is likely the φ2 (Phi2) system clock input — source shows "02", which may be an OCR or typographical error.]**

## Features
- 3 tone oscillators
  - Range: 0–4 kHz
- 4 waveforms per oscillator
  - Triangle, Sawtooth, Variable Pulse, Noise
- 3 amplitude modulators
  - Range: 48 dB
- 3 envelope generators
  - Exponential response
  - Attack Rate: 2 ms–8 s
  - Decay Rate: 6 ms–24 s
  - Sustain Level: 0–peak volume
  - Release Rate: 6 ms–24 s
- Oscillator synchronization
- Ring modulation
- Programmable filter
  - Cutoff range: 30 Hz–12 kHz
  - 12 dB/octave rolloff
  - Outputs: Low-pass, Band-pass, High-pass, Notch
  - Variable resonance
- Master volume control
- 2 A/D potentiometer interfaces (POT X, POT Y)
- Random number / modulation generator
- External audio input

## Source Code
```text
PIN CONFIGURATION (28-pin DIP)

                                +----+ +----+
                     CAP1A   1 @|    +-+    |@ 28  Vdd
                                |           |
                     CAP1B   2 @|           |@ 27  AUDIO OUT
                                |           |
                     CAP2A   3 @|           |@ 26  EXT IN
                                |           |
                     CAP2B   4 @|           |@ 25  Vcc
                                |           |
                      /RES   5 @|           |@ 24  POT X
                                |           |
                        02   6 @|           |@ 23  POT Y
                                |           |
                       R/W   7 @|           |@ 22  D7
                                |    6581   |
                       /CS   8 @|    SID    |@ 21  D6
                                |           |
                        A0   9 @|           |@ 20  D5
                                |           |
                        A1  10 @|           |@ 19  D4
                                |           |
                        A2  11 @|           |@ 18  D3
                                |           |
                        A3  12 @|           |@ 17  D2
                                |           |
                        A4  13 @|           |@ 16  D1
                                |           |
                       GND  14 @|           |@ 15  D0
                                +-----------+

Pin list (as shown in source):
1  CAP1A
2  CAP1B
3  CAP2A
4  CAP2B
5  /RES
6  02
7  R/W
8  /CS
9  A0
10 A1
11 A2
12 A3
13 A4
14 GND
15 D0
16 D1
17 D2
18 D3
19 D4
20 D5
21 D6
22 D7
23 POT Y
24 POT X
25 Vcc
26 EXT IN
27 AUDIO OUT
28 Vdd
```

## References
- "6581_sid_block_diagram_and_description" — block diagram and full SID functional description
- "6566_vicii_pin_configuration_and_register_map" — VIC-II pinout and adjacent system peripheral info