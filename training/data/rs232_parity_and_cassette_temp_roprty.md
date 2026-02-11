# ROPRTY ($BD) — RS-232 Output Parity / Cassette Temporary Storage

**Summary:** Zero-page workspace $00BD (ROPRTY) is used by the KERNAL RS-232 routines as an output-parity work byte and by the cassette/tape routines as temporary storage for the current character being read or written.

## Details
ROPRTY is a zero-page byte at address $00BD. Its documented uses in the C64 KERNAL are:
- RS-232 routines: used as an output-parity work byte during serial (RS-232) operations.
- Cassette/tape routines: used as temporary storage for the current character being read from or sent to the tape.

The byte is part of the KERNAL workspace and is referenced by serial and tape code paths; other nearby workspace locations are used by those routines for assembling and buffering characters.

## Key Registers
- $00BD - Zero Page - ROPRTY: RS-232 output parity / cassette temporary storage

## References
- "pointer_current_filename_fnadr" — expands on how RS-232 filename characters copied to $0293–$0296 affect serial parameters; notes ROPRTY usage during RS-232 operations
- "tape_input_byte_buffer_mych" — expands on tape routines and nearby workspace used for assembling and temporarily storing characters

## Labels
- ROPRTY
