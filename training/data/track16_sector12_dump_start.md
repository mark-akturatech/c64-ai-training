# TRACK 16 - SECTOR 12 (dump fragment)

**Summary:** Raw disk-sector fragment for track 16 (hex $10), sector 12 (hex $0C) showing the sector header and the first bytes of the sector data; contains an OCR/format ambiguity in the first byte.

**Description**

This chunk is the start of a sector dump for Track 16 / Sector 12. It begins with a short lead-in remark and the sector header, then shows the first few byte values at offset 00. The dump is clearly truncated (only the first four bytes are present).

**[Note: Source may contain an error — the first data byte is printed as "OO", which is likely an OCR error and probably intended to be "00".]**

## Source Code

```text
Again,  nothing  much  of  interest.  Chain  to  track  16  ($10),  sector  12  ($0C). 

TRACK  16  -  SECTOR  12 

00: 

00 

68 

8B 

20 
```

## References

- "track16_sector02_dump_and_notes" — expands on the previous sector (track 16, sector 02) in the chain that led to this sector