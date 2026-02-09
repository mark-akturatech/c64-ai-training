# Block-Free (B-F) and Block-Execute (B-E) Disk Commands

**Summary:** Describes the CBM DOS Block-Free (B-F) command, which deallocates a sector in the Block Availability Map (BAM) by setting its associated bit to 1 on track 18, sector 0. Also covers the Block-Execute (B-E) command used with the `PRINT#` command channel. Includes syntax, examples, and a corrected BASIC demonstration program.

**Description**

The B-F (Block-Free) command is sent to the disk drive's command channel to mark a specific disk sector as free in the BAM, allowing it to be reused for new data. The BAM resides on track 18, sector 0 of a standard 1541 disk.

**Syntax:**


- **file#**: Logical file number of the command channel (e.g., 15).
- **drive**: Drive number (typically 0).
- **track**: Track number (1 to 35).
- **sector**: Sector number (0 to the maximum sector count for the given track).

**Example:**


The B-E (Block-Execute) command loads a specific block into the drive's memory and executes the machine language program contained in that block. This command is primarily used for diagnostic purposes and requires caution, as executing arbitrary code can affect drive operation.

**Syntax:**


- **file#**: Logical file number of the command channel (e.g., 15).
- **channel**: Secondary address of the associated open statement.
- **drive**: Drive number (typically 0).
- **track**: Track number (1 to 35).
- **sector**: Sector number (0 to the maximum sector count for the given track).

**Example:**


**Caveats:**

- Do not deallocate track 18 directory sectors, as this will corrupt the disk.
- The Block-Execute command is primarily diagnostic and offers little advantage over a normal memory-execute in most cases.
- Ensure that the example program is run with a test diskette to prevent data loss.

## Source Code

```basic
PRINT# file#, "B-F:"; drive; track; sector
```

```basic
PRINT#15, "B-F:0,1,7"
```

```basic
PRINT# file#, "B-E:"; channel; drive; track; sector
```

```basic
PRINT#15, "B-E:2,0,1,0"
```


The following BASIC program demonstrates the use of the Block-Execute command.

```basic
100 REM BLOCK-EXECUTE DEMONSTRATION
110 OPEN 15,8,15
120 PRINT#15, "I0"
130 INPUT#15, EN$, EM$, ET$, ES$
140 IF EN$ <> "00" THEN GOTO 250

150 OPEN 2,8,2,"#3"
160 PRINT#15, "U1";2;0;1;0
170 INPUT#15, EN$, EM$, ET$, ES$
180 IF EN$ <> "00" THEN GOTO 220

190 PRINT#15, "M-W" + CHR$(0) + CHR$(6) + CHR$(96)
200 PRINT#15, "U2";2;0;1;0
210 PRINT#15, "M-W" + CHR$(0) + CHR$(6) + CHR$(0)

220 PRINT#15, "B-E";2;0;1;0
230 CLOSE 2

240 INPUT#15, EN$, EM$, ET$, ES$
250 CLOSE 15
260 END
```

**Notes:**

- This program opens the command channel and a secondary channel, sends initialization and memory-write commands, and executes a block on the disk.
- Ensure that the disk used is a test diskette to prevent data loss.

## Key Registers

- None. This chunk documents CBM DOS commands and the BAM location (track 18, sector 0), not memory-mapped C64 chip registers.

## References

- "block_allocate_command" — inverse operation (allocate previously freed sectors).