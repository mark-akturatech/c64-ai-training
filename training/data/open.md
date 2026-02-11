# OPEN ($FFC0)

**Summary:** KERNAL OPEN routine at $FFC0 opens a file (requires prior SETLFS and SETNAM). Uses/overwrites registers A, X, Y. Real implementation reached indirectly via the vector at $031A, ultimately at $F34A.

## Description
Opens a file previously configured by calling SETLFS (logical file number, device, secondary address) and SETNAM (filename pointer/length). The OPEN entry at $FFC0 expects the environment prepared by those calls and will use/modify the CPU registers A, X, and Y.

Implementation detail provided by the source: the $FFC0 entry is an entrypoint that jumps indirectly via the vector stored at $031A; the actual routine execution address is $F34A.

(Caller must call SETLFS and SETNAM before invoking OPEN; registers A/X/Y are clobbered by the routine.)

## Key Registers
- $FFC0 - KERNAL - OPEN entry point (KERNAL vector entry)
- $031A - Zero page - KERNAL indirect vector used by $FFC0 (pointer to real routine)
- $F34A - ROM - Actual OPEN routine implementation address (reached via vector)

## References
- "setlfs" — configures logical number, device, secondary address
- "setnam" — sets filename pointer and length
- "close" — closes files opened by OPEN

## Labels
- OPEN
