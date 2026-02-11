# Diskette Formatting (NEW) — Tracks, Sectors, Directory, BAM

**Summary:** Describes the C64 floppy "NEW" (format) process: the DOS NEW command writes 35 concentric tracks with varying sector counts, creates a directory and the Block Availability Map (BAM) recorded on track 18, and establishes sectors composed of a header block and a data block.

## Formatting overview
A fresh floppy diskette is blank and must be formatted before use. The DOS NEW command formats the disk by writing 35 concentric tracks to the media. Each track is divided into a sequence of sectors/blocks (the number of sectors varies by track). Formatting lays down these empty sectors/blocks and initializes the filesystem structures needed for later file storage.

During formatting the DOS also creates and records:
- The directory (file entries) 
- The Block Availability Map (BAM), which tracks free/used blocks

Both the directory and the BAM are recorded on track 18 of the formatted disk.

Each sector written during formatting consists of two parts:
- A header block (sector identification and control information)
- A data block (the actual sector payload for file or filesystem data)

This chapter gives a high-level description of the formatting process and the basic organization of tracks and sectors on the diskette. Detailed structures for the directory, BAM, header blocks, and data blocks are covered in separate sections.

## References
- "layout_of_tracks_and_sectors" — detailed track and sector organization
- "header_block_structure_and_fields" — header block contents and fields
- "data_block_structure_and_fields" — data block layout and fields