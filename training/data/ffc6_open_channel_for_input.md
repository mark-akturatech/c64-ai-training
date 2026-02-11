# $FFC6 — OPEN CHANNEL FOR INPUT (KERNAL)

**Summary:** $FFC6 is the KERNAL routine "Open channel for input" that marks an already-open logical file as the system input channel (used by CHRIN $FFCF and GETIN $FFE4). For serial devices it automatically sends LISTEN and any secondary address from OPEN $FFC0. Errors: 3, 5, 6.

## Description
Any logical file previously opened with the OPEN routine ($FFC0) can be designated as the active input channel by calling this KERNAL entry. The device on that channel must be input-capable; otherwise the routine returns an error and aborts.

Behavior notes:
- If input comes from a device other than the keyboard, this routine must be called before using CHRIN ($FFCF) or GETIN ($FFE4).
- If input is solely from the keyboard and no other input channels are open, calls to SETLFS/OPEN and this routine are not required.
- For devices on the serial bus, the routine automatically sends the LISTEN command and the secondary address supplied earlier by the OPEN routine ($FFC0).

Possible error return codes (from the source):
- 3 : file not open
- 5 : device not present
- 6 : file is not an input file

## Key Registers
- $FFC6 - KERNAL ROM - Open channel for input (marks an already-open logical file as the input channel)
- $FFC0 - KERNAL ROM - OPEN (open logical file) — related routine referenced
- $FFCF - KERNAL ROM - CHRIN (read character from current input channel) — related consumer routine
- $FFE4 - KERNAL ROM - GETIN (higher-level input routine) — related consumer routine
- $FFBA - KERNAL ROM - SETLFS (set logical file, device, and secondary address) — prepares device/logical file before OPEN

## References
- "ffcf_input_character_from_channel" — expands on reading characters from the input channel (CHRIN)
- "ffba_set_logical_first_and_second_addresses" — expands on SETLFS which prepares device/logical file prior to OPEN

## Labels
- CHKIN
