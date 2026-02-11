# SID voice 3 digital/envelope outputs and using oscillator 3 for modulation

**Summary:** Describes SID readback registers (oscillator 3 digital output and envelope 3 output) and the mute bit for voice 3; shows vibrato/modulation by adding OSC3 output (peek $D41B) to another voice's frequency with an Example Program in Commodore BASIC.

## Oscillator 3 digital output (register 27 / $D41B)
Register 27 (peek at $D41B) provides an 8-bit digitized output (0–255) that directly reflects the waveform produced by oscillator 3:
- Sawtooth: a sequence incrementing 0 → 255 at the oscillator rate.
- Triangle: increments 0 → 255 then decrements 255 → 0.
- Pulse: toggles between 0 and 255.
- Noise: produces a stream of pseudo-random 0–255 values.

This register is independent of the envelope generator: register 27 always reflects the oscillator waveform regardless of ADSR settings.

## Envelope 3 output (register 25 / $D41A)
Register 25 (peek at $D41A) returns the 8-bit output of envelope generator 3 (0–255). The oscillator must be running for the envelope register to produce meaningful values. The envelope output behaves similarly to the oscillator output as a time-varying 0–255 value representing the ADSR-modulated amplitude.

## Muting voice 3 while reading its digital outputs (register 24 / $D419)
Bit 7 of register 24 (the voice 3 control/flags register at $D419) disables the audible audio output of voice 3 while leaving the digital readback registers (oscillator 3 at $D41B and envelope 3 at $D41A) accessible. This allows using osc3/env3 purely as modulation sources without hearing the raw voice.

## Vibrato / modulation technique
A common modulation technique is to add the 8-bit oscillator-3 output to the frequency value of another voice to create vibrato or complex frequency modulation. Read osc3 with PEEK on $D41B and add (or scale) that value to the target voice frequency low/high words; update the target voice frequency registers while oscillator 3 runs (usually with its audio output muted via bit 7 of $D419).

## Source Code
```basic
10 s = 54272
20 for l = 0 to 24 : poke s + l, 0 : next
30 poke s + 3, 8
40 poke s + 5, 41 : poke s + 6, 89
50 poke s + 14, 117
60 poke s + 18, 16
70 poke s + 24, 143
80 read fr, dr
90 if fr = 0 then end
100 poke s + 4, 65
110 for t = 1 to dr * 2
120   fq = fr + peek(s + 27) / 2
130   hf = int(fq / 256) : lf = fq AND 255
140   poke s + 0, lf : poke s + 1, hf
150 next
160 poke s + 4, 64
170 goto 80
500 data 4817,2,5103,2,5407,2
510 data 8583,4,5407,2,8583,4
520 data 5407,4,8583,12,9634,2
530 data 10207,2,10814,2,8583,2
540 data 9634,4,10814,2,8583,2
550 data 8583,12
560 data 0,0
```

## Key Registers
- $D419 - SID - Voice 3 control/flags register (bit 7 mutes audio output of voice 3 while leaving digital outputs readable)
- $D41A - SID - Envelope generator 3 output (read-only 0–255)
- $D41B - SID - Oscillator 3 digital output (read-only 0–255; saw/triangle/pulse/noise behaviors)

## References
- "example_program_7_code_and_explanation" — siren example using oscillator 3 output for modulation
- "example_program_6_code_and_explanation" — detailed explanation of Example Program 6

## Labels
- $D419
- $D41A
- $D41B
