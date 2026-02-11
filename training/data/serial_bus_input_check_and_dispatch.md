# Handle input: serial bus check ($90) and dispatch to bit-level handler ($EE13)

**Summary:** Check zero-page serial status byte $0090; if zero (no error) JMP to serial input bit-level handler at $EE13, otherwise return ASCII CR ($0D) with carry cleared (CLC, RTS). Searchable terms: $0090, $EE13, serial bus, LDA, BEQ, CLC, RTS.

## Description
This ROM snippet handles the "input device was serial bus" case in the device dispatch path. Behavior:

- LDA $0090 reads the serial status byte from zero page address $90.
- BEQ branches when the value read is zero (Z flag set), meaning "no errors flagged". If zero, execution jumps to the serial input bit-level handler at $EE13.
- If $90 is nonzero (an error flag present), the routine returns an end-of-line byte (ASCII CR, $0D) in the accumulator, clears the carry flag (CLC) and RTS to return to caller.
- On success (no error), control is transferred directly to $EE13 (bit-level serial input handler).

Notes:
- The routine returns A=$0D and C clear when an error is detected; on success it jumps to the handler and does not return here.
- The code uses zero-page $0090 as the serial status byte (nonzero indicates an error).

## Source Code
```asm
.; input device was serial bus
.,F1AD A5 90    LDA $90         ; get the serial status byte
.,F1AF F0 04    BEQ $F1B5       ; if no errors flagged go input byte and return
.,F1B1 A9 0D    LDA #$0D        ; else return [EOL]
.,F1B3 18       CLC             ; flag no error
.,F1B4 60       RTS
.,F1B5 4C 13 EE JMP $EE13       ; input byte from serial bus and return
.; input device was RS232 device
```

## Key Registers
- $0090 - Zero Page - Serial status byte (zero = no error, nonzero = error)
- $EE13 - ROM - Serial input bit-level handler entry (jump target when $0090 == 0)

## References
- "input_character_from_channel_device_dispatch" — expands on handling 'serial bus' case within device dispatch
- "rs232_input_highlevel_handshake_and_interrupt_control" — handshake and interrupt management for serial lines