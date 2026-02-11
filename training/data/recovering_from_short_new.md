# Recovering from a Short NEW (zeros BAM and track 18 sector 1)

**Summary:** Short NEW zeros the BAM and directory header (track 18, sector 1). Recovery uses EDIT TRACK & SECTOR to restore the forward track/sector pointer, DISPLAY A BLOCK AVAILABILITY MAP (Appendix C) and DISPLAY A CHAIN to locate file chains, and careful reconstruction of track 18/sector 1 entries.

## Recovery steps (quick)
1. A short NEW zeros the BAM and track 18, sector 1 (directory header). Run the EDIT TRACK & SECTOR utility on the affected disk.
2. In EDIT TRACK & SECTOR, call up track 18, sector 1 and change the forward track/sector pointer from $00,$FF to $12,$04.
3. Load and LIST the directory. Files beyond the first eight (i.e., directory entries 9+) will appear; the first eight directory entries are effectively lost for now.
4. Do NOT VALIDATE the diskette if you only need to copy the visible files — the directory sectors will not be reallocated. Copy all visible files to a new diskette.

## Recovering the first eight (lost) files — detailed
1. If the first eight files are required, you must locate their starting track/sector entries manually.
2. Prepare a sector grid (a worksheet with a cell for every track/sector on the disk) to mark usage as you discover it.
3. VALIDATE the original diskette (this step is required for the next tool to display accurate allocation), then run the DISPLAY A BLOCK AVAILABILITY MAP program (Appendix C). Mark on your sector grid which sectors are in use by other files. You should see a blank area centered around track 18 where the lost files likely resided.
4. Run the DISPLAY A CHAIN program. Record each chain it reports on your grid. Typical starting points for chains belonging to the missing files are near track 17 sector 0 or track 19 sector 0; work outward from track 18 until you have located chains for all eight missing files.
5. Once you have determined plausible starting track/sector values for the missing files, use EDIT TRACK & SECTOR to reconstruct track 18, sector 1 (the directory header). Use the tables and hex dumps from Chapter 4 as a template, but substitute the starting track/sector values you discovered (do NOT blindly use example values from the manual).
6. After rebuilding track 18, sector 1 with the correct starting pointers, copy the recovered eight files onto another disk.
7. When finished, retain copies and consider archival backups.

## References
- "track18_directory_sector_table" — tables and hex dumps for reconstructing track 18 sector 1 (Chapter 4)
- "recovering_entire_diskette" — procedures for copying recovered files and full-disk recovery workflows