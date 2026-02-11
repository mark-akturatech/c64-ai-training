# SAL ($AC-$AD) — Pointer to Start of LOAD / Screen-Scrolling

**Summary:** SAL at $AC-$AD is a two-byte KERNAL workspace pointer (low=$AC, high=$AD) used as the working start address for SAVE/LOAD operations and for screen-scrolling routines; it receives its initial value from $C1 and is incremented during the transfer and restored afterward.

## Description
SAL is a 16-bit pointer stored in zero page (low byte at $AC, high byte at $AD). The KERNAL copies the pointer kept at $C1 (decimal 193) — the pointer to the start of the RAM area to be SAVEd or LOADed — into SAL when beginning a SAVE, LOAD, or VERIFY operation. SAL is then used as the working pointer that is incremented while data is transmitted or received. At the end of the operation the original pointer value is restored to SAL.

Screen-management and screen-scrolling routines also temporarily repurpose SAL as a working pointer while manipulating screen memory; callers should not assume SAL retains the original load/save pointer across such routines.

(Clarification: bytes are stored little-endian — low byte at $AC, high byte at $AD.)

## Key Registers
- $AC-$AD - Zero Page (KERNAL workspace) - SAL: two-byte pointer to the starting address for SAVE/LOAD and used for screen-scrolling (low=$AC, high=$AD)

## References
- "load_end_pointer_EAL_AE_AF" — matching ending pointer for SAVE/LOAD/VERIFY operations  
- "tape_buffer_count_and_force_output_BUFPNT" — buffering details during tape SAVE/LOAD operations

## Labels
- SAL
