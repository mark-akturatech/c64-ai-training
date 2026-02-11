# PW LO / PW HI (Pulse Width — Registers 02,03 / SID Voice 1 $D402-$D403)

**Summary:** Pulse Width registers PW LO/PW HI ($D402-$D403) form a 12-bit PWn value controlling the SID (VIC-II voice 1) Pulse waveform duty cycle; formula PWout = (PWn / 40.95)% and special values (0, 2048, 4095) determine DC/square outputs.

**Description**
Together, PW LO and PW HI contain a 12-bit unsigned value (PWn) that linearly sets the Pulse Width (duty cycle) of the Pulse waveform on Oscillator/Voice 1. Only the low 4 bits of PW HI are used; the upper nibble of PW HI (bits 4–7) is unused. The effective pulse width as a percentage is given by:

PWout = (PWn / 40.95) %

PWn ranges from 0 to 4095 (12-bit). Notes on behavior:
- PW registers affect sound only when the Pulse waveform for Oscillator/Voice 1 is selected.
- The 12-bit resolution allows smooth pulse-width sweeps with no discernible stepping.
- Extreme values:
  - PWn = 0 (minimum) → constant DC output
  - PWn = 4095 (maximum) → constant DC output
  - PWn = 2048 (midpoint, 0x800) → exact square wave

## Source Code
```text
Pulse width composition (12-bit):
  PWn = PW_LO + ((PW_HI & 0x0F) << 8)

Formula:
  PWout = (PWn / 40.95) %

Examples:
  PWn = 0       -> PWout = 0%    -> DC
  PWn = 2048    -> PWout ≈ 50%   -> square wave (0x800)
  PWn = 4095    -> PWout ≈ 100%  -> DC (0xFFF)
```

## Key Registers
- $D402-$D403 - SID - Voice 1 Pulse Width Low / Pulse Width High (12-bit PWn; PW_HI bits 4-7 unused)

## References
- "freq_lo_hi_registers" — expands on Oscillator frequency control (Registers 00,01) used to modulate Noise and other effects
- "waveform_selection_bits_and_output_behavior" — expands on Pulse waveform must be selected for PW registers to take effect

## Labels
- PW_LO
- PW_HI
