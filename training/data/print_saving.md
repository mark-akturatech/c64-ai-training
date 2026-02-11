# PRINT 'SAVING' (KERNAL)

**Summary:** Checks MSGFLG ($9D) for direct-mode and, if set, prints the KERNAL I/O message at offset $51 ('SAVING') via JSR $F12F, then transfers to the print-filename routine at $F5C1. Addresses: $F68F-$F698, MSGFLG $9D, I/O message offset $51.

**Description**
This KERNAL fragment is executed when a save operation announces itself. Behavior:

- LDA $9D reads MSGFLG (kernel message/IO flag).
- BPL $F68E branches out if accumulator is positive (bit 7 clear) — i.e., not in direct mode. (MSGFLG negative implies direct mode.)
- LDY #$51 loads the message-table offset $51, pointing to the 'SAVING' string in the KERNAL I/O message table.
- JSR $F12F calls the KERNAL routine that outputs the message referenced by the Y offset.
- JMP $F5C1 transfers to the filename-printing routine to output the filename being saved.

The sequence ensures the 'SAVING' message is only printed in direct (message-enabled) mode, then the filename is printed using the standard print-filename routine.

## Source Code
```asm
.,F68F A5 9D    LDA $9D         ; MSGFLG
.,F691 10 FB    BPL $F68E       ; not in direct mode, exit
.,F693 A0 51    LDY #$51        ; offset to message in table
.,F695 20 2F F1 JSR $F12F       ; output 'SAVING'
.,F698 4C C1 F5 JMP $F5C1       ; output filename
```

## Key Registers
- **MSGFLG ($9D):** Controls the display of KERNAL messages. Bit 7 set (negative) enables messages; bit 7 clear (positive) disables them.

## References
- "save_to_serial_bus" — expands on message printed before saving to serial device
- "print_filename" — expands on routine used to print the filename after 'SAVING'

## Labels
- MSGFLG
