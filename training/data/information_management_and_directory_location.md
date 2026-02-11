# Diskette Organization — DOS Information Management (Track 18, BAM, Directory)

**Summary:** DOS must track free vs used sectors, assign names/locations to files, and follow sector chains (file allocation). On the Commodore disk DOS stores the Block Availability Map (BAM) at track 18, sector 0 and directory entries in track 18 sectors 1–18 to minimize head movement.

## Overview
The DOS must provide three core information-management functions:
1. Track which sectors contain data and which are free (availability).
2. Assign names and storage locations to files (file metadata).
3. Track the sequence of sectors that compose each file (sector chains).

To centralize and speed access, DOS places its directory structures on track 18 (midway between outermost track 1 and innermost track 35). Centering the directory reduces head travel and wear on drive and media.

## Directory and BAM layout
- Track 18 is subdivided into a map area and directory-entry area.
- Sector 0 of track 18 contains the Block Availability Map (BAM). The BAM records which sectors are currently in use and which are available for writing; it is consulted when allocating space for new data.
- Sectors 1–18 of track 18 contain directory entries. Each directory entry holds file metadata such as file name, file type, and pointers to the sectors (sector-chain) where the file's data is stored.

## References
- "bam_sector_dump_and_overview" — expands on BAM layout and example dump
- "directory_entries_overview_and_track18_sector1_example" — expands on directory entries layout and example (track 18 sector 1)