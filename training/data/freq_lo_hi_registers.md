# SID FREQ LO / FREQ HI (Registers 00-01, Voice 1)

**Summary:** FREQ LO/FREQ HI ($D400/$D401) form a 16-bit frequency control for SID Oscillator 1 (voice 1); frequency given by Fout = (Fn * Fclk / 16777216) Hz and for a 1.0 MHz clock Fout = Fn * 0.059604645 Hz.

## Description
Together FREQ LO and FREQ HI form a 16-bit unsigned value Fn (FREQ LO = low byte, FREQ HI = high byte) which linearly controls the output frequency of SID Oscillator 1. The frequency is calculated as:

Fout = (Fn * Fclk / 16777216) Hz

where Fn is the 16-bit value in the two registers and Fclk is the system clock applied to the 02 input (pin 6). For a standard 1.0 MHz clock the numeric factor becomes:

Fout = Fn * 0.059604645 Hz

This resolution is sufficient for musical tuning (no discernable stepping) and allows smooth sweeps between notes (portamento). A complete table for generating 8 octaves of the equally tempered scale with A4 = 440 Hz is provided in Appendix E (see original reference).

## Key Registers
- $D400-$D401 - SID - Voice 1 frequency registers (FREQ LO, FREQ HI): 16-bit linear frequency control for Oscillator 1

## References
- "pw_lo_hi_registers" — expands on Pulse width registers (Registers 02,03) and pulse interaction  
- "control_register_header" — expands on Control register (Register 04) — gating and waveform selection

## Labels
- FREQLO
- FREQHI
