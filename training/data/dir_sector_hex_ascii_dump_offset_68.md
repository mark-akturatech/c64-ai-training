# DIR sector hex/ASCII dump — offset $68 (end of sector)

**Summary:** Hex/ASCII dump of a directory (DIR) file sector at offset $68, showing a zero byte, seven specific bytes, and a final byte 0x52 (ASCII 'R'); completes the byte-by-byte listing for the example DIR sector.

**Description**

This chunk contains the final bytes of an example directory sector dump for the C64 DIR file. The listing begins at sector offset $68 and shows:

- A leading 00 byte (zero / unused).
- Seven specific bytes: 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 (all ASCII spaces).
- A final byte 0x52 (ASCII capital 'R'), which is the last known byte for the sector and will render as 'R' in the ASCII column.

## Source Code

```text
.  68: 

00 20 20 20 20 20 20 20 52

.  68: 

.  00        .  20        .  20        .  20        .  20        .  20        .  20        .  20        .  52
```

## References

- "dir_sector_hex_ascii_dump_offset_60" — previous offset block (0x60)