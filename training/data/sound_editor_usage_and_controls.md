# Sound Editor — usage and controls

**Summary:** Describes the Sound Editor program that displays and edits all SID registers on-screen (SID $D400 range), accepts hexadecimal input suitable for assemblers, and can transfer edited register data to the SID (producing sound if a channel is enabled). Lists the loader/run commands (LOAD "SOUND EDIT",8,1; SYS 4096) and the complete Table 8-1 (cursor movement, hex keys, and additional controls).

**Sound Editor overview**

The Sound Editor displays all SID chip registers on the screen using the Chapter 3 naming conventions. A cursor is used to navigate between fields; each register field is edited by typing hexadecimal digits, allowing the data to be copied directly into an assembler source listing. After editing, the program can transfer the edited values to the SID chip—if a voice/channel is enabled, this will produce audible output.

To run the Sound Editor from disk:

- `LOAD "SOUND EDIT",8,1`
- `SYS 4096`

The document identifies the source and listing files for the program:

- C-10 — source code
- C-11 — assembled listing

Controls are detailed in Table 8-1.

## Source Code

```basic
LOAD "SOUND EDIT",8,1
SYS 4096
```

```text
Table 8-1. The Controls for the Sound Editor Program.

CURSOR DOWN    Moves the cursor down one field
CURSOR UP      Moves the cursor up one field
CURSOR RIGHT   Moves the cursor one field to the right
CURSOR LEFT    Moves the cursor one field to the left

0-9            Allowable numbers for the data fields
A-F            Allowable letters for the data fields

F1             Transfers the data from the screen to the SID chip and the software timer
```

## Key Registers

- $D400-$D406 - SID - Voice 1 registers (frequency, pulse, control, ADSR, etc.)
- $D407-$D40D - SID - Voice 2 registers
- $D40E-$D414 - SID - Voice 3 registers
- $D415-$D418 - SID - Filter and global registers

## References

- "sid_sound_effects_and_tremolo" — expands on implementing and testing sound effects and tremolo using the Sound Editor
- "sound_editor_intro" — continues the introduction and points to Appendix C listings
- "figure_pages_41_44_ignored" — figures that appear nearby in the original source document