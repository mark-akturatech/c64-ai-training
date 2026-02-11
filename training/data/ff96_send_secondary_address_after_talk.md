# C64 KERNAL $FF96 — Send secondary address after TALK

**Summary:** KERNAL vector $FF96 sends a secondary address on the CBM serial bus for a TALK device; call after TALK ($FFB4) with the accumulator containing a value 4..31. Not valid after LISTEN.

## Description
This KERNAL routine transmits a secondary address command on the C64 serial bus for a device that has already been selected with TALK. The accumulator (A) must contain a number in the range 4..31; the routine sends that value as the secondary address. The routine is only intended to be used after a prior call to the TALK routine — it will not work if called after LISTEN.

## Calling convention
- Entry: A = secondary address (decimal 4..31)
- Precondition: A TALK ($FFB4) call has been performed for the target device
- Postcondition: The value in A is transmitted as a secondary-address command over the serial bus
- Restrictions: Calling this routine after LISTEN will not work (per source)

## Key Registers
- $FF96 - KERNAL ROM - Send secondary address after TALK (transmit secondary address on serial bus; A must contain 4..31; requires prior TALK $FFB4)

## References
- "ffb4_command_talk" — expands on the preceding TALK command ($FFB4)
- "ffa5_input_byte_from_serial" — expands on reading data after TALK (input byte from serial)
