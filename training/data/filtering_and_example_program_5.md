# SID Filtering — Example Program 5

**Summary:** Demonstrates SID filter cutoff and enabling for voice 1 using POKEs to SID registers ($D415-$D418). Shows use of Lcf/Hcf bytes (cutoff low/high), POKE to turn the filter on, and setting register for filter type (high-pass). Includes a BASIC example (Example Program 5) that writes cutoff, enables filter, and plays data-driven notes.

**Filtering Overview**

The SID's analog-style filter alters a waveform's harmonic content. Cutoff frequency is set with two bytes (low and high), and the filter must be enabled for a voice. This example:

- Stores the SID base in `s` (`s = 54272` or `$D400`).
- Writes cutoff low and high bytes to offsets +21 (Lcf) and +22 (Hcf) relative to `s`.
- Enables the filter (POKE to offset +23).
- Selects the filter type (high-pass) via the register at offset +24 (master/voice routing/volume bits).

Behavioral notes:

- High-pass filter attenuates frequencies below the cutoff point.
- The example modifies register +24 for volume and filter/type settings to pick the high-pass response.

## Source Code

```basic
5 s=54272
10 for l=s to s+24: poke l,0: next
15 poke s+22,128: poke s+21,0: poke s+23,1
20 poke s+5,9: poke s+6,0
30 poke s+24,79
40 read hf,lf,dr
50 if hf<0 then end
60 poke s+1,hf: poke s,lf
70 poke s+4,33
80 for t=1 to dr: next
90 poke s+4,32: for t=1 to 50: next
100 goto 40
110 data 25,177,250,28,214,250
120 data 25,177,250,25,177,250
130 data 25,177,125,28,214,125
140 data 32,94,750,25,177,250
150 data 28,214,250,19,63,250
160 data 19,63,250,19,63,250
170 data 21,154,63,24,63,63
180 data 25,177,250,24,63,125
190 data 19,63,250,-1,-1,-1
```

## Key Registers

- $D400-$D406: SID (Voice 1: frequency low/high, pulse width, control, ADSR)
- $D407-$D40D: SID (Voice 2)
- $D40E-$D414: SID (Voice 3)
- $D415-$D416: SID - Filter cutoff low (Lcf) and high (Hcf) bytes (cutoff frequency)
- $D417: SID - Filter control (resonance/filter enable bits and mode routing)
- $D418: SID - Master volume/voice routing/filter type bits (volume + filter/type settings)

## References

- "filter_types_and_registers" — expands on which bits in register 24 control filter types and how Lcf/Hcf encode cutoff
- "advanced_techniques_and_example_6" — expands on using oscillator outputs for modulation with filters

## Labels
- LCF
- HCF
- FILTER_CONTROL
- MASTER_VOLUME
