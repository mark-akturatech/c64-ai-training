# Directory Entry: Final Two Bytes = File Block Count (Low-Byte + High-Byte*256)

**Summary:** In a Commodore 1541 disk directory entry, the final two bytes (offsets $1E–$1F) represent the file's length in disk blocks as a little-endian 16-bit value: blocks = low-byte + high-byte * 256. For example, $0D + $00 * 256 = 13 blocks.

**Explanation**

- A directory entry is 32 bytes long; the last two bytes (byte offsets 30 and 31, i.e., $1E and $1F) constitute the block-count field.
- The block count is stored in little-endian format: the first of the two bytes is the low-order byte (0–255), and the second is the high-order byte (0–255). Compute file blocks as: low + high * 256.
- In the provided example, the low byte is 13 ($0D), and the high byte is 0 ($00), so the file occupies 13 blocks on the diskette.

## Source Code

```text
Hex dump of a directory entry:

00: 12 04 82 11 00 48 4F 57 20 54 4F 20 55 53 45 A0
10: A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 0D 00

Interpretation:
- Bytes 0–1: Track and sector of next directory block (18, 4)
- Byte 2: File type (PRG, closed)
- Bytes 3–4: Track and sector of first data block (17, 0)
- Bytes 5–20: File name ("HOW TO USE", padded with $A0)
- Bytes 21–30: Unused or specific to REL files
- Bytes 31–32: Block count (13 blocks)
```

## References

- "single_directory_file_entry_example" — expands on example with block count bytes