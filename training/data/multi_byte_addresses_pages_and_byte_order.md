# Two-byte addresses, pages, and LSB/MSB byte-ordering

**Summary:** Explains two-byte (16-bit) addressing on the C64: a byte holds 0–255 (bits 128+64+32+16+8+4+2+1 = 255), two bytes give 256*256 = 65536 combinations (64KiB), pages are 256-byte units (page 0 = 0*256), and the usual C64 computation/addressing is address = LSB + 256 * MSB with the low byte stored at the lower memory address and the high byte stored at the next higher address.

## Explanation

- Single byte range: a byte's bits are 128, 64, 32, 16, 8, 4, 2, 1; summing these gives 255, the maximum one-byte value.
- Need for two bytes: to count beyond 255, use a second byte as the high-order byte. Two bytes produce 256 * 256 = 65,536 distinct values (0–65,535), matching the C64's 64KiB address space.
- Page concept: a page is 256 bytes. Pages are numbered from 0: page N begins at address N * 256 (page 0 = $0000, page 1 = $0100, etc.).
- Byte ordering and address computation: the usual convention on the C64 is little-endian (LSB first). The two-byte address value is computed as:
  address = LSB + 256 * MSB
  The LSB (low byte, 0–255) is stored at the lower memory location; the MSB (high byte, count of 256s) is stored at the following higher memory location.
- Short example (illustrative): address $1234 has LSB $34 stored first and MSB $12 stored at the next higher address.

## References
- "memory_size_and_addressing" — expands overall memory size and multi-byte addresses
- "bits_bytes_and_binary_numbering" — explains why two bytes extend numeric range beyond a single byte
- "format_of_memory_map_entries" — how two-byte pointers and vectors are documented in memory map entries
