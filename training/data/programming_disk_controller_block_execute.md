# BLOCK-EXECUTE (B-E:) — add/execute routines on the disk controller

**Summary:** BLOCK-EXECUTE (B-E:) loads a single disk block (sector) from the drive into the drive's buffer at offset 0 and begins executing it on the disk controller until an RTS is encountered. Invoked from BASIC with PRINT# to the drive channel: parameters are channel, drive, track, block.

**Overview**
Expert programmers can store machine-language routines on a diskette and have the drive load and execute them in the drive's own controller memory (the drive buffer). This allows DOS-like routines to be "wedged" into the drive and run from there.

BLOCK-EXECUTE behavior:
- Loads the specified block from disk into the drive's buffer, with the code placed starting at buffer location 0.
- Begins execution at buffer address 0 on the disk controller.
- Execution proceeds on the drive until an RTS (Return from Subroutine) is reached, at which point control returns to the drive DOS.

The mechanism is analogous to adding routines into the host's memory (e.g., DOS Support Program wedge), but the code runs on the disk controller CPU in the drive.

**Drive Buffer Details**
The Commodore 1541 disk drive contains 2 KB of RAM, organized into five 256-byte buffers located at memory addresses $0300–$07FF. These buffers are designated as follows:

- Buffer 0: $0300–$03FF
- Buffer 1: $0400–$04FF
- Buffer 2: $0500–$05FF
- Buffer 3: $0600–$06FF
- Buffer 4: $0700–$07FF

Buffer 4 is typically reserved for the Block Allocation Map (BAM), and Buffer 3 is used for directory operations. Therefore, Buffers 0, 1, and 2 are generally available for user operations. ([bitsavers.trailing-edge.com](https://bitsavers.trailing-edge.com/pdf/commodore/The_Anatomy_of_the_1541_Disk_Drive_Jun84.pdf?utm_source=openai))

**Entry and Exit Conventions**
When using BLOCK-EXECUTE, the loaded code is placed into the drive's buffer starting at address $0300 (Buffer 0). Execution begins at this address. The code should conclude with an RTS instruction to return control to the drive's DOS. The drive's 6502 CPU utilizes the standard 6502 stack located at $0100–$01FF. Programmers should ensure that the stack is properly managed and that the code does not disrupt the drive's operating system unless intentional. ([bitsavers.trailing-edge.com](https://bitsavers.trailing-edge.com/pdf/commodore/The_Anatomy_of_the_1541_Disk_Drive_Jun84.pdf?utm_source=openai))

**Disk Structure and Block Numbering**
The Commodore 1541 disk drive uses a 5¼-inch floppy disk formatted with 35 tracks, each containing a varying number of sectors:

- Tracks 1–17: 21 sectors per track
- Tracks 18–24: 19 sectors per track
- Tracks 25–30: 18 sectors per track
- Tracks 31–35: 17 sectors per track

Each sector (block) is 256 bytes. The total number of blocks on a standard disk is 683, with 664 blocks available for user data after accounting for system overhead. ([c64os.com](https://www.c64os.com/post/howdoes1541work?utm_source=openai))

Track 18 is reserved for the directory and BAM:

- Track 18, Sector 0: Disk header and BAM
- Track 18, Sectors 1–17: Directory entries

When specifying parameters for BLOCK-EXECUTE, ensure that the track and sector numbers correspond to valid data blocks and do not overlap with system-reserved areas.

## Source Code
```basic
' Format for BLOCK-EXECUTE
PRINT#file#, "B-E:" channel; drive; track; block
```

## References
- "memory_write_and_example" — expands on how MEMORY-WRITE deposits machine code to be executed with BLOCK-EXECUTE or MEMORY-EXECUTE
