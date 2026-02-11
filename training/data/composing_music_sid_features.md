# COMMODORE 64 - COMPOSING SONGS

**Summary:** Describes the C64's built-in SID synthesizer with three programmable voices, nine full music octaves, and four controllable waveforms; references Commodore Music Cartridges and Commodore Music books for composition and sound effects (SID registers at $D400-$D418).

## Overview
The Commodore 64 includes a built-in music synthesizer (SID) supporting:
- Three completely programmable voices (separate tone generators).
- Nine full musical octaves of pitch range.
- Four controllable waveforms for each voice (selectable per-voice waveform types).
Commodore published companion Music Cartridges and Music books aimed at helping users create or reproduce music and sound effects. For advanced sound routines, consult machine code programming resources; for game/animation sound integration, see animation sprites references.

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency, pulse width, waveform/control, envelope)
- $D407-$D40D - SID - Voice 2 registers (frequency, pulse width, waveform/control, envelope)
- $D40E-$D414 - SID - Voice 3 registers (frequency, pulse width, waveform/control, envelope)
- $D415-$D418 - SID - Filter and global control registers

## References
- "machine_code_programming_resources" — expands on using machine code to drive advanced sound routines  
- "animation_sprites" — expands on sound effects used with animations and games
