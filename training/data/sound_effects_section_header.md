# SID 6581/8580 Sound-effect Examples (laser, explosion, drum kick, hand clap)

**Summary:** This document provides assembly code examples for generating sound effects on the SID 6581/8580 chip, including laser/zap, explosion, drum kick, and hand clap. It details the necessary SID register settings, waveforms, ADSR values, pulse widths, filter cutoff frequencies, and timing values required to produce these effects.

**Overview**

The following assembly code examples demonstrate how to create specific sound effects using the SID chip:

- **Laser/Zap**
- **Explosion**
- **Drum Kick**
- **Hand Clap**

Each example includes the appropriate register settings and parameters to achieve the desired sound effect.

## Source Code

```assembly
; Laser/Zap Sound Effect
; Uses Voice 1 of the SID chip

LDA #$00
STA $D400   ; Voice 1 Frequency Low Byte
STA $D401   ; Voice 1 Frequency High Byte
LDA #$10
STA $D404   ; Voice 1 Control Register (Triangle Waveform)
LDA #$0F
STA $D405   ; Voice 1 Attack/Decay (Attack: 0, Decay: 15)
LDA #$00
STA $D406   ; Voice 1 Sustain/Release (Sustain: 0, Release: 0)
LDA #$01
STA $D404   ; Start the sound (Gate bit set)
; Delay loop to let the sound play
LDX #$FF
LDY #$FF
DelayLoop:
DEY
BNE DelayLoop
DEX
BNE DelayLoop
LDA #$00
STA $D404   ; Stop the sound (Gate bit cleared)
```

```assembly
; Explosion Sound Effect
; Uses Voice 1 of the SID chip

LDA #$00
STA $D400   ; Voice 1 Frequency Low Byte
STA $D401   ; Voice 1 Frequency High Byte
LDA #$80
STA $D404   ; Voice 1 Control Register (Noise Waveform)
LDA #$F0
STA $D405   ; Voice 1 Attack/Decay (Attack: 15, Decay: 0)
LDA #$00
STA $D406   ; Voice 1 Sustain/Release (Sustain: 0, Release: 0)
LDA #$01
STA $D404   ; Start the sound (Gate bit set)
; Delay loop to let the sound play
LDX #$FF
LDY #$FF
DelayLoop:
DEY
BNE DelayLoop
DEX
BNE DelayLoop
LDA #$00
STA $D404   ; Stop the sound (Gate bit cleared)
```

```assembly
; Drum Kick Sound Effect
; Uses Voice 1 of the SID chip

LDA #$00
STA $D400   ; Voice 1 Frequency Low Byte
STA $D401   ; Voice 1 Frequency High Byte
LDA #$40
STA $D404   ; Voice 1 Control Register (Sawtooth Waveform)
LDA #$F0
STA $D405   ; Voice 1 Attack/Decay (Attack: 15, Decay: 0)
LDA #$00
STA $D406   ; Voice 1 Sustain/Release (Sustain: 0, Release: 0)
LDA #$01
STA $D404   ; Start the sound (Gate bit set)
; Delay loop to let the sound play
LDX #$FF
LDY #$FF
DelayLoop:
DEY
BNE DelayLoop
DEX
BNE DelayLoop
LDA #$00
STA $D404   ; Stop the sound (Gate bit cleared)
```

```assembly
; Hand Clap Sound Effect
; Uses Voice 1 of the SID chip

LDA #$00
STA $D400   ; Voice 1 Frequency Low Byte
STA $D401   ; Voice 1 Frequency High Byte
LDA #$80
STA $D404   ; Voice 1 Control Register (Noise Waveform)
LDA #$10
STA $D405   ; Voice 1 Attack/Decay (Attack: 1, Decay: 0)
LDA #$00
STA $D406   ; Voice 1 Sustain/Release (Sustain: 0, Release: 0)
LDA #$01
STA $D404   ; Start the sound (Gate bit set)
; Delay loop to let the sound play
LDX #$7F
LDY #$7F
DelayLoop:
DEY
BNE DelayLoop
DEX
BNE DelayLoop
LDA #$00
STA $D404   ; Stop the sound (Gate bit cleared)
```

## Key Registers

- **$D400-$D401**: Voice 1 Frequency Low/High Byte
- **$D404**: Voice 1 Control Register
- **$D405**: Voice 1 Attack/Decay
- **$D406**: Voice 1 Sustain/Release

## References

- "sound_effect_laser" — expanded laser/zap example and explanation
- "sound_effect_explosion" — expanded explosion example and explanation
- "sound_effect_drum_kick" — expanded drum kick example and explanation
- "sound_effect_hand_clap" — expanded hand clap example and explanation

## Labels
- $D400
- $D401
- $D404
- $D405
- $D406
