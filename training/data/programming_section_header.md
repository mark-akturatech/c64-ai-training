# SID Programming Techniques (Section 11)

**Summary:** Section header for SID (6581/8580) programming techniques with references to example 6502 assembly snippets and related topics; relevant SID register block $D400-$D418 is the target for code examples and initialization techniques.

**Overview**

This chunk serves as the section header for "11. PROGRAMMING TECHNIQUES" in the SID programming guide. It introduces various SID programming methods, including initialization, voice setup, envelope control, and filter usage. The section references example 6502 assembly snippets that demonstrate these techniques. The SID register block from $D400 to $D418 is the primary focus for code examples and initialization procedures.

## Source Code

Below is an example of initializing the SID chip and setting up a basic voice with a sawtooth waveform:

```assembly
; Initialize SID chip
LDA #$00
STA $D400  ; Voice 1 Frequency Low
STA $D401  ; Voice 1 Frequency High
STA $D402  ; Voice 1 Pulse Width Low
STA $D403  ; Voice 1 Pulse Width High
STA $D404  ; Voice 1 Control Register
STA $D405  ; Voice 1 Attack/Decay
STA $D406  ; Voice 1 Sustain/Release

; Set frequency for Voice 1
LDA #$0F
STA $D400  ; Frequency Low
LDA #$10
STA $D401  ; Frequency High

; Set pulse width for Voice 1
LDA #$80
STA $D402  ; Pulse Width Low
LDA #$08
STA $D403  ; Pulse Width High

; Set envelope for Voice 1
LDA #$10
STA $D405  ; Attack/Decay: Attack=1, Decay=0
LDA #$F0
STA $D406  ; Sustain/Release: Sustain=15, Release=0

; Set control register for Voice 1
LDA #%00010001  ; Gate=1, Sawtooth waveform
STA $D404
```

This code initializes the SID chip, sets the frequency and pulse width for Voice 1, configures the envelope, and selects the sawtooth waveform with the gate bit enabled.

## Key Registers

- $D400-$D418 - SID - Voice 1-3 registers and global/filter registers (SID register block)

## References

- "programming_initialization" — recommended register clearing and initialization practices
- "music_engine_structure" — example music engine layout and structure (tracks, patterns, timing)