# LOAD/VERIFY wrapper at $FFD5 -> $F49E (C64 KERNAL)

**Summary:** ROM entry point $FFD5 is a JMP wrapper to the KERNAL load/verify routine at $F49E. Requires SETLFS ($FFBA) and SETNAM ($FFBD) called first; A=0 for load, A=1 for verify; if device secondary=0 use (X,Y) start address, otherwise header supplies start; returns the highest RAM address loaded.

## Description
This KERNAL routine loads data from an opened device into RAM, or verifies device data against RAM without altering memory.

- Call sequence:
  - Call SETLFS ($FFBA) to set logical file (device, etc.).
  - Call SETNAM ($FFBD) to set filename/record name.
  - Execute at $FFD5 (wrapper) or $F49E (actual routine entry).
- Mode selection:
  - A = 0 -> perform a load (write device data into RAM).
  - A = 1 -> perform a verify (compare device data to RAM; RAM unchanged).
- Address selection:
  - If the device was OPENed with secondary address = 0, the device header is ignored. The caller must supply the starting memory address in the (X,Y) register pair.
  - If the device secondary address = 1 or 2, the device header is used; the header supplies the starting memory address for the load.
- Return:
  - The routine returns the address of the highest RAM location which was loaded (no register mapping for the return address is given in this chunk).
- Notes:
  - $FFD5 is only a JMP wrapper that transfers control to $F49E where the load/verify implementation resides.
  - The routine reads sequential bytes from the device and either stores them in RAM (load) or compares them with RAM (verify), using header behavior as described.

## Source Code
```asm
.; $FFD5
.,FFD5 4C 9E F4    JMP $F49E       ; load RAM from a device
```

## Key Registers
- $FFD5 - ROM - JMP wrapper to $F49E (load/verify entry)
- $F49E - ROM - load/verify routine (actual implementation)
- $FFBA - ROM - SETLFS (set logical file/device; must be called first)
- $FFBD - ROM - SETNAM (set filename/record name; must be called first)

## References
- "device_load_save_routines" — expands on F49E load/verify routine (external)

## Labels
- SETLFS
- SETNAM
