# CHKOUT ($FFC9)

**Summary:** KERNAL CHKOUT ($FFC9) sets a specified logical file as the default output device. Input: X = logical file number; uses A and X registers; file must be OPEN. Real entry is indirect via ($0320) then $F250.

## Description
- Purpose: Make the logical file number in X the default output device for subsequent character output (requires the file to be OPEN).
- Calling convention: X = logical file number. Registers A and X are used/modified by the routine.
- Requirement: The logical file must already be OPEN before calling CHKOUT; otherwise behavior depends on the device/driver.
- Addressing/dispatch: The documented vector is $FFC9, but the actual implementation is reached indirectly via the zero-page vector at ($0320) and then through $F250.
- Complementary function: CHKIN ($FFC6) sets the default input device (logical file) and is the input counterpart to CHKOUT.

## Source Code
(omitted — no assembly listing or register map provided in source)

## Key Registers
(omitted — this chunk documents a KERNAL entry, not memory-mapped hardware registers)

## References
- "chkin" — sets default input device (CHKIN $FFC6)
- "open" — describes requirement that a file must be OPEN before CHKOUT is used