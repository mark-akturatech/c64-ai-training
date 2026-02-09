# CERTIFY — annotated BASIC line-range map (BAM, buffer, block-allocate, error handling)

**Summary:** Mapping of Commodore 64 BASIC line ranges in the CERTIFY program showing where the BAM image is stored/restored ($0700-$07A0), worst-case buffer writes at $0400-$04FF, block-allocate commands (PRINT#15 "B-a"/"B-A"), error-array and bad-sector allocation, and the job-queue lines (1020-1230). Mentions compensation for a block-allocate bug (store/restore BAM).

## Line range map
This chunk lists what each BASIC line range in CERTIFY does. Keep these exact ranges for quick code navigation and automated indexing.

- 330-380 — Store the BAM image from disk into C64 RAM ($0700-$07A0).
- 390-440 — Query DOS version (open/print channel to disk drive).
- 460-500 — Write a worst-case binary pattern into the buffer at $0400.
- 510-540 — Initialize track, sector, and loop/counters for certification.
- 550 — Issue block-allocate command to the drive (PRINT#15 "B-a: " ; o; t; s).
- 700 — Write worst-case binary pattern at $0400-$04FF to a deallocated track/sector.
- 710 — Query the drive's error channel for the preceding operation.
- 720-740 — Build/maintain an error array (list of failed sectors).
- 800-890 — Restore the BAM (write the in-RAM BAM image back to the disk).
- 960-980 — Allocate any bad sectors recorded in the error array (block-allocate for bad sectors).
- 1020-1230 — Job queue and subroutines (not expanded here; referenced to other chapter/notes).

Notes:
- Lines 330-380 (store BAM) and 800-890 (restore BAM) deliberately compensate for a known block-allocate bug in the drive firmware by saving the BAM to RAM and restoring it after block-allocate operations.
- Lines 960-980 operate on the error array created in 720-740 to mark sectors as allocated (bad) on the disk.
- The block-allocate commands have alternate textual formats used in the program (see Source Code). The second shown alternate appears corrupted in the source; see note below.

## Source Code
```text
Line Range -> Action
330-380    Store the BAM ($0700 - $07A0) into C64 RAM
390-440    Query DOS version
460-500    Write worst-case binary pattern to buffer at $0400
510-540    Initialize track, sector, and counters
550        Block-allocate command (drive)
700        Write worst-case binary pattern at $0400-$04FF to a deallocated track/sector
710        Query error channel
720-740    Error array
800-890    Restore the BAM
960-980    Allocate any bad sectors in error array
1020-1230  Job queue and subroutines (detailed elsewhere)
```

```basic
550 PRINT#15, "B-a: " ; o; t; s
```

```basic
970 PRINT#15, "B-A: " ; O; TV.  ( I > ; S% < I >
```
**[Note: Source may contain an error — the second PRINT#15 line (line shown for 970) appears corrupted/garbled in the original text and is likely an alternate case of the block-allocate command.]**

## Key Registers
- $0700-$07A0 - C64 RAM - BAM image storage area (in-RAM copy of disk BAM)
- $0400-$04FF - C64 RAM - worst-case binary pattern buffer used for write/read verification

## References
- "read_bam_and_dos_check" — expands on the BAM-store and DOS version check referenced in lines 330-440
- "buffer_init_certify_loop_and_restore_bam" — expands on the certification loop, buffer writes, and BAM restore behavior described across multiple line ranges
- "job_queue_and_subroutines" — expands on the job-queue logic (lines 1020-1230)