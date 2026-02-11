# Sector header — directory dump (TRACK 18 / SECTOR 01)

**Summary:** Textual sector header marking a Commodore 1541 directory sector: "TRACK 18" and "-  SECTOR  01" indicate the dump that follows is directory data from Track 18, Sector 1 (first directory sector). Searchable terms: Track 18, Sector 01, directory sector, 1541, BAM.

## Description
This chunk is the textual header and surrounding spacing that appears immediately before the raw directory sector data in a disk directory dump. It identifies the following data as belonging to Track 18, Sector 1.

On Commodore 1541-format disks, Track 18 holds the disk directory and the Block Availability Map (BAM). Sector 0 on track 18 normally contains the BAM and disk ID; directory entries begin at sector 1 and continue across subsequent directory sectors. This header therefore marks the first directory sector in the dump.

The header text and spacing are preserved verbatim to help locate and align the raw sector bytes that follow in the dump file.

## References
- "directory_entry_00-18_first_directory_entry" — expands on first directory entry data (offsets 00: through 18:)
