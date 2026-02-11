# SID Sound Effects and Demo Tune Routine

**Summary:** This document provides information on sound effects achievable with the SID chip, including real-time control techniques such as tremolo, and includes a demo program that plays a short tune by reading note and time tables.

**Description**

The SID chip can produce a wide variety of sound effects beyond the basic waveforms; many effects require real-time manipulation of SID registers. A common example is producing tremolo by changing a channel's output level (volume) in real time.

The accompanying demo contains program segments intended to be used directly or expanded to generate a broad set of sounds. One specific routine in the demo plays a short tune by reading two tables: a note table (note values) and a time table (durations). The routine treats a note value of $00 as an end marker and quits playback when it encounters $00. By replacing or editing the note and time tables, you can produce different tunes. The demo also shows effects of different waveforms by playing sounds while switching waveform-related SID settings.

The text references a Sound Editor utility (Appendix C) that is used to select SID register values and to transfer edited values to the SID; see the referenced chunks for details on running and using that utility.

## Source Code

Below is a BASIC program that demonstrates playing a simple tune using the SID chip. This program reads note and duration values from DATA statements and plays them sequentially.

```basic
10 REM ** SID TUNE PLAYER DEMO **
20 POKE 54296,15 : REM SET VOLUME TO MAX
30 FOR I = 54272 TO 54296 : POKE I,0 : NEXT I : REM CLEAR SID REGISTERS
40 READ NOTE, DURATION
50 IF NOTE = 0 THEN END
60 POKE 54272,NOTE : REM SET FREQUENCY LOW BYTE
70 POKE 54273,0 : REM SET FREQUENCY HIGH BYTE
80 POKE 54276,17 : REM GATE BIT ON, TRIANGLE WAVEFORM
90 FOR J = 1 TO DURATION * 10 : NEXT J : REM NOTE DURATION
100 POKE 54276,16 : REM GATE BIT OFF
110 FOR J = 1 TO 10 : NEXT J : REM SHORT PAUSE BETWEEN NOTES
120 GOTO 40
130 DATA 193,10, 217,10, 243,10, 0,0 : REM NOTE VALUES AND DURATIONS
```

In this program:

- Line 20 sets the master volume to maximum.
- Lines 30 clears the SID registers.
- Lines 40-120 form the main loop that reads note and duration values, sets the frequency, enables the gate bit to start the note, waits for the duration, disables the gate bit to stop the note, and then pauses briefly before the next note.
- Line 130 contains the note and duration data. The note value of 0 serves as the end marker.

The note values correspond to specific frequencies. For example, a value of 193 corresponds to a certain pitch. The durations are arbitrary units that can be adjusted to change the tempo.

## Key Registers

- **$D400-$D401 (54272-54273):** Frequency Control for Voice 1
- **$D404 (54276):** Control Register for Voice 1
- **$D418 (54296):** Volume and Filter Control

## References

- "sound_editor_intro" — Introduces the Sound Editor utility (Appendix C) used to select SID register values referenced here
- "sound_editor_usage_and_controls" — Explains how to run the Sound Editor and transfer edited register values to the SID