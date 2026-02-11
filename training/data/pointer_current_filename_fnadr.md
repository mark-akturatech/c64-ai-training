# FNADR — Pointer to current filename ($BB-$BC)

**Summary:** FNADR at $BB-$BC is a two-byte KERNAL workspace pointer to the current filename used by OPEN/LOAD/SAVE routines; tape OPENs without a filename do not use it. When opening the RS-232 device, up to four filename characters are copied to $293-$296 (decimal 659–662) to select serial parameters (baud, parity, word length).

## Description
FNADR ($BB-$BC) holds a two-byte pointer to the address of the current filename in KERNAL workspace. KERNAL file operations (OPEN, LOAD, SAVE) that use a filename consult this pointer to find the filename string.

If an OPEN of the cassette/tape device is performed without a filename, FNADR is not used.

Disk filename behavior with a shifted-space:
- If a disk filename contains a shifted-space character, the remainder of the name will appear outside the quotes in the directory and can be used as a comment. Example: saving with the name "ML[shifted space]SYS828" will produce the directory entry shown as "ML"SYS 828.
- A program may be referenced either by the portion of the name that appears within quotes (the quoted portion) or by the full name (including the shifted-space). However, a later directory entry like "ML"SYS 900 would not be found by referencing just "ML" (the quoted portion), because the rest of the name differs.

RS-232 filename usage:
- When opening the RS-232 device with a filename up to four characters long, those four characters are copied into $293-$296 (decimal 659–662). The RS-232 routines use these bytes to control serial parameters such as baud rate, parity, and word length.

## Key Registers
- $BB-$BC - KERNAL workspace - Two-byte pointer to the current filename used by OPEN/LOAD/SAVE (unused for tape OPENs without a filename).
- $293-$296 - KERNAL workspace - RS-232 filename characters copied when opening RS-232; used to control baud, parity, and word length (decimal 659–662).

## References
- "current_secondary_address_sa" — expands on how secondary address affects how LOAD/SAVE interpret filenames and load addresses
- "rs232_parity_and_cassette_temp_roprty" — expands on RS-232 routines and related workspace locations (parity/temporary storage)

## Labels
- FNADR
