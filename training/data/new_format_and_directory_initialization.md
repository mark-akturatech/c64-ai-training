# NEW — Format or Clear Disk (PRINT#15)

**Summary:** Describes the disk drive NEW command (PRINT#15,"NEW:name,id" or "N:name,id") used to format a disk by creating timing/block markers, the BAM and directory (track 18), or to clear the directory of an already-formatted disk; explains disk name and 2-character ID placement.

## Command purpose and behavior
The NEW command is used when initializing a diskette or when you want to clear an existing directory without reformatting the entire disk.

- Formatting: NEW erases the diskette, writes timing and block markers, and creates the directory and the BAM (Block Availability Map). The BAM and directory structures are initialized on track 18.
- Clearing directory: NEW may also be used to clear the directory of an already-formatted disk (fast alternative to full reformat).
- Disk name: The name specified is stored as the disk's volume name and appears when the directory is listed.
- ID code: A two-character ID is written into the directory and also recorded on every block throughout the disk. This ID allows the drive or software to detect mismatched disks (for example, accidental disk replacement while writing).

(PRINT#15 is the serial device channel used to send commands to the disk drive.)

## Source Code
```basic
PRINT#15, "NEW:name,id"   ' Format disk: creates timing/block markers, BAM and directory
PRINT#15, "N:name,id"     ' Abbreviation: same as NEW

PRINT#15, "N:name"        ' Clear directory only (for an already-formatted disk)
```

## References
- "bAm_directory_and_file_format_tables" — expands on how NEW initializes the BAM and directory structures on track 18
