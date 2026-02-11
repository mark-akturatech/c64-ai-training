# Side Sector #0 — Pointer Table Dump (Track 17, Sector 13) — header + first pointer block

**Summary:** Formatted dump of Side Sector #0 for TRACK 17 - SECTOR 13 showing the title/header and the initial columnar pointer entries up through the offset marker ". 18" (pointer table / track-sector slot area). Searchable terms: TRACK 17, SECTOR 13, SIDE SECTOR #0, pointer table, track/sector pairs, offset .10, offset .18.

**Description**
This chunk is the beginning of a formatted side-sector dump that contains a header line for TRACK 17 - SECTOR 13 (SIDE SECTOR #0) followed by the first block of pointer slots (track/sector pair area). The dump is presented in narrow columnar form with offset markers (e.g., ". 10," and ". 18") that denote positions within the sector/pointer table.

Observations from the provided rows (literal tokens preserved in Source Code):
- The top-most lone line "60" appears above the TRACK header. This likely represents the decimal value 96, which corresponds to the ASCII character 'a'. This could be a placeholder or marker used in the dump format.
- Header line: "TRACK  17  -  SECTOR  13  SIDE  SECTOR  #0" — identifies the disk location and that this is side-sector index 0.
- The pointer area is shown in small columns; offsets are indicated by ". 10," and ". 18" (". 10" appears before the first group; ". 18" marks the end of the provided block).
- Column entries between offsets are short tokens that likely represent track/sector pointers or slot values. Examples exactly as printed:
  - ".  10,"
  - "1 1"
  - "03"
  - "1 1"
  - "0E"
  - "1 1"
  - "04"
  - "1 1"
  - "0F"
  - ".  18"
- Note: tokens "0E" and "0F" are hexadecimal values representing decimal 14 and 15, respectively. Similarly, spacing ("1 1") could be an attempt to show "11" or two-column layout "1  1". Do not assume exact byte values without original binary.

Context / intended use:
- This chunk is the initial portion of a pointer table for side sector 0; further pointer entries continue past offset .18 and are referenced by other chunks ("side_sector_0_pointer_table_18_20", "side_sector_0_pointer_table_20_28").
- To reconstruct full track/sector mapping, the continuation chunks must be retrieved and OCR artifacts corrected against the original image.

## Source Code
```text
60 

TRACK  17  -  SECTOR  13  SIDE  SECTOR  #0 

.  10, 

1 1 

03 

1 1 

0E 

1 1 

04 

1 1 

0F 

.  18 

---
Additional information can be found by searching:
- "side_sector_0_pointer_table_18_20" which expands on continues with the next pointer block (offset .18 -> .20)
- "side_sector_0_pointer_table_20_28" which expands on subsequent pointer blocks in the same formatted dump
```

## References
- "side_sector_0_pointer_table_18_20" — continuation of pointer table (offset .18 → .20)
- "side_sector_0_pointer_table_20_28" — subsequent pointer blocks in this formatted dump (offset .20 → .28)
