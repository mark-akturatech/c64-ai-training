# C64 I/O Map — Voice 1 Pulse Width Registers ($D402 / $D403)

**Summary:** SID registers $D402 (PWLO1) and $D403 (PWHI1) hold the 12-bit pulse waveform width for SID Voice 1; combine the low byte and the high nybble to form the full pulse width value.

## Description
PWLO1 and PWHI1 are the two SID registers that define the pulse waveform width (pulse duty) for Voice 1. The width is a 12-bit value made from:
- PWLO1 ($D402) — low 8 bits (bits 7:0)
- PWHI1 ($D403) — high 4 bits (bits 11:8) stored in the low nybble of the byte

Programs set the pulse width by writing the low byte and the high nybble (order of writes is not mandated here). The combined 12-bit value is used by the SID oscillator to determine the pulse waveform duty.

## Source Code
```text
$D402        PWLO1        Voice 1 Pulse Waveform Width (low byte)
$D403        PWHI1        Voice 1 Pulse Waveform Width (high nybble)
```

Example composition (use when reading or constructing the full 12-bit width):
```text
pulse_width_12bit = ((PWHI1 & $0F) << 8) | PWLO1
```

## Key Registers
- $D402-$D403 - SID - Voice 1 pulse width (low byte / high nybble)

## References
- "voice1_pulse_waveform_width_control" — expands on Pulse width register composition