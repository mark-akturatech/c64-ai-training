# KERNAL CHKOUT ($FFC9)

**Summary:** Define a previously OPENed logical file as an output channel using CHKOUT at $FFC9 (65481). Call with X = logical file number (JSR $FFC9); requires prior OPEN, affects A and X, needs 4+ stack space, and reports errors via READST (0, 3, 5, 7). On the serial bus CHKOUT auto-sends the LISTEN and any secondary address specified by OPEN.

## Description
Purpose: open a channel for output to a logical file previously created with OPEN. Call address: $FFC9 (hex) / 65481 (decimal). Communication register: X (contains logical file number chosen in OPEN). Preparatory routine: OPEN must be used first to establish the logical file number, device LISTEN address, and optional secondary address.

Behavior:
- If the logical file was not created by OPEN, or if the device is not an output device, CHKOUT will abort with an error (see Errors).
- When opening a serial-bus device, CHKOUT will automatically send the device LISTEN address (from OPEN) and a secondary address if one was specified.
- Not required to set up output when using the built-in screen and no other output channels are defined — the screen is the default output device.

Stack / registers:
- Stack requirements: 4+ bytes free on the stack.
- Registers affected: A and X (modified).
- Communication: X = logical file number on entry.

## How to Use
1. Use KERNAL OPEN to create a logical file and specify device LISTEN address (and secondary address if needed).
2. Load X with the logical file number used in OPEN.
3. Call CHKOUT via JSR $FFC9 (JSR CHKOUT).

Caution: If you intend to send data to the screen and no other output channels are defined, CHKOUT and OPEN are not required.

## Errors
Errors are reported via the KERNAL status mechanism (see READST). Possible codes relevant to CHKOUT:
- 0 — No error
- 3 — File not open
- 5 — Device not present
- 7 — Not an output file

## Source Code
```asm
; Example: define logical file 3 as an output channel
LDX #$03      ; X = logical file number 3
JSR $FFC9     ; JSR CHKOUT (define file 3 as output)
```

## References
- "chkin_open_input_channel" — covers opening input (CHKIN) vs output (CHKOUT) channels
- "ciout_transmit_byte_over_serial_bus" — covers transmitting bytes after a LISTEN (OPEN+CHKOUT) has been sent