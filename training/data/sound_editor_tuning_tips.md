# Sound Editor: Experiment with SID Registers and Play Time

**Summary:** Guidance on utilizing a C64 sound editor to manipulate SID voice registers ($D400–$D418), adjust playback duration via timer settings, and separate sound design from main program integration. Search terms: SID, $D400, play time, timer, sound editor, register experimentation.

**Practical Advice**

- **Rapid Iteration:** Modify SID register values in the editor—such as attack, decay, sustain, release (ADSR), waveform, pulse width, and frequency—and listen immediately. This approach accelerates understanding of how each parameter influences timbre and envelope.

- **Utilize Shorter Play-Time Settings:** While refining sounds, use shorter play-time or timer settings to expedite playback, allowing quicker cycling through variations. Playback duration is controlled by timer/play-time values—see software_timer_registers_sndtm.

- **Separate Sound Design from Game Integration:** Finalize register values within the editor, then export them into the main program. This method avoids the need to run the full game loop during sound tuning.

- **Focus Edits per Voice:** Adjust per-voice registers—frequency, control, pulse width, and envelope—to observe direct changes. Apply global/filter registers afterward to shape the combined output.

- **Systematic Iteration:** Alter one parameter at a time, listen, then revert or note values. The editor’s immediate feedback serves as a primary learning tool.

## Source Code

Below is an example of a BASIC program that demonstrates sound manipulation using the SID chip:

```basic
10 SID = 54272
20 FOR I = 0 TO 28 : POKE SID + I, 0 : NEXT
30 POKE SID + 24, 15
40 POKE SID + 1, 20
50 POKE SID + 5, 0 * 16 + 0
60 POKE SID + 6, 15 * 16 + 9
70 POKE SID + 4, 1 + 16
80 POKE SID + 4, 16
```

This program sets up the SID chip to produce a sound with specific ADSR envelope settings and waveform selection. ([c64programming.wordpress.com](https://c64programming.wordpress.com/2013/11/13/making-friends-with-commodore-64s-sid/?utm_source=openai))

## Key Registers

- **$D400–$D414**: SID Voice Registers
  - **Voice 1**: $D400–$D406
  - **Voice 2**: $D407–$D40D
  - **Voice 3**: $D40E–$D414

- **$D415–$D418**: SID Filter and Global Registers

## References

- "editor_ui_labels_and_intro_to_sid_registers"—details on editor UI and register editing functions.
- "sid_voice_registers_descriptions"—information on per-voice registers for experimentation.
- "software_timer_registers_sndtm"—explains how timer values control sound playback duration and release sequencing.