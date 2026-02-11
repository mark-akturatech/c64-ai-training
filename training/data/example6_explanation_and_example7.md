# SID Modulation: EXAMPLE PROGRAM 6 (Line-by-Line) and EXAMPLE PROGRAM 7 (Siren)

**Summary:** This document provides a line-by-line explanation of EXAMPLE PROGRAM 6, which demonstrates SID modulation techniques using the Commodore 64's Sound Interface Device (SID) at base address $D400. It covers setting ADSR envelopes, pulse width, triangle waveforms, and muting voice 3 while using it as a modulation source. Additionally, it includes the full BASIC listing of EXAMPLE PROGRAM 7, a siren effect that reads `PEEK(S+27)*3.5` to modulate voice 1 frequency.

**EXAMPLE PROGRAM 6 — Line-by-Line Explanation**

Assumes `S = 54272` ($D400), the SID base address.

- **Line 10** — Set `S` to the beginning of the sound chip.
  - `S = 54272` ($D400) — base address for SID registers.

- **Line 20** — Clear all sound chip locations.
  - Zero the first block of SID registers to initialize voice and control registers.

- **Line 30** — Set high pulse width for voice 1.
  - Write to pulse-width high/low registers for voice 1 (pulse width controls duty cycle).

- **Line 40** — Set Attack/Decay for voice 1 (A=2, D=9).
  - Write ADSR attack/decay byte for voice 1.

- **Line 40 (continued)** — Set Sustain/Release for voice 1 (S=5, R=9).
  - Write ADSR sustain/release byte for voice 1.

- **Line 50** — Set low frequency for voice 3.
  - Initialize voice 3 frequency low byte (voice 3 is used as a modulation source).

- **Line 60** — Set triangle waveform for voice 3.
  - Set waveform/control bits for voice 3 to triangle.

- **Line 70** — Set volume to 15 and turn off audio output of voice 3.
  - Configure master volume and mixer so voice 3's audio is not sent to the output while its oscillator still runs for modulation.

- **Line 80** — Read frequency and duration of note.
  - Fetch note frequency and length from data table (song table).

- **Line 90** — If frequency equals zero, stop.
  - Zero frequency denotes end-of-song marker.

- **Line 100** — POKE start pulse waveform control for voice 1.
  - Trigger the pulse (start gate/enable waveform) for voice 1.

- **Line 110** — Start timing loop for duration.
  - Loop for the requested note length; each iteration updates modulation.

- **Line 120** — Get new frequency using oscillator 3 output.
  - Sample the value derived from voice 3 (oscillator 3 triangle) to modulate voice 1 frequency.

- **Line 130** — Get high and low frequency.
  - Split computed frequency into high (HF) and low (LF) bytes for SID frequency registers.

- **Line 140** — POKE high and low frequency for voice 1.
  - Write LF to $D400 and HF to $D401 (voice 1 frequency low/high).

- **Line 150** — End of timing loop.
  - Continue looping until duration is complete.

- **Line 160** — POKE stop pulse waveform control for voice 1.
  - Stop the pulse / clear gate for voice 1.

- **Line 170** — Go back for next note.
  - Advance to next note in song table.

- **Lines 500–550** — Frequencies and durations for song.
  - Data table of note frequencies and durations.

- **Line 560** — Zero signals end of song.
  - Zero frequency marks termination.

**Notes on the Modulation Technique**

- Voice 3 is configured as a running triangle oscillator, but its audio output is disabled in the mixer; the oscillator waveform is nevertheless used as a varying control value to alter voice 1 frequency in real time.

- The loop samples a SID memory location (`PEEK(S+27)`) and scales it (multiply by 3.5) to produce a sweep range added to a base frequency, then writes LF/HF to voice 1 frequency registers each loop iteration.

## Source Code

```basic
10 S=54272
20 FOR L=0 TO 24:POKE S+L,0:NEXT
30 POKE S+14,5
40 POKE S+18,16
50 POKE S+3,1
60 POKE S+24,143
70 POKE S+6,240
80 POKE S+4,65
90 FR=5389
100 FOR T=1 TO 200
110 FQ=FR+PEEK(S+27)*3.5
120 HF=INT(FQ/256):LF=FQ-HF*256
130 POKE S+0,LF:POKE S+1,HF
140 NEXT
150 POKE S+24,0
```

## Key Registers

- **$D400–$D406** — SID (Voice 1): frequency low/high, pulse width low/high, control, attack/decay, sustain/release.

- **$D407–$D40D** — SID (Voice 2): same per-voice register map.

- **$D40E–$D414** — SID (Voice 3): same per-voice register map (voice 3 used as modulation source).

- **$D415–$D418** — SID (filter, routing, mixer, volume): filter cutoff, resonance/routing, master volume/mixer bits.

- **$D41B** — SID (Oscillator 3 Output): provides the upper 8 bits of oscillator 3's output waveform, used for modulation purposes.

- **S = 54272 ($D400)** — BASIC variable used as the SID base for POKE/PEEK operations.

## References

- "Advanced Techniques and Example 6" — expands discussion of oscillator 3 output usage and muting with bit 7.

- "Commodore 64 Programmer's Reference Guide" — provides detailed information on SID registers and modulation techniques.