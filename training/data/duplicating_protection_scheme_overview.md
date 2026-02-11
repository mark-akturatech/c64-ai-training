# Duplicating a Protection Scheme (Disk Errors 20–29, supplied duplication programs)

**Summary:** This document provides a rank order and descriptions of common copy-protection disk errors (21, 23, 20, 27, 29, 22), historical notes, and a catalogue of 13 supplied programs for creating or duplicating these error types. Programs include DESTROY A SECTOR, FULL TRACK, 23A/23B/23M, 20/20M, 27M, 22A/22B, FORMAT A DISKETTE 29, BACKUP, and COPY. An asterisk (*) denotes an exact duplicate of a bad sector.

**Rank order of error types**

The rank order in which errors commonly appear on copy-protected diskettes:

1. **21 ERROR (FULL TRACK)**  
2. **23 ERROR (SINGLE SECTOR)**  
3. **23 ERROR (FULL TRACK)**  
4. **20 ERROR (SINGLE SECTOR)**  
5. **27 ERROR (FULL TRACK)**  
6. **29 ERROR (MULTIPLE FORMATTING)**  
7. **22 ERROR (SINGLE SECTOR)**  
8. **21 ERROR (PARTIAL TRACK)**

**Historical notes**

- Historically, the 21 error (full-track) and the 29 error (multiple formatting/formatting-ID tricks) appeared concurrently.
- Currently, the two predominant protection errors used to corrupt a diskette are the 21 full-track error and the 23 single-sector error; these are also the easiest to duplicate.
- Partial-track formatting (a 21 partial-track variant) is noted as a newer technique.

**Supplied programs (catalogue)**

Thirteen programs are supplied to create or duplicate a variety of disk errors. Program names and their corresponding error numbers and ranges are as follows:

- **DESTROY A SECTOR**  
  - *Error Number:* 21  
  - *Error Range:* FULL TRACK

- **FULL TRACK**  
  - *Error Number:* 21  
  - *Error Range:* FULL TRACK

- **23A ERROR**  
  - *Error Number:* 23  
  - *Error Range:* SINGLE SECTOR

- **23B ERROR**  
  - *Error Number:* 23  
  - *Error Range:* SINGLE SECTOR

- **23M ERROR**  
  - *Error Number:* 23  
  - *Error Range:* SINGLE SECTOR  
  - *Note:* Creates an exact duplicate of a bad sector.

- **20 ERROR**  
  - *Error Number:* 20  
  - *Error Range:* SINGLE SECTOR

- **20M ERROR**  
  - *Error Number:* 20  
  - *Error Range:* SINGLE SECTOR  
  - *Note:* Creates an exact duplicate of a bad sector.

- **27M ERROR**  
  - *Error Number:* 27  
  - *Error Range:* FULL TRACK  
  - *Note:* Creates an exact duplicate of a bad sector.

- **22A ERROR**  
  - *Error Number:* 22  
  - *Error Range:* SINGLE SECTOR

- **22B ERROR**  
  - *Error Number:* 22  
  - *Error Range:* SINGLE SECTOR  
  - *Note:* Creates an exact duplicate of a bad sector.

- **FORMAT A DISKETTE**  
  - *Error Number:* 29  
  - *Error Range:* MULTIPLE FORMATTING ID'S

- **BACKUP**  
  - *Error Number:* N/A  
  - *Error Range:* SINGLE DRIVE BACKUP

- **COPY**  
  - *Error Number:* N/A  
  - *Error Range:* SINGLE FILE COPY

*Note:* An asterisk (*) denotes that the program creates an exact duplicate of a bad sector.

## References

- "create_21_full_track" — expands on program to create a full-track 21 error
- "create_23_single_sector" — expands on programs to create 23 errors
