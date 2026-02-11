# SID Sync & Ring Modulation (6581) — mosquito / bell techniques

**Summary:** Explains synchronization and ring modulation on the 6581 SID (C64), including the control bits in the voice control register ($D404) that enable sync and ring modulation between voice 1 and voice 3, and a BASIC example that uses sync to imitate a "mosquito" sound.

**Synchronization**

Synchronization locks two oscillators (voices) so their waveforms align, effectively resetting the phase of the slave oscillator to match the master. This technique can create a narrow, buzzy "mosquito" tone by forcing waveform interaction between two voices (voice 1 and voice 3).

Sync is enabled by setting bit 1 of the voice 1 control register ($D404).

**Ring Modulation**

Ring modulation replaces the normal output of oscillator 1 with a modulated combination of oscillator 1 and oscillator 3, producing non-harmonic overtones suitable for metallic sounds like bells and gongs. This effect is activated by setting bit 2 of the voice 1 control register ($D404).

**Example: "Mosquito" Imitation (BASIC)**

The following BASIC program (Example Program 9) sets frequencies, waveforms, and control bits to produce a mosquito-like sound using synchronization between voices 1 and 3.

## Source Code

```basic
10 s=54272
20 for l=0 to 24: poke s+l,0: next
30 poke s+1,100
40 poke s+5,219
50 poke s+15,28
60 poke s+24,15
70 poke s+4,19
80 for t=1 to 5000: next
90 poke s+4,18
100 for t=1 to 1000: next: poke s+24,0
```

This program initializes the SID registers, sets the frequencies for voices 1 and 3, enables synchronization, and plays the sound for a short duration.

## Key Registers

- $D400-$D406: SID (6581) - Voice 1 registers (frequency low/high, pulse width low/high, control ($D404), ADSR)
- $D407-$D40D: SID (6581) - Voice 2 registers
- $D40E-$D414: SID (6581) - Voice 3 registers
- $D415-$D418: SID (6581) - Filter and global registers
- $D404: SID (6581) - Voice 1 Control register

Voice 1 Control Register ($D404) bit-field:

- Bit 0: Gate (1 = Start Attack/Decay/Sustain cycle; 0 = Start Release cycle)
- Bit 1: Sync (1 = Synchronize oscillator 1 with oscillator 3)
- Bit 2: Ring Modulation (1 = Enable ring modulation between oscillator 1 and oscillator 3)
- Bit 3: Test (1 = Reset oscillator 1)
- Bit 4: Triangle Wave (1 = Enable triangle waveform)
- Bit 5: Sawtooth Wave (1 = Enable sawtooth waveform)
- Bit 6: Pulse Wave (1 = Enable pulse waveform)
- Bit 7: Noise Wave (1 = Enable noise waveform)

Note: Only one waveform should be enabled at a time to produce standard waveforms.

## References

- "example9_code_and_explanation" — expanded explanation of Example Program 9 (sync)
- "example10_code_and_explanation" — ring modulation example (clock chime imitation)