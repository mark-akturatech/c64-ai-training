# SID Voice 1 Frequency Control ($D400-$D401)

**Summary:** $D400-$D401 (SID) are the low and high bytes of the 16-bit Voice 1 Frequency Control; frequency is computed by FREQUENCY = (REGISTER_VALUE * CLOCK / 16777216) Hz (NTSC clock 1,022,730 Hz => multiplier ≈ 0.060959458 Hz).  

## Description
These two consecutive SID registers form a 16-bit frequency control for SID voice 1. Both bytes must be combined to form the full frequency value:

- Combined REGISTER_VALUE = low_byte + 256 * high_byte
- Resolution: 16-bit (65536 discrete steps)
- Usable pitch range: from 0 (very low) up to about 4000 Hz (very high) in 65536 steps
- Frequency formula:
  FREQUENCY = (REGISTER_VALUE * CLOCK / 16,777,216) Hz

System clock (CLOCK) values:
- NTSC (American): 1,022,730 Hz
- PAL (European): 985,250 Hz

NTSC numeric form of the formula:
- FREQUENCY = REGISTER_VALUE * 0.060959458 Hz

The frequency may be changed mid-note for effects; some nonlinearity of perceived pitch is inherent due to discrete steps and clock division.

## Key Registers
- $D400-$D401 - SID - Voice 1 Frequency Control (low byte, high byte)

## References
- "sid_overview_intro" — expands on where frequency fits in voice processing sequence  
- "voice1_pw_width_and_control" — expands on Pulse Width registers and control for voice 1

## Labels
- SID_VOICE_1_FREQUENCY
