# Block Availability Map (BAM) — directory vs on-disk

**Summary:** The textual directory displayed on-screen is not necessarily the same as the directory structures stored on the disk; the Block Availability Map (BAM) is the on-disk structure that records which disk blocks are free or used and is used to compute "blocks free". Searchable terms: Block Availability Map, BAM, directory, on-disk, diskette.

## Overview
What you see on your screen (the printed/text directory) is a presentation layer and may differ from the actual on-disk layout. The Block Availability Map (BAM) is the disk-resident allocation map that tracks free and used blocks (i.e., which sectors/tracks are available). The BAM is the authoritative structure the system consults to determine free space and to allocate or free blocks for files.

## References
- "directory_header_and_entry_fields" — contrasts on-screen directory fields with on-disk directory structures  
- "active_files_and_blocks_free_calculation" — expands on how the BAM is used to compute 'blocks free' and track file block usage  
- "example_directory_listing_output" — example of the displayed listing whose on-disk representation is explored via the BAM