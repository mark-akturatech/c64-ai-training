# INITIALIZE command (1541)

**Summary:** INITIALIZE (I or I0) tells a 1541 drive to read the disk ID and BAM (block availability map) into the drive's internal DOS memory so the drive knows where to write next; use via OPEN/PRINT/CLOSE (e.g. OPEN 15,8,15 : PRINT#15,"I0" : CLOSE 15). INITIALIZE clears the drive error channel and stops the flashing LED — retrieve the error status first if you need it.

## Behavior and usage
- Purpose: INITIALIZE instructs the drive's DOS to read the disk ID and the contents of the BAM into the drive's internal memory. The BAM identifies free sectors so the DOS knows where to write; without it writes could overwrite existing files.
- Syntax (BASIC/serial): OPEN 15,8,15  : PRINT#15,"I0"  : CLOSE 15  
  - Alternate short form: PRINT#15,"I"
  - On a 1541 running DOS 5.1 the command appears as >I0 or >I at the drive prompt.
- Recommended practice: initialize each time you insert a disk into the 1541. Do not rely on the drive's autoinit — explicitly INITIALIZE to ensure the drive has the correct BAM/ID and the disk is properly seated.
- Autoinitialization and the "bump": the 1541 has an autoinit behavior when encountering errors. If it fails a read operation it retries and may perform a mechanical "bump" (step head outward to track 1, then step inward to track 18) before settling and awaiting commands. Explicit INITIALIZE avoids this scenario.
- Error-channel behavior: INITIALIZE clears the drive error channel and turns off the flashing red LED. Because it clears the error status prepared by DOS, retrieve the drive's error message/status before running INITIALIZE if error information is required.

## Source Code
```basic
OPEN 15,8,15
PRINT#15,"I0"
CLOSE 15

' Alternate:
PRINT#15,"I"

' DOS 5.1 drive prompt:
> I0
> I
```

## References
- "bam_sector_dump_and_overview" — explains BAM location (track 18 sector 0) and how INITIALIZE reads it into drive memory
