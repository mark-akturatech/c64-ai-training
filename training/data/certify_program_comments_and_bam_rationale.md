# CERTIFY program — B-F (block-free), M-E (memory-execute), and B-E (block-execute) notes

**Summary:** This document details the CERTIFY program's handling of the block-free (B-F) command, the correct procedures for opening and closing direct-access channels, the Memory-Execute (M-E) command for executing code in 1541 RAM, and the Block-Execute (B-E) command for executing machine-language programs stored on disk. It also addresses the necessity of managing the Block Availability Map (BAM) and the allocation issues concerning tracks 34 and 35.

**Block-Free (B-F) Command and Channel Handling**

- **Purpose:** To deallocate specific disk blocks, the program calculates a range of sectors, iterates over them, issues the B-F command to free each block, counts the number of blocks freed, prints progress information (track, sector, counter), and closes the direct-access channel upon completion.

- **Channel Management:** It is crucial to open and close the direct-access channel properly around the B-F sequence. Improper handling can result in tracks 34 and 35 remaining marked as allocated on a full diskette.

- **CERTIFY Program Line Summary:**
  - **180:** Calculate the sector range.
  - **190:** Begin loop for sectors 0 to the calculated range.
  - **200:** Issue the Block-Free (B-F) command.
  - **210:** Increment the counter for freed blocks.
  - **220:** Print track, sector, and counter information.
  - **250:** Close the direct-access channel.

- **B-F Command Syntax:**
  - The B-F command is used to mark a specific block as free in the BAM. The correct syntax is:
    Where:
    - **drive:** The drive number (typically 0).
    - **track:** The track number of the block to be freed.
    - **sector:** The sector number of the block to be freed.

    For example, to free the block at track 12, sector 7:
    This command instructs the drive to mark the specified block as available for use.

**Memory-Execute (M-E) Command**

- **Purpose:** The M-E command executes a machine-language program located in the 1541's RAM. This is typically used after loading code into the drive's memory using the Memory-Write (M-W) command.

- **Syntax:**
  Where:
  - **lo-byte:** Low byte of the memory address.
  - **hi-byte:** High byte of the memory address.

- **Example:**
  To execute code at memory address $0600:
  This command tells the drive to execute the code starting at address $0600.

- **Interaction with M-W:**
  Before using M-E, the machine-language program must be loaded into the 1541's RAM using the M-W command.

- **BASIC Example:**
  The following BASIC program writes a single RTS instruction ($60) into the 1541's RAM at $0600 and then executes it:
  - **Line 120:** Writes 1 byte ($60) to RAM at $0600.
  - **Line 130:** Executes the RTS instruction at $0600.

**Block-Execute (B-E) Command**

- **Purpose:** The B-E command loads a specific block from the disk into the 1541's memory and executes it as a machine-language program. This is useful for running code stored directly on the disk without first loading it into the computer's memory.

- **Syntax:**
  Where:
  - **channel:** The channel number used for the direct-access file.
  - **drive:** The drive number (typically 0).
  - **track:** The track number where the executable block is stored.
  - **sector:** The sector number where the executable block is stored.

- **Example:**
  Assuming a machine-language program is stored at track 2, sector 0, and you want to execute it using buffer #2 (starting at $0500):
  - **Line 20:** Opens a direct-access channel to buffer #2.
  - **Line 30:** Loads and executes the block at track 2, sector 0.

  This sequence loads the specified block into the drive's memory buffer and begins execution at the start of the buffer.

**BAM Handling and Track Allocation Issues**

- **BAM Management:** The Block Availability Map (BAM) keeps track of which blocks on the disk are free or allocated. Proper management of the BAM is essential to ensure data integrity and prevent overwriting of data.

- **Storing and Restoring the BAM Locally:** Before performing operations that modify the BAM, such as deallocating or allocating blocks, it's advisable to read the BAM into the computer's memory. This allows for verification and restoration if necessary.

- **Block-Allocating Deallocated Tracks/Sectors:** After deallocating blocks using the B-F command, ensure that any necessary blocks are reallocated appropriately to maintain the disk's structure and prevent data loss.

- **Allocating Bad Sectors:** If the disk has known bad sectors, they should be marked as allocated in the BAM to prevent their use. This can be done using the Block-Allocate (B-A) command:
  Where:
  - **drive:** The drive number (typically 0).
  - **track:** The track number of the bad sector.
  - **sector:** The sector number of the bad sector.

  For example, to allocate track 12, sector 7:
  This command marks the specified block as in use, preventing the DOS from writing data to it.

- **Tracks 34/35 Allocation Issues:** On a full diskette, tracks 34 and 35 may remain marked as allocated if the direct-access channel is not properly opened and closed around B-F sequences. Ensuring correct channel handling prevents this issue.

## Source Code

    ```
    PRINT#15, "B-F:"; drive; track; sector
    ```

    ```
    PRINT#15, "B-F:0 12 7"
    ```

  ```
  PRINT#15, "M-E" CHR$(lo-byte) CHR$(hi-byte)
  ```

  ```
  PRINT#15, "M-E" CHR$(0) CHR$(6)
  ```

  ```basic
  100 REM MEMORY-EXECUTE
  110 OPEN 15,8,15
  120 PRINT#15, "M-W" CHR$(0) CHR$(6) CHR$(1) CHR$(96)
  130 PRINT#15, "M-E" CHR$(0) CHR$(6)
  140 CLOSE 15
  150 END
  ```

  ```
  PRINT#15, "B-E"; channel; drive; track; sector
  ```

  ```basic
  10 OPEN 15,8,15
  20 OPEN 2,8,2,"#2"
  30 PRINT#15, "B-E"; 2; 0; 2; 0
  40 CLOSE 2
  50 CLOSE 15
  60 END
  ```

  ```
  PRINT#15, "B-A"; drive; track; sector
  ```

  ```
  PRINT#15, "B-A:0 12 7"
  ```


## References

- "certify_diskette_program" — expands on maps parts of the program to their functions and rationale.
- "block_allocate_notes_and_bam_update" — expands on why storing/restoring BAM is necessary.