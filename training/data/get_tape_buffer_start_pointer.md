# get_tape_buffer_start_pointer (ROM $F7D0)

**Summary:** 6502 ROM helper at $F7D0 that loads the tape buffer start pointer from zero page ($B2/$B3) into X (low) and Y (high), and compares the high byte with #$02 (check for $02xx RAM area). Returns with X/Y containing the pointer; CPY sets flags.

## Description
This small KERNAL helper routine performs the following:
- Loads the low byte of the tape buffer start pointer from zero page address $B2 into X.
- Loads the high byte from zero page address $B3 into Y.
- Compares Y with #$02 using CPY (the comparison updates processor flags: Z, C, N).
- Returns with RTS.

Calling convention / effects:
- Input: pointer stored at zero page $B2 (low), $B3 (high).
- Output: X = low byte, Y = high byte of the pointer.
- Flags: CPY #$02 modifies N/Z/C — callers can use these to test whether the pointer's high byte equals $02 (typical RAM page). No other registers or memory are altered by this routine.
- Stack: untouched.
- Location: ROM $F7D0.

Typical use: callers read X/Y after RTS to set I/O pointers or bounds; the CPY result is used to verify the pointer is in the expected $02xx RAM area.

## Source Code
```asm
.,F7D0 A6 B2    LDX $B2         get tape buffer start pointer low byte
.,F7D2 A4 B3    LDY $B3         get tape buffer start pointer high byte
.,F7D4 C0 02    CPY #$02        compare high byte with $02xx
.,F7D6 60       RTS
```

## References
- "set_tape_buffer_start_and_end_pointers" — caller that uses X/Y to set I/O and end pointers
- "create_tape_header_and_initiate_write" — higher-level routine that invokes the set-pointer routine which itself calls this helper
