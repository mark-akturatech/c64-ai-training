# SAVE RAM to device (ROM wrapper at $FFD8 -> $F5DD)

**Summary:** KERNAL SAVE wrapper at $FFD8 (JMP $F5DD) — saves memory starting from an indirect zero‑page address (pointer specified by A) to a target address held in X/Y; requires SETLFS ($FFBA) and SETNAM ($FFBD). Special-case: device 1 (cassette) does not require a filename; devices 0 (keyboard) and 3 (screen) cannot be SAVEd to.

## Description
This ROM entry saves a block of memory to a logical file as configured by prior SETLFS and SETNAM calls. Memory range and target are specified by two mechanisms in CPU registers:

- Source start: an indirect address on page zero designated by register A (zero-page pointer: address stored at $00+A and $00+A+1).
- Target/length/addressing: values in X and Y are used to specify the address used by the save implementation (described in the original ROM: "to the address stored in XY").

Before calling this routine the calling program must set up:
- SETLFS ($FFBA) — select device, logical file number and mode.
- SETNAM ($FFBD) — set filename (except for device 1).

Notes and restrictions:
- Device 1 (cassette) accepts SAVE without a filename; other devices require a filename or an error will be raised.
- Device 0 (keyboard) and device 3 (screen) cannot be SAVEd to — attempting to do so causes an error and aborts the SAVE.
- This entry is a simple JMP wrapper: $FFD8 JMPs to the actual implementation at $F5DD.

## Source Code
```asm
.,FFD8  4C DD F5    JMP $F5DD      ; save RAM to device (wrapper)
```

## Key Registers
- $FFD8 - KERNAL ROM - JMP wrapper to $F5DD (SAVE entry)
- $F5DD - KERNAL ROM - SAVE implementation entry (target of $FFD8)
- $FFBA - KERNAL ROM - SETLFS (set logical file/device/mode) — must be called before SAVE
- $FFBD - KERNAL ROM - SETNAM (set filename) — must be called before SAVE (not required for device 1)

## References
- "device_load_save_routines" — expands on F5DD SAVE implementation

## Labels
- SAVE
- SETLFS
- SETNAM
