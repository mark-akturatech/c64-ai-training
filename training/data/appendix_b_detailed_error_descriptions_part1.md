# DOS Error Messages (Commodore 1541 / Drive DOS)

**Summary:** Descriptions and causes for Commodore DOS error codes 20–39 (read/write errors: header, sync, data, checksum, decode, write-protect, ID mismatch; and syntax/file errors). Includes causes and suggested diagnostics for each listed code. (Ignore error numbers <20 except 01.)

## Overview
This chunk enumerates DOS error messages as returned by 1541-style drive DOS, with concise causes and suggested diagnostics. Codes below identify physical-media/drive problems (20–29) and command/syntax/file-name problems (30–39). The source text provided is explicit for 20–39; entries for 50–74 are referenced but not present in the supplied source. 

**[Note: Source may be truncated — definitions for 50–74 are not included in the provided text.]**

## Read / Write error codes (20–29)
20: READ ERROR (block header not found)
- Meaning: Controller cannot find the header of the requested data block.
- Causes: Illegal block number requested; header destroyed or unreadable.
- Diagnostics: Verify track/block numbers used by the request; try VALIDATE or BLOCK command diagnostics; inspect disk surface for damage.

21: READ ERROR (no sync character)
- Meaning: Controller failed to detect a sync mark (start-of-sector marker) on the track.
- Causes: Read/write head misalignment, no diskette present, unformatted or improperly seated disk, or hardware failure.
- Diagnostics: Check disk insertion and format; reseat disk; try another known-good disk; check drive head alignment and drive electronics.

22: READ ERROR (data block not present)
- Meaning: Requested data block is not present (was not properly written).
- Causes: Illegal track/block combination or previously failed write.
- Diagnostics: Verify block address; use BLOCK commands to inspect track/block allocation; attempt recovery from backups.

23: READ ERROR (checksum error in data block)
- Meaning: Data was read into DOS memory but checksum over the data fails.
- Causes: Data corruption on media; grounding problems causing bit errors.
- Diagnostics: Retry read; check grounding and cabling; try another drive or disk surface; run multiple reads to see if errors repeat.

24: READ ERROR (byte decoding error)
- Meaning: Data/header read into memory but contains invalid bit pattern (decode failure).
- Causes: Media corruption or grounding/electrical faults producing invalid bit patterns.
- Diagnostics: Check drive electronics and grounding; try reading via another drive; inspect media.

25: WRITE ERROR (write-verify error)
- Meaning: Controller detected mismatch between written data and DOS memory during verify.
- Causes: Failed write, media defect, write head problem.
- Diagnostics: Ensure disk is writable (write-protect tab); try another disk; check write circuitry; reformat if appropriate.

26: WRITE PROTECT ON
- Meaning: Write attempted while write-protect switch engaged.
- Causes: Diskette write-protect tab present (notched covered).
- Diagnostics: Remove write-protect tab or use a disk with tab removed; check for debris keeping tab engaged.

27: READ ERROR (checksum error in header)
- Meaning: Header checksum invalid; block not read into DOS memory.
- Causes: Corrupt header on media; grounding problems.
- Diagnostics: Inspect header fields with BLOCK commands or directory tools; examine grounding and drive electronics.

28: WRITE ERROR (long data block)
- Meaning: After writing a data block, controller searches for the next header sync mark but times out — indicating data ran into next block area.
- Causes: Bad disk format (data extends beyond intended block), write-overlap, or hardware failure.
- Diagnostics: Check disk format; reformat disk; test drive hardware and timing circuits.

29: DISK ID MISMATCH
- Meaning: Disk ID on media does not match requested/expected ID or disk not initialized.
- Causes: Uninitialized diskette; corrupt/bad header containing ID mismatch.
- Diagnostics: Initialize or format disk; check header ID fields; ensure calling program expects correct disk ID.

## Syntax and file-related errors (30–39)
30: SYNTAX ERROR (general syntax)
- Meaning: DOS cannot interpret the command sent to the command channel.
- Causes: Illegal number of file names, illegal pattern usage (e.g., two filenames on left side of COPY).
- Diagnostics: Verify command format, argument count, and pattern placement.

31: SYNTAX ERROR (invalid command — start position)
- Meaning: Command not recognized because it does not start in the first character position.
- Causes: Leading spaces or misplaced characters.
- Diagnostics: Ensure command starts at first position (no leading spaces) and correct secondary addressing.

32: SYNTAX ERROR (invalid command — length)
- Meaning: Command exceeds allowable length.
- Causes: Command longer than 58 characters.
- Diagnostics: Shorten command or split into multiple operations.

33: SYNTAX ERROR (invalid file name)
- Meaning: Pattern matching used illegally in OPEN/SAVE command or filename invalid.
- Causes: Bad pattern/wildcard usage in file operations.
- Diagnostics: Correct filename or pattern syntax; avoid illegal characters.

34: SYNTAX ERROR (no file given)
- Meaning: File name omitted or DOS did not recognize token as filename.
- Causes: Missing colon (:) or other syntax error leading to missing filename.
- Diagnostics: Check command for required filename and colon separators.

39: SYNTAX ERROR (invalid command to command channel)
- Meaning: Command sent to command channel (secondary address 15) is not recognized.
- Causes: Unsupported or malformed command.
- Diagnostics: Confirm valid command for command channel and correct secondary addressing.

## Source Code
```text
(Reference table of DOS error messages and brief causes)

NOTE: Ignore error message numbers <20 except 01 (SCRATCH info).

20: READ ERROR (block header not found) -- The disk controller is unable to locate the header of the requested data block. Caused by an illegal block number, or the header has been destroyed.

21: READ ERROR (no sync character) -- The disk controller is unable to detect a sync mark on the desired track. Caused by misalignment of the read/writer head, no diskette is present, or unformatted or improperly seated diskette. Can also indicate a hardware failure.

22: READ ERROR (data block not present) -- The disk controller has been requested to read or verify a data block that was not properly written. This error message occurs in conjunction with the BLOCK commands and indicates an illegal track and/or block request.

23: READ ERROR (checksum error in data block) -- This error message indicates that there is an error in one or more of the data bytes. The data has been read into the DOS memory, but the checksum over the data is in error. This message may also indicate grounding problems.

24: READ ERROR (byte decoding error) -- The data or header as been read into the DOS memory, but a hardware error has been created due to an invalid bit pattern in the data byte. This message may also indicate grounding problems.

25: WRITE ERROR (write-verify error) -- This message is generated if the controller detects a mismatch between the written data and the data in the DOS memory.

26: WRITE PROTECT ON -- This message is generated when the controller has been requested to write a data block while the write protect switch is depressed. Typically, this is caused by using a diskette with a write a protect tab over the notch.

27: READ ERROR (checksum error in header) -- The controller has detected an error in the header of the requested data block. The block has not been read into the DOS memory.  This message may also indicate grounding problems.

28: WRITE ERROR (long data block) -- The controller attempts to detect the sync mark of the next header after writing a data block. If the sync mark does not appear within a predetermined time, the error message is generated.  The error is caused by a bad diskette format (the data extends into the next block), or by hardware failure.

29: DISK ID MISMATCH -- This message is generated when the controller has been requested to access a diskette which has not been initialized. The message can also occur if a diskette has a bad header.

30: SYNTAX ERROR (general syntax) -- The DOS cannot interpret the command sent to the command channel.  Typically, this is caused by an illegal number of file names, or pattems are illegally used. For example, two file names may appear on the left side of the COPY command.

31: SYNTAX ERROR (invalid command) -- The DOS does not recognize the command.  The command must start in the first position.

32: SYNTAX ERROR (invalid command) -- The command sent is longer than 58 characters.

33: SYNTAX ERROR (invalid file name) -- Pattem matching is invalidly used in the OPEN or SAVE command.

34: SYNTAX ERROR (no file given) -- the file name was left out of a command or the DOS does not recognize it as such.  Typically, a colon (:) has been left out of the command,

39: SYNTAX ERROR (invalid command) -- This error may result if the command sent to command channel (secondary address 15) is unrecognized
```

## References
- "reading_error_channel_example_and_error_fields" — expands on using the BASIC error-channel reader to obtain error code plus track and block for diagnosis
- "validate_command_defragment_and_caution_with_random_files" — expands on some errors (file open/write or directory errors) connected to improper file states that VALIDATE can address in some cases