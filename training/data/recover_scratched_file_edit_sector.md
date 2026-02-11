# Recovering a Scratched Directory Entry with EDIT TRACK & SECTOR (Track 18)

**Summary:** This procedure outlines the steps to recover a scratched directory entry on Commodore 1541-format disks using the EDIT TRACK & SECTOR utility. By accessing track 18 and the appropriate sector, you can locate the scratched file's directory entry, restore its file type, and validate the disk to ensure successful recovery.

**Procedure**

1. **Prepare**
   - Load and run the EDIT TRACK & SECTOR program from the diskette containing the scratched file.

2. **Select Track and Sector**
   - When prompted, enter track 18.
   - Determine the sector number corresponding to the directory entry slot of the scratched file using the following table:

     | Directory Entry Slot | Sector Number |
     |---------------------|---------------|
     | 1–8                 | 1             |
     | 9–16                | 2             |
     | 17–24               | 3             |
     | 25–32               | 4             |
     | 33–40               | 5             |
     | 41–48               | 6             |
     | 49–56               | 7             |
     | 57–64               | 8             |
     | 65–72               | 9             |
     | 73–80               | 10            |
     | 81–88               | 11            |
     | 89–96               | 12            |
     | 97–104              | 13            |
     | 105–112             | 14            |
     | 113–120             | 15            |
     | 121–128             | 16            |
     | 129–136             | 17            |
     | 137–144             | 18            |

     Each sector contains 8 directory entries, so calculate the sector number by dividing the directory entry slot number by 8 and rounding up.

   - When prompted for the starting byte, enter:
     - `00` — if the scratched file entry is one of the first four in that half-sector group
     - `80` — if the scratched file entry is one of the last four in that group

3. **Locate File Entry and File-Type Byte**
   - A hex dump of the half-sector appears: the display shows three columns of hexadecimal bytes on the left and ASCII on the right.
   - Move the cursor to the third column of hexadecimal numbers and find the filename in the ASCII column on the right.
   - Move the cursor down so it is on the same row as the start of the filename. That row will be aligned to one of these offsets: `$00`, `$20`, `$40`, `$60`, `$80`, `$A0`, `$C0`, or `$E0` (start of each directory entry within the half-sector).
   - The byte under the cursor (first byte of the directory entry) is the file-type byte. For a scratched file, it will be `$00`.

4. **Restore the Correct File-Type**
   - Type over the `$00` with the correct file-type value:

     | File Type | Value |
     |-----------|-------|
     | PRG       | $82   |
     | SEQ       | $81   |
     | REL       | $84   |
     | USR       | $83   |
     | DEL       | $80   |

   - Terminate edit mode by holding `SHIFT` and pressing `CLR/HOME`.
   - When prompted whether to rewrite the track and sector, press `Y`. The modified sector will be written to disk.

5. **Check Directory Listing**
   - Enter the following commands to check if the filename appears in the directory:

   - If the filename does not appear, you likely made a mistake; do not continue write operations until the error is understood.

6. **Validate the Disk**
   - In direct mode, enter:

   - If the drive halts and the error light is not flashing, the sector rewrite succeeded, and the file recovery was successful.
   - If VALIDATE fails, consult additional sections on errors (see cross-references).

7. **Practice First**
   - It is recommended to practice on a test disk: SAVE a file, SCRATCH (delete) it, then attempt recovery following the above steps.

## Source Code

     ```basic
     LOAD "$",8
     LIST
     ```

     ```basic
     OPEN 15,8,15,"V0":CLOSE 15
     ```

```text
File type values (use as the single-byte file-type value in the directory entry):

PRG  — $82
SEQ  — $81
REL  — $84
USR  — $83
DEL  — $80
```

```basic
' Validate command to run in direct mode after rewrite:
OPEN 15,8,15,"V0":CLOSE 15
```

```text
Directory-entry row offsets within a half-sector (start bytes you will land on):
$00, $20, $40, $60, $80, $A0, $C0, $E0
(These are the byte offsets shown at left of the hex dump; the file-type byte is at the entry's first byte.)
```

**[Note: Source may contain an error — original text shows an isolated "174" with no label; that value is not assigned here.]**

## References

- "track18_directory_sector_table" — expands on the Sector lookup table referenced when entering the sector number
- "recovering_unclosed_file" — expands on link-fixing steps needed when recovering PRG/other file types (unclosed file/relinked sectors)
