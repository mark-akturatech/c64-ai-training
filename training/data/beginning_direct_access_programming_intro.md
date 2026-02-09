# Beginning Direct-Access Programming (1541)

**Summary:** Introduces direct-access commands for the Commodore 1541 disk drive, detailing their functions and providing example programs to demonstrate their usage. A basic understanding of these commands is essential for utilizing routines in subsequent chapters and Appendix C.

**Overview**

This section transitions from general housekeeping to specialized direct-access commands recognized by the Commodore 1541 disk drive. It covers:

- **Direct-Access Commands:** These commands allow precise control over disk operations, enabling tasks such as reading and writing specific data blocks, managing memory, and executing code within the drive.

- **Command Functions:**
  - **Block-Read (U1):** Reads a data block into 1541 RAM.
  - **Buffer-Pointer (B-P):** Sets the pointer to any byte in a disk buffer.
  - **Block-Write (U2):** Writes a data block from 1541 RAM to the diskette.
  - **Memory-Read (M-R):** Reads bytes from 1541 RAM or ROM.
  - **Memory-Write (M-W):** Writes bytes into 1541 RAM.
  - **Block-Allocate (B-A):** Marks a sector as in use in the Block Availability Map (BAM).
  - **Block-Free (B-F):** Marks a sector as free in the BAM.
  - **Memory-Execute (M-E):** Executes a 6502 routine stored in 1541 RAM or ROM.
  - **Block-Execute (B-E):** Loads and executes a 6502 routine in 1541 RAM.

- **Example Program: Reading a Data Block**

  The following BASIC program demonstrates how to read a specific data block from the diskette into the 1541's RAM and display its contents:


  **Explanation:**
  - Line 10: Opens the command channel to the disk drive.
  - Line 20: Opens a data channel for direct access.
  - Line 30: Sends the `U1` command to read track 18, sector 1 into buffer 2.
  - Line 40: Reads the status message from the drive.
  - Line 50: Checks for errors; if any, displays the error message and ends the program.
  - Lines 60-90: Reads and prints each byte from the buffer.
  - Lines 100-110: Closes the channels.

- **Appendix C Routines:**

  For further details and advanced routines utilizing these commands, refer to Appendix C of "Inside Commodore DOS."

## Source Code

  ```basic
  10 OPEN 15,8,15
  20 OPEN 2,8,2,"#"
  30 PRINT#15,"U1 2 0 18 1"
  40 INPUT#15,A$,B$,C$,D$
  50 IF A$<>"00" THEN PRINT "ERROR: ";A$;B$;C$;D$: CLOSE 15:CLOSE 2: END
  60 FOR I=0 TO 255
  70   GET#2,A$
  80   PRINT ASC(A$);
  90 NEXT I
  100 CLOSE 15
  110 CLOSE 2
  ```


```text
(No additional source code provided in this section.)
```

## Key Registers

(This section does not reference specific C64/1541 registers or addresses.)

## References

- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld
- "Commodore 1541 Disk Drive User's Guide"
- "Commodore 1541-II User's Guide"