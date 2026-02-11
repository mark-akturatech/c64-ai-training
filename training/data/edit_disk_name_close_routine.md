# EDIT DISK NAME — Close/cleanup subroutine (CLOSE2, INPUT#15 status, CLOSE15, END)

**Summary:** BASIC cleanup subroutine for the "EDIT DISK NAME" utility that closes file channel 2 (CLOSE2), reads the drive command-channel status with INPUT#15 into EN, EM$, ET, ES, closes the command channel (CLOSE15), and exits (END).

**Description**
This short BASIC fragment performs an orderly shutdown after disk read/write attempts (BAM / disk name). It:

- Closes the program's data/file channel (channel 2) to release the drive file handle.
- Reads the drive command-channel (device channel 15) status into four variables:
  - **EN**: Error Number
  - **EM$**: Error Message (string)
  - **ET**: Error Track
  - **ES**: Error Sector

  These variables capture the status/error fields returned by the drive after the previous command(s). ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1581_Users_Guide.pdf?utm_source=openai))

- Closes the command channel (channel 15).
- Ends the program.

The variables read from the command channel (EN, EM$, ET, ES) are intended for the calling/main routine to inspect the drive's response to previous operations (for example, write attempts to the BAM and disk name).

## Source Code
```basic
710 REM  CLOSE
720 CLOSE2
730 INPUT#15,EN,EM$,ET,ES
740 CLOSE15
750 END
```

## References
- "edit_disk_name_read_bam_and_modify_disk_name" — Main routine that calls this cleanup sequence after write attempts and status checks