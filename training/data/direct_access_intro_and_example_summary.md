# Direct-access job-queue read — 1541 FDC (read track 18, sector 0 into buffer $0300-$03FF)

**Summary:** Describes intermediate direct-access programming of the 1541 FDC using the drive job queue; a successful job request returns the 4-byte result (00, OK, 00, 00), and the sector contents can be retrieved via GET# from buffer $0300-$03FF. Example goal: read track 18, sector 0 into buffer 0 ($0300-$03FF) and print it to the screen.

**Description**

This chunk describes bypassing the 1541 drive parser and working the drive's job queue/FDC directly from the C64. Instead of using the drive's higher-level file parser, programs write job requests into the drive job queue; when the FDC completes the job, it returns a 4-byte status (example success: 00, OK, 00, 00). After a successful completion, the block (track/sector) resides in the drive buffer and can be transferred to the C64 with a GET# command.

Prerequisites for direct job-queue control:

- **Job Codes:** The 1541 FDC recognizes specific job codes for various operations. The relevant job codes are:

  - $80: READ a sector
  - $90: WRITE a sector
  - $A0: VERIFY a sector
  - $B0: SEEK any sector
  - $C0: BUMP (move) head to track #1
  - $D0: JUMP to machine code in buffer
  - $E0: EXECUTE code in buffer once up to speed & head ready

  ([devili.iki.fi](https://www.devili.iki.fi/pub/Commodore/docs/books/Inside_Commodore_DOS_OCR.pdf?utm_source=openai))

- **Buffer Area Map:** The 1541 drive has several buffers mapped to specific memory addresses:

  - Buffer 0: $0300-$03FF
  - Buffer 1: $0400-$04FF
  - Buffer 2: $0500-$05FF
  - Buffer 3: $0600-$06FF
  - Buffer 4: $0700-$07FF

  ([dusted.dk](https://www.dusted.dk/pages/c64/C64-programming/files/sta_c64_org/cbm1541mem.html?utm_source=openai))

- **Error Codes:** After a job is executed, the FDC returns an error code indicating the result:

  - $01: Job completed successfully
  - $02: Header block not found
  - $03: No SYNC character
  - $04: Data block not found
  - $05: Data block checksum error
  - $07: Verify error after write
  - $08: Write protect error
  - $09: Header block checksum error
  - $0A: Data block too long
  - $0B: ID mismatch error
  - $10: Byte decoding error

  ([g3sl.github.io](https://g3sl.github.io/c1541rom.html?utm_source=openai))

Advantages noted:

- The drive will not perform an automatic bump/reinitialization when you operate the job queue directly (avoids the loud error bump).
- Enables more flexible schemes for raw FDC control than the standard drive parser.

Example described:

- A program that writes a job to read track 18, sector 0 into buffer number 0 (drive buffer mapped at $0300-$03FF) and then prints the 256-byte sector contents to the screen. This example is a modification of an earlier beginning direct-access program.

Operational details explicitly preserved:

- Successful job response format: (00, OK, 00, 00).
- Buffer containing the block after a successful job: $0300-$03FF (buffer 0).
- Data retrieval method: issue GET# to fetch the buffer contents, as per the C64-to-1541 GET# protocol.

## Source Code

```basic
10 OPEN 15,8,15
20 PRINT#15,"M-W"CHR$(0)CHR$(0)CHR$(2)CHR$(128)
30 PRINT#15,"M-W"CHR$(6)CHR$(0)CHR$(2)CHR$(18)CHR$(0)
40 PRINT#15,"M-E"CHR$(0)CHR$(0)CHR$(0)
50 INPUT#15,E,E$,T,S
60 IF E<>0 THEN PRINT "ERROR: ";E,E$,T,S:CLOSE 15:END
70 OPEN 2,8,2,"#"
80 FOR I=1 TO 256
90 GET#2,A$:PRINT A$;
100 NEXT I
110 CLOSE 2
120 CLOSE 15
```

This BASIC program performs the following steps:

1. Opens the command channel to the disk drive.
2. Sends a memory-write command to set the job code for reading a sector.
3. Sends a memory-write command to set the track and sector numbers.
4. Executes the job.
5. Checks for errors.
6. If no errors, opens a data channel to read the buffer.
7. Reads and prints each byte from the buffer.
8. Closes the data and command channels.

## Key Registers

- $0300-$03FF - 1541 buffer 0 - drive buffer area containing a 256-byte track/sector block after a successful job request (readable via GET#).

## References

- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld
- "Commodore 1541 Disk Drive User's Guide"