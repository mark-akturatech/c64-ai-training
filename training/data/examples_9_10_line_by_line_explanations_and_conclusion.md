# Example Program 10 — Line-by-line explanation (SID sync / ring-mod, waveforms, timing loops)

**Summary:** Line-by-line BASIC descriptions for Example Program 10 showing SID register uses (frequency, Attack/Decay, waveform/control bits including sync and ring-mod, master volume), how BASIC timing loops gate waveforms, and how control-register bit changes produce the intended sonic effects.

**Line-by-line explanation (Example Program 10)**

- **Lines 10–20:** Initialize SID and clear registers
  - Set `S` to the start address of the SID chip (`54272` or `$D400`).
  - Clear SID registers to ensure a known starting state.

- **Line 30:** Set high frequency for voice 1
  - POKE `S+1,130`

- **Line 40:** Set Attack/Decay for voice 1 (A=0, D=9)
  - POKE `S+5,9`

- **Line 50:** Set high frequency for voice 3
  - POKE `S+15,30`

- **Line 60:** Set volume to maximum (15)
  - POKE `S+24,15`

- **Lines 70–90:** Generate sound with timing loops
  - FOR loop to repeat the sound generation process.
  - Set control register for voice 1 to start triangle waveform and enable ring modulation.
  - Timing loop to control duration.
  - Clear control register to stop sound.
  - Timing loop before next iteration.

**How the SID control bits produce sync / ring-mod / gating effects**

- **Control Register (Voice 1 at `S+4`):**
  - Bit 0: GATE (1 = start Attack/Decay/Sustain cycle, 0 = start Release cycle)
  - Bit 1: SYNC (1 = enable oscillator synchronization)
  - Bit 2: RING MOD (1 = enable ring modulation)
  - Bit 3: TEST (1 = reset oscillator)
  - Bit 4: TRIANGLE waveform (1 = enable)
  - Bit 5: SAWTOOTH waveform (1 = enable)
  - Bit 6: PULSE waveform (1 = enable)
  - Bit 7: NOISE waveform (1 = enable)

Setting multiple waveform bits simultaneously can produce complex waveforms.

**Timing loops and audible result**

- BASIC timing loops (`FOR/NEXT`) control the duration of sounds.
- Due to BASIC's execution speed variability, precise timing is challenging; machine code is recommended for exact timing.

**Encouragement / further resources**

- Experiment with different frequency ratios, envelope settings, and waveform combinations to explore a wide range of sounds.
- Refer to the "Commodore 64 Programmer's Reference Guide" for more detailed information on SID programming.

## Source Code

```basic
10 S=54272
20 FOR L=S TO S+24:POKE L,0:NEXT
30 POKE S+1,130
40 POKE S+5,9
50 POKE S+15,30
60 POKE S+24,15
70 FOR L=1 TO 12
80 POKE S+4,17
90 FOR T=1 TO 1000:NEXT T
100 POKE S+4,16
110 FOR T=1 TO 1000:NEXT T
120 NEXT L
```

## Key Registers

- **$D400–$D401 (54272–54273):** Voice 1 Frequency (Low/High)
- **$D402–$D403 (54274–54275):** Voice 1 Pulse Width (Low/High)
- **$D404 (54276):** Voice 1 Control Register
- **$D405 (54277):** Voice 1 Attack/Decay
- **$D406 (54278):** Voice 1 Sustain/Release
- **$D40E–$D40F (54286–54287):** Voice 3 Frequency (Low/High)
- **$D418 (54296):** Volume and Filter Mode

## References

- "Commodore 64 Programmer's Reference Guide" – Detailed information on SID programming and sound generation techniques.