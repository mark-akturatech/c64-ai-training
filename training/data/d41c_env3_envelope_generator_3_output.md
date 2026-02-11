# SID $D41C — ENV3 (Envelope Generator 3 Output)

**Summary:** Read-only SID register $D41C (ENV3) returns the envelope generator output for voice 3; useful for modulation of Frequency Control, Pulse Width, or Filter Frequency. Requires the gate bit in Control Register 3 to be set; ADSR (attack/decay/sustain/release) controls the envelope shape.

## Description
ENV3 ($D41C) is a read-only byte exposing the current output level of voice 3's envelope generator. The value may be added to other sound parameters (for example, another oscillator's Frequency Control registers, Pulse Width registers, or the Filter Frequency Control register) to implement modulation techniques.

To produce any output on ENV3 the gate bit in Control Register 3 must be set to 1. Setting that gate bit begins the attack/decay/sustain cycle; clearing the gate bit begins the release cycle. The envelope shape and timing are governed by the voice 3 ADSR settings.

## Key Registers
- $D41C - SID - Envelope generator output for Voice 3 (read-only)

## References
- "d41b_random_oscillator3_upper_waveform" — expands on Oscillator 3 vs Envelope 3 outputs for modulation

## Labels
- ENV3
