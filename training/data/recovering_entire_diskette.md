# 8.5 Recovering an Entire Diskette

**Summary:** Steps for using the 1541 BACKUP program, DISPLAY A CHAIN, and EDIT TRACK & SECTOR to recover a diskette that cannot be initialized; covers behavior on hard errors on track 18 (track/sector chain relinking), VALIDATE, and copying intact files to a new disk.

**Procedure**
- **Applicability:** Only use when the diskette cannot be initialized.
- **Make a backup:** Run the 1541 BACKUP program (see chapter 7, section 7.15) to create a backup image of the damaged diskette.
- **Inspect the backup directory:**
  - Load and list the directory on the backup.
  - If the directory lists normally, run VALIDATE on the backup.
    - If VALIDATE succeeds, the backup is usable.
    - If VALIDATE fails, manually inspect the backup and copy each intact file to a new disk; some files may be lost.
- **If the directory cannot be fully displayed (hard error encountered during backup on track 18):**
  - The hard error indicates a sector on track 18 could not be copied, and the backup's directory is corrupt.
  - Load and run DISPLAY A CHAIN on the backup. Attempt to follow the directory chain starting at track 18, sector 1.
    - DISPLAY A CHAIN will abort when it reaches the uncopyable sector; the abort location identifies the bad sector.
  - Run EDIT TRACK & SECTOR on the backup to relink the directory chain around the bad sector.
    - Consult the sector ordering table below to determine which sector normally follows the problematic sector when relinking.
    - Relinking the chain will discard pointers to up to eight files (those whose directory entries pointed into the lost sector).
  - After relinking, list the directory. Inspect and copy all remaining (intact) files from the repaired backup to a new diskette.

**Track 18 Sector Ordering Table**

Track 18 of a Commodore 1541 diskette contains 19 sectors, numbered 0 through 18. The directory structure typically uses an interleave of 3, meaning each directory sector points to the sector three positions ahead in the sequence. This interleave pattern helps optimize disk access times. The standard sector ordering for track 18 is as follows:

| Sector Number | Next Sector in Chain |
|---------------|----------------------|
| 1             | 4                    |
| 4             | 7                    |
| 7             | 10                   |
| 10            | 13                   |
| 13            | 16                   |
| 16            | 2                    |
| 2             | 5                    |
| 5             | 8                    |
| 8             | 11                   |
| 11            | 14                   |
| 14            | 17                   |
| 17            | 3                    |
| 3             | 6                    |
| 6             | 9                    |
| 9             | 12                   |
| 12            | 15                   |
| 15            | 18                   |
| 18            | 0                    |
| 0             | End of Chain         |

This table indicates the sequence in which directory sectors are linked on track 18. When relinking the directory chain around a bad sector, use this ordering to determine the appropriate sector to link to next.

## References
- "1541_BACKUP_program" — backup program and usage (chapter 7, section 7.15)
- "track18_directory_sector_table" — sector ordering for track 18 directory chains (section 8.1)
- "recovering_physically_damaged_diskette" — physical-damage recovery steps and precautions
