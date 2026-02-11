# White Noise Waveform (SID)

**Summary:** Describes the SID white noise waveform and provides a BASIC program to demonstrate its sound; useful for sound effects.

**Description**

The SID chip in the Commodore 64 offers a white noise waveform, commonly used for sound effects like explosions or gunfire. The following BASIC program demonstrates how to generate white noise using the SID:

## Source Code

```basic
10 S = 54272
20 POKE S+24, 15
30 POKE S+5, 15
40 POKE S+6, 0
50 POKE S+4, 129
60 POKE S+1, 0
70 POKE S, 0
80 FOR T = 1 TO 1000: NEXT T
90 POKE S+4, 128
100 POKE S+24, 0
```

This program sets up the SID to produce white noise by configuring the appropriate registers:

- **Line 10:** Sets the base address of the SID chip.
- **Line 20:** Sets the master volume to maximum.
- **Line 30:** Sets the attack and decay rates.
- **Line 40:** Sets the sustain and release rates.
- **Line 50:** Selects the white noise waveform and initiates the gate.
- **Lines 60-70:** Sets the frequency to the lowest value.
- **Line 80:** Introduces a delay to allow the sound to play.
- **Line 90:** Turns off the gate to stop the sound.
- **Line 100:** Resets the volume.

This example illustrates how to produce white noise using the SID chip, which can be utilized for various sound effects in programs.

## References

- "pulse_width_registers_and_square_wave" — expands on alternative waveform options and program adjustments after learning pulse width control