# SID examples: synchronization ("mosquito") and ring modulation (clock chime)

**Summary:** Two SID (MOS 6581/8580) examples using SID base $D400 (decimal 54272): Example 9 demonstrates voice synchronization and triangle waveform gating (sync between voice 1 and voice 3) by writing to the voice-1 control register ($D404); Example 10 demonstrates ring modulation (bell/chime) by writing control bits and uses POKEs to set frequencies, ADSR, and master volume.

**Examples overview**

- **Example Program 9 ("synchronization 'mosquito'")**: Sets up ADSR and frequencies for voices, then enables a triangle waveform on voice 1 with synchronization to voice 3 by setting the voice-1 control register bits. The provided line-by-line table documents each BASIC line's intent (initialize SID base, clear registers, set high frequencies, set ADSR, set volume, set waveform/control bits to start the sound, timing loop, stop sound, turn off volume).

- **Example Program 10 ("ring modulation clock chime")**: A short BASIC program that sets SID base `s=54272` ($D400), clears registers, writes frequency/high bytes and ADSR values, sets voice-1 control to enable ring modulation, triangle waveform, and gate for a short chime (`POKE s+4,21`), times the note, then clears the ring modulation bit (`POKE s+4,20`) to gate off. The program loops to produce multiple chimes.

- `s = 54272` is the SID base ($D400). POKEs use `s+offset` addressing (e.g., `POKE s+4` targets $D404 — voice 1 control register).

**Bit usage (as reported / inferred from source)**

The source statements and the program's POKE values indicate the following control bits for the voice control register (voice 1 control / $D404):

- **Bit 0**: Gate (start/stop voice)
- **Bit 1**: Sync (sync voice 1 to voice 3)
- **Bit 2**: Ring modulation
- **Bit 4**: Triangle waveform selection

*Note: The source may contain an inconsistency regarding bit numbering conventions.*

## Source Code

```basic
REM EXAMPLE PROGRAM 9 (synchronization "mosquito")
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

**Line-by-line explanation of Example Program 9:**

- **Line 10**: Set `s` to start of sound chip.
- **Line 20**: Clear sound chip registers.
- **Line 30**: Set high frequency for voice 1.
- **Line 40**: Set Attack/Decay for voice 1 (A=13, D=11).
- **Line 50**: Set high frequency for voice 3.
- **Line 60**: Set volume to 15.
- **Line 70**: Set start triangle, sync waveform control for voice 1.
- **Line 80**: Timing loop.
- **Line 90**: Set stop triangle, sync waveform control for voice 1.
- **Line 100**: Wait, then turn off volume.

The synchronization feature is enabled in line 70, where bits 0, 1, and 4 of register 4 are set. Bit 1 enables the syncing function between voice 1 and voice 3. Bits 0 and 4 gate voice 1 and set the triangular waveform.

```basic
REM EXAMPLE PROGRAM 10 (ring modulation clock chime)
10 s=54272
20 for l=0 to 24: poke s+l,0: next
30 poke s+1,130
40 poke s+5,9
50 poke s+15,30
60 poke s+24,15
70 for l=1 to 12: poke s+4,21
80 for t=1 to 1000: next: poke s+4,20
90 for t=1 to 1000: next: next
```

## Key Registers

- **$D400-$D406**: SID (voice 1) - frequency low/high, pulse width low/high, control register, ADSR (voice 1)
- **$D40E-$D414**: SID (voice 3) - frequency, pulse, control, ADSR (voice 3)
- **$D415-$D418**: SID (filter/global) - filter parameters and master volume ($D418 is master volume)

## References

- "synchronization_and_ring_modulation_overview" — explanation of which control bits enable sync/ring-mod and how they are used