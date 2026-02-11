# SID Laser/Zap example — ADSR A=0 D=15, S/R low, frequency sweep

**Summary:** Example SID (6581/8580) voice-1 setup showing ADSR bytes ($D405/$D406), 16-bit frequency MSB write ($D401), waveform+gate control ($D404), and a simple downward frequency sweep via DEC $D401. Search terms: $D401, $D404, $D405, $D406, SID, ADSR, sawtooth, noise, gate, DEC.

## Overview
This chunk shows a minimal assembly sequence to produce a percussive "laser/zap" sound on SID voice 1:

- $D405 (Attack/Decay): high nibble = Attack (0–15), low nibble = Decay (0–15). The example stores #$0F (0000 1111b) to set Attack=0, Decay=15.
- $D406 (Sustain/Release): high nibble = Sustain (0–15), low nibble = Release (0–15). The example stores #$00 to set Sustain=0, Release=0 (very percussive).
- Frequency is 16-bit: $D400 = low byte, $D401 = high byte (MSB). The example initializes the MSB to #$82 and then repeatedly DEC $D401 each frame to sweep frequency down.
- $D404 is the oscillator control/waveform/gate register for voice 1; writing a value with the gate bit set triggers the envelope. The source uses #$81 (gate + waveform bit(s)), but the comments contain a contradiction about which waveform that value selects — see note below.

Behavioral notes:
- Writing the high byte ($D401) alone steps the coarse part of frequency; sweeping only $D401 produces large (MSB-sized) steps. For finer sweeps, modify $D400 as well.
- The write to $D404 sets the waveform(s) and the gate bit (starts the envelope). Gate is commonly the low-order bit (bit 0) (short parenthetical).

**[Note: Source may contain an error — the inline comment labels for $D404 contradict each other about whether #$81 selects sawtooth or noise; the value #$81 (binary 1000 0001) sets gate plus a high waveform bit, but the source text inconsistently names the waveform.]**

## Source Code
```asm
    lda #$0f          ; A=0 (high nibble), D=15 (low nibble)
    sta $d405

    lda #$00          ; S=0 (high nibble), R=0 (low nibble)
    sta $d406

    lda #$82          ; Start frequency high (MSB)
    sta $d401

    lda #$81          ; Waveform + gate (source comments conflict: sawtooth+gate vs noise+gate)
    sta $d404         ; (Use $81 = noise+gate for noise laser) 

; Sweep frequency down each frame:
    dec $d401
```

## Key Registers
- $D400-$D406 - SID (6581/8580) - Voice 1 registers: frequency low/high ($D400/$D401), pulse width low/high, control/waveform/gate ($D404), attack/decay ($D405), sustain/release ($D406)

## References
- "waveforms_noise" — noise-based laser variant details
- "adsr_overview" — percussive ADSR settings and explanation