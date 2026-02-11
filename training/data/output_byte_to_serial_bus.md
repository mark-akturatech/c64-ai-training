# Transmit byte with deferred-character handling ($EDDD-$EDEE)

**Summary:** C64 ROM routine at $EDDD-$EDEE implements IEC serial-bus transmit with deferred-character handling, testing and rotating zero-page flag $0094, saving the deferred transmit byte to $0095, and calling the Tx routine at $ED40.

## Description
This routine decides whether to send the current byte immediately or save it as a deferred transmit byte for later. Behavior summary:

- BIT $0094 tests bit 7 of the zero-page flag byte; if bit 7 is set (negative flag set), a deferred character is pending and the code sends the current byte immediately.
- If no deferred-character bit is set, SEC then ROR $0094 shifts the flag byte right with carry=1 injected, altering the deferred-bit pattern.
- BNE after the ROR branches to the save path if the shifted flag byte is non-zero (i.e., after shifting some flags remain), causing the current byte to be stored as the deferred Tx byte and returning.
- If the shifted flag byte becomes zero, the routine pushes the current byte (PHA), JSR $ED40 to transmit via the IEC serial Tx routine, then pulls the byte (PLA) and stores it into $0095 (deferred Tx byte).
- CLC indicates "flag ok" before returning via RTS.

Notes on stack usage and Tx call:
- PHA/PLA are used to preserve the caller's A value across the JSR to $ED40; $ED40 performs the actual byte transmit on the IEC serial bus.
- $0094 acts as a small shift/flag register controlling deferred-transmit behavior; $0095 holds the deferred transmit byte.

## Source Code
```asm
.,EDDD 24 94    BIT $94         ; test the deferred character flag
.,EDDF 30 05    BMI $EDE6       ; if there is a deferred character go send it
.,EDE1 38       SEC             ; set carry
.,EDE2 66 94    ROR $94         ; shift into the deferred character flag
.,EDE4 D0 05    BNE $EDEB       ; save the byte and exit, branch always
.,EDE6 48       PHA             ; save the byte
.,EDE7 20 40 ED JSR $ED40       ; Tx byte on serial bus
.,EDEA 68       PLA             ; restore the byte
.,EDEB 85 95    STA $95         ; save the deferred Tx byte
.,EDED 18       CLC             ; flag ok
.,EDEE 60       RTS
```

## Key Registers
- $0094 - Zero Page - deferred-character flag / shift register used by IEC transmit logic
- $0095 - Zero Page - deferred Tx byte (saved transmit byte)

## References
- "send_secondary_address_after_listen_and_talk_set_atn" — expands on stores of deferred Tx byte used by LISTEN/TALK secondary sends
- "wait_for_serial_bus_end_after_send" — expands on possible follow-up waiting for bus end after a send

## Labels
- $0094
- $0095
