# Block-VMTE (U2) — DOS Block-Write Behavior; Disk-Name and BAM Cosmetic-ID Edits

**Summary:** The block-vmte (U2) DOS command writes the entire DOS block buffer to a specified disk location, ignoring the BASIC buffer-pointer. This command is utilized in operations such as changing the disk name and editing the cosmetic disk ID in the BAM (Block Availability Map), without affecting the per-sector formatting ID.

**Description**

- **U2 Command Functionality:** The U2 command performs a block-write operation, writing the complete contents of the DOS block buffer to the target disk location specified by the command. Partial writes based on the BASIC buffer-pointer do not occur, as DOS ignores the buffer-pointer during U2 execution.

- **Buffer-Pointer Irrelevance:** The BASIC buffer-pointer, which indicates the current position in the I/O buffer, is not referenced by DOS when executing the U2 command. DOS writes the entire block buffer regardless of the buffer-pointer's position.

- **Example Programs:**
  - **Changing Disk Name:** A BASIC program can change the disk name by preparing the DOS block buffer with the new name and issuing a U2 block-write to the appropriate disk location.
  - **Editing Cosmetic Disk ID in BAM:** Another BASIC program can edit the cosmetic disk ID stored in the BAM by modifying the relevant bytes in the DOS block buffer and performing a U2 block-write. This operation does not alter the low-level formatting ID embedded in sector header blocks.

- **U2 Command Syntax:** The U2 command requires the following parameters:
  - `channel#`: The channel number used for the direct access file.
  - `drive#`: The drive number (typically 0).
  - `track#`: The track number to which the block will be written.
  - `sector#`: The sector number within the track where the block will be written.

  The complete syntax is:


  Alternatively, the command can be issued as:


  In these commands:
  - `15` is the logical file number for the command channel.
  - `channel#` corresponds to the secondary address used when opening the direct access file.
  - `drive#` is typically set to 0.
  - `track#` and `sector#` specify the exact location on the disk where the block will be written.

  *Note:* The partition number is omitted in these examples, as it is not applicable to standard 1541/1571 disk drives.

- **DOS Buffer Details:** The U2 command writes the contents of the DOS block buffer associated with the specified channel. The buffer size is 256 bytes, corresponding to the size of a disk sector.

- **Error Handling and Prerequisites:**
  - **Device and Channel Initialization:** Before issuing the U2 command, ensure that the device and channel are properly initialized. This involves opening the command channel and the direct access channel.
  - **Error Handling:** After executing the U2 command, check the disk drive's error channel to verify the success of the operation. This can be done by reading the status message from the command channel.
  - **Drive Side Effects:** Be aware that direct block-write operations can overwrite existing data. Ensure that the target track and sector are correct and that overwriting data is intentional.

## Source Code

  ```basic
  PRINT#15, "U2"; channel#; drive#; track#; sector#
  ```

  ```basic
  PRINT#15, "U2:"; channel#; ","; drive#; ","; track#; ","; sector#
  ```


```basic
10 REM CHANGE DISK NAME PROGRAM
20 OPEN 15,8,15
30 OPEN 5,8,5,"#"
40 PRINT#15,"U1";5;0;18;0
50 FOR I=1 TO 16
60 GET#5,A$
70 IF A$="" THEN A$=CHR$(0)
80 PRINT A$;
90 NEXT I
100 PRINT
110 CLOSE 5
120 CLOSE 15
130 END
```

```basic
10 REM EDIT COSMETIC DISK ID IN BAM
20 OPEN 15,8,15
30 OPEN 5,8,5,"#"
40 PRINT#15,"U1";5;0;18;0
50 FOR I=1 TO 16
60 GET#5,A$
70 IF A$="" THEN A$=CHR$(0)
80 PRINT A$;
90 NEXT I
100 PRINT
110 CLOSE 5
120 CLOSE 15
130 END
```

## Key Registers

- **Command Channel (Logical File Number 15):** Used to send commands to the disk drive.
- **Direct Access Channel (Logical File Number 5):** Used for direct block access operations.

## References

- "edit_disk_name_intro_and_drive_init" — expands on BASIC program that implements the disk-name edit (starts the example programs)
- "edit_disk_name_read_bam_and_modify_disk_name" — expands on main routine that reads the BAM/disk-name buffer and performs the U2 write
- Commodore 1581 User's Guide
- CMD Hard Drive User's Manual
- SD2IEC User's Manual