# EAL ($AE-$AF) — Pointer to Ending Address for SAVE/LOAD/VERIFY

**Summary:** EAL at $AE-$AF is the 16-bit little-endian pointer (low byte at $AE, high byte at $AF) used by the KERNAL to mark the ending address of the area saved or loaded by the SAVE/LOAD/VERIFY routines. Searchable terms: $AE, $AF, EAL, KERNAL SAVE, LOAD, VERIFY, pointer.

## Description
EAL is a KERNAL workspace pointer that holds the ending address (end-of-program) for disk/tape SAVE, LOAD, and VERIFY operations. The KERNAL SAVE routine sets EAL to indicate the last byte to include when saving; LOAD and VERIFY use the same field to determine the expected end address.

Storage format:
- 16-bit address, little-endian
  - $AE = low byte (least significant)
  - $AF = high byte (most significant)

Usage notes:
- Paired with the start pointer (SAL / $AC-$AD) to define the inclusive address range to operate on.
- Typical workflow: KERNAL routines set SAL (start) and EAL (end) before invoking device I/O. Device handlers read these to know how many bytes to transfer.
- Any code that manipulates KERNAL load/save behavior should preserve/restore these bytes if it calls the KERNAL routines or relies on them afterward.

## Key Registers
- $AE-$AF - KERNAL - Pointer to Ending Address for SAVE/LOAD/VERIFY (EAL), 16-bit little-endian (low=$AE, high=$AF)

## References
- "load_start_pointer_SAL_AC_AD" — start pointer paired with this end pointer (SAL / $AC-$AD)

## Labels
- EAL
