# SID Voice 2 Registers ($D407-$D40B)

**Summary:** SID voice 2 registers at $D407-$D40B (SID chip, base $D400) — FRELO/FREHI frequency control (16-bit), PWLO/PWHI pulse width (12-bit), and VCREG2 control bits for gate, sync, ring modulation, test and waveform selection.

## Description
Voice 2 uses five consecutive SID registers:

- $D407/$D408 form the 16-bit frequency control word for oscillator 2 (FRELO = low byte, FREHI = high byte).
- $D409/$D40A form the 12-bit pulse width for the pulse waveform (PWLO = low 8 bits, PWHI supplies the high 4 bits in its low nybble).
- $D40B is the Voice 2 Control Register (VCREG2) holding gate, sync, ring-mod, test and waveform select bits.

Behavioral notes:
- Gate bit (VCREG2 bit 0): setting to 1 starts the attack/decay/sustain phase; clearing to 0 starts release.
- Sync bit (VCREG2 bit 1): when set, oscillator 2 is synchronized to oscillator 1 (oscillator 2 phase is reset to oscillator 1 on wrap).
- Ring Modulation (VCREG2 bit 2): when set, oscillator 2 is ring-modulated with oscillator 1.
- Test bit (VCREG2 bit 3): when set, oscillator 2 is disabled/tested (oscillator output inhibited).
- Waveform select (VCREG2 bits 4–7): each bit enables a waveform; multiple waveform bits may be set simultaneously to combine waveforms (triangle, sawtooth, pulse, noise respectively).
- Pulse width is a 12-bit value (0–4095) constructed from PWLO (8 LSBs) and the low nibble of PWHI (4 MSBs).

(Parenthetical: "synchronize" = reset oscillator phase; "pulse width" = duty cycle control)

## Source Code
```text
$D407        FRELO2       Voice 2 Frequency Control (low byte)
$D408        FREHI2       Voice 2 Frequency Control (high byte)
$D409        PWLO2        Voice 2 Pulse Waveform Width (low byte)
$D40A        PWHI2        Voice 2 Pulse Waveform Width (high nybble)
$D40B        VCREG2       Voice 2 Control Register

VCREG2 bit map:
  bit 0    Gate Bit:       1 = Start attack/decay/sustain, 0 = Start release
  bit 1    Sync Bit:       1 = Synchronize oscillator with Oscillator 1 frequency
  bit 2    Ring Modulation:1 = Ring modulate Oscillators 2 and 1
  bit 3    Test Bit:       1 = Disable Oscillator 2
  bit 4    Select triangle waveform
  bit 5    Select sawtooth waveform
  bit 6    Select pulse waveform
  bit 7    Select noise waveform

Pulse width:
  - 12-bit value: PW = ($D40A & $0F) << 8 | $D409
  - Range: 0..4095 (0 = minimum duty, 4095 = maximum)
```

## Key Registers
- $D407-$D40B - SID - Voice 2 FRELO, FREHI, PWLO, PWHI, VCREG (frequency, pulse width, control)

## References
- "voice2_atdcy2_and_surel2" — expands on Voice 2 ADSR registers ($D40C-$D40D)

## Labels
- FRELO2
- FREHI2
- PWLO2
- PWHI2
- VCREG2
