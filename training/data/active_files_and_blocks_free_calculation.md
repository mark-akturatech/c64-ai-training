# Directory summary — 15 PRG files, 558 BLOCKS FREE (664 formatted blocks)

**Summary:** Directory listing shows 15 active files (all PRG) and a final line reporting free blocks. The "558 BLOCKS FREE" equals the formatted capacity (664 blocks) minus the sum of blocks used by the active files (664 − 106 = 558).

## Explanation
- The demo disk contains 15 active directory entries; each is a program file (type "PRG").
- The directory's last line displays the remaining available blocks on the disk for storage.
- Computation shown on the directory: formatted capacity = 664 blocks; blocks used by active files = 106; therefore free blocks = 664 − 106 = 558.

## References
- "example_directory_listing_output" — shows where "15 active files", "PRG" types, and "558 BLOCKS FREE." appear in the directory output  
- "directory_header_and_entry_fields" — expands on per-file directory entry fields that contain the block counts used in the calculation  
- "display_vs_on_disk_and_bam_intro" — introduces on-disk structures (BAM) that record free/used blocks and how they relate to the displayed free-block count