# COMMODORE 64 - EXAMPLE PROGRAM 1: Single-voice BASIC demonstration

**Summary:** BASIC program that drives the SID chip (base $D400) to play a melody: clears SID registers, sets ADSR (S+5,S+6), sets master volume (S+24 / $D418), writes frequency high/low to voice‑1 registers ($D400/$D401), gates waveform via control register (S+4), and uses DATA triplets (HF,LF,Duration) with -1 terminator.

**Description**
This program demonstrates a minimal single‑voice playback routine in Commodore 64 BASIC. It:

- Sets S = 54272 ($D400), the SID base address.
- Clears the SID register block (S through S+24) to silence and reset parameters.
- Initializes ADSR for voice 1 by writing to S+5 (Attack/Decay) and S+6 (Sustain/Release).
- Sets master volume via S+24 (offset 24 from S, i.e. $D418).
- Reads DATA in triplets: HF (frequency high), LF (frequency low), DR (duration loop count). A negative HF signals end of song.
- For each note: writes frequency bytes to the voice 1 frequency registers, sets the control register (S+4) to gate a sawtooth waveform (33 decimal), waits DR loop iterations, clears the gate (32 decimal) and waits a short release delay (50 iterations), then proceeds to next DATA triplet.

Implementation details preserved from the source:
- ADSR writes use S+5 and S+6.
- Waveform/gate uses S+4; 33 decimal (0x21) gates the voice with sawtooth selected in this example, 32 decimal (0x20) clears the gate but leaves the waveform bits.
- The song DATA ends with -1,-1,-1 to indicate termination.

## Source Code
```basic
5 S = 54272
10 FOR L = S TO S + 24 : POKE L,0 : NEXT : REM clear sound chip registers
20 POKE S + 5, 9 : POKE S + 6, 0                : REM set Attack/Decay and Sustain/Release (voice 1)
30 POKE S + 24, 15                             : REM set master volume to maximum
40 READ HF, LF, DR
50 IF HF < 0 THEN END
60 POKE S + 1, HF : POKE S, LF                  : REM write frequency high then low (voice 1)
70 POKE S + 4, 33                               : REM gate sawtooth waveform for voice 1
80 FOR T = 1 TO DR : NEXT                       : REM sustain duration loop
90 POKE S + 4, 32 : FOR T = 1 TO 50 : NEXT      : REM release (clear gate, short delay)
100 GOTO 40

110 DATA 25,177,250, 28,214,250
120 DATA 25,177,250, 25,177,250
130 DATA 25,177,125, 28,214,125
140 DATA 32, 94,750, 25,177,250
150 DATA 28,214,250, 19, 63,250
160 DATA 19, 63,250, 19, 63,250
170 DATA 21,154, 63, 24, 63, 63
180 DATA 25,177,250, 24, 63,125
190 DATA 19, 63,250, -1, -1, -1
```

## Key Registers
- $D400-$D406 - SID (Voice 1): frequency low/high, pulse width low/high, control register, attack/decay, sustain/release
- $D407-$D40D - SID (Voice 2) — referenced for completeness (not used here)
- $D40E-$D414 - SID (Voice 3) — referenced for completeness (not used here)
- $D415-$D418 - SID filter & master volume (master volume at $D418 which this program writes via S+24)

## References
- "volume_and_frequencies" — maps frequency registers to pitch and Fn formula
- "adsr_registers_and_examples" — expands on how registers S+5 and S+6 control ADSR