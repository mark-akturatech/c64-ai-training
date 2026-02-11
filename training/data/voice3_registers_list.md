# C64 SID Voice 3 registers ($D410-$D414)

**Summary:** SID Voice 3 register descriptions for $D410-$D414: PWLO3/PWHI3 (pulse width low/high), VCREG3 (Gate, Sync, Ring Mod, Test, waveform select), ATDCY3 (Attack/Decay), SUREL3 (Sustain/Release). ADSR and waveform bits behave analogously to Voice 1/2.

## Voice 3 register overview
- $D410 PWLO3 — Voice 3 Pulse Waveform Width (low byte). Combined with $D411 high nybble to form the pulse width value (12-bit pulse width: low 8 bits + high 4 bits).
- $D411 PWHI3 — Voice 3 Pulse Waveform Width (high nybble). High 4 bits of pulse width; lower 4 bits of this register are used (nybble).
- $D412 VCREG3 — Voice 3 Control Register. Bit definitions:
  - Bit 0: Gate — 1 = start attack/decay/sustain, 0 = start release
  - Bit 1: Sync — 1 = synchronize oscillator with Oscillator 2 frequency
  - Bit 2: Ring Modulation — 1 = ring modulate Oscillators 3 and 2
  - Bit 3: Test — 1 = disable Oscillator 3 (test mode)
  - Bit 4: Triangle waveform select
  - Bit 5: Sawtooth waveform select
  - Bit 6: Pulse waveform select
  - Bit 7: Noise waveform select
- $D413 ATDCY3 — Voice 3 Attack/Decay register:
  - Bits 0-3: Decay cycle duration (0–15)
  - Bits 4-7: Attack cycle duration (0–15)
- $D414 SUREL3 — Voice 3 Sustain/Release register:
  - Bits 0-3: Release cycle duration (0–15)
  - Bits 4-7: Sustain volume level (0–15)

ADSR envelope encoding and waveform selection operate the same way as for Voice 1 and Voice 2.

## Source Code
```text
$D410        PWLO3        Voice 3 Pulse Waveform Width (low byte)

$D411        PWHI3        Voice 3 Pulse Waveform Width (high nybble)

$D412        VCREG3       Voice 3 Control Register

                     0    Gate Bit:  1=Start attack/decay/sustain, 0=Start release
                     1    Sync Bit:  1=Synchronize oscillator with Oscillator 2 frequency
                     2    Ring Modulation:  1=Ring modulate Oscillators 3 and 2
                     3    Test Bit:  1=Disable Oscillator 3
                     4    Select triangle waveform
                     5    Select sawtooth waveform
                     6    Select pulse waveform
                     7    Select noise waveform

$D413        ATDCY3       Voice 3 Attack/Decay Register

                     0-3  Select decay cycle duration (0-15)
                     4-7  Select attack cycle duration (0-15)

$D414        SUREL3       Voice 3 Sustain/Release Control Register

                     0-3  Select release cycle duration (0-15)
                     4-7  Select sustain volume level (0-15)
```

## Key Registers
- $D410-$D414 - SID - Voice 3: PWLO3, PWHI3, VCREG3 (Gate/Sync/Ring/Test/waveforms), ATDCY3 (AD), SUREL3 (SR)

## References
- "voice2_registers_list_and_vcreg2" — expands on Voice2/3 comparison and sync/ring-mod differences

## Labels
- PWLO3
- PWHI3
- VCREG3
- ATDCY3
- SUREL3
