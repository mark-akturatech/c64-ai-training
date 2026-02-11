# $FF90 — Control KERNAL messages

**Summary:** KERNAL vector $FF90 controls printing of KERNAL error and control messages; the accumulator passed to the routine uses bits 7 ($80) and 6 ($40) to select error or control messages respectively.

## Description
This KERNAL routine prints predefined KERNAL messages based on the accumulator value when it is called. Bit 7 selects printing of an error message (example: "FILE NOT FOUND") and bit 6 selects printing of a control message (example: "PRESS PLAY ON CASSETTE").

- Bit masks: bit 7 = $80 (128), bit 6 = $40 (64).
- Calling convention: place the selection bits in the accumulator and call the routine (e.g. JSR $FF90). (short parenthetical: JSR is the usual 6502 call instruction)

If bit 7 is set, one of the KERNAL's error messages will be printed. If bit 6 is set, a control message will be printed.

## Key Registers
- $FF90 - KERNAL ROM - Control printing of KERNAL error and control messages (bits 7 = print error, 6 = print control)

## References
- "KERNAL API (Lee Davison)" — description of $FF90 control KERNAL messages