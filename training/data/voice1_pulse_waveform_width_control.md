# C64 I/O Map: $D402-$D403 — SID (Voice 1) Pulse Width Control

**Summary:** $D402-$D403 on the SID ($D400 base) hold Voice 1's 12-bit pulse width (low byte + lower nybble of high byte), controlling the pulse waveform duty cycle; PULSE WIDTH = (REGISTER VALUE / 40.95)%, range 0–4095 steps.

## Description
These two SID registers form a 12-bit pulse-width value for Voice 1 used only when the voice's waveform is set to pulse (see the voice control register at $D404 / VCREG1 bit 6). The 12-bit value is stored as:

- Low byte in $D402
- High nibble (lower 4 bits of the high byte) in $D403

The pulse width determines the duty cycle (percentage of each cycle the waveform is high). The resolution is 4096 discrete steps (0–4095), covering 0–100% duty cycle. Adjusting the pulse width changes the timbre of the pulse waveform.

The relationship between the register value and duty-cycle percentage is given by:
PULSE WIDTH = (REGISTER VALUE / 40.95)%

When the pulse waveform is not selected, these registers have no effect on output.

## Key Registers
- $D402-$D403 - SID - Voice 1 pulse width (12-bit; low byte + lower nybble of high byte)

## References
- "voice1_frequency_control" — expands on pulse width relevant when pulse waveform selected
- "d404_vcreg1_voice1_control_register" — expands on selecting pulse waveform via VCREG1 bit 6
