# THE SOUND EDITOR

**Summary:** The Sound Editor utility assists in selecting values for the SID chip's registers ($D400). It references a sound-editing program provided in Appendix C (Listings C-10 and C-11) to facilitate the configuration of SID voice and effect registers.

**Overview**

The Sound Editor program, detailed in Appendix C, aids users in configuring the SID chip's registers by providing an interactive interface. This utility displays all SID registers on the screen, allowing users to modify values directly. The program is designed to help users experiment with different sound parameters and immediately hear the results.

**Usage**

To use the Sound Editor:

1. Load the program by typing:


2. Run the program with:


The program displays all SID registers on the screen, using the naming conventions discussed in Chapter 3. A cursor can be moved around the screen, allowing you to change the values that will be loaded into any of the SID registers. All numbers are entered in hexadecimal notation, facilitating easy data entry into your assembler. After updating the desired fields, you can instruct the Sound Editor to transfer the data to the SID chip. If a channel is enabled, this should produce a sound.

**Controls**

The controls for the Sound Editor are as follows:

- **CURSOR DOWN**: Moves the cursor down one field.
- **CURSOR UP**: Moves the cursor up one field.
- **CURSOR RIGHT**: Moves the cursor one field to the right.
- **CURSOR LEFT**: Moves the cursor one field to the left.
- **0-9**: Allowable numbers for the data fields.
- **A-F**: Allowable letters for the data fields.
- **F1**: Transfers the data from the screen to the SID chip and the software timer.

## Source Code

   ```basic
   LOAD "SOUND EDIT",8,1
   ```

   ```basic
   SYS 4096
   ```


## Key Registers

The Sound Editor utilizes the following SID registers:

- **V1ATDC**: The high nibble controls the attack time for this channel; the low nibble controls the decay time.

For a more detailed description of each register, refer to the section on the SID chip.

## References

- "sid_sound_effects_and_tremolo" — expands on sound context and tune routines the Sound Editor can help configure.
- "figure_pages_41_44_ignored" — nearby figure pages/diagrams in the source document (ignored in this chunk).

## Labels
- V1ATDC
