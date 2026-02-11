# SID Drum Kick — short noise burst then low-frequency triangle (Voice 1)

**Summary:** Example SID (6581/8580) sequence using Voice 1 registers ($D400-$D406) to produce a percussive kick: short noise burst (noise + gate) using fast ADSR, then switch to a low-frequency triangle waveform to simulate the pitch tail. Uses frequency high/low ($D400/$D401), control ($D404) and ADSR ($D405/$D406).

## Description
This pattern creates a kick by splitting the sound into two stages on SID voice 1:

1. Noise burst (impact)
   - Configure very short attack/decay and low sustain so the noise is a short burst.
   - Set waveform to Noise + Gate to trigger the burst.

2. Low-frequency triangle (tail)
   - After 1–2 frames, change the frequency to a low pitch and switch waveform to Triangle + Gate to produce the low tone tail (simulates pitch drop).

Important register/format notes used in the sequence:
- Frequency is 16-bit (low byte at $D400, high byte at $D401). The example writes only the high byte to move pitch rapidly.
- Control register ($D404) waveform/gate bits used here:
  - Bit 0 = Gate (1 = on)
  - Bit 4 = Triangle waveform
  - Bit 7 = Noise waveform
  (Other bits: Sync, Ring Mod, Test, Saw, Pulse — not used in this example.)
- ADSR format:
  - $D405 Attack/Decay: high nibble = Attack (0–15), low nibble = Decay (0–15).
  - $D406 Sustain/Release: high nibble = Sustain level (0–15), low nibble = Release (0–15).
  - Example uses Attack=0, Decay=0, Sustain=0, Release=9 for a very short noise burst.

Timing: the example notes switching the waveform after "1–2 frames" (video frames) to change from noise burst to triangle tail.

## Source Code
```asm
; DRUM KICK:
; Short noise burst followed by low-frequency tone on SID Voice 1

    lda #$00
    sta $D405        ; Attack/Decay = $00 (A=0, D=0)
    lda #$09
    sta $D406        ; Sustain/Release = $09 (S=0, R=9)
    lda #$20
    sta $D401        ; Frequency high = $20 (medium-high frequency)
    lda #$81
    sta $D404        ; Control = Noise (bit7) + Gate (bit0) -> noise burst

    ; After 1-2 frames, switch to triangle at low frequency
    lda #$05
    sta $D401        ; Frequency high = $05 (low frequency for tail)
    lda #$11
    sta $D404        ; Control = Triangle (bit4) + Gate (bit0)
```

## Key Registers
- $D400-$D406 - SID - Voice 1: Frequency low/high ($D400/$D401), Pulse width low/high ($D402/$D403), Control/Gate ($D404), Attack/Decay ($D405), Sustain/Release ($D406)

## References
- "waveforms_triangle" — expands on use triangle for low tone tail
- "waveforms_noise" — expands on initial noise burst

## Labels
- $D400
- $D401
- $D402
- $D403
- $D404
- $D405
- $D406
