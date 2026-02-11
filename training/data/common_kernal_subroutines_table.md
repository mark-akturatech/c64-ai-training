# KERNAL: CHROUT ($FFD2), GETIN ($FFE4), STOP ($FFE1)

**Summary:** Three KERNAL entry points: $FFD2 CHROUT (output an ASCII character), $FFE4 GETIN (read an ASCII character), and $FFE1 STOP (check RUN/STOP key). These routines provide basic console I/O and program interruption handling for the C64.

## KERNAL subroutines
The three KERNAL subroutines referenced here are:

- $FFD2 — CHROUT: Outputs a single ASCII character (used to print text to the screen).
- $FFE4 — GETIN: Reads a single ASCII character (keyboard input).
- $FFE1 — STOP: Checks the RUN/STOP key state (used to allow programs to honor user interrupts).

Together CHROUT and GETIN provide simple character-based I/O; STOP is used to detect and respond to the RUN/STOP key to guard against certain classes of programming errors. CHROUT will be used in following examples to print information to the screen.

## Key Registers
- $FFD2 - KERNAL - CHROUT (output an ASCII character)
- $FFE4 - KERNAL - GETIN (input an ASCII character)
- $FFE1 - KERNAL - STOP (checks RUN/STOP key)

## References
- "prewritten_kernal_subroutines" — expands on context for KERNAL routines
- "chrout_output_subroutine" — expands on detailed CHROUT behavior

## Labels
- CHROUT
- GETIN
- STOP
