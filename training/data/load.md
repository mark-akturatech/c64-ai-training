# $FFD5 - LOAD (KERNAL)

**Summary:** KERNAL LOAD routine at $FFD5 (real entry $F49E) loads or verifies a sequential file; requires SETLFS and SETNAM beforehand. Inputs: A (0=load, 1–255=verify), X/Y = load address when secondary address = 0; outputs: Carry flag and A/X/Y as status/addresses.

## Description
Loads a file from the device/logic number and filename previously configured by SETLFS and SETNAM. Behavior and register conventions:

- Input
  - A = operation selector:
    - 0 = load the file into memory
    - 1–255 = verify the file (compare file bytes to memory)
  - X/Y = target load address (used only if the file's secondary address = 0) (secondary address = file/channel secondary address byte)
- Output
  - Carry flag: 0 = success, 1 = error
  - If Carry = 1: A = KERNAL error code (see KERNAL error table in other entries)
  - If Carry = 0: X/Y = last byte address (address of last byte loaded/verified)
- Registers
  - Uses/clobbers A, X, Y
- Preconditions
  - SETLFS must have been called to set device/logical/unit
  - SETNAM must have been called to set filename
- Entry/real address
  - Vector/label commonly referenced as $FFD5; actual ROM entry at $F49E

## Key Registers
- $FFD5 - KERNAL - LOAD routine (loads or verifies file). Uses A/X/Y; returns Carry and A/X/Y. Real ROM address $F49E.

## References
- "save" — complementary file write operation (SAVE $FFD8)
- "setlfs" — configures device/logical number for LOAD
- "setnam" — sets filename for LOAD

## Labels
- LOAD
