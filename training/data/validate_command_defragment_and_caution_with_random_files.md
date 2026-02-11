# VALIDATE command (PRINT#15,"VALIDATE" or "V")

**Summary:** VALIDATE (sent with PRINT#15) reorganizes a disk directory to reclaim fragmented small gaps and collects blocks from files that were OPENed but never properly CLOSED; do not use on disks containing random-access files because VALIDATE deallocates blocks used by random files.

## Description
VALIDATE reorganizes a diskette's directory to consolidate free space left by repeated SAVE and SCRATCH operations. It also scans for files that were left OPEN but not properly CLOSED and frees the blocks those unusable files occupy, returning them to the drive's free-space pool.

Behavioral notes:
- Reclaims many small unused gaps ("a block here and a few blocks there") so they can be reused for new files.
- Collects and deallocates blocks from improperly closed (OPENed) files.
- Dangerous for disks using random files (random-access files): VALIDATE will deallocate blocks that random files rely on, so it must not be run on disks containing random files.

FORMAT:
- The command is sent to the disk drive command channel (channel 15).

## Source Code
```basic
PRINT#15,"VALIDATE"
PRINT#15,"V"
```

## References
- "block_allocate_and_error_handling" — expands on how VALIDATE can affect blocks allocated for random files