# 1541 Direct-Access Commands (U1/U2, B-P, M-R/M-W, B-A/B-F, M-E/B-E)

**Summary:** Overview of Commodore 1541 direct-access commands: block-read (U1), block-write (U2), buffer-pointer (B‑P), memory-read/write (M‑R/M‑W), block-allocate/free (B‑A/B‑F), and execute commands (M‑E, B‑E). Includes BAM (Block Availability Map) bit operations and typical read-modify-write usage patterns.

**Direct-Access Command Roles**

- **Block-Read (U1):**  
  Reads a specified block from disk into the drive's internal buffer.

- **Block-Write (U2):**  
  Writes the contents of the drive's internal buffer to a specified block on disk.

- **Buffer-Pointer (B‑P):**  
  Sets the pointer to a specific byte within the drive's internal buffer.

- **Memory-Read (M‑R):**  
  Reads bytes from the 1541's RAM or ROM.

- **Memory-Write (M‑W):**  
  Writes bytes into the 1541's RAM.

- **Block-Allocate (B‑A):**  
  Marks a disk block as in-use in the drive's BAM (Block Availability Map).

- **Block-Free (B‑F):**  
  Marks a disk block as free in the BAM.

- **Memory-Execute (M‑E):**  
  Executes a 6502 routine stored in the 1541's RAM or ROM.

- **Block-Execute (B‑E):**  
  Loads and executes a 6502 routine in the 1541's RAM.

**Command Syntax and Parameter Formats**

- **Block-Read (U1):**  
  `PRINT#15, "U1:" channel "," drive "," track "," sector`  
  Reads the specified block into the drive's buffer associated with the given channel.

- **Block-Write (U2):**  
  `PRINT#15, "U2:" channel "," drive "," track "," sector`  
  Writes the contents of the buffer associated with the given channel to the specified block.

- **Buffer-Pointer (B‑P):**  
  `PRINT#15, "B-P:" channel "," position`  
  Sets the buffer pointer for the specified channel to the given byte position.

- **Memory-Read (M‑R):**  
  `PRINT#15, "M-R" CHR$(low_address) CHR$(high_address) CHR$(num_bytes)`  
  Reads the specified number of bytes starting from the given memory address in the drive.

- **Memory-Write (M‑W):**  
  `PRINT#15, "M-W" CHR$(low_address) CHR$(high_address) CHR$(num_bytes)`  
  Writes the specified number of bytes to the given memory address in the drive.

- **Block-Allocate (B‑A):**  
  `PRINT#15, "B-A:" drive "," track "," sector`  
  Marks the specified block as allocated in the BAM.

- **Block-Free (B‑F):**  
  `PRINT#15, "B-F:" drive "," track "," sector`  
  Marks the specified block as free in the BAM.

- **Memory-Execute (M‑E):**  
  `PRINT#15, "M-E" CHR$(low_address) CHR$(high_address)`  
  Executes the routine at the specified memory address in the drive.

- **Block-Execute (B‑E):**  
  `PRINT#15, "B-E:" channel "," drive "," track "," sector`  
  Loads and executes a routine from the specified block in the drive.

**BAM Bit Layout and Sector-to-Bit Mapping**

The Block Availability Map (BAM) is stored on track 18, sector 0 of a 1541 disk. Each track's availability is represented by 4 bytes:

- **Byte 0:** Number of free sectors on the track.
- **Bytes 1-3:** Bitmap indicating the availability of each sector (1 = free, 0 = allocated).

For example, for track 1:

- **Byte 0:** Number of free sectors.
- **Byte 1:** Sectors 0–7.
- **Byte 2:** Sectors 8–15.
- **Byte 3:** Sectors 16–23.

Each bit within bytes 1–3 corresponds to a sector, with the least significant bit representing the lowest-numbered sector.

**Example Sequences**

**Using Buffer-Pointer (B‑P):**

1. **Read a Block:**

2. **Modify Buffer:**

3. **Write Back Block:**

**Using Memory-Read/Write (M‑R/M‑W):**

1. **Read Memory:**

2. **Write Memory:**

**Timing and Handshaking:**

When using these commands, ensure proper synchronization between the host and the drive. After sending a command, wait for the drive to process it before proceeding. This can be achieved by checking the drive's status channel for completion or errors.

**Assembly Example: Read-Modify-Write Loop**

## Source Code

   ```basic
   OPEN 15,8,15
   PRINT#15, "U1:2,0,10,5"  ' Read track 10, sector 5 into buffer 2
   CLOSE 15
   ```

   ```basic
   OPEN 2,8,2,"#"
   FOR I = 0 TO 255
     GET#2, A$
     ' Modify A$ as needed
   NEXT I
   CLOSE 2
   ```

   ```basic
   OPEN 15,8,15
   PRINT#15, "U2:2,0,10,5"  ' Write buffer 2 back to track 10, sector 5
   CLOSE 15
   ```

   ```basic
   OPEN 15,8,15
   PRINT#15, "M-R" CHR$(52) CHR$(18) CHR$(3)  ' Read 3 bytes from $1234
   GET#15, A$, B$, C$
   CLOSE 15
   ```

   ```basic
   OPEN 15,8,15
   PRINT#15, "M-W" CHR$(52) CHR$(18) CHR$(3)  ' Write 3 bytes to $1234
   PRINT#15, "ABC"
   CLOSE 15
   ```

```assembly
; Read a block, modify it, and write it back
LDX #$02          ; Logical file number
LDY #$08          ; Device number
LDA #$02          ; Secondary address (channel)
JSR SETLFS        ; Set logical file parameters

LDA #<FILENAME    ; Low byte of filename
LDX #>FILENAME    ; High byte of filename
LDY #$00          ; Filename length
JSR SETNAM        ; Set filename parameters

JSR OPEN          ; Open the file

; Read the block into buffer
LDA #$02          ; Logical file number
JSR CHKIN         ; Set input channel

; Modify the buffer as needed
; ...

; Write the buffer back to disk
LDA #$02          ; Logical file number
JSR CHKOUT        ; Set output channel

; Close the file
LDA #$02          ; Logical file number
JSR CLOSE

RTS

FILENAME:
  .BYTE "U1:2,0,10,5",0
```



## References

- "block_write_u2_syntax" — expands on block-write (U2) syntax and parameters
- "memory_read_m-r_syntax" — expands on memory-read (M‑R) usage as an alternative to B‑P