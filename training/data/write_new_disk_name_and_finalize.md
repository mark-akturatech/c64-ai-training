# byRiclianll — BASIC: write edited 16-byte disk name (NDN$) to drive buffer and issue WRITE job

**Summary:** C64 BASIC sequence that sends an M-W (memory-write) to the drive command channel (PRINT#15), transfers a 16-byte disk-name string (NDN$) into the drive buffer (CHR$ address/length bytes), sets JOB=144 (WRITE) and calls the job-queue subroutine (GOSUB 660), polls the drive with command "10" and reads status bytes via INPUT#15, then closes the channel and prints DONE. Searchable terms: PRINT#15, CHR$(), "M-W", JOB=144, GOSUB 660, INPUT#15, CLOSE 15, NDN$.

**Description**
This chunk implements the final steps to write an edited 16-byte disk name (NDN$) back to the drive buffer and start a DOS WRITE job on the drive:

- Send an M-W (memory-write) command over the drive command channel (channel 15) to copy the 16-byte NDN$ into the drive buffer. The M-W packet includes two address bytes and a length byte before the data.
- Set JOB = 144 (the DOS WRITE command code) and call the job-queue subroutine (GOSUB 660) which enqueues and executes the WRITE job on the drive.
- Poll the drive with the status command "10" (PRINT#15,"10") and read the returned four status bytes (EN, EM, ET, ES) via INPUT#15.
- Close the command channel (CLOSE 15), print a DONE message to the user, and END the program. Alternate cleanup labels CLOSE/END are present at lines 630/640.

## Source Code
```basic
530  PRINT#15, "M-W";CHR$(0);CHR$(5);CHR$(16);NDN$      : REM send M-W packet (addr lo, addr hi, len=16, data)
540  REM  WRITE
550  JOB = 144                                         : REM set WRITE job code
560  GOSUB 660                                         : REM call job queue to perform WRITE
570  PRINT#15, "10"                                    : REM poll drive for completion/status
580  INPUT#15, EN, EM, ET, ES                          : REM read four status bytes from drive
590  CLOSE 15
600  PRINT "DONE!"
610  END
620  REM  (alternate cleanup)
630  CLOSE 15
640  END
```

## Key Registers
- **NDN$**: 16-byte string containing the new disk name.
- **JOB**: Numeric variable set to 144, representing the WRITE job code.
- **EN, EM, ET, ES**: Numeric variables to store the four status bytes read from the drive.

## References
- "seek_read_and_disk_name_fetch_and_edit_input" — provides NDN$ (the new 16-byte disk name) to be sent by M-W
- "job_queue_subroutine_and_error_handler" — performs the actual SEEK/READ/WRITE job processing and polling (GOSUB 660)