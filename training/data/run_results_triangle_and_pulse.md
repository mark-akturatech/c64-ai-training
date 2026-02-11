# Sawtooth → Triangle and Variable Pulse Wave — Observations and ASCII Diagrams

**Summary:** This section provides an example program that demonstrates the conversion of a sawtooth waveform into a triangular waveform and illustrates the effect of varying the pulse width of a pulse waveform on the Commodore 64's SID chip.

**Observations**

The sound quality changes notably when converting a sawtooth waveform into a triangular waveform, resulting in a less twangy and more hollow sound. This is due to the reduced high-frequency harmonic content in the triangular waveform compared to the sawtooth.

The variable pulse (rectangular) waveform's audible character depends on the pulse width. Adjusting the pulse width alters the harmonic spectrum, changing the perceived timbre.

**Example Program**

The following BASIC program demonstrates the generation of triangular and pulse waveforms on the Commodore 64's SID chip.


**Explanation:**

- **Lines 10-20:** Initialize the SID chip by setting the base address (`S=54272`), maximum volume, and ADSR envelope parameters.
- **Lines 30-80:** Generate a triangular waveform by setting the control register to 17 (triangle waveform with gate on) and varying the frequency.
- **Lines 90-160:** Generate a pulse waveform by setting the control register to 65 (pulse waveform with gate on), setting the pulse width to 2048 (50% duty cycle), and varying the frequency.

**Pulse Width Control**

The pulse width of the pulse waveform is controlled by two registers:

- **Pulse Width Low Byte:** Address `S+2` (54274)
- **Pulse Width High Byte:** Address `S+3` (54275)

The pulse width value is a 12-bit number formed by combining these two registers:

`Pulse Width = (High Byte AND 15) * 256 + Low Byte`

The pulse width can range from 0 to 4095, corresponding to a duty cycle from 0% to 100%. A value of 2048 sets a 50% duty cycle, producing a square wave.

**Running the Program**

To run the program:

1. Enter the program into the Commodore 64's BASIC editor.
2. Type `RUN` and press Enter.
3. The program will play a series of notes using the triangular waveform, followed by the pulse waveform with a 50% duty cycle.

This demonstration allows you to hear the differences between the waveforms and understand the effect of pulse width on the sound.

## Source Code

```basic
10 S=54272
20 POKE S+24,15 : REM Set maximum volume
30 POKE S+5,0 : POKE S+6,0 : REM Set ADSR to immediate attack and release
40 POKE S+4,17 : REM Select triangle waveform and gate on
50 FOR FREQ=100 TO 1000 STEP 100
60   POKE S, FREQ AND 255 : POKE S+1, INT(FREQ/256)
70   FOR T=1 TO 1000 : NEXT T
80 NEXT FREQ
90 POKE S+4,16 : REM Gate off
100 POKE S+4,65 : REM Select pulse waveform and gate on
110 POKE S+2,0 : POKE S+3,8 : REM Set pulse width to 2048 (50% duty cycle)
120 FOR FREQ=100 TO 1000 STEP 100
130   POKE S, FREQ AND 255 : POKE S+1, INT(FREQ/256)
140   FOR T=1 TO 1000 : NEXT T
150 NEXT FREQ
160 POKE S+4,64 : REM Gate off
170 END
```


```text
              +               +          +----+  +----+  +----+  |
             / \             / \         |    |  |    |  |    |  |
            /   \           /   \        |    |  |    |  |    |  |
           /     \         /     \       |    |  |    |  |    |  |
         ./.......\......./.......\.    .|....|..|....|..|....|..|.
                   \     /               |    |  |    |  |    |  |
                    \   /                |    |  |    |  |    |  |
                     \ /                 |    |  |    |  |    |  |
                      +                  |    +--+    +--+    +--+
                                                  <-->
                                              PULSE WIDTH
```

## References

- "Commodore 64 Programmer's Reference Guide"
- "Peeks & Pokes for the Commodore 64" by Abacus Software
- "Commodore 64 SID music programming with BASIC - playing a note"