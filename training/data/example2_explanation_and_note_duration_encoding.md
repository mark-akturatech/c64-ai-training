# Example Program 2 — three-voice control (line-by-line explanation)

**Summary:** This program demonstrates how to control the SID chip (base address $D400) to produce three-voice music on the Commodore 64. It covers voice setup, array-based activity scheduling per 1/16th measure, decoding a compact note encoding format, octave division of base frequencies, and the runtime loop that writes frequency and waveform control bytes for three voices.

**Voice control and note encoding (overview)**

- **Program Initialization:**
  - Clears all SID registers.
  - Allocates arrays sized by song length in 1/16th-measure steps.
  - Reads a base-frequency table for note pitch values.

- **Voice Configuration:**
  - Each voice has a waveform/control byte stored, determining waveform selection and gate on/off status.
  - Voice 2 receives a high pulse-width byte.
  - Filter cutoff and resonance are set, with one voice routed through the filter.

- **Note Encoding:**
  - Notes are encoded into single integers using the formula:
    \[ \text{Encoded Value} = (((D \times 8) + O) \times 16) + N \]
    Where:
    - \( D \) = Duration in number of 1/16ths of a measure (integer)
    - \( O \) = Octave (0–7)
    - \( N \) = Note number (0–11)

- **Decoding Process:**
  1. \( N = \text{Encoded Value} \mod 16 \) (low 4 bits)
  2. \( T = \text{INT}(\text{Encoded Value} / 16) \)
  3. \( O = T \mod 8 \) (low 3 bits of \( T \))
  4. \( D = \text{INT}(T / 8) \)

- **Silence Representation:**
  - A silence is represented by using the negative of the duration number.

- **Octave Handling:**
  - For octave offsets, the program divides the base frequency by 2 repeatedly (one division per octave decrement) unless the octave is the highest, in which case division is skipped.

- **Activity Array Population:**
  - Activity arrays are filled per 1/16th-step with three bytes per voice: low-frequency byte, high-frequency byte, and waveform/control byte.
  - For notes longer than one 1/16th:
    - Intermediate beats: waveform control with voice on.
    - Last beat of the note: waveform control set to voice-off (gate off).
  - For a single 1/16th note: appropriate entries are set immediately.

- **Runtime Operation:**
  - At runtime, the program POKEs, each 1/16th:
    - Low-frequency bytes for all voices.
    - High-frequency bytes for all voices.
    - Waveform control bytes for all voices.
  - Then runs a timing loop for the 1/16th duration.
  - After the song, the program mutes (volume off).

- **Program Structure:**
  - ADSR and S/R values are set at lines 500–520.
  - Volume and filter settings are at line 530.
  - Base-frequency data and voice data are stored in the BASIC data statements referenced (lines 600–620 and 1000–3999).

## Source Code

```text
-- Line-by-line description table (from source) --
Line(s) | Description
10      | Set S equal to start of sound chip and clear all sound chip registers.
20      | Dimension arrays to contain activity of song, 1/16th of a measure per location.
30      | Dimension array to contain base frequency for each note.
40      | Store waveform control byte for each voice.
50      | Set high pulse width for voice 2.
        | Set high frequency for filter cutoff.
        | Set resonance for filter and filter voice 3.
60      | Read in base frequency for each note.
100     | Begin decoding loop for each voice.
110     | Initialize pointer to activity array.
120     | Read coded note.
130     | If coded note is zero, then next voice.
140     | Set waveform controls to proper voice.
        | If silence, set waveform controls to 0.
150     | Decode duration and octave.
160     | Decode note.
170     | Get base frequency for this note.
180     | If highest octave, skip division loop.
190     | Divide base frequency by 2 appropriate number of times.
200     | Get high and low frequency bytes.
210     | If sixteenth note, set activity array: high frequency, low frequency, and waveform control (voice on).
220     | For all but last beat of note, set activity array: high frequency, low frequency, waveform control (voice on).
230     | For last beat of note, set activity array: high frequency, low frequency, waveform control (voice off).
240     | Increment pointer to activity array. Get next note.
250     | If longer than before, reset number of activities.
260     | Go back for next voice.
500     | Set Attack/Decay for voice 1 (A=0, D=0).
        | Set Sustain/Release for voice 1 (S=15, R=0).
510     | Set Attack/Decay for voice 2 (A=5, D=5).
        | Set Sustain/Release for voice 2 (S=8, R=5).
520     | Set Attack/Decay for voice 3 (A=0, D=10).
        | Set Sustain/Release for voice 3 (S=12, R=5).
530     | Set volume 15, low-pass filtering.
540     | Start loop for every 1/16th of a measure.
550     | POKE low frequency from activity array for all voices.
560     | POKE high frequency from activity array for all voices.
570     | POKE waveform control from activity array for all voices.
580     | Timing loop for 1/16th of a measure and back for next 1/16th measure.
590     | Pause, then turn off volume.
600-620 | Base frequency data.
1000-1999 | Voice 1 data.
2000-2999 | Voice 2 data.
3000-3999 | Voice 3 data.

-- Duration table (as printed in source) --
NOTE TYPE        DURATION
1/16            128
1/8             256
DOTTED 1/8      384
1/4             512
1/4 + 1/16      640
DOTTED 1/4      768
1/2            1024
1/2 + 1/16    1152
1/2 + 1/8     1280
DOTTED 1/2    1536
WHOLE         2048

-- Encoding formula (source) --
((((D*8)+O)*16)+N)

-- Decoding pseudocode (reverse of the formula) --
C = coded_note
N = C MOD 16
T = INT(C / 16)
O = T MOD 8
D = INT(T / 8)

-- ADSR / S/R and other lines (values from source) --
Line 500: Voice1 A/D = 0,0    Voice1 S/R = 15,0
Line 510: Voice2 A/D = 5,5    Voice2 S/R = 8,5
Line 520: Voice3 A/D = 0,10   Voice3 S/R = 12,5
Line 530: Volume = 15, low-pass filtering enabled
```

## Key Registers

- **$D400–$D406**: SID Voice 1 registers (frequency low, frequency high, pulse width low, pulse width high, control/status, attack/decay)
- **$D407–$D40D**: SID Voice 2 registers (frequency low, frequency high, pulse width low, pulse width high, control/status, attack/decay)
- **$D40E–$D414**: SID Voice 3 registers (frequency low, frequency high, pulse width low, pulse width high, control/status, attack/decay)
- **$D415–$D418**: SID Filter and miscellaneous registers (filter cutoff low/high, resonance/mode, volume/miscellaneous)

## References

- "using_multiple_voices_and_example_program_2" — expands on the full program listing and data statements referenced above.