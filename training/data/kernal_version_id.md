# KERNAL VERSION ID ($FF80)

**Summary:** KERNAL version ID byte at $FF80 contains the KERNAL ROM revision number (value $03). Searchable terms: $FF80, KERNAL, ROM version ID, version byte.

## KERNAL VERSION ID
This single byte in the KERNAL ROM identifies the ROM revision. In the provided dump the byte at address $FF80 holds the value $03, which is the KERNAL version number stored in ROM.

## Source Code
```text
                                *** KERNAL VERSION ID
                                This byte contains the version number of the KERNAL.
.:FF80 03
```

## Key Registers
- $FF80 - KERNAL ROM - KERNAL version ID byte (ROM revision; value shown $03)

## References
- "Commented Commodore 64 KERNAL Disassembly (Magnus Nyman)" — KERNAL version ID byte at $FF80