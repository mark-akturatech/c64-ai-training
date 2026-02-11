# MEMBOT ($FF9C / $FE34)

**Summary:** KERNAL entry MEMBOT manages the BASIC workspace lower boundary. Call with Carry clear to restore a saved boundary or set Carry to save the current boundary; 16-bit address passed/returned in X/Y registers. Vector entry $FF9C → real routine at $FE34.

## Description
MEMBOT is the KERNAL routine that reads or writes the BASIC workspace lower boundary (the start of BASIC variables/temporary storage):

- Purpose: Save or restore the BASIC workspace lower pointer (the "MEMBOT" value).
- Call: JSR $FF9C (public KERNAL vector). The vector points to the implementation at $FE34.
- Input:
  - Carry = 0 : restore — X/Y contain the 16-bit address to set as the new BASIC workspace lower boundary.
  - Carry = 1 : save — no address input; routine returns the current BASIC workspace lower boundary in X/Y.
  - X/Y: the 16-bit address pair (X = low byte, Y = high byte).
- Output:
  - If Carry = 1 (save): X/Y returned contain the saved 16-bit MEMBOT value.
  - If Carry = 0 (restore): no return value specified; X/Y are consumed.
- Registers:
  - Uses (and thus clobbers) X and Y registers. Other registers and flags are not documented here.
- Notes:
  - For normal usage set or read the lower boundary of BASIC’s workspace; complementary routine for the upper boundary is MEMTOP ($FF99).
  - $FF9C is the documented KERNAL entry; $FE34 is the actual ROM address of the implementation.

## Key Registers
- $FF9C - KERNAL - MEMBOT vector (public JSR entry)
- $FE34 - KERNAL ROM - MEMBOT implementation (real address)

## References
- "memtop" — BASIC workspace upper boundary (MEMTOP $FF99)

## Labels
- MEMBOT
