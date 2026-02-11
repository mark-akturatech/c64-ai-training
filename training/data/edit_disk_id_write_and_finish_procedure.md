# Write new disk ID and finalize — B-P buffer reposition + U2 block-write to track 18 sector 0 (drive #15)

**Summary:** This BASIC routine updates the disk ID by writing a new two-character identifier (NDI$) into the drive's buffer and issuing a block write to track 18, sector 0, which contains the disk's BAM (Block Availability Map) and disk ID.

**Operation**

This BASIC fragment finalizes a disk-ID update by writing the two-character NDI$ into the drive buffer and issuing a block write to track 18, sector 0:

- **Open Channels:**
  - Open channel 2 for data transfer: `OPEN 2,8,2`
  - Open channel 15 for command and status communication: `OPEN 15,8,15`

- **Reposition the Drive's Buffer Pointer:**
  - Send the "B-P" command to device channel 15 to reposition the buffer pointer to the disk-ID location: `PRINT#15,"B-P";2;162`
    - "B-P" is the drive buffer reposition command; parameters select the buffer and offset.

- **Write New Disk ID:**
  - Send the two-character new disk ID (NDI$) into the previously selected buffer via channel 2: `PRINT#2,NDI$;`
    - Channel 2 is used as the host-side buffer channel.

- **Issue Block Write Command:**
  - Issue the "U2" block-write command to the drive: `PRINT#15,"U2";2;0;18;0`
    - This writes the contents of buffer 2 (starting at buffer offset 0) to track 18, sector 0 on the disk.

- **Check for Errors:**
  - Read the drive response: `INPUT#15,EN$,EM$,ET$,ES$`
    - EN$ is the drive error code; "00" indicates success.
  - If EN$ is not "00", print an error message and branch to the cleanup routine.

- **Finalize and Close Channels:**
  - If EN$ is "00", issue the "10" command to update the BAM: `PRINT#15,"10"`
  - Read the response, close channels 2 and 15, print "DONE", and end the program.

- **Cleanup Routine:**
  - Closes channel 2, re-reads any final drive response, and closes channel 15.

## Source Code

```basic
500  OPEN 2,8,2
510  OPEN 15,8,15
520  PRINT#15,"B-P";2;162
530  PRINT#2,NDI$;
540  PRINT#15,"U2";2;0;18;0
550  INPUT#15,EN$,EM$,ET$,ES$
560  IF EN$<>"00" THEN PRINT "ERROR: ";EN$;" ";EM$;" ";ET$;" ";ES$ : GOTO 690
570  CLOSE 2
580  PRINT#15,"10"
590  INPUT#15,EN$,EM$,ET$,ES$
600  CLOSE 15
610  PRINT "DONE!"
620  END
630  REM  CLOSE
640  CLOSE 2
650  INPUT#15,EN$,EM$,ET$,ES$
660  CLOSE 15
670  END
```

## References

- "edit_disk_id_read_and_edit_disk_id_bytes" — expands on preparing the padded new ID (NDI$) before writing
- "edit_disk_id_block_write_alternatives_bottom" — expands on alternate syntaxes for the U2 block-write command used here