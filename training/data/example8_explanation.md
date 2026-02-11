# Filtered-noise "hand clap" (Example 8) — line-by-line explanation

**Summary:** Line-by-line explanation of a BASIC program that produces a filtered-noise "hand clap" on the SID chip (SID registers $D400-$D418): clearing SID registers, setting Voice 1 frequency and waveform (noise), writing ADSR nibbles, setting filter cutoff and enabling the filter, selecting high-pass mode and master volume, and looping to create multiple claps.

**Line-by-line explanation**

Below each BASIC line is explained in terms of the SID register(s) it touches and the effect on the sound. Numeric register addresses are given relative to the SID base ($D400 = decimal 54272) so S is typically set to 54272.

- **Line 10** — "Set S to start of sound chip."
  - Operation: `S = 54272` sets the base address of the SID chip. Subsequent POKE/PEEK use S+offset to address SID registers.

- **Line 20** — "Clear all sound chip registers."
  - Operation: Zero the SID register block to a known state:
    This mutes voices, clears waveform/control flags, resets envelopes, and clears filter/volume state.

- **Line 30** — "Set high and low frequencies for voice 1."
  - Operation: Write the low and high frequency bytes for Voice 1:
    These two bytes form the 16-bit oscillator frequency for voice 1.

- **Line 40** — "Set Attack/Decay for voice 1 (A=0, D=8)."
  - Operation: Write the combined Attack/Decay byte for Voice 1:
    The combined byte has the attack nibble high and decay nibble low.

- **Line 50** — "Set high cutoff frequency for filter."
  - Operation: Write the filter cutoff high byte:
    This sets the high 8 bits of the 12-bit cutoff frequency used by the SID multimode filter.

- **Line 60** — "Turn on filter for voice 1."
  - Operation: Set the filter-enable bits so Voice 1 is routed through the SID filter:

- **Line 70** — "Set volume 15, high-pass filter."
  - Operation: Write master volume and filter mode bits to the SID volume/mode register:
    Setting volume to 15 yields maximum master output; enabling the high-pass mode bit emphasizes the "clap" timbre.

- **Line 80** — "Count 15 claps."
  - Operation: Program loop counter for repeated clap events:

- **Line 90** — "Set start noise waveform control."
  - Operation: Write the voice 1 control/waveform register to select the noise waveform and assert the gate bit:
    Noise waveform bits + gate cause the noise oscillator envelope to start.

- **Line 100** — "Wait, then set stop noise waveform control."
  - Operation: Delay (short wait) then clear the gate bit in the voice 1 control register:
    This releases the envelope (stops the noise excitation).

- **Line 110** — "Wait, then start next clap."
  - Operation: Additional delay to space claps, then loop back:

- **Line 120** — "Turn off volume."
  - Operation: Final write to master volume register to silence output:

**[Note: The source states "A=0" as a fast attack. Verify numeric-to-rate mapping against the SID datasheet if exact timing is critical.]**

## Source Code

    ```basic
    FOR I = 0 TO 24
      POKE S + I, 0
    NEXT I
    ```

    ```basic
    POKE S + 0, 0   : REM Frequency Low Byte
    POKE S + 1, 0   : REM Frequency High Byte
    ```

    ```basic
    POKE S + 5, 8   : REM %0000 1000 = $08
    ```

    ```basic
    POKE S + 22, 255   : REM High byte of cutoff frequency
    ```

    ```basic
    POKE S + 23, 1   : REM Enable filter for Voice 1
    ```

    ```basic
    POKE S + 24, 79   : REM %0100 1111 = $4F
    ```

    ```basic
    FOR J = 1 TO 15
    ```

    ```basic
    POKE S + 4, 129   : REM %1000 0001 = $81
    ```

    ```basic
    FOR T = 1 TO 50 : NEXT T
    POKE S + 4, 128   : REM %1000 0000 = $80
    ```

    ```basic
    FOR T = 1 TO 100 : NEXT T
    NEXT J
    ```

    ```basic
    POKE S + 24, 0
    ```


```basic
10 S = 54272
20 FOR I = 0 TO 24 : POKE S + I, 0 : NEXT I
30 POKE S + 0, 0 : POKE S + 1, 0
40 POKE S + 5, 8
50 POKE S + 22, 255
60 POKE S + 23, 1
70 POKE S + 24, 79
80 FOR J = 1 TO 15
90 POKE S + 4, 129
100 FOR T = 1 TO 50 : NEXT T
110 POKE S + 4, 128
120 FOR T = 1 TO 100 : NEXT T
130 NEXT J
140 POKE S + 24, 0
```

## Key Registers

- $D400-$D406 - SID (Voice 1) - Frequency low/high, pulse width low/high, control/waveform, Attack/Decay, Sustain/Release
- $D415-$D418 - SID (Filter & Master) - Filter cutoff (low/high), resonance/mode/enable bits, master volume and filter-mode bits

## References

- Commodore 64 Programmer's Reference Guide: Programming Sound and Music on Your Commodore 64 - Filtering
- Commodore 64 Programmer's Reference Guide: Programming Sound and Music on Your Commodore 64 - Advanced Techniques