# $D404 (54276) VCREG1 — Voice 1 Control Register

**Summary:** $D404 is the SID (Sound Interface Device) Voice 1 Control Register (VCREG1). Bits: b0 Gate (start ADSR), b1 Sync (sync to Osc3), b2 Ring Mod (osc1/3), b3 Test (disable oscillator), b4-b7 waveform selects (triangle, saw, pulse, noise); multiple waveform bits are ANDed and the Gate starts/stops ADSR (ADSR = Attack-Decay-Sustain-Release).

## Register overview
This register controls Voice 1 output routing and note gating on the SID ($D400-$D41F family). Gate (bit 0) starts the ADSR envelope when set while a waveform bit is active; clearing Gate begins release. Sync (bit 1) forces oscillator 1 to synchronize to oscillator 3's fundamental frequency. Ring Modulation (bit 2) replaces voice 1 triangle output with a ring-modulated combination of oscillators 1 and 3 (useful for nonharmonic bell/gong timbres). Test (bit 3) disables oscillator output (useful for waveform construction under software control). Bits 4–7 select triangle, sawtooth, pulse, and noise waveforms respectively; at least one waveform bit must be set to produce sound. If multiple waveform bits are set their outputs are logically ANDed (combining waveforms is possible but the noise+other combos are not recommended). For audible output the frequency registers, ADSR registers, pulse width, and global or voice volume must be set appropriately.

## Source Code
```text
$D404        VCREG1       Voice 1 Control Register

Bit layout:
  Bit 0 - Gate Bit:
    1 = Start attack/decay/sustain (ADSR), 0 = Start release.
    Setting this bit while a waveform bit (b4-b7) is set begins the note.
    Clearing it after a note started begins release. Requires frequency, ADSR,
    pulse width (if using pulse), and volume to be set for audible output.

  Bit 1 - Sync Bit:
    1 = Synchronize Oscillator 1's fundamental frequency to Oscillator 3.
    Oscillator 3 must be set to a nonzero frequency. Other Osc3 parameters
    do not otherwise affect Voice 1 output.

  Bit 2 - Ring Modulation:
    1 = Replace triangle output of Voice 1 with ring modulation of Osc1 and Osc3.
    Produces nonharmonic overtones, useful for bell/gong sounds.

  Bit 3 - Test Bit:
    1 = Disable Oscillator 1 output.
    Used to help construct complex waveforms under software control.

  Bit 4 - Triangle waveform select:
    1 = Output triangle waveform (requires Gate bit set to sound)

  Bit 5 - Sawtooth waveform select:
    1 = Output sawtooth waveform (requires Gate bit set to sound)

  Bit 6 - Pulse waveform select:
    1 = Output pulse waveform (pulse harmonic content varies with Pulse Width regs).
    Requires Gate bit set to sound.

  Bit 7 - Random noise waveform select:
    1 = Output noise waveform whose apparent frequency varies with Osc1.
    Useful for unpitched sounds (explosions, drums). Combining noise with other
    waveforms is not recommended.

Notes:
  - One of bits 4..7 must be set to produce sound. Setting multiple waveform bits
    results in logical ANDing of the waveform outputs.
  - Pulse waveform timbre controlled by Pulse Width registers (see "voice1_pulse_waveform_width_control").
  - ADSR envelope controlled by ADSR registers (see "voice1_adsr_and_envelope").
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width low/high, control (VCREG1 at $D404), ADSR low/high)

## References
- "voice1_pulse_waveform_width_control" — pulse width and its effect on Voice 1 pulse waveform
- "voice1_adsr_and_envelope" — ADSR registers and envelope behavior for Voice 1
- "voice2_voice3_control_registers" — control registers and behavior for Voices 2 and 3