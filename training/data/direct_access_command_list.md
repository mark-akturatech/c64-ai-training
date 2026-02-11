# 1541 Direct-Access Commands (DOS)

**Summary:** The Commodore 1541 DOS supports nine direct-access commands for manipulating 1541 RAM, disk blocks, and executing code on the drive: Block-Read (U1), Buffer-Pointer (B-P), Block-Write (U2), Memory-Read (M-R), Memory-Write (M-W), Block-Allocate (B-A), Block-Free (B-F), Memory-Execute (M-E), and Block-Execute (B-E).

**Direct-Access Commands**

The 1541 DOS recognizes the following nine direct-access commands and their functions:

- **Block-Read (U1):** Reads a data block from disk into 1541 RAM.
- **Buffer-Pointer (B-P):** Sets the pointer to any byte within a disk buffer in 1541 RAM.
- **Block-Write (U2):** Writes a data block from 1541 RAM to disk.
- **Memory-Read (M-R):** Reads (peeks) bytes from 1541 RAM or ROM.
- **Memory-Write (M-W):** Writes (pokes) bytes into 1541 RAM.
- **Block-Allocate (B-A):** Sets a bit in the BAM (Block Availability Map) to mark a sector as in use.
- **Block-Free (B-F):** Clears a BAM bit to mark a sector as free.
- **Memory-Execute (M-E):** Executes a 6502 routine present in 1541 RAM or ROM.
- **Block-Execute (B-E):** Loads a 6502 routine from disk into 1541 RAM and executes it.

**Command Syntax and Examples**

**Block-Read (U1):**

- **Syntax:** `PRINT#<file#>,"U1:<channel#>,<drive#>,<track>,<sector>"`
- **Example:** `PRINT#15,"U1:2,0,18,0"`  
  Reads the block at track 18, sector 0 into buffer associated with channel 2.

**Buffer-Pointer (B-P):**

- **Syntax:** `PRINT#<file#>,"B-P:<channel#>,<pointer>"`
- **Example:** `PRINT#15,"B-P:2,0"`  
  Sets the buffer pointer for channel 2 to the start of the buffer.

**Block-Write (U2):**

- **Syntax:** `PRINT#<file#>,"U2:<channel#>,<drive#>,<track>,<sector>"`
- **Example:** `PRINT#15,"U2:2,0,18,1"`  
  Writes the contents of the buffer associated with channel 2 to track 18, sector 1.

**Memory-Read (M-R):**

- **Syntax:** `PRINT#<file#>,"M-R:<start address>,<end address>"`
- **Example:** `PRINT#15,"M-R:8192,8200"`  
  Reads bytes from address 8192 to 8200 in the 1541's memory.

**Memory-Write (M-W):**

- **Syntax:** `PRINT#<file#>,"M-W:<start address>,<data>"`
- **Example:** `PRINT#15,"M-W:8192,0,1,2,3"`  
  Writes the bytes 0, 1, 2, 3 starting at address 8192 in the 1541's memory.

**Block-Allocate (B-A):**

- **Syntax:** `PRINT#<file#>,"B-A:<drive#>,<track>,<sector>"`
- **Example:** `PRINT#15,"B-A:0,18,5"`  
  Marks track 18, sector 5 as allocated in the BAM.

**Block-Free (B-F):**

- **Syntax:** `PRINT#<file#>,"B-F:<drive#>,<track>,<sector>"`
- **Example:** `PRINT#15,"B-F:0,18,5"`  
  Marks track 18, sector 5 as free in the BAM.

**Memory-Execute (M-E):**

- **Syntax:** `PRINT#<file#>,"M-E:<address>"`
- **Example:** `PRINT#15,"M-E:8192"`  
  Executes the routine at address 8192 in the 1541's memory.

**Block-Execute (B-E):**

- **Syntax:** `PRINT#<file#>,"B-E:<channel#>,<drive#>,<track>,<sector>"`
- **Example:** `PRINT#15,"B-E:2,0,18,2"`  
  Loads and executes the block at track 18, sector 2 using channel 2.

**Error Codes and Return Conventions**

The 1541 DOS provides error codes to indicate the status of operations. Common error codes include:

- **00, OK:** No error.
- **20, READ ERROR:** Block header not found.
- **21, READ ERROR:** Sync character not found.
- **22, READ ERROR:** Data block not present.
- **23, READ ERROR:** Checksum error in data.
- **26, WRITE PROTECT ON:** Attempt to write with write protect tab on.
- **30, SYNTAX ERROR:** General syntax error.
- **65, NO BLOCK:** Block to be allocated has been previously allocated.
- **66, ILLEGAL TRACK AND SECTOR:** Attempt to access a non-existent track or sector.

After executing a command, the drive's error channel should be checked to determine the result. This can be done by reading from the command channel:


Where `EN` is the error number, `EM$` is the error message, `ET` is the track number, and `ES` is the sector number associated with the error.

**Block Availability Map (BAM) Layout**

The BAM is stored in track 18, sector 0 of the disk and has the following structure:

- **Bytes 0-1:** Track/Sector location of the first directory sector (typically 18/1).
- **Byte 2:** DOS version type (usually $41 for "A").
- **Bytes 4-143:** BAM entries for each track, in groups of four bytes per track:
  - **Byte 0:** Number of free sectors on the track.
  - **Bytes 1-3:** Bitmap indicating free (1) and used (0) sectors.

For example, the BAM entry for track 1 might look like:


Where `12` indicates 18 free sectors, and `FF F9 17` is the bitmap for sector usage.

## Source Code

```basic
OPEN 15,8,15
INPUT#15,EN,EM$,ET,ES
PRINT EN,EM$,ET,ES
CLOSE 15
```

```
12 FF F9 17
```


## References

- "block_read_u1_syntax" — expands on Block-Read (U1) usage and syntax
- "memory_read_m-r_syntax" — expands on Memory-Read (M-R) usage and syntax