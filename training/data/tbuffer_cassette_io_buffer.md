# TBUFFER (828-1019 / $33C-$3FB)

**Summary:** TBUFFER is a 192-byte cassette I/O buffer at $33C-$3FB used for tape device (device 1) read/write operations; it stores block type identifiers, program/data header blocks, and data storage blocks. When unused, it is commonly repurposed for short machine code routines or VIC-II graphics (sprite) data (sprite blocks #13/#14 at $340-$37F and $380-$3BF).

**Structure and Usage**

- **Size and Location:** 192 bytes located at decimal 828–1019 ($33C–$3FB).
- **Block Alignment:** Each tape block stored in TBUFFER occupies the full 192 bytes. The first byte (at $33C) is the block-type identifier.
- **Header Block Format (Program or Data Headers):**
  - Byte 0: Identifier (1 byte).
  - Bytes 1–2: Starting RAM address (2 bytes, little-endian format).
  - Bytes 3–4: Ending RAM address (2 bytes, little-endian format).
  - Bytes 5–191: Filename field, padded with spaces so the name portion totals 187 bytes.
  - **Total:** 1 + 2 + 2 + 187 = 192 bytes.
- **Data Storage Block Format:**
  - Byte 0: Identifier (1 byte).
  - Bytes 1–191: Data payload (191 bytes).
  - **Total:** 1 + 191 = 192 bytes.

**Block Identifier Values:**
- 1 — Program header for a relocatable program file.
- 3 — Program header for a nonrelocatable program file.
- 4 — Data file header (used when BASIC OPENs a tape data file).
- 2 — Data storage block (subsequent blocks following a data file header).

**Behavioral Notes:**
- **Relocatable vs Nonrelocatable:**
  - A relocatable program is produced when SAVE uses a secondary address of 0 (or any even number).
  - A nonrelocatable program is produced when SAVE uses a secondary address of 1 (or any odd number).
  - A nonrelocatable program will always load at the address specified in the header.
  - A relocatable program, when loaded normally, will be placed at the current start-of-BASIC address unless LOAD is invoked with a secondary address of 1 (in which case it loads at the header address).
- **Program Files:** Only use TBUFFER for the header block; actual program data transfers bypass the buffer and go directly to/from RAM.
- **Data File Headers (Identifier 4):** Placed in TBUFFER when BASIC OPENs a tape file for reading/writing; subsequent data blocks (identifier 2) follow. These blocks contain the actual data payload, with each block consisting of 191 bytes of data preceded by a 1-byte identifier.

**Common Alternate Uses (When Tape Not in Use):**
- **Short Machine-Language Routines:** Programmers often place small ML code here.
- **VIC-II Graphics Memory:**
  - Locations $340–$37F (decimal 832–895) can be used as sprite data block #13.
  - Locations $380–$3BF (decimal 896–959) can be used as sprite data block #14.
  - This is practical when the VIC-II is banked to the lowest 16K (default); otherwise, free space for sprite data is limited.

## Source Code

```text
TBUFFER map (192 bytes total) — located at $33C-$3FB (decimal 828-1019)

Offset (from $33C) / Absolute addr / Contents
0   / $33C  : Identifier byte (block type)
Header block (program or data header):
1-2 / $33D-$33E : Starting RAM address (2 bytes, little-endian)
3-4 / $33F-$340 : Ending   RAM address (2 bytes, little-endian)
5-191 / $341-$3FB: Filename field (padded with spaces) — 187 bytes

Data storage block:
1-191 / $33D-$3FB : Data payload (191 bytes)

Identifier values:
$01 = relocatable program header
$03 = nonrelocatable program header
$04 = data file header
$02 = data storage block (data payload blocks)
```

## Key Registers

- $033C-$03FB - RAM - TBUFFER cassette I/O buffer (192 bytes)
- $0340-$037F - VIC-II - sprite data block #13 (usable if VIC banked to low 16K and tape unused)
- $0380-$03BF - VIC-II - sprite data block #14 (usable if VIC banked to low 16K and tape unused)

## References

- "rs232_fifo_buffer_indices" — contrast between cassette buffering (TBUFFER) and RS-232 FIFO buffers

## Labels
- TBUFFER
