# KERNAL: PRINT "LOADING/VERIFYING" (entry $F5D2)

**Summary:** Selects and prints either the "VERIFY" or "LOAD" I/O message based on the VERCK load/verify flag ($0093). Uses LDY with message-table offsets ($49 / $59) and jumps to the KERNAL I/O message print routine at $F12B/$F12F.

## Description
This KERNAL routine decides whether to print the "VERIFY" or "LOAD" message during disk/serial operations:

- LDY #$49 — preset Y to the verify-message offset in the KERNAL I/O messages table.
- LDA $93 — read VERCK (zero-page $93), the load/verify flag.
- BEQ $F5DA — if VERCK == 0, keep the verify offset (branch taken).
- LDY #$59 — if VERCK != 0, replace Y with the load-message offset.
- JMP $F12B — jump to the KERNAL I/O message print routine; the message to print is selected by Y.

Y therefore holds an 8-bit offset into the I/O messages table; the print routine at $F12B/$F12F reads the message indicated by Y and outputs "LOADING" or "VERIFYING" accordingly.

## Source Code
```asm
.,F5D2 A0 49    LDY #$49        ; offset to verify message
.,F5D4 A5 93    LDA $93         ; VERCK, load/verify flag
.,F5D6 F0 02    BEQ $F5DA       ; verify (branch if zero)
.,F5D8 A0 59    LDY #$59        ; offset to load message
.,F5DA 4C 2B F1 JMP $F12B       ; output message flagged by (Y)
```

## Key Registers
- $F5D2 - KERNAL ROM - Entry for selecting "LOADING/VERIFYING"
- $F12B - KERNAL ROM - I/O message print routine (prints message pointed to by Y)
- $0093 - Zero Page - VERCK (load/verify flag used to select message)

## References
- "load_from_serial_bus" — expands on use during load to print either 'LOADING' or 'VERIFYING'

## Labels
- VERCK
