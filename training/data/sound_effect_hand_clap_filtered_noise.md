# SID 6581/8580 — Hand clap (filtered noise) example

**Summary:** Example SID code (6581/8580) producing a filtered noise "hand clap" using filter registers $D415/$D416 (cutoff), $D417 (resonance/routing), $D418 (mode/master volume) and voice 1 control/ADSR ($D404/$D405/$D406). Shows setting short ADSR, noise waveform + gate, and routing voice 1 through the low-pass filter.

## Hand clap (filtered noise) — operation
This example uses voice 1 as a noise source (control register selects noise waveform) with a very short ADSR envelope to create a burst. The voice is routed through the SID filter and the filter is configured for a low-pass response with resonance; master volume is set to maximum.

Sequence (as implemented by the listing):
- Set master volume and configure filter cutoff (high/low) so the filter will shape the noise spectrum.
- Set resonance and route voice 1 through the filter.
- Enable low-pass filter mode and ensure master volume is at maximum.
- Set a short ADSR (attack/decay and sustain/release) for a sharp noise burst.
- Set voice 1 frequency (high byte) as required for the noise behaviour.
- Set control register for voice 1 to select noise waveform and open the gate.

No additional definitions or invented register bitmaps are added here — the listing below is the authoritative sequence to reproduce the effect.

## Source Code
```asm
; HAND CLAP (Filtered Noise) - SID 6581/8580
; Initialize SID and set filter
    LDA #$0F        ; Master volume = max
    STA $D418

    LDA #$40        ; Filter cutoff high byte
    STA $D416
    LDA #$00        ; Filter cutoff low byte
    STA $D415

    LDA #$41        ; Resonance = 4, route voice 1 to filter
    STA $D417

    LDA #$10        ; Enable low-pass filter (bit for LP)
    ORA #$0F        ; OR with master volume max (keep volume = $0F)
    STA $D418

; Set up noise burst with short envelope (voice 1)
    LDA #$09        ; Attack=0, Decay=9  (A=0, D=9)
    STA $D405
    LDA #$00        ; Sustain=0, Release=0 (S=0, R=0)
    STA $D406

    LDA #$20        ; Voice 1 freq high byte (pitch/frequency hi)
    STA $D401

    LDA #$81        ; Control: Noise waveform + Gate on
    STA $D404
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width, control, A/D then S/R)
- $D407-$D40D - SID - Voice 2 registers (freq/pw/control/ADSR)
- $D40E-$D414 - SID - Voice 3 registers (freq/pw/control/ADSR)
- $D415-$D418 - SID - Filter: cutoff low/high, resonance/routing, mode & master volume

## References
- "filter_registers_and_modes_overview" — routing voice through filter and resonance settings
- "waveforms_noise" — filtered noise for percussive sounds (hand clap)