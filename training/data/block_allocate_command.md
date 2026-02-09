# Block-Allocate (B-A) Command

**Summary:** Describes the CBM DOS Block-Allocate (B-A) command that marks a disk sector as "in use" in the BAM by clearing its bit (set to 0) at track 18, sector 0; syntax uses the C64/CBM PRINT# channel form (e.g., `PRINT#15,"B-A";0;1;7`). Notes valid drive/track/sector ranges and cautions that DOS normal writes (SAVE) will skip allocated sectors but direct block-write (U2) can overwrite them.

**Description**

The Block-Allocate (B-A) command sets a sector's BAM bit low (0) — i.e., marks it as allocated — in the BAM located on track 18, sector 0. The DOS will avoid writing to sectors flagged as allocated during normal DOS-managed writes (for example, SAVE). However, allocated sectors are not physically write-protected: a direct-access block-write (the U2 command) can overwrite them, which is why B-A is considered a direct-access operation.

Valid parameter ranges:
- **drive** = 0 (drive number field in the command)
- **track** = 1 to 35
- **sector** = 0 to the maximum sector number for the specified track (track-dependent sector counts)

The command has two textual forms (semicolon-separated or colon-terminated) accepted by the DOS command channel.

**Usage**

- **Primary effect:** Flip the BAM bit for the specified track/sector to 0 (allocated).
- **Consequence:** Prevents DOS-managed writes from using the sector; direct block-write (U2) can still overwrite the sector.
- **The command modifies the on-disk BAM entry (track 18, sector 0).** See Chapter 4 for BAM bit-to-sector mapping details.

Do not attempt to use B-A on production disks without a full understanding of the BAM layout and directory implications — allocated sectors removed from DOS's free pool can corrupt file allocation/directory consistency if used incorrectly.

## Source Code

```basic
' Syntax forms
' PRINT# file#, "B-A"; drive#; track; sector
' PRINT# file#, "B-A:"; drive#; track; sector

' Example (allocate track 1, sector 7 on drive 0 using channel 15)
PRINT#15, "B-A";0;1;7

' Program to allocate every sector on a diskette
10 OPEN 15,8,15
20 FOR T = 1 TO 35
30   FOR S = 0 TO (21 - (T > 17) - (T > 24) - (T > 30))
40     PRINT#15, "B-A";0;T;S
50     INPUT#15, EN, EM$, ET, ES
60     IF EN <> 0 THEN PRINT "Error allocating T=";T;" S=";S;" : ";EM$
70   NEXT S
80 NEXT T
90 CLOSE 15
```

## References

- "block_allocate_program" — expands the example into a full program that allocates every sector on a diskette
- "bam_and_bam_handling_notes" — expands on BAM handling caveats and directory implications