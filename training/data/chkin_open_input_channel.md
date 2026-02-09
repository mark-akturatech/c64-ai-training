# CHKIN (KERNAL)

**Summary:** CHKIN opens an already-OPENed logical file as an input channel (KERNAL entry $FFC6 / 65478). Call via JSR with the logical file number in X; affects A and X; for serial devices it automatically sends TALK and any secondary address supplied by OPEN. Errors: #3, #5, #6.

## Description
Purpose: Define a previously OPENed logical file as an input channel so input routines (CHRIN, GETIN) read from it. Call address is $FFC6 (hex) / 65478 (decimal). Communication register: X (logical file number).

Behavior and requirements:
- The logical file must already be OPENed (unless only using the keyboard — see note).
- The device on the channel must be capable of input; otherwise the routine returns an error and aborts.
- If reading from anything other than the keyboard, CHKIN must be called before using CHRIN or GETIN.
- If only keyboard input is used and no other channels are open, neither OPEN nor CHKIN need to be called.
- For serial-bus devices, CHKIN automatically transmits the device's TALK address (and the secondary address if supplied in OPEN) onto the bus so the device begins talking.

Registers / stack:
- Call: JSR $FFC6
- Communication register: X = logical file number
- Registers affected: A, X
- Stack requirements: None

How to use (sequence):
0) OPEN the logical file if necessary (not required for keyboard-only input).
1) Load X with the logical file number to be used.
2) JSR CHKIN (JSR $FFC6).

Possible error returns:
- #3: File not open
- #5: Device not present
- #6: File not an input file

Example usage is shown below.

## Source Code
```asm
; Example: prepare for input from logical file 2
    LDX #2
    JSR $FFC6        ; JSR CHKIN
```

## Key Registers
- $FFC6 - KERNAL - CHKIN call entry (open logical file as input; expects X=logical file number)

## References
- "acptr_get_byte_from_serial_bus_full_handshake" — expands on reading from a device commanded to TALK (ACPTR/CHRIN interaction)
- "chkin_chkin_to_chkin_relationship_chkout" — expands on paired I/O concept: CHKIN (input) vs CHKOUT (output)