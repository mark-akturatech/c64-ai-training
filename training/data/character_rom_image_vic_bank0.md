# Character ROM image seen by VIC-II in memory bank 0 ($1000-$1FFF)

**Summary:** VIC-II bank 0 maps the character ROM image into $1000-$1FFF (4096–8191) while the CPU normally sees RAM there; this makes RAM at $1000-$1FFF unusable for screen/user character data and prevents use of sprite data blocks 64–127. Useful addresses: $1000-$1FFF, $0400 (screen RAM), $C000 (Character ROM CPU mapping), zero-page BASIC pointers starting at $002B.

## Description

- Memory range 4096–8191 ($1000–$1FFF) is the VIC-II-visible image of the Character ROM when the VIC-II is banked to the first 16K (bank 0 — the default). The 6510 CPU still accesses RAM at those addresses unless the CPU has had ROM mapped in at $C000.
- This banked view lets the VIC-II fetch character shapes that physically reside at $C000 (49152) while the CPU and RAM remain in lower addresses. The VIC-II has its own 16K window into the machine RAM/ROM space which can differ from the CPU's view.
- Consequences:
  - RAM at $1000–$1FFF cannot be used for screen memory or user-defined character dot data while VIC-II is using the Character ROM image in that range.
  - Sprite data blocks numbered 64–127 (the blocks that would fall in this 4K range) are not accessible to the VIC-II when the ROM image is present there.
- Verification: Turn on bitmap mode and set the screen memory to addresses that include 0–8192; the portion mapped to $1000–$1FFF will display the ROM character shapes (text glyphs) — confirming the VIC-II is reading ROM image data there.
- For the format and layout of character shape data, see the Character ROM description at $C000.

## BASIC memory layout and NEW behavior

- Quick review of BASIC pointers starting at 43 (decimal) / $002B (hex) shows the BASIC program area grows from lower addresses to higher as follows:
  - BASIC Program Text
  - Non-Array Variables and String Descriptors
  - Array Variables
  - Free Area (reported by FRE(0))
  - String Text Area (strings build from top of memory downward into the free area)
  - BASIC ROM
- NEW does not zero the text area; it replaces the first link address in the BASIC program with two zeros (end-of-program marker). To recover a program after NEW:
  - Replace the first link address you saved.
  - Locate the two zeros that mark the end of the program.
  - Set the pointers at decimal 45, 47, and 49 (zero-page addresses $002D, $002F, $0031) — these all point to the end of a BASIC program before RUN — to the byte following those two zeros.

## Key Registers
- $1000-$1FFF - VIC-II - Character ROM image visible to VIC-II when using memory bank 0 (4096–8191)
- $C000 - CPU - Character ROM base (49152) — CPU can access this ROM when mapped into CPU space
- $0400 - RAM - Common screen RAM area used by VIC-II (1024)
- $002B - Zero Page - Start of BASIC pointer table (decimal 43)
- $002D, $002F, $0031 - Zero Page - BASIC end-of-program pointers (decimal 45, 47, 49) — update these to recover a program after NEW

## References
- "character_rom_bank2_image" — expands on Character ROM image also appearing in bank 2 when VIC-II uses that bank
