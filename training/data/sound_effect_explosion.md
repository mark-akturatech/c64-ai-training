# SID Explosion — short ADSR noise rumble (6581/8580)

**Summary:** Example SID (6581/8580) routine producing an explosion/rumble using noise waveform with gate enabled, short ADSR (A=0, D=0; S=15, R=9), low-frequency voice (frequency high byte $D401), and optional filter cutoff sweep; references SID registers $D400-$D406 and filter range $D415-$D418.

**Description**
This packet demonstrates a minimal SID programming sequence to produce a short explosion/rumble effect by:
- Selecting the noise waveform and enabling the gate for the voice (control register).
- Using very short attack and decay (A=0, D=0) with a high sustain level and moderate release (S=15, R=9) so the sound sustains briefly then releases.
- Setting a low pitch (low-frequency rumble) by writing the frequency high byte; the frequency is a 16-bit value in $D400-$D401.
- Optionally sweeping the filter cutoff downward to emphasize an impact/boom.

ADSR register packing (SID): attack and decay share $D405 (high nibble = attack 0–15, low nibble = decay 0–15). Sustain and release share $D406 (high nibble = sustain 0–15, low nibble = release 0–15). Writing the control register with the gate bit set starts the envelope; clearing the gate begins the release phase.

Notes:
- The example writes only the high byte of the frequency ($D401); the frequency is 16-bit across $D400 (low) and $D401 (high). If $D400 is 0 or unchanged, the resulting frequency is the value formed with that low byte.
- $D404 is the voice control register — the example value $81 is described here as “noise + gate” (0x81 sets the noise waveform and turns the gate on in this example).

Control register ($D404) bit mapping:
- Bit 7: Noise waveform enable (1 = on)
- Bit 6: Pulse waveform enable (1 = on)
- Bit 5: Sawtooth waveform enable (1 = on)
- Bit 4: Triangle waveform enable (1 = on)
- Bit 3: Test bit (1 = disable oscillator)
- Bit 2: Ring modulation enable (1 = on)
- Bit 1: Synchronization enable (1 = on)
- Bit 0: Gate (1 = start attack/decay/sustain; 0 = start release)

In this example, setting $D404 to $81 (binary 10000001) enables the noise waveform (bit 7) and sets the gate (bit 0), initiating the attack phase of the envelope generator with the noise waveform selected.

## Source Code
```asm
; EXPLOSION - SID (6581/8580) example
; Short ADSR (A=0,D=0; S=15,R=9), low frequency, noise + gate.
    LDA #$00          ; A=0, D=0 (attack/decay packed in $D405)
    STA $D405

    LDA #$F9          ; S=15, R=9 (sustain/release packed in $D406)
    STA $D406

    LDA #$10          ; set high byte of frequency for a low rumble
    STA $D401

    LDA #$81          ; noise + gate (control register)
    STA $D404

    ; Optional: sweep filter cutoff down for extra effect (use $D415-$D418)
```

## Key Registers
- $D400-$D401 - SID (voice 1) - Frequency (16-bit, low then high)
- $D402-$D403 - SID (voice 1) - Pulse width (16-bit, low then high)
- $D404 - SID (voice 1) - Control register (waveform selection, gate, sync, ring, test, etc.)
- $D405 - SID (voice 1) - Attack (high nibble) / Decay (low nibble)
- $D406 - SID (voice 1) - Sustain (high nibble) / Release (low nibble)
- $D415-$D418 - SID - Filter cutoff / resonance / routing / master volume (used for optional cutoff sweep)

## References
- "waveforms_noise" — expands on use of noise for explosion
- "filter_sweeps" — expands on sweeping filter cutoff to enhance impact

## Labels
- $D400
- $D401
- $D404
- $D405
- $D406
- $D415
