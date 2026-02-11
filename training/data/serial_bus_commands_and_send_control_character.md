# KERNAL: Serial bus device command helpers (TALK/LISTEN/Control-char) at $ED09-$ED20

**Summary:** KERNAL ROM routines and small helper sequences at $ED09, $ED0C and $ED11 implement serial-bus device TALK/LISTEN command assembly and the "send a control character" sequence, using zero-page flags $0094 (deferred character) and $00A3 (EOI). Related routines called: RS-232 idle check $F0A4 and serial Tx byte routine $ED40.

## Description
This chunk documents three short sequences in the Commodore 64 KERNAL ROM that prepare serial bus command bytes and transmit a control character:

- At $ED09 the code ORs the accumulator with $40 (TALK command bit). A following .BYTE $2C is a literal token used by the ROM sequence (source notes: "makes next line BIT $2009").
- At $ED0C the code ORs the accumulator with $20 (LISTEN command bit) and then JSR $F0A4 to check RS-232 bus idle before proceeding.
- Starting at $ED11 is the "send a control character" sequence:
  - PHA saves the current device address (accumulator) on the stack.
  - BIT $94 tests the deferred-character flag in zero page $0094.
  - If the deferred flag is clear (BPL), the routine skips the deferred handling and restores the device address (PLA).
  - If deferred is set, SEC and ROR $A3 propagate/set the EOI flag from/into the EOI flag byte at zero page $00A3 (ROR rotates a bit into the carry/EOI).
  - JSR $ED40 calls the serial Tx byte routine to transmit the control character on the serial bus.
  - LSR $94 clears the deferred-character flag.
  - LSR $A3 clears the EOI bit in the EOI flag byte.
  - PLA restores the saved device address from the stack.

No additional algorithmic detail is added here — the listing and zero-page flags ($0094,$00A3) are the authoritative behavior; other related sequences (deferring commands, the full Tx routine) are in separate chunks.

## Source Code
```asm
                                *** command serial bus device to TALK
.,ED09 09 40    ORA #$40        OR with the TALK command
.:ED0B 2C       .BYTE $2C       makes next line BIT $2009

                                *** command devices on the serial bus to LISTEN
.,ED0C 09 20    ORA #$20        OR with the LISTEN command
.,ED0E 20 A4 F0 JSR $F0A4       check RS232 bus idle

                                *** send a control character
.,ED11 48       PHA             save device address
.,ED12 24 94    BIT $94         test deferred character flag
.,ED14 10 0A    BPL $ED20       if no defered character continue
.,ED16 38       SEC             else flag EOI
.,ED17 66 A3    ROR $A3         rotate into EOI flag byte
.,ED19 20 40 ED JSR $ED40       Tx byte on serial bus
.,ED1C 46 94    LSR $94         clear deferred character flag
.,ED1E 46 A3    LSR $A3         clear EOI flag
.,ED20 68       PLA             restore the device address
```

## Key Registers
- $ED09 - KERNAL ROM - ORA #$40 (set TALK command bit helper)
- $ED0C - KERNAL ROM - ORA #$20 (set LISTEN command bit helper)
- $ED11 - KERNAL ROM - send control-character sequence (PHA...PLA)
- $ED40 - KERNAL ROM - serial Tx byte routine (JSR target for transmit)
- $F0A4 - KERNAL ROM - RS-232 bus idle check (JSR target)
- $0094 - Zero Page - deferred-character flag (tested with BIT, cleared with LSR)
- $00A3 - Zero Page - EOI flag byte (ROR to set/propagate, LSR to clear)

## References
- "defer_serial_command_sequence" — expands on deferring a command (uses same serial control primitives and flags $0094,$00A3)
- "serial_tx_byte_routine" — expands on the Tx routine called to transmit the control character on the serial bus

## Labels
- $ED09
- $ED0C
- $ED11
- $0094
- $00A3
