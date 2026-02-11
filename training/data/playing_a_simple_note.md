# SID Voice 1 — Play a Simple Note (Assembly Example)

**Summary:** Example assembly to play a single note on SID Voice 1 (SID base $D400) using LDA/STA to set ADSR ($D405/$D406), frequency bytes ($D400/$D401) for A4 = $1CC8 (PAL), and control/GATE on $D404 to start and stop the note.

## Playing the note (what the steps do)
1. Set ADSR for Voice 1:
   - Store attack/decay into $D405 and sustain/release into $D406.
2. Set frequency (low byte then high byte):
   - Write to $D400 (freq low) then $D401 (freq high). The example uses $1CC8 for A4 = 440 Hz (PAL timing).
3. Turn the voice on by writing waveform + Gate to control:
   - $20 selects sawtooth waveform (saw bit shown in source).
   - $01 is the Gate bit; set together ($21) to start the note.
4. After the desired duration, clear Gate (leave waveform bits) to begin the release phase:
   - Write waveform value without Gate bit ($20) to $D404.

Notes:
- Frequency bytes are written low then high (little-endian).
- Gate is controlled by bit 0 of the control register; setting it activates the envelope (attack/decay/sustain), clearing it starts release.
- The example uses PAL frequency value; NTSC systems require different frequency register values.

## Source Code
```asm
; Configure Voice 1
lda #$20          ; Attack=2, Decay=0
sta $d405
lda #$f8          ; Sustain=15, Release=8
sta $d406

; Set frequency (A4 = 440 Hz, PAL value $1CC8)
lda #$c8
sta $d400         ; Freq lo
lda #$1c
sta $d401         ; Freq hi

; Gate on with sawtooth waveform
lda #$21          ; Sawtooth ($20) + Gate ($01)
sta $d404

; ... wait for desired duration ...

; Gate off (start release)
lda #$20          ; Sawtooth, gate off
sta $d404
```

## Key Registers
- $D400-$D406 - SID - Voice 1 (Freq low, Freq high, Pulse width/misc, Control/Gate, Attack/Decay, Sustain/Release)

## References
- "adsr_overview" — ADSR setup details for the note example
- "frequency_calculation" — how frequency register values (e.g. $1CC8) are calculated for given pitches and PAL/NTSC differences