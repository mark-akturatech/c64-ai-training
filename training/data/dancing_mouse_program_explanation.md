# Dancing Mouse — SID and VIC POKEs (lines 5, 10, 15)

**Summary:** Explains BASIC POKE usage that initializes the SID ($D400) voice registers (frequency, ADSR, master volume $D418) and the VIC-II ($D000) sprite enable register ($D015). Shows decimal→hex conversions for S=54272 and V=53248 and decodes the specific POKEs used to set timbre/volume for voices 1 and 2 and to enable a sprite.

## Explanation
This chunk covers the initial hardware setup performed by three BASIC lines in the Dancing Mouse program: the SID sound chip base is set to S=54272 ($D400) and several POKEs set voice 1 and voice 2 parameters (frequency, Attack/Decay, Sustain/Release) and the master volume; the VIC-II base is set to V=53248 ($D000) and a POKE enables a sprite.

Address maths shown here:
- S = 54272 decimal = $D400 hex (SID base)
- V = 53248 decimal = $D000 hex (VIC-II base)
- POKE S+24 -> $D400 + 24 = $D418 (SID master volume / filter control)
- POKE V+21 -> $D000 + 21 = $D015 (VIC-II sprite enable register)

Line-by-line decoding from the program text:

Line 5 (SID / voice 1 + master volume)
- S=54272 — defines SID base as $D400.
- POKE S+24,15 — POKE $D418,15: sets the SID master volume to 15 (high nibble 0..15 used here; 15 is maximum volume used by the program).
- POKE S,220 — POKE $D400,220: writes low-frequency byte for Voice 1 to produce an approximate high C (octave 6) frequency.
- POKE S+1,68 — POKE $D401,68: writes the high-frequency byte for Voice 1 completing the frequency word.
- POKE S+5,15 — POKE $D405,15: sets Attack/Decay (AD) for Voice 1; described as “maximum DECAY level with no attack” in the source, producing an echo-like envelope.
- POKE S+6,215 — POKE $D406,215: sets Sustain/Release (SR) for Voice 1; 215 decimal is the SR byte value used.

Line 10 (SID / voice 2)
- POKE S+7,120 — POKE $D407,120: Voice 2 low-frequency byte.
- POKE S+8,100 — POKE $D408,100: Voice 2 high-frequency byte.
- POKE S+12,15 — POKE $D40C,15: Voice 2 Attack/Decay (same AD value as Voice 1).
- POKE S+13,215 — POKE $D40D,215: Voice 2 Sustain/Release (same SR as Voice 1).

Notes on ADSR bytes:
- The program uses decimal AD/SR bytes directly. The source describes POKE S+5,15 as “maximum DECAY with no attack” and POKE S+6,215 as the combined sustain/release value; the chunk does not break these bytes into SID bitfields.

Line 15 (VIC-II / sprites)
- PRINT "<SHIFT+CLR/HOME>" — clears the screen at start (BASIC print).
- V=53248 — defines VIC-II base as $D000.
- POKE V+21,1 — POKE $D015,1: writes 1 to the sprite-enable register, enabling the first hardware sprite (the program text labels it “sprite number 1”; hardware numbering is often zero-based).

Coordination note
- These POKEs are initial setup: SID voices and master volume are primed before the program plays notes; VIC-II sprite enable is turned on before sprite data and movement routines are used. The full program and DATA blocks (not included here) contain the routines and timing that coordinate sprite animation with sound events.

## Source Code
```basic
5  S=54272
   POKE S+24,15
   POKE S,220
   POKE S+1,68
   POKE S+5,15
   POKE S+6,215

10 POKE S+7,120
   POKE S+8,100
   POKE S+12,15
   POKE S+13,215

15 PRINT "<SHIFT+CLR/HOME>"
   V=53248
   POKE V+21,1
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width, control, Attack/Decay, Sustain/Release)
- $D407-$D40D - SID - Voice 2 registers (same layout as Voice 1)
- $D40E-$D414 - SID - Voice 3 registers
- $D415-$D418 - SID - Filter / master volume region (master volume commonly at $D418)
- $D000-$D02E - VIC-II - control and sprite registers (sprite enable/control area included; sprite enable specifically at $D015)

## References
- "dancing_mouse_program_source" — full program source and DATA blocks (contains routines linking sound and sprite animation)
- "sprite_color_registers_locations_and_usage" — covers sprite color POKEs such as POKE V+39 used elsewhere in the program