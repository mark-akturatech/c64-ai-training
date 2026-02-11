# DOS Error Messages 50–74 (CBM DOS / 1541)

**Summary:** CBM DOS error messages 50–74 from the 1541/CBM DOS family, covering record/relative-file errors (50–52), file open/lookup errors (60–64), block/track errors (65–67), channel limits (70), directory/BAM and disk capacity errors (71–72), DOS-format incompatibility (73), and drive readiness (74).

**Errors 50–74**

50: RECORD NOT PRESENT — Disk read attempted past the last record via INPUT# or GET#. Also occurs when positioning beyond EOF in a relative file. If the intent is to expand the file with a subsequent PRINT#, the error may be ignored; do not attempt INPUT or GET again without repositioning first.

51: OVERFLOW IN RECORD — A PRINT# has exceeded the defined record size; data is truncated. The terminating carriage return is counted as part of the record length, so overflow occurs if total characters including that CR exceed the record size.

52: FILE TOO LARGE — The relative-file record position indicates that writing would overflow disk capacity (disk overflow would result).

60: WRITE FILE OPEN — Attempted to open a file for reading while it is already open for writing and not yet closed.

61: FILE NOT OPEN — An attempt to access a file that has not been opened through DOS. In some cases the request is simply ignored rather than generating this message.

62: FILE NOT FOUND — The requested file name does not exist on the specified drive.

63: FILE EXISTS — Attempt to create a file using a name that already exists on the disk.

64: FILE TYPE MISMATCH — Requested operation’s file type does not match the file type stored in the directory entry.

65: NO BLOCK — Occurs in conjunction with the B-A (block allocate) command; indicates the attempted block to allocate was already allocated. The error’s numeric parameters indicate the track and sector of the next higher-numbered available block. If both parameters are zero (0), no higher-numbered blocks are available.

66: ILLEGAL TRACK AND SECTOR — DOS attempted to access a track or sector that does not exist in the disk format in use (may indicate a corrupted pointer to the next block).

67: ILLEGAL SYSTEM T OR S — Error indicating an illegal system track or sector was referenced.

70: NO CHANNEL (available) — The requested I/O channel is not available because the DOS channel limit has been reached. Maximums: up to five sequential files open simultaneously; direct-access channels may allow six open files.

71: DIRECTORY ERROR — The BAM (Block Availability Map) in memory does not match internal block counts; the BAM allocation is corrupted or has been overwritten. Correction requires reinitializing the diskette to restore the BAM in DOS memory; this may terminate some active files. NOTE: BAM = Block Availability Map.

72: DISK FULL — Either no free blocks remain or the directory has reached its entry limit. On the 1541, DISK FULL is reported while two blocks remain to permit the current file to be closed.

73: DOS MISMATCH — CBM DOS versions 1 and 2 are read-compatible but not write-compatible. A disk formatted under one DOS version cannot be safely written by the other; DOS MISMATCH is displayed when a write is attempted on a disk formatted in a non-compatible DOS (CBM DOS V2.6 mention for 1541). This message can also appear after power-up.

74: DRIVE NOT READY — Attempted access to a 1541 drive when no diskette is present (drive not ready).

## References

- "index_section" — expands on index and cross-references for error messages
- "bam_format_1541" — expands on Directory Error (71) and details of the Block Availability Map (BAM)