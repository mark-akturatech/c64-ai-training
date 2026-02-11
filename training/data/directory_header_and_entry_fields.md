# Directory header and entry structure (drive number, disk name, ID, DOS indicator, entry fields)

**Summary:** Explains C64/Commodore disk directory header fields (leading drive number, 16‑char diskette name padding, two‑character disk ID, DOS version/format indicator such as "2A") and the three fields present in each directory entry: blocks used, filename, and file type.

## Directory header fields
- Leading digit (e.g. "0"): the drive number accessed (legacy from dual‑drive systems such as the 4040).  
- Diskette name: a 16‑character field. If the logical name is shorter, ASCII space characters are appended (padding) to fill 16 bytes. The printed name in the directory is this padded field.  
- Disk ID: two characters following the name; cosmetic, usually the original format ID assigned when the disk was formatted. Not required for filesystem operation.  
- DOS/version indicator (e.g. "2A"): a short code printed after the ID that identifies the DOS version/format (legacy holdover indicating specific controller/format, e.g. 4040 compatibility in many listings).

These header fields are presentation items shown at the top of a directory listing; the true on‑disk structures (BAM, directory blocks) are separate.

## Directory entry fields
Each active directory entry (one per file) contains three displayed fields:
1. Number of blocks (sectors) the file occupies — used to compute storage used/free on the disk (display uses this count; BAM holds authoritative allocation info).  
2. File name — the file's name as stored in the directory entry.  
3. File type — the file type/flags (PRG, SEQ, REL, etc.) as recorded in the directory entry.

These three fields are the user‑visible components per directory entry in the standard Commodore directory display.

## References
- "example_directory_listing_output" — expands on the sample listing that uses these header fields and entry fields  
- "active_files_and_blocks_free_calculation" — expands on uses of the entry block counts to compute blocks free  
- "display_vs_on_disk_and_bam_intro" — notes that the displayed directory is a presentation and introduces the BAM as the on‑disk structure to be examined next
