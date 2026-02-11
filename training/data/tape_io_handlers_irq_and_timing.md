# Kernal Tape I/O & Character I/O Routines (GETIN/CHRIN, CHROUT, CHKIN, CHKOUT, CLOSE)

**Summary:** Describes Commodore 64 Kernal character I/O and cassette/Tape I/O implementation details: ROM entry points ($FFCF,$FFD2,$FFC6,$FFC9,$FFC3), RAM jump vectors ($0324,$0326,$031E,$0320,$031C), device-number location ($0099), CIA#1 timer usage for tape bit timing ($DC00-$DC0F), and 6510 port bit usage ($0001).

## GETIN / CHRIN (character input) behavior
- Kernal GETIN (CHRIN) entry via jump-table at $FFCF. The routine jumps through the RAM vector at $0324.
- Device number used to select current device is stored at $0099.
- If the current input device is keyboard (default), behavior:
  - Blink cursor and fetch characters from the keyboard buffer.
  - Echo characters to screen until a carriage return (CR) is encountered.
  - When CR is received:
    - Set a flag indicating the length of the last logical line prior to CR.
    - Read the first character of that logical line from the screen and return it in A.
  - Subsequent calls return the next character in the logical line (read from screen) until CR is returned to indicate end-of-line.
  - Only the last logical line before CR is used; typing more than 80 characters starts a new logical line and older characters are ignored. The routine processes only the most recent 80-character group.

## CHROUT (character output) behavior
- Kernal CHROUT entry via jump-table at $FFD2. The routine jumps through the RAM vector at $0326.
- Sends the character in A to the current output device. If no device has been selected with CHKOUT, the screen is the default output.
- Special-case: if the cassette is the current output device, writing a byte appends it to the cassette buffer only; physical transmission to tape does not occur until the 192-byte cassette output buffer is full (or when file is CLOSED — see CLOSE).

## Channel selection: CHKIN and CHKOUT
- CHKIN entry via jump-table at $FFC6; routine jumps through RAM vector at $031E.
  - Use: designate a logical file (X register holds file number) as the current input channel.
  - Sets current file, device, and secondary address for input.
  - For serial bus devices, sends TALK (and secondary when needed) on the bus.
- CHKOUT entry via jump-table at $FFC9; routine jumps through RAM vector at $0320.
  - Use: designate a logical file (X register holds file number) as the current output channel.
  - Sets current file, device, and secondary address for output.
  - For serial bus devices, sends LISTEN (and secondary when needed) on the bus.

## CLOSE behavior
- CLOSE entry via jump-table at $FFC3; routine jumps through RAM vector at $031C.
- Call with A = logical file number to close that file.
- Effects by device type:
  - RS-232: de-allocates receive/transmit buffer space at top of memory.
  - Cassette (when opened for writing): forces the last cassette block to be written immediately, even if it is less than 192 bytes.
  - Serial bus: sends UNLISTEN on the bus.
- File table housekeeping:
  - CLOSE removes the file's entry from the logical-file tables at addresses $0259, $0263, and $026D (decimal 601, 611, 621) and shifts higher entries down one slot.

## Tape I/O / Tape bit timing and CIA involvement (implementation notes from Kernal)
- Tape I/O routines and state machine spans multiple Kernal ROM offsets (examples given in source): $F875, $F8D0, $F8E2, $F92C, $FA60, $FBA6, etc. These ROM routines:
  - Find tape file headers and manage reading/writing of tape blocks.
  - Set/adjust CIA#1 Timer A for tape bit timing.
  - Use CIA#1 Timer B or Timer CNT mode to toggle tape data output line (often combined with 6510 port bit toggles).
  - Install or modify IRQ vectors to handle tape bit receive processing (ROM contains the IRQ-driven Read Tape Data and cassette character receive/store handlers).
- The cassette write-side accumulates bytes into a 192-byte buffer; hardware timers and IRQs manage bit timing and actual toggling of output lines for cassette waveform generation. See referenced CIA timers behavior for exact timing relationships.

## Key Registers
- $0324 - RAM vector - GETIN/CHRIN jump vector
- $0326 - RAM vector - CHROUT jump vector
- $031E - RAM vector - CHKIN jump vector
- $0320 - RAM vector - CHKOUT jump vector
- $031C - RAM vector - CLOSE jump vector
- $0099 - RAM - current device number for input/output selection
- $FFCF - ROM - GETIN/CHRIN table entry point (Kernal)
- $FFD2 - ROM - CHROUT table entry point (Kernal)
- $FFC6 - ROM - CHKIN table entry point (Kernal)
- $FFC9 - ROM - CHKOUT table entry point (Kernal)
- $FFC3 - ROM - CLOSE table entry point (Kernal)
- $DC00-$DC0F - CIA#1 - timers, ports and control registers (Timer A/B used for tape bit timing and output)
- $0001 - 6510 processor port - data/DDR register controlling cassette/port bit toggles used by tape output
- $FFFE-$FFFF - System vectors - IRQ vector location (used when Kernal installs/uses IRQ handler for tape I/O)

## References
- "cia_timers_register_behavior_and_timing" — expands on how CIA timers are used for cassette bit timing and related register behaviors

## Labels
- GETIN
- CHRIN
- CHROUT
- CHKIN
- CHKOUT
- CLOSE
