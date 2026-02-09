# Coordinating Multiple Voices — 1/16th Measure Arrays (C64 / SID)

**Summary:** Technique for synchronized multi-voice playback on the C64 using per-1/16th measure event arrays, precomputed high/low frequency bytes, octave division by two, and a waveform control byte (note gate on/off). Searchable terms: 1/16th arrays, high/low frequency bytes, waveform control byte, divide by 2, SID, voices.

**Controlling multiple voices**
- **Timing strategy:** Split each musical measure into 16 equal parts (1/16th notes). All voices advance in lock-step through these 16 slots to remain synchronized.
- **Data layout:** Record the events that occur in each 1/16th interval in three separate arrays (one array per voice). Each array entry represents what that voice must do during that 1/16th slice.
- **Frequency bytes:** The program computes the two SID frequency register bytes (high and low) from a base set of frequencies. Higher-octave base values are reused and halved (divide by 2) to derive lower octaves. The BASIC listing computes these high/low bytes in lines 180 and 190.
- **Waveform control byte:** A single byte used as a gate/control for the voice—treated as "start" (begin or continue a note) or "stop" (end a note). The choice of waveform (which bits compose the waveform control byte) is selected once per voice in line 40.
- **Playback model:** At runtime, the driver steps through the 16-part measure index, reads each voice's array entry for the current 1/16th step, outputs the appropriate frequency high/low bytes and the waveform control byte for that voice (start/continue/stop), thereby producing synchronized multi-voice playback.
- **Reuse and economy:** By storing base frequency values for a highest octave and deriving other octaves via division by 2, the program minimizes stored data and simplifies frequency calculation for simultaneous voices.

## Source Code
```basic
10 REM INITIALIZE SID CHIP
20 FOR I = 54272 TO 54296: POKE I, 0: NEXT I
30 POKE 54296, 15: REM SET MAXIMUM VOLUME

40 REM SET WAVEFORM CONTROL BYTE FOR EACH VOICE
50 POKE 54276, 33: REM VOICE 1: TRIANGLE WAVEFORM, GATE BIT ON
60 POKE 54283, 33: REM VOICE 2: TRIANGLE WAVEFORM, GATE BIT ON
70 POKE 54290, 33: REM VOICE 3: TRIANGLE WAVEFORM, GATE BIT ON

80 REM DEFINE BASE FREQUENCIES FOR HIGHEST OCTAVE
90 DIM FREQ(12)
100 DATA 2017, 2131, 2250, 2380, 2520, 2670, 2831, 3004, 3189, 3387, 3599, 3827
110 FOR I = 1 TO 12
120 READ FREQ(I)
130 NEXT I

140 REM COMPUTE FREQUENCIES FOR LOWER OCTAVES
150 DIM FREQS(7, 12)
160 FOR O = 0 TO 7
170 FOR N = 1 TO 12
180 FREQS(O, N) = FREQ(N) / (2 ^ (7 - O))
190 NEXT N, O

200 REM MAIN PLAYBACK LOOP
210 FOR STEP = 1 TO 16
220 FOR V = 1 TO 3
230 REM READ EVENT FOR VOICE V AT STEP
240 EVENT = VOICE(V, STEP)
250 IF EVENT = 0 THEN 290
260 REM EXTRACT NOTE AND OCTAVE FROM EVENT
270 NOTE = EVENT AND 15
280 OCTAVE = (EVENT AND 112) / 16
290 REM SET FREQUENCY FOR VOICE V
300 POKE 54272 + (V - 1) * 7, FREQS(OCTAVE, NOTE) AND 255
310 POKE 54273 + (V - 1) * 7, FREQS(OCTAVE, NOTE) / 256
320 REM SET WAVEFORM CONTROL BYTE
330 POKE 54276 + (V - 1) * 7, 33
340 NEXT V
350 REM DELAY FOR 1/16TH NOTE DURATION
360 FOR T = 1 TO 100: NEXT T
370 NEXT STEP
380 GOTO 210
```

## Key Registers
- **Voice 1 Frequency Low Byte:** $D400 (54272)
- **Voice 1 Frequency High Byte:** $D401 (54273)
- **Voice 1 Control Register:** $D404 (54276)
- **Voice 2 Frequency Low Byte:** $D407 (54279)
- **Voice 2 Frequency High Byte:** $D408 (54280)
- **Voice 2 Control Register:** $D40B (54283)
- **Voice 3 Frequency Low Byte:** $D40E (54286)
- **Voice 3 Frequency High Byte:** $D40F (54287)
- **Voice 3 Control Register:** $D412 (54290)
- **Volume Control Register:** $D418 (54296)

## References
- "example2_explanation_and_note_duration_encoding"—expands on decoding notes into per-1/16th array entries and practical encoding of durations and events
- Commodore 64 Programmer's Reference Guide, Chapter 4: Programming Sound and Music