# Directory sector forward pointer, sector staggering, and file-type byte ($82) (C64 / 1541)

**Summary:** Explains the first-two-byte forward pointer (track/sector) at the start of a directory sector, the file-entry first byte (file-type, e.g., $82 = PRG), and notes on disk rotation/sector staggering (typical sector increment 10; directory staggered by 3), plus the example hex dump and the directory sector filling sequence (0 (BAM), 1, 4, 7, ...).

**Directory-sector forward pointer**

Each directory sector on Commodore DOS is chained: the first two bytes of the sector are the forward pointer to the next directory sector. Interpretation:

- Byte 0 = track number of the next directory sector.
- Byte 1 = sector number of the next directory sector.
- A track value of $00 typically means end of the directory chain.

This pointer forms a linked list of directory sectors. The DOS reads the forward pointer to find the next sector to continue reading directory file entries.

**File-entry file-type byte**

Within each file entry (the entry structure described by the disk/DOS), the first byte of the file entry is the file-type byte. Example in the provided dump shows $82, which DOS interprets as a Program file (PRG). The table of file-type codes (hex → directory display) is preserved in the Source Code section.

**Disk rotation and sector staggering**

Performance-oriented formatting of Commodore disks uses sector staggering to reduce head-wait time when reading/writing sequential sectors. The source notes:

- Typical sector increment (stagger) used on many formatted disks: increments of 10.
- Directory sectors are staggered differently; the directory is commonly staggered by 3.

These stagger values determine the logical sector order used when the disk is formatted; the directory sectors follow a specific filling order so that the DOS can traverse them efficiently given the drive head stepping and rotation behavior.

**Sector filling sequence (directory)**

The source lists the directory-sector filling sequence for a full directory (as given): start with sector 0 (BAM), then 1, 4, 7, ... (sequence continues according to the disk's stagger pattern). See Source Code for the exact referenced listing.

## Source Code

Corrected raw example dump:

```text
.  00:  12 04 82 11 00 48 4F 57  HOW
.  08:  20 54 4F 20 55 53 45 A0  TO USE
.  10:  A0 A0 A0 A0 A0 00 00 00
.  18:  00 00 00 00 00 00 0D 00
```

File-type table:

```text
HEX   ASCII  FILE TYPE          DIRECTORY SHOWS
$00   0      Scratched          Does not appear
$80   128    Deleted            DEL
$81   129    Sequential         SEQ
$82   130    Program            PRG
$83   131    User               USR
$84   132    Relative           REL
$00   0      Unclosed deleted   Same as scratched
$01   1      Unclosed sequential *SEQ
$02   2      Unclosed program    *PRG
$03   3      Unclosed user       *USR
```

Directory-sector filling example:

```text
Full directory sector sequence: 0 (BAM), 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33
```

## References

- "directory_sector_layout_table" — expands on location of the forward pointer in the directory sector
- "sample_directory_sector_raw_dump" — expands on example where bytes point to next directory block