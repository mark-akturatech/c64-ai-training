# KERNAL $FFCF — Input character from channel

**Summary:** KERNAL vector $FFCF returns one byte from the currently opened input channel (set by CHKIN $FFC6). If the input channel is the keyboard, the routine enables the cursor, fills the BASIC input buffer (up to 80 chars) until a carriage return, and then subsequent calls return buffered characters one at a time (returned in A).

## Description
This KERNAL entry ($FFCF) reads a single byte from the input channel previously selected by CHKIN ($FFC6). Behavior details:

- If CHKIN ($FFC6) has selected a non-keyboard device, $FFCF simply reads one byte from that device and returns it in the accumulator (A). The input channel remains open after the call.
- If no other input channel has been selected (i.e., keyboard is the input), keyboard input is handled specially:
  - The cursor is turned on and blinks while the user types a logical input line.
  - Characters typed are stored into the BASIC input buffer (logical line), up to 80 characters.
  - The routine does not return characters immediately as typed; rather, after the user types a carriage return, the entire logical line (including the carriage return) is available to be returned one byte per call to $FFCF.
  - Successive calls to $FFCF return the buffered characters one at a time. When the carriage return is returned, the buffered line has been completely processed. The next call to $FFCF will start the process again (cursor on, new line).
- Return: data byte in accumulator (A).
- Channel state: remains open after the call.

Related KERNAL routines provide alternative or lower-level input behavior (see References).

## Key Registers
- $FFCF - KERNAL - GET INCHR: input character from current input channel (returns byte in A)
- $FFC6 - KERNAL - CHKIN: set input channel used by $FFCF

## References
- "ffe4_get_character_from_input_device" — expands on alternative input routine that depends on IRQ
- "ff9f_scan_the_keyboard" — expands on keyboard scanning used by IRQ filling the buffer

## Labels
- CHRIN
- CHKIN
