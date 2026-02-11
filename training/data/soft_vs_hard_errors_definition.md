# Soft vs Hard Read/Write DOS Errors (byRiclianII)

**Summary:** Classification of C64 DOS read/write errors into hard errors (header-block failures, unrecoverable) and soft errors (data-block failures, sometimes recoverable). Lists error codes (e.g. $20/$21/$22/$23 read errors) and describes two recovery utilities: RECOVER TRACK & SECTOR and LAZARUS.

## Error classification and consequences
A hard error is a read/write error that occurs in a header block. Header blocks are never rewritten after initial formatting; therefore any data in a sector whose header block is damaged is unrecoverable. If a header block is corrupted, the forward pointer is lost and the remainder of the file is effectively lost as well.

A soft error is a read/write error that occurs in a data block. Data blocks can be rewritten, so a soft error can sometimes be recovered provided the diskette is not physically damaged or fundamentally flawed. Recovery is not guaranteed.

The following table shows which reported read errors are treated as soft vs hard in the DOS error taxonomy given here:

- Soft Errors
  - 22 Read Error
  - 23 Read Error
  - 27 Read Error
  - 29 Read Error

- Hard Errors
  - 20 Read Error
  - 21 Read Error

Note: recovery is only possible for soft errors; a damaged header block (hard error) makes the affected sector and subsequent file data unrecoverable.

## Recovery utilities (Appendix C)
Two utilities referenced for attempting recovery are:

- RECOVER TRACK & SECTOR
  - Attempts to rewrite a damaged sector (used for soft errors in data blocks).
  - No guarantee of success; depends on whether the medium is physically capable of accepting a rewrite.

- LAZARUS
  - Attempts to resurrect an entire diskette.
  - Produces a status report listing the number of read errors encountered and the number of write errors that occurred during recovery.
  - A write error reported by LAZARUS indicates that a previously-encountered soft error was actually unrecoverable (a hard error in disguise).

## References
- "recovering_hard_error" — expands on procedures when an error is identified as a hard error
- "recovering_soft_error" — expands on using RECOVER TRACK & SECTOR or LAZARUS (Appendix C) to attempt recovery