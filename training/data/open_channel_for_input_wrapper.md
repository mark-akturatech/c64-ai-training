# KERNAL CHKIN wrapper at $FFC6 (JMP ($031E))

**Summary:** Wrapper entry in the Commodore 64 KERNAL at $FFC6 that JMPs indirectly via the CHKIN vector at $031E to open an input channel (CHKIN). References the OPEN routine at $FFC0 and automatically issues LISTEN/secondary for devices on the serial bus; returns error codes 3, 5, 6.

## Description
This KERNAL entry at $FFC6 is a tiny wrapper that transfers control to the CHKIN vector held at address $031E using an indirect JMP (JMP ($031E)). CHKIN is the routine used to open a channel for input.

Behavioral details preserved from the original documentation:
- If the target device is on the serial bus, the routine will automatically send the LISTEN address and any secondary address previously specified by the OPEN routine ($FFC0).
- Possible error return values (in A or via standard KERNAL error conventions) from this operation:
  - 3 — file not open
  - 5 — device not present
  - 6 — file is not an input file

This wrapper is a standard KERNAL entry point; the actual implementation of CHKIN may be relocated by changing the vector at $031E, allowing redirection to alternative handlers.

## Source Code
```asm
.,FFC6 6C 1E 03    JMP ($031E)    ; do open channel for input
```

## Key Registers
- $FFC6 - KERNAL ROM - CHKIN wrapper entry (JMP ($031E))
- $031E - KERNAL vector - CHKIN vector (indirect jump target)
- $FFC0 - KERNAL ROM - OPEN routine (reference: OPEN supplies listen/secondary)

## References
- "kernal_vectors_list" — expands on CHKIN vector at $031E and other KERNAL vectors

## Labels
- CHKIN
