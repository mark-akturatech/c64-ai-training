# CHKIN ($FFC6)

**Summary:** Sets the specified logical file as the default input device (KERNAL CHKIN). Call via $FFC6; input X = logical file number; clobbers A and X registers. Implementation reached indirectly via vector at $031E and ultimately at $F20E.

## Description
CHKIN is the KERNAL routine that makes a previously OPENed logical file the system's default input device. The caller must supply the logical file number in register X. CHKIN uses and modifies A and X, so those registers are not preserved.

Behavioral notes (from source):
- Requires the logical file to be OPEN before calling.
- Input: X = logical file number.
- Uses/Clobbers: A, X registers.
- Entry point (ROM vector): $FFC6.
- Real routine address is reached indirectly via the zero-page/vector at $031E, ultimately at $F20E.

Complementary/related KERNAL calls:
- CHKOUT ($FFC9) — sets default output device.
- OPEN — file must be OPEN before CHKIN is valid.

## Key Registers
- $FFC6 - KERNAL ROM - CHKIN entry point (set default input)
- $031E - Zero page/vector - pointer used by CHKIN to jump to implementation
- $F20E - ROM - actual routine address referenced by CHKIN via $031E

## References
- "CHKOUT ($FFC9)" — complementary operation to set default output
- "OPEN" — file must be OPEN before CHKIN can set it as default input