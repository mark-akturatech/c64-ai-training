# CLOSE (BASIC statement)

**Summary:** CLOSE file# — ensures DOS updates the BAM and directory entries on the 1541/Commodore drive; keep the error channel (channel 15) OPENed first and CLOSEd last. After a BASIC error that closes files at the BASIC level but not on the drive, run OPEN 15,8,15,"I" to reinitialize the drive.

## CLOSE statement
CLOSE file# causes the DOS on the disk drive to finish the directory entry and allocate blocks in the BAM (block availability map). If you do not CLOSE a file after writing, the directory entry and BAM will not be properly updated and you risk losing data.

FORMAT:
- CLOSE file#

Do not CLOSE the error channel (channel 15) before closing your data channels. Open the error channel first and CLOSE it last. That ordering prevents the drive from being left in a state where files are closed on the drive but still considered open by BASIC.

If you close the error channel while other files remain OPEN, the drive will close those files for you, but BASIC will still think the channels are open. That can allow your program to attempt writes to channels that BASIC believes are still valid even though the drive already closed them.

## Recovery after a BASIC error
If a BASIC program encounters an error, BASIC will CLOSE files at the BASIC level without instructing the drive to CLOSE them. The result is files that appear closed to BASIC but remain un-finalized on the disk (directory/BAM not updated). Immediately reinitialize the drive to make files safe:

- Run: OPEN 15,8,15,"I"

This reinitializes the drive and forces it to finalize any pending file operations.

## Source Code
```basic
CLOSE file$
CLOSE file#
OPEN 15,8,15,"I"
```

## Key Registers
- (none)

## References
- "directory_bam_and_listing" — expands on why CLOSE is required to update the BAM and directory entries