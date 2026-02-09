# CHAPTER 5 — DIRECT-ACCESS PROGRAMMING

**Summary:** This chapter provides an in-depth exploration of direct-access programming techniques for the Commodore 1541 disk drive. It covers the use of direct-access commands to interact with the drive's internals, including low-level disk operations, track and sector manipulation, and error handling. The chapter includes command lists, syntax, and example programs in BASIC and assembly language to demonstrate direct-access routines and communication with the 1541.

**Overview**

Direct-access programming allows for precise control over the Commodore 1541 disk drive by enabling operations at the track and sector level. This approach is essential for tasks such as custom file management, data recovery, and disk utilities development. The chapter introduces the fundamental concepts, commands, and techniques necessary to perform direct-access operations effectively.

**Direct-Access Commands**

The 1541 DOS recognizes several direct-access commands that facilitate low-level disk operations. These commands include:

- **Block-Read (U1):** Reads a specified data block from the disk into the 1541's RAM.
- **Block-Write (U2):** Writes a data block from the 1541's RAM to a specified location on the disk.
- **Buffer-Pointer (B-P):** Sets the pointer to a specific byte within a disk buffer.
- **Memory-Read (M-R):** Reads bytes from the 1541's RAM or ROM.
- **Memory-Write (M-W):** Writes bytes into the 1541's RAM.
- **Block-Allocate (B-A):** Marks a specific sector as in use in the Block Availability Map (BAM).
- **Block-Free (B-F):** Marks a specific sector as free in the BAM.
- **Memory-Execute (M-E):** Executes a machine language routine stored in the 1541's RAM or ROM.
- **Block-Execute (B-E):** Loads and executes a machine language routine in the 1541's RAM.

These commands provide the foundation for direct-access programming by allowing precise control over disk operations and memory management within the 1541 drive.

**Example Programs**

To illustrate the use of direct-access commands, the following examples demonstrate how to read from and write to specific sectors on a disk using BASIC:

**Example 1: Writing Data to a Specific Sector**


In this program, the user inputs a message and specifies the track and sector where the data should be written. The program then opens a command channel to the disk drive, sets the buffer pointer, writes the data to the specified location, and closes the channel.

**Example 2: Reading Data from a Specific Sector**


This program prompts the user for the track and sector to read from, opens a command channel to the disk drive, reads the data from the specified location, and displays the retrieved data.

**1541 Internal Documentation**

Understanding the internal workings of the 1541 disk drive is crucial for effective direct-access programming. Key aspects include:

- **Disk Structure:** The 1541 uses a single-sided 5¼" floppy disk with 35 tracks. Each track contains a varying number of sectors:
  - Tracks 1–17: 21 sectors per track
  - Tracks 18–24: 19 sectors per track
  - Tracks 25–30: 18 sectors per track
  - Tracks 31–35: 17 sectors per track

  Each sector holds 256 bytes of data, totaling 170 KB of storage capacity.

- **Block Availability Map (BAM):** The BAM keeps track of free and occupied sectors on the disk. Direct manipulation of the BAM allows for custom file management and data recovery operations.

- **Error Handling:** The 1541 provides error codes to indicate the status of disk operations. Common error codes include:
  - 20: Block header not found
  - 21: Sync character not found
  - 22: Data block not present
  - 23: Checksum error in data
  - 24: Byte decoding error in data
  - 25: Write-verify error
  - 26: Write protect on

  Proper error handling ensures data integrity and helps diagnose issues during direct-access operations.

## Source Code

```basic
10 INPUT "MESSAGE TO WRITE"; A$
20 INPUT "TRACK TO WRITE"; T
30 INPUT "SECTOR TO WRITE"; S
40 OPEN 15,8,15
50 PRINT#15, "B-P"; 0
60 PRINT#15, "U2"; 0; T; S
70 PRINT#15, "B-W"; 0
80 PRINT#15, "CLOSE"
90 CLOSE 15
100 PRINT "DATA WRITTEN TO TRACK"; T; "SECTOR"; S
```

```basic
10 INPUT "TRACK TO READ"; T
20 INPUT "SECTOR TO READ"; S
30 OPEN 15,8,15
40 PRINT#15, "U1"; 0; T; S
50 INPUT#15, A$
60 PRINT "DATA READ FROM TRACK"; T; "SECTOR"; S; ": "; A$
70 CLOSE 15
```


```text
+-------------------+
| 1541 Disk Layout  |
+-------------------+
| Track | Sectors   |
|-------|-----------|
| 1–17  | 21        |
| 18–24 | 19        |
| 25–30 | 18        |
| 31–35 | 17        |
+-------------------+
```

## Key Registers

- **Command Channel (15):** Used to send commands to the disk drive.
- **Data Channel (Secondary Address 0–14):** Used for data transfer between the computer and the disk drive.

## References

- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld
- Commodore 1541 Disk Drive User's Guide
- Commodore 64 Programmer's Reference Guide

By mastering direct-access programming, developers can unlock the full potential of the Commodore 1541 disk drive, enabling advanced disk operations and custom utilities tailored to specific needs.