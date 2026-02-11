# STOP ($FFE1) — Check RUN/STOP key

**Summary:** Call the KERNAL subroutine at $FFE1 to test the RUN/STOP key; it must be called frequently to make the key effective. On return the Z flag is set if RUN/STOP was pressed; A is modified and X may be modified (only when pressed). On PET/CBM machines the call may exit to BASIC instead of returning.

## Description
The KERNAL STOP routine at $FFE1 samples the RUN/STOP key at the instant it is called. To allow a running machine-language program to be interrupted by the RUN/STOP key, call $FFE1 frequently from your program.

Typical usage pattern:
- Call (JSR) $FFE1 periodically.
- Immediately follow the call with a BEQ to your program exit/cleanup so the program will terminate when RUN/STOP is pressed (BEQ branches when Z=1).

Behavior details:
- The subroutine checks the key only at the moment of the call; continuous responsiveness requires frequent calls.
- If RUN/STOP is being pressed at that instant, the Z flag will be set on return.
- Registers affected: accumulator A is altered by the routine; index register X will be altered only if RUN/STOP was pressed.
- Status: Z signals whether RUN/STOP was being pressed (Z = set if pressed).
- PET/CBM special case: on PET/CBM systems, if RUN/STOP is pressed the system will exit to BASIC and display READY — in that case the routine will not return to the calling machine-code program.

Example (inline):
- `JSR $FFE1`  ; check RUN/STOP
- `BEQ Exit`   ; branch to exit if RUN/STOP was pressed (Z set)

## Key Registers
- $FFE1 - KERNAL - STOP subroutine: check RUN/STOP key; sets Z on return if pressed; modifies A (always) and X (only if pressed)

## References
- "getin_subroutine_keyboard_input" — expands on related input subroutine GETIN  
- "numeric_key_waiting_subroutine_project" — programming project uses STOP to allow aborting

## Labels
- STOP
