# MACHINE - BASIC RAM layout and pointers (SOB, SOV, SOA, EOA, BOS, TOM)

**Summary:** BASIC RAM layout: cassette buffer below BASIC area; Start-of-BASIC (SOB) common fixed addresses $0401, $0801, $1001, $1201; SOB pointer locations at $0028-$0029 (PET/CBM) and $002B-$002C (VIC-20 / C64 / PLUS/4); End-of-BASIC is marked by three zero bytes; SOV (start-of-variables), SOA (start-of-arrays), EOA, BOS (bottom-of-strings) and TOM (top-of-memory) are related pointers described in machine documentation.

## BASIC Memory Layout
BASIC RAM is partitioned (high to low) roughly as:
- BASIC program text and tokenized lines (between SOB and End-of-BASIC)
- BASIC variables (SOV)
- Arrays area (SOA)
- Dynamic/free strings area (BOS..TOM)
- Below BASIC area: cassette buffer (usable if not performing I/O)

Key points from the source:
1. Cassette buffer lies below the BASIC area and can be used for short test programs when not doing I/O.
2. Start-of-BASIC (SOB) is usually a fixed address for each machine:
   - PET/CBM: $0401 (decimal 1025)
   - Commodore 64: $0801 (decimal 2049)
   - PLUS/4: $1001 (decimal 4097)
   - VIC-20: may use $0401, $1001, or $1201 (machine-dependent)
   A pointer in zero page contains the current SOB for machines that support relocatable BASIC.
3. End-of-BASIC is indicated by three consecutive zero bytes somewhere after SOB. There is no dedicated "end" pointer — the three zero bytes mark the end. After a NEW, the three zeros appear immediately at SOB (no program present).
4. The start-of-variables (SOV) is typically located immediately after the end-of-BASIC (often directly behind the three zero bytes). SOA (start-of-arrays), EOA, BOS and TOM are related pointers that determine where arrays and string storage begin/end and the top of available BASIC memory; their exact locations are machine-dependent and described in each machine's documentation.

The logical layout from low to high memory is: Cassette buffer | BASIC PROGRAM | three zero bytes (end marker) | VARIABLES (SOV) | ARRAYS (SOA/EOA) | DYNAMIC STRINGS (BOS/TOM). A visual diagram is provided in the Source Code section below.

- SOB = Start-of-BASIC (fixed per machine or pointed-to)
- SOV = Start-of-variables
- SOA = Start-of-arrays
- EOA = End-of-arrays (or similar array boundary)
- BOS = Bottom-of-strings
- TOM = Top-of-memory (end of RAM available to BASIC)

## Source Code
```text
  __________________BASIC RAM_______________________
 /                                                  \
| Cassette |   BASIC PROGRAM   |0 0 0| VARIABLES | ARRAYS | DYNAMIC STRINGS |
                          ^             ^           ^       ^      ^
                          |             |           |       |      |
                         SOB           SOV         SOA     EOA    BOS/TOM
```

## Key Registers
- $0028-$0029 - PET/CBM Start-of-BASIC pointer (SOB pointer) — little-endian address holding current SOB ($0401 on unrelocated PET/CBM).
- $002B-$002C - VIC-20 / C64 / PLUS/4 Start-of-BASIC pointer (SOB pointer) — little-endian address holding current SOB (commonly $0801 on C64, $1001 on PLUS/4; VIC-20 may point to $0401, $1001, or $1201).
- $0401 - PET/CBM default Start-of-BASIC address (SOB)
- $0801 - Commodore 64 default Start-of-BASIC address (SOB)
- $1001 - PLUS/4 default Start-of-BASIC address (SOB)
- $0401, $1001, $1201 - VIC-20 possible Start-of-BASIC addresses (machine/config dependent)

## References
- "sov_pointer_dangers_and_effects" — expands on the role of SOV in memory protection and potential problems