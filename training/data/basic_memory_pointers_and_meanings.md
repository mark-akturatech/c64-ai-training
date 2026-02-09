# BASIC memory pointers: SOV, SOA, EOA, TOM, BOS (C64/VIC-20/PET)

**Summary:** Describes BASIC pointer semantics and addresses for PET/CBM and VIC-20 / Commodore 64 / PLUS/4: Start-of-Variables (SOV $002D-$002E on C64), Start-of-Arrays (SOA $002F-$0030), End-of-Arrays (EOA $0031-$0032), Bottom-of-Strings (BOS $0033-$0034) and Top-of-Memory (TOM $0037-$0038). Includes dynamic-string placement, SAVE/LOAD interaction, variable size and pointer behavior when the BASIC program changes.

## Pointer semantics and runtime behavior

- SOV (Start-of-Variables)
  - Marks the first free byte where BASIC stores variables at run-time. Each BASIC variable occupies exactly seven bytes.
  - On C64/VIC-20/PLUS-4 the two-byte SOV pointer resides at $002D/$002E (low byte first).
  - SAVE in direct mode saves memory from the start-of-BASIC (SOB) up to but not including the address pointed to by SOV — i.e., it saves the program text including the 3-byte end-of-BASIC marker but not variables.
  - LOAD in direct mode places the SOV pointer just after the last byte loaded, ensuring variables are allocated above the program text.
  - When the BASIC program is changed, SOV may be moved (up or down) as needed.

- SOA (Start-of-Arrays)
  - Points one byte beyond the end of BASIC variables — the next free address where arrays are allocated.
  - Arrays (from DIM or default dimensioning) are built starting at SOA.
  - On C64/VIC-20/PLUS-4 the SOA pointer is at $002F/$0030 (low/high).
  - When the BASIC program is edited, SOA is set to match SOV (erasing all variables immediately).

- EOA (End-of-Arrays)
  - Set one location beyond the last array element allocated by BASIC; memory above EOA appears free but is used by dynamic strings and other BASIC allocations.
  - On C64/VIC-20/PLUS-4 the EOA pointer is at $0031/$0032.
  - On program change, EOA is reset to match SOA/SOV (erasing arrays).

- TOM (Top-of-Memory)
  - Points one byte beyond the highest address available to BASIC. On the C64 TOM typically points to $A000 (the start of the KERNAL/ROM area), but this can vary depending on RAM configuration or resident monitors that occupy high memory.
  - TOM pointer location on C64/VIC-20/PLUS-4 is $0037/$0038.
  - If a machine-language monitor or other resident code occupies high memory, TOM may be lower than expected.

- BOS (Bottom-of-Strings)
  - Points to the last (highest) dynamic string allocated. If no dynamic strings exist BOS equals TOM.
  - On C64/VIC-20/PLUS-4 the BOS pointer is at $0033/$0034.
  - Dynamic (computed) strings created by operations such as concatenation (R$=R$+"*") or INPUT N$ are stored high in memory; BOS moves downward as new dynamic strings are allocated.
  - When the BASIC program is changed, BOS is reset to TOM, destroying all dynamic strings.

- Dynamic strings and garbage
  - "Dynamic" strings are those built at run-time (concatenation, INPUT, string functions) and thus must be placed in the dynamic string area referenced by BOS.
  - Dynamic-string storage is allocated from high memory down toward EOA. Changing the BASIC program clears BOS (sets it to TOM) and invalidates stored dynamic strings.
  - (No explicit garbage-collection algorithm is described in this excerpt; BASIC manages BOS growth/shrinkage and clears all dynamic strings on program edits.)

## Source Code
```text
BASIC pointer map (two-byte little-endian pointers):

PET/CBM        VIC-20 / C64 / PLUS-4    Meaning
-------------- -----------------------  ---------------------------------------
$002A/$002B    $002D/$002E             SOV - Start-of-Variables (pointer, 2 bytes)
(decimal 42/43)(decimal 45/46)
$002C/$002D    $002F/$0030             SOA - Start-of-Arrays (pointer, 2 bytes)
(decimal 44/45)(decimal 47/48)
$002E/$002F    $0031/$0032             EOA - End-of-Arrays (pointer, 2 bytes)
(decimal 46/47)(decimal 49/50)
$0030/$0031    $0033/$0034             BOS - Bottom-of-Strings (pointer, 2 bytes)
(decimal 48/49)(decimal 51/52)
$0034/$0035    $0037/$0038             TOM - Top-of-Memory (pointer, 2 bytes)
(decimal 52/53)(decimal 55/56)

Notes:
- Pointers are stored low byte first (little-endian).
- Each BASIC variable occupies exactly 7 bytes in the variables area.
- SAVE (direct mode) saves from SOB (start-of-BASIC) up to but not including SOV.
- LOAD (direct mode) sets SOV to just beyond the last byte loaded.
- On program change: SOV, SOA, EOA, BOS are adjusted (SOA/EOA/BOS set to match SOV/TOM as described), which effectively wipes variables, arrays, and dynamic strings.
- Typical C64 TOM: $A000 (subject to variation if resident code occupies high memory).
```

## Key Registers
- $002D-$002E - BASIC - SOV (Start-of-Variables) pointer (2-byte little-endian)
- $002F-$0030 - BASIC - SOA (Start-of-Arrays) pointer (2-byte little-endian)
- $0031-$0032 - BASIC - EOA (End-of-Arrays) pointer (2-byte little-endian)
- $0033-$0034 - BASIC - BOS (Bottom-of-Strings) pointer (2-byte little-endian)
- $0037-$0038 - BASIC - TOM (Top-of-Memory) pointer (2-byte little-endian)

## References
- "monitor_save_command_format_and_load_relocation" — monitor .S/.L operations and effects on BASIC pointers