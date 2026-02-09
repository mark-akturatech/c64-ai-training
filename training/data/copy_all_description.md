# MACHINE - COPY-ALL and COPY-ALL.64

**Summary:** Machine-language utilities for copying files between disk drives or to/from cassette on PET/CBM and Commodore 64; uses a BASIC string as a transfer buffer and exposes two SYS commands (directory and copy). Written in machine code so the BASIC ROM can be flipped out (disable BASIC ROM to free memory).

**Description**
COPY-ALL (PET/CBM) and COPY-ALL.64 (Commodore 64) are utilities that combine a small machine-language driver with a BASIC stub. The BASIC portion exposes two SYS commands:
- one SYS to obtain the directory of the selected device,
- one SYS to perform the actual file copying.

File data is transferred by reading from the source file into a BASIC string reserved as a transfer buffer, then writing that string out to the target device. This technique mirrors the approach used in the separate utility "STRING THING" (BASIC string used as block buffer).

Because the copying engine is implemented in machine language, the program can flip the BASIC ROM out of the address space to reclaim RAM for larger transfers (useful when copying large programs or when memory is tight). The package exists as two filenames: COPY-ALL (for PET/CBM) and COPY-ALL.64 (for the C64).

## Source Code
```assembly
; Assembly source code for COPY-ALL and COPY-ALL.64 is not available in the provided references.
```

## Key Registers
- **SYS Command Addresses:**
  - Directory listing: Address not specified in available sources.
  - File copying: Address not specified in available sources.

## References
- "string_thing_description" — expands on the BASIC string transfer-buffer technique used here (BASIC-string buffering).
- Jim Butterfield, "Machine Language for the Commodore 64 and Other Commodore Computers," 1984.