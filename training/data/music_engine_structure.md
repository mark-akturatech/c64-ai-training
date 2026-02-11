# SID Music Engine Structure (KickAssembler example)

**Summary:** Example SID 6581/8580 music engine in KickAssembler demonstrating a frequency table of 16-bit values, initialization that clears SID registers ($D400–$D418), ADSR/volume setup ($D405/$D406/$D418), and a per-frame play routine that writes frequency to $D400/$D401, gates voice via $D404, checks an end marker, and loops. Includes raster-synchronized playback and note_index stepping.

**Music Engine Structure**

This chunk describes a minimal music player layout:

- **Data layout:** A frequency table of 16-bit values (.word entries). Each note is stored as a little-endian 16-bit frequency value for the SID frequency registers.
- **Initialization (init):** Clears the SID register block ($D400–$D418) by writing zeroes, sets master volume and disables filter ($D418), and sets ADSR for the voice via $D405/$D406.
  - The clear loop uses X = #$18 and stores A into $D400,X down to $D400 (clearing through $D418).
- **Play routine (play):** Intended to be called once per frame via raster interrupt. It:
  - Loads note_index into X, reads the low byte (freq_table,X) into $D400 and the high byte (freq_table+1,X) into $D401.
  - Tests for end-of-song: after loading both bytes, the code ORs the high and low bytes (the accumulator contains the high byte at that point, then ORA freq_table,X mixes the low byte) and branches to loop_song if the combined word is zero.
  - Gates the voice and selects sawtooth by storing #$21 into $D404 (voice 1 control register).
  - Advances to the next note when the duration counter expires—note_index is incremented by 2 to step 16-bit table entries.
- **loop_song:** Resets note_index to $00 and returns.

(Short clarifier: the end-marker test works because the A register contains the high byte when ORA freq_table,X is executed, so the OR covers both bytes.)

## Source Code

```asm
.pc = $0810 "Music Player"

; Music data: table of 16-bit frequency values
freq_table:
  .word $1cd6      ; Note 1
  .word $2145      ; Note 2
  .word $0000      ; End marker / loop

init:
  ; Clear SID
  lda #$00
  ldx #$18
!loop:
  sta $d400,x
  dex
  bpl !loop-

  ; Set volume, disable filter
  lda #$0f
  sta $d418

  ; Set ADSR
  lda #$00         ; A=0, D=0 (instant attack/decay)
  sta $d405
  lda #$f9         ; S=15, R=9
  sta $d406

  rts

play:
  ; Called once per frame (via raster interrupt)
  ; Read next note from table
  ldx note_index
  lda freq_table,x
  sta $d400         ; Freq lo
  lda freq_table+1,x
  sta $d401         ; Freq hi

  ; Check for end marker
  ora freq_table,x
  beq loop_song

  ; Gate on + sawtooth
  lda #$21
  sta $d404

  ; Set duration counter
  lda #$0a          ; Example duration value
  sta duration_counter

  ; Wait for duration to expire
wait_duration:
  lda duration_counter
  beq advance_note
  dec duration_counter
  jmp wait_duration

advance_note:
  ; Gate off
  lda #$20
  sta $d404

  ; Advance to next note
  lda note_index
  clc
  adc #2
  sta note_index

  rts

loop_song:
  lda #$00
  sta note_index
  rts

note_index:
  .byte 0

duration_counter:
  .byte 0

; Raster interrupt setup
irq_setup:
  sei                 ; Disable interrupts
  lda #$7f
  sta $dc0d           ; Disable CIA 1 interrupts
  sta $dd0d           ; Disable CIA 2 interrupts
  lda $dc0d           ; Acknowledge any pending CIA 1 interrupts
  lda $dd0d           ; Acknowledge any pending CIA 2 interrupts
  asl $d019           ; Acknowledge any pending VIC-II interrupts
  lda #<irq_handler
  sta $0314           ; Set IRQ vector low byte
  lda #>irq_handler
  sta $0315           ; Set IRQ vector high byte
  lda #$01
  sta $d01a           ; Enable raster interrupt
  lda #$80
  sta $d012           ; Set raster line for interrupt
  cli                 ; Enable interrupts
  rts

irq_handler:
  pha                 ; Save accumulator
  txa
  pha                 ; Save X register
  tya
  pha                 ; Save Y register

  jsr play            ; Call play routine

  lda #$80
  sta $d012           ; Reset raster line for next interrupt
  asl $d019           ; Acknowledge VIC-II interrupt

  pla                 ; Restore Y register
  tay
  pla                 ; Restore X register
  tax
  pla                 ; Restore accumulator
  rti                 ; Return from interrupt
```

## Key Registers

- $D400–$D406 - SID (Voice 1) - Frequency lo/hi, Pulse width lo/hi, Control/Attack+Decay ($D404 = control, $D405 = Attack/Decay, $D406 = Sustain/Release)
- $D407–$D40D - SID (Voice 2) - Voice 2 registers
- $D40E–$D414 - SID (Voice 3) - Voice 3 registers
- $D415–$D418 - SID (Filter/Master) - Filter cutoff/LFO/Resonance and Master volume ($D418)

## References

- "raster_synchronized_playback" — how to call play per frame via raster IRQ
- "note_frequency_table_pal" — example frequency table values for PAL timing