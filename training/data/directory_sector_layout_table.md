# Directory sector layout — byte offsets and file entries

**Summary:** Directory sector byte map showing forward pointer ($00-$01), eight file entry slots (byte ranges 2-31, 34-63, ... 226-255) and the unused/gap two-byte separators between entries; useful for parsing directory blocks in Commodore disk images.

**Layout description**

A directory sector is 256 bytes. According to this table:

- **Bytes 0-1:** Forward pointer to the next directory block (track/sector pointer).
- **Bytes 2-31:** File entry #1 (30 bytes).
- **Bytes 32-33:** Unused (2 bytes).
- **Bytes 34-63:** File entry #2 (30 bytes).
- **Bytes 64-65:** Unused (2 bytes).
- **Bytes 66-95:** File entry #3 (30 bytes).
- **Bytes 96-97:** Unused (2 bytes).
- **Bytes 98-127:** File entry #4 (30 bytes).
- **Bytes 128-129:** Unused (2 bytes).
- **Bytes 130-159:** File entry #5 (30 bytes).
- **Bytes 160-161:** Unused (2 bytes).
- **Bytes 162-191:** File entry #6 (30 bytes).
- **Bytes 192-193:** Unused (2 bytes).
- **Bytes 194-223:** File entry #7 (30 bytes).
- **Bytes 224-225:** Unused (2 bytes).
- **Bytes 226-255:** File entry #8 (30 bytes).

Each file entry within the 30-byte region is structured as follows:

- **Byte 0:** File type.
- **Bytes 1-2:** Track and sector location of the first data block.
- **Bytes 3-18:** File name (16 bytes, padded with $A0 if shorter).
- **Bytes 19-20:** File size in blocks (little-endian).

## Source Code

```text
160-161    0        Unused
162-191    File entry #6 in the directory block
192-193    0        Unused
194-223    File entry #7 in the directory block
224-225    0        Unused
226-255    File entry #8 in the directory block
```

## References

- "sample_directory_sector_raw_dump" — expands on an example hex dump of a directory sector.
- "single_directory_file_entry_example" — expands on how an individual file entry is stored within those byte ranges.