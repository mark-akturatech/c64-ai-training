# Commodore 1541 Sector Layout and GCR Encoding (DOS 2.6 Sync)

**Summary:** This document details the Commodore 1541 disk drive's sector structure, including the Header Block and Data Block, the DOS 2.6 synchronization marks, the two write modes (sync and normal), and the binary-to-GCR encoding process, which involves splitting each byte into high and low 4-bit nybbles and mapping them using a 16-entry GCR lookup table.

**Sector Division and Sync Behavior**

A 1541 disk sector is recorded as a continuous bitstream on a track, divided into two contiguous parts: a Header Block and a Data Block. There are no demagnetized gaps between sectors; synchronization characters (sync marks) indicate the start of each header and data block. In DOS 2.6, a sync mark consists of five consecutive $FF bytes written to the disk.

To differentiate a sync mark from ordinary data, the drive employs two write modes:

- **Sync Write Mode:** Used to write the sync mark patterns (non-standard encoding).
- **Normal Write Mode:** Used for ordinary sector bytes.

During normal write mode, each 8-bit byte is encoded into 10 bits using Commodore’s binary-to-GCR (Group Code Recording) conversion.

**Binary-to-GCR Encoding**

- Each 8-bit data byte is split into two 4-bit nybbles: a high nybble and a low nybble.
- Each 4-bit nybble (0–15) is converted via a 16-entry GCR lookup table into a 5-bit GCR code; the pair of 5-bit codes yields the 10-bit value written for that original byte.

**GCR Lookup Table:**

| Nybble (Decimal) | Nybble (Binary) | GCR Code (Binary) | GCR Code (Hex) |
|------------------|-----------------|-------------------|----------------|
| 0                | 0000            | 01010             | 0x0A           |
| 1                | 0001            | 01011             | 0x0B           |
| 2                | 0010            | 10010             | 0x12           |
| 3                | 0011            | 10011             | 0x13           |
| 4                | 0100            | 01110             | 0x0E           |
| 5                | 0101            | 01111             | 0x0F           |
| 6                | 0110            | 10110             | 0x16           |
| 7                | 0111            | 10111             | 0x17           |
| 8                | 1000            | 01001             | 0x09           |
| 9                | 1001            | 11001             | 0x19           |
| 10               | 1010            | 11010             | 0x1A           |
| 11               | 1011            | 11011             | 0x1B           |
| 12               | 1100            | 01101             | 0x0D           |
| 13               | 1101            | 11101             | 0x1D           |
| 14               | 1110            | 11110             | 0x1E           |
| 15               | 1111            | 10101             | 0x15           |

*Source: [Commodore 1541 - C64-Wiki](https://www.c64-wiki.com/wiki/Commodore_1541)*

**Example:**

- Byte $12 = %0001 0010
  - High nybble = %0001 = 1
  - Low nybble  = %0010 = 2
  - GCR encoding:
    - High nybble (1) → GCR code: 01011
    - Low nybble (2) → GCR code: 10010
  - Combined GCR code: 01011 10010

## Source Code

```text
Header Block (16 8-bit bytes)
Fields:
- Sync Character (5 bytes of $FF)
- Header Block Identifier ($08)
- Header Block Checksum (1 byte)
- Track Number (1 byte)
- Sector Number (1 byte)
- ID LO (1 byte)
- ID HI (1 byte)
- Off Bytes ($0F) (5 bytes)
- Header Gap ($55) (1 byte)

Data Block (260 8-bit bytes)
Fields:
- Sync Character (5 bytes of $FF)
- Data Block Identifier ($07)
- 256 Data Bytes
- Data Block Checksum (1 byte)
- Off Bytes ($00) (2 bytes)
- Variable Tail Gap ($55) (1 byte)

Sync mark:
- DOS 2.6 sync mark defined as five 8-bit $FF bytes written in succession.

Write modes:
- Two write modes are used to differentiate sync marks from normal data: sync mode and normal write mode.

Binary-to-GCR conversion (example):
- $12 (hex) = %00010010 (binary)
  - High nybble = %0001 (decimal 1)
  - Low nybble  = %0010 (decimal 2)
  - GCR encoding:
    - High nybble (1) → GCR code: 01011
    - Low nybble (2) → GCR code: 10010
  - Combined GCR code: 01011 10010
```

## References

- [Commodore 1541 - C64-Wiki](https://www.c64-wiki.com/wiki/Commodore_1541)
- [Commodore 1541 - Wikipedia](https://en.wikipedia.org/wiki/Commodore_1541)
- [GCR Decoding on the Fly](https://www.linusakesson.net/programming/gcr-decoding/index.php)
