# SID 6581/8580 — Known Quirks and Bugs

**Summary:** This document details specific hardware quirks of the SID 6581/8580 sound chip, including ADSR retriggering issues, noise LFSR lockup and recovery, write-only register readback behavior, 6581 filter distortion and DC offset, TEST-bit oscillator behavior, combined-waveform differences between 6581/8580, and the audible click on writes to $D418 used for digital playback.

**Quirks and Behaviors**

1. **ADSR Retrigger Delay (ADSR Bug)**
   - The internal ADSR rate counter can delay a retriggered note. Players mitigate this with "hard restart" techniques, which involve re-initializing the envelope state rather than relying on a simple gate toggle.

2. **Noise LFSR Lockup**
   - Selecting noise simultaneously with another waveform, or switching from a combined waveform to noise, can freeze the noise LFSR, resulting in silence. Recovery involves setting the TEST bit (writing $08 to the voice control register), then re-writing the desired waveform bits.

3. **Write-Only Registers Readback**
   - SID registers $D400-$D418 are write-only; reading them returns the last value present on the data bus (the last value written to any SID register), not the actual internal register contents. This often causes unexpected behavior in code that expects readable SID registers.

4. **6581 Filter Distortion (Nonlinear Behavior)**
   - The 6581 filter is non-linear and can clip or distort at high resonance or with multiple voices routed through it at high levels; this is a major contributor to the 6581's characteristic sound.

5. **6581 DC Offset**
   - The 6581 exhibits a waveform- and filter-dependent DC offset on its audio output. This DC offset contributes to audible clicks when volume or filter routing changes are written and is one reason 6581-based sample (digi) tricks work.

6. **Combined Waveform Differences (6581 vs 8580)**
   - Combined waveform behavior differs between 6581 and 8580 due to die-level differences. Programs relying on specific combined-waveform artifacts may sound different across chips.

7. **TEST Bit Behavior (Oscillator Reset/Hold)**
   - The TEST bit (bit 3 of each voice control register; value $08) resets and holds the oscillator accumulator at zero while set. Clearing TEST resumes the oscillator from zero, which is useful for phase-accurate reset/restart of oscillators.

8. **Volume Register Click (6581)**
   - Any write to $D418 produces an audible click proportional to the volume change; even writing the same value can produce a small click. This behavior is exploited for sample playback on the 6581 but can cause unwanted artifacts in music.

## Source Code

```text
SID Register Summary (Base $D400):

$D400 - Voice 1 Frequency Low
$D401 - Voice 1 Frequency High
$D402 - Voice 1 Pulse Width Low
$D403 - Voice 1 Pulse Width High
$D404 - Voice 1 Control Register
$D405 - Voice 1 Attack/Decay
$D406 - Voice 1 Sustain/Release

$D407 - Voice 2 Frequency Low
$D408 - Voice 2 Frequency High
$D409 - Voice 2 Pulse Width Low
$D40A - Voice 2 Pulse Width High
$D40B - Voice 2 Control Register
$D40C - Voice 2 Attack/Decay
$D40D - Voice 2 Sustain/Release

$D40E - Voice 3 Frequency Low
$D40F - Voice 3 Frequency High
$D410 - Voice 3 Pulse Width Low
$D411 - Voice 3 Pulse Width High
$D412 - Voice 3 Control Register
$D413 - Voice 3 Attack/Decay
$D414 - Voice 3 Sustain/Release

$D415 - Filter Cutoff Low
$D416 - Filter Cutoff High
$D417 - Resonance / Filter Mode / Voice Routing
$D418 - Volume / Master Control

Control Register ($D404, $D40B, $D412):

Bit 7: Noise Waveform (1 = Enable)
Bit 6: Pulse Waveform (1 = Enable)
Bit 5: Sawtooth Waveform (1 = Enable)
Bit 4: Triangle Waveform (1 = Enable)
Bit 3: Test (1 = Oscillator Reset)
Bit 2: Ring Modulation (1 = Enable)
Bit 1: Synchronize Oscillator (1 = Enable)
Bit 0: Gate (1 = Start Attack/Decay; 0 = Start Release)

Resonance / Filter Mode / Voice Routing Register ($D417):

Bits 7-4: Filter Resonance Control (0000 = Minimum, 1111 = Maximum)
Bit 3: Filter Mode Select (1 = High-Pass Filter Enable)
Bit 2: Filter Mode Select (1 = Band-Pass Filter Enable)
Bit 1: Filter Mode Select (1 = Low-Pass Filter Enable)
Bit 0: Filter Voice 3 Off (1 = Disable Voice 3 from Filter)

Volume / Master Control Register ($D418):

Bits 7-4: Not Used
Bit 3: Filter Select (1 = Enable Filter)
Bits 2-0: Volume Control (0000 = Minimum, 1111 = Maximum)

Examples (6502 Assembly):

; Noise LFSR Lockup Recovery (Voice 1 Control Register at $D404)
LDA #$08      ; Set TEST bit
STA $D404
LDA #<waveform_bits> ; Desired waveform bits after recovery
STA $D404

; Trigger Volume Write (May Produce Click on 6581)
LDA #$0F
STA $D418     ; Write master volume (click may occur)
```

## Key Registers

- $D400-$D406 - SID - Voice 1 (Frequency Low/High, Pulse Width Low/High, Control, ADSR)
- $D407-$D40D - SID - Voice 2 (Frequency Low/High, Pulse Width Low/High, Control, ADSR)
- $D40E-$D414 - SID - Voice 3 (Frequency Low/High, Pulse Width Low/High, Control, ADSR)
- $D415-$D418 - SID - Filter and Volume (Cutoff, Resonance/Mode/Routing, Master Volume)

## References

- "adsr_bug" — Expands on ADSR retriggering issue and workarounds
- "waveforms_noise" — Expands on LFSR lockup warnings and fixes
- "sample_playback_digi_techniques" — Expands on volume click exploitation and chip differences