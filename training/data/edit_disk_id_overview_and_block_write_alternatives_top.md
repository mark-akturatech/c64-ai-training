# EDIT DISK ID — Line-range summary

**Summary:** Line-range summary for the "EDIT DISK ID" BASIC program describing operations on logical file 2 (GET#2 / PRINT#2, channel 2), the block-write (U2) command to the 1541 (track 18, sector 0), and updating the BAM at $0700-$07FF.

## Line-range overview
- 280 — Open logical file number 2 for device 8 with secondary address 2 (uses GET#2, PRINT#2). This lets the 1541 assign a buffer area (channel 2).
- 310–380 — Query DOS version (drive/1541 DOS version check).
- 550 — Pad the new diskette name (ensure correct length/format for the disk header).
- 560 — Reset channel 2 file pointer to byte position 144 (prepare buffer offset for disk header overwrite).
- 570 — Overwrite the existing disk name inside channel 2's buffer area (modify the in-memory disk header buffer).
- 580 — Issue block-write (U2) to write channel 2 buffer to drive 0, track 18, sector 0 (this writes the modified disk header back to disk).
- 660 — Update the BAM in memory ($0700-$07FF) so the disk allocation map reflects the disk name change.

Notes:
- The block-write command referenced at line 580 is the U2 (block program write via channel 2) to the 1541; the listing shows alternate ASCII formats for the U2 command.
- "Channel 2" here refers to the Commodore logical file secondary address assigned to the drive buffer, not a VIC/CIA register.

## Source Code
```basic
PRINT#15, "U2: "2;0; 18; O
PRINT#15, "U2:2,0,  18,  O"
```

## Key Registers
- $0700-$07FF - RAM - BAM (Block Availability Map) — updated to reflect disk name change

## References
- "edit_disk_id_initialization_and_drive_check" — expands on program start, user prompts, and initial DRIVE 0 / channel 15 check
- "edit_disk_id_block_write_alternatives_bottom" — expands on additional alternate U2 command formats shown at the end of the listing

## Labels
- BAM
