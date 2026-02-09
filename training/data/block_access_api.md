# Commodore IEC Serial Bus Block Access API (256-byte logical blocks, "#" buffer)

**Summary:** Block Access API for Commodore disk drives: uses 256-byte logical blocks identified by track/sector and the "#" channel syntax to allocate a direct block buffer. Commands include U1 (UA) read block, U2 (UB) write block, B-A allocate block in the BAM, and B-F free block in the BAM.

**Block Access API**

The drive block system exposes 256-byte logical blocks addressed by track and sector. The "#" channel syntax (used when opening a channel) allocates a buffer on that channel which the drive can read into or write from using block-level commands.

Provided commands:

- **U1 (UA)**: Read a single 256-byte block into the buffer allocated on the "#" channel.
- **U2 (UB)**: Write a single 256-byte block from the buffer to disk.
- **B-A**: Allocate a block in the drive's BAM (Block Availability Map).
- **B-F**: Free a block in the drive's BAM.

**Command Syntax:**

- **U1 (UA)**: `"U1:channel,drive,track,sector"`
  - *channel*: Logical file number used when opening the direct access file.
  - *drive*: Drive number (typically 0 for single-drive systems).
  - *track*: Track number of the block to read.
  - *sector*: Sector number of the block to read.

- **U2 (UB)**: `"U2:channel,drive,track,sector"`
  - *channel*: Logical file number used when opening the direct access file.
  - *drive*: Drive number (typically 0 for single-drive systems).
  - *track*: Track number of the block to write.
  - *sector*: Sector number of the block to write.

- **B-A**: `"B-A:drive,track,sector"`
  - *drive*: Drive number (typically 0 for single-drive systems).
  - *track*: Track number of the block to allocate.
  - *sector*: Sector number of the block to allocate.

- **B-F**: `"B-F:drive,track,sector"`
  - *drive*: Drive number (typically 0 for single-drive systems).
  - *track*: Track number of the block to free.
  - *sector*: Sector number of the block to free.

**Behavior and Response Codes:**

- **U1 (UA)**:
  - Reads the specified block into the buffer associated with the given channel.
  - On success, the drive returns "00, OK, 00, 00".
  - On error, the drive returns an error code such as "20, READ ERROR" if the block header is not found.

- **U2 (UB)**:
  - Writes the contents of the buffer associated with the given channel to the specified block.
  - On success, the drive returns "00, OK, 00, 00".
  - On error, the drive returns an error code such as "25, WRITE ERROR" if a write-verify error occurs.

- **B-A**:
  - Marks the specified block as allocated in the BAM.
  - On success, the drive returns "00, OK, 00, 00".
  - If the block is already allocated, the drive returns "65, NO BLOCK" indicating the block is in use.

- **B-F**:
  - Marks the specified block as free in the BAM.
  - On success, the drive returns "00, OK, 00, 00".
  - If the block is already free, the drive returns "00, OK, 00, 00" (no error).

**Examples:**

- **Reading a Block (U1):**


- **Writing a Block (U2):**


- **Allocating a Block (B-A):**


- **Freeing a Block (B-F):**


**Note:** In the examples, `PRINT#15` is used to send commands to the drive's command channel (secondary address 15), while `PRINT#2` is used to interact with the data buffer allocated on channel 2.

**Usage Notes**

- Logical block size: 256 bytes.
- Blocks are identified by track and sector numbers; the API manipulates drive BAM entries via B-A / B-F.
- The "#" channel syntax is used to allocate a buffer on a chosen IEC channel so block reads/writes operate directly on that buffer.
- The source references related pages for additional drive memory and channel architecture details (see References).

## Source Code

  ```basic
  10 OPEN 2,8,2,"#"
  20 PRINT#15,"U1:2,0,18,0"
  30 REM Read data from channel 2
  40 CLOSE 2
  ```

  ```basic
  10 OPEN 2,8,2,"#"
  20 REM Write data to channel 2
  30 PRINT#15,"U2:2,0,18,0"
  40 CLOSE 2
  ```

  ```basic
  10 OPEN 15,8,15
  20 PRINT#15,"B-A:0,18,5"
  30 CLOSE 15
  ```

  ```basic
  10 OPEN 15,8,15
  20 PRINT#15,"B-F:0,18,5"
  30 CLOSE 15
  ```


```basic
10 REM Example: Reading track 18, sector 0 via channel 2
20 OPEN 2,8,2,"#"        : REM Allocate buffer on channel 2
30 PRINT#15,"U1:2,0,18,0" : REM Read track 18, sector 0 into buffer
40 REM ... read data from channel 2 ...
50 CLOSE 2
```

```text
Block Access API (summary from source)
- Block size: 256 bytes logical blocks (track/sector)
- "#" channel: allocates a buffer for direct block access
Commands:
  U1 (UA)  - Read a block into buffer
  U2 (UB)  - Write a block from buffer
  B-A      - Allocate a block in the BAM (Block Availability Map)
  B-F      - Free a block in the BAM
```

## References

- "memory_and_execution_commands" — expands on M-R/M-W/M-E drive memory operations
- "commodore_dos_channel_architecture" — expands on use of channels for block access and buffers