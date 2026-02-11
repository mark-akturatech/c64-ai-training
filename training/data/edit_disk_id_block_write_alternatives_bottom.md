# Alternate U2 Block-Write Formats (PRINT#15 Command Channel)

**Summary:** This document details the syntax variations for the block-write (U2) command issued to the Commodore 1541 disk drive's command channel using the `PRINT#15` statement in BASIC. It highlights differences in spacing after the colon and corrects typographical errors in the command examples.

**Alternate U2 Formats**

The U2 command is used to write a block of data from the drive's buffer to a specified track and sector on the disk. The general syntax for the U2 command is:

`PRINT#15, "U2:"; channel; drive; track; sector`

Where:

- **channel**: The logical file number of the open data channel.
- **drive**: The drive number (typically 0 for single-drive systems).
- **track**: The track number on the disk where the data will be written.
- **sector**: The sector number within the track where the data will be written.

In the provided BASIC listing, two variations of the U2 command are observed:

1. **With a space after the colon:**

   `PRINT#15, "U2: "; 2,0,18,0`

2. **Without a space after the colon:**

   `PRINT#15, "U2:2,0,18,0"`

Both formats are functionally equivalent and correctly instruct the disk drive to write the contents of the buffer associated with channel 2 to track 18, sector 0.

**Note:** The original source contained typographical errors in the first example, displaying `"2;o; ia;o"` instead of the correct `"2,0,18,0"`. These errors have been corrected in the examples above.

## Source Code

```basic
PRINT#15, "U2: "; 2,0,18,0

PRINT#15, "U2:2,0,18,0"
```

## References

- "edit_disk_id_write_and_finish_procedure" — expands on alternate U2 formats for the block-write in the write/finish step.
- "edit_disk_id_overview_and_block_write_alternatives_top" — overview referencing the same alternate formats.
