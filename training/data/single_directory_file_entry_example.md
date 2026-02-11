# Directory file entry layout — single entry, forward pointer, and sector chaining

**Summary:** Each directory sector on a Commodore 1541 disk contains eight file entries. The first two bytes of each directory sector serve as a forward pointer (track and sector) to chain directory sectors together. For example, bytes $12,$04 indicate track 18, sector 4. The final directory sector is marked with $00,$FF. Directory sectors are allocated in a staggered sequence to optimize disk access.

**Description**

- **Directory Sector Structure:**
  - Each 256-byte directory sector begins with a two-byte forward pointer:
    - Byte 0: Next directory track
    - Byte 1: Next directory sector
  - If the forward pointer is $00,$FF, it signifies the last directory sector.
  - Example: A forward pointer of $12,$04 indicates the next directory sector is at track 18, sector 4.

- **Directory Entry Layout:**
  - Each directory sector contains eight 32-byte file entries.
  - Structure of a single directory entry:
    - Byte 0: File type
      - Bits 0-3: File type
        - 0000: DEL (Deleted)
        - 0001: SEQ (Sequential)
        - 0010: PRG (Program)
        - 0011: USR (User)
        - 0100: REL (Relative)
      - Bit 4: Unused
      - Bit 5: Used during SAVE-@ replacement
      - Bit 6: Locked flag (1 indicates locked file)
      - Bit 7: Closed flag (1 indicates properly closed file)
    - Bytes 1-2: Track and sector of the first data block
    - Bytes 3-18: Filename (16 characters, padded with $A0 if shorter)
    - Bytes 19-20: Track and sector of the first side-sector block (REL files only)
    - Byte 21: Record length (REL files only)
    - Bytes 22-25: Unused
    - Bytes 26-27: Track and sector of replacement file during SAVE-@ or OPEN-@ operations
    - Bytes 28-29: Number of blocks in file (low byte, high byte)

- **Sector Allocation:**
  - Directory sectors are allocated in a staggered sequence to reduce disk rotations and improve throughput.
  - The filling sequence for directory sectors on track 18 is:
    - 1, 4, 7, 10, 13, 16
    - 2, 5, 8, 11, 14, 17
    - 3, 6, 9, 12, 15, 18

## Source Code

```text
Sample single directory file entry (hex bytes shown; 8 entries per sector)

. 00:  12 04 82 11 00 48 4F 57    HOW
. 08:  20 54 4F 20 55 53 45       TO USE
. 10:  A0 A0 A0 A0 A0 00 00 00
. 18:  00 00 00 00 00 00 0D 00

Notes:
- Bytes 0-1 (here: 12 04) are a forward pointer: track $12 (18), sector $04.
- Byte 2 (82) indicates a PRG file that is properly closed.
- Bytes 3-4 (11 00) point to the first data block at track $11 (17), sector $00.
- Bytes 5-20 contain the filename "HOW TO USE", padded with $A0.
- Bytes 21-22 are unused.
- Bytes 23-24 (0D 00) indicate the file occupies 13 blocks.
```

## References

- "directory_sector_layout_table" — expands on byte ranges for file entries
- "file_entry_forward_pointer_and_chaining" — expands on how bytes 0-1 chain directory sectors