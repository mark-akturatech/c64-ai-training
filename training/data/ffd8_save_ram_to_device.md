# C64 KERNAL: $FFD8 — SAVE (Save RAM to a device)

**Summary:** KERNAL vector $FFD8 implements SAVE: saves memory from an indirect zero-page address (specified by A) to the destination address in XY into a logical file. Requires prior SETLFS ($FFBA) and SETNAM ($FFBD); filename optional for cassette (device 1). Device 0 (keyboard) and device 3 (screen) cannot be SAVEd to.

## Description
$FFD8 is the KERNAL routine that writes a block of RAM to a logical file on a selected device.

Call semantics (as described in source):
- The source block start address is supplied indirectly via a zero-page pointer whose low byte is in A (i.e., A selects the zero-page address where the two-byte source pointer resides).
- The destination start address (in RAM) is taken from registers X and Y (XY hold the address where data should be saved from).
- Before calling SAVE, the caller must set the logical file and device using SETLFS ($FFBA) and provide a filename using SETNAM ($FFBD) when required.
- A filename is optional when saving to device 1 (cassette); all other devices require a filename or an error will result.
- Attempts to SAVE to device 0 (keyboard) or device 3 (screen) are invalid; such attempts produce an error and the SAVE is stopped.
- The routine writes the specified memory region to the logical file previously selected by SETLFS; errors during the operation follow the usual KERNAL error handling (routine terminates and returns error).

Behavioral notes from source:
- SETLFS ($FFBA) and SETNAM ($FFBD) must be used before calling $FFD8 unless saving to cassette where filename is optional.
- Device validation is enforced: device numbers 0 and 3 are rejected for SAVE.

## Key Registers
- $FFD8 - KERNAL - SAVE: save RAM to a logical file (source pointer via zero page A, destination address in X/Y)
- $FFBA - KERNAL - SETLFS: set logical file and device (must be called before SAVE)
- $FFBD - KERNAL - SETNAM: set filename (required for SAVE except on device 1)

## References
- "ffba_set_logical_first_and_second_addresses" — expands on SETLFS for device selection  
- "ffbd_set_the_filename" — expands on SETNAM for filename selection

## Labels
- SAVE
- SETLFS
- SETNAM
