# Example Programs 7 & 8 — SID Siren (Modulated) and Hand-Clap (Filtered Noise)

**Summary:** BASIC POKE examples controlling the SID chip ($D400–$D418) to produce a siren (voice 3 triangle waveform modulating voice 1 frequency via PEEK(S+27), with gating and timing loop) and a hand-clap imitation (noise waveform, filtered noise, ADSR envelope, repeated gated bursts). Utilizes S = 54272 (SID base), POKE/PEEK on SID register offsets, waveform/select bits, ADSR bytes, and filter cutoff/resonance.

**Siren (Example Program 7)**

This example sets up SID voice 3 as a triangle oscillator and uses its output (read via PEEK at S+27) to modulate the frequency of voice 1, producing a siren-like effect. The program also demonstrates an explicit timing loop and gating control.

**Full BASIC Source Listing:**


**Explanation:**

- **Line 10:** Sets S to the base address of the SID chip ($D400 or 54272).
- **Line 20:** Clears the first 25 SID registers by setting them to 0.
- **Line 30:** Sets the frequency of voice 3 to a low value (low byte = 0, high byte = 128).
- **Line 40:** Configures voice 3 to use a triangle waveform (POKE S+18,17; bit 4 set).
- **Line 50:** Sets the pulse width of voice 1 to its maximum value (low byte = 255, high byte = 15).
- **Line 60:** Sets the master volume to 15 (maximum).
- **Line 70:** Sets the ADSR envelope for voice 1 with a sustain level of 15 (maximum) and a release rate of 0 (immediate).
- **Line 80:** Starts voice 1 with a sawtooth waveform and the gate bit set (POKE S+4,33; bits 0 and 5 set).
- **Line 90:** Initializes the frequency of voice 1 to 0.
- **Line 100:** Begins a loop that runs 1000 times to create the modulation effect.
- **Line 110:** Reads the output of voice 3's oscillator via PEEK(S+27) (register $D41B).
- **Line 120:** Sets the frequency of voice 1 to the value read from voice 3's output.
- **Line 130:** Ends the loop.
- **Line 140:** Turns off the master volume, silencing the output.

**Notes:**

- **PEEK(S+27):** Reads the output of voice 3's oscillator (register $D41B), which provides the current waveform value of voice 3. This value is used to modulate the frequency of voice 1, creating the siren effect.
- **Timing Loop:** The loop from lines 100 to 130 controls the duration of the modulation effect. The number of iterations (1000) determines how long the siren sound plays.
- **ADSR Values:** The ADSR envelope for voice 1 is set with a sustain level of 15 (maximum) and a release rate of 0 (immediate), ensuring the note sustains at full volume and stops immediately when released.

**Hand-Clap Imitation (Example Program 8)**

This BASIC program uses the SID noise waveform, a short ADSR envelope, and the SID filter (cutoff/resonance) to produce a percussive clap. It repeatedly gates noise bursts (enable/disable noise waveform and envelope shaping) to simulate hand-clap bursts.

**Full BASIC Source Listing:**


**Explanation:**

- **Line 10:** Sets S to the base address of the SID chip ($D400 or 54272).
- **Line 20:** Clears the first 25 SID registers by setting them to 0.
- **Line 30:** Sets the frequency of voice 1 to a specific value (low byte = 240, high byte = 33).
- **Line 40:** Sets the attack and decay rates for voice 1 (attack = 0, decay = 8).
- **Line 50:** Sets the filter cutoff frequency low byte to 104.
- **Line 60:** Sets the filter cutoff frequency high byte to 1.
- **Line 70:** Sets the master volume to 15 and enables the low-pass filter.
- **Line 80:** Begins a loop to create multiple noise bursts.
- **Line 90:** Starts voice 1 with the noise waveform and the gate bit set (POKE S+4,129; bits 0 and 7 set).
- **Line 100:** Delays for a short duration, then turns off the gate bit (POKE S+4,128).
- **Line 110:** Short pause before the next burst.
- **Line 120:** Turns off the master volume, silencing the output.

**Notes:**

- **Noise Waveform:** The noise waveform is selected by setting bit 7 of the control register (POKE S+4,129).
- **Filter Settings:** The filter cutoff frequency is set using registers at S+22 and S+23, shaping the noise to resemble a hand clap.
- **Gating Control:** The gate bit is toggled on and off to create short bursts of noise, simulating the transient nature of a hand clap.

## Source Code

```basic
10 S=54272
20 FOR L=0 TO 24:POKE S+L,0:NEXT
30 POKE S+14,0:POKE S+15,128
40 POKE S+18,17
50 POKE S+2,255:POKE S+3,15
60 POKE S+24,15
70 POKE S+6,240
80 POKE S+4,33
90 POKE S+0,0:POKE S+1,0
100 FOR T=1 TO 1000
110 F=PEEK(S+27)
120 POKE S+0,F:POKE S+1,0
130 NEXT T
140 POKE S+24,0
```

```basic
10 S=54272
20 FOR L=0 TO 24:POKE S+L,0:NEXT
30 POKE S+0,240:POKE S+1,33
40 POKE S+5,8
50 POKE S+22,104
60 POKE S+23,1
70 POKE S+24,79
80 FOR N=1 TO 15
90 POKE S+4,129
100 FOR T=1 TO 250:NEXT:POKE S+4,128
110 FOR T=1 TO 30:NEXT:NEXT
120 POKE S+24,0
```


## Key Registers

- **$D400–$D406:** SID Voice 1 (Frequency low/high, Pulse Width low/high, Control, Attack/Decay, Sustain/Release).
- **$D407–$D40D:** SID Voice 2 (same layout as voice 1).
- **$D40E–$D414:** SID Voice 3 (same layout as voice 1).
- **$D415–$D418:** SID Filter / Global Registers (Filter Cutoff, Routing, Resonance/Mode, Volume).

## References

- "example6_explanation_and_example7" — expands on the relationship between Examples 6 and 7 (modulation).
- "example8_explanation" — expands on the explanation of the clap program and why filter + noise produce the effect.