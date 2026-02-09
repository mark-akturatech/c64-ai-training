# 1541 Block-Read Command (U1)

**Summary:** The 1541 DOS Block-Read command "U1" (PRINT# command) copies the contents of a specified track and sector into the drive's DOS buffer/workspace; use PRINT# with the command string "U1" and parameters (channel, drive, track, sector). After U1, read bytes from the command channel with GET# (null bytes may appear).

**Description**

The Block-Read command (U1) transfers the contents of one disk sector (a specified track and sector) into the 1541 disk drive's RAM buffer (workspace). The command is sent over a command channel opened with OPEN and uses the secondary address (channel) as the command channel identifier.

**Parameters:**

- **file#** — The BASIC logical file number of the open command channel (the channel returned by OPEN).
- **channel (secondary address)** — The secondary address of the associated open statement (the command channel).
- **drive#** — Must be 0 (selects the target drive for this command string format).
- **track** — 1 to 35 (valid track numbers on a 1541).
- **sector** — 0 to the maximum sector number for the specified track (sector count varies by track).

**Behavior:**

- U1 copies the raw 256-byte sector into the DOS workspace buffer in the drive.
- To retrieve the buffered bytes, read from the same command channel with GET# (GET# reads bytes from the drive; see "block_read_get_and_null_handling" for null-byte handling).
- The sector contents may contain zero (null) bytes; code that reads must handle that (nulls do not terminate GET# reads by themselves).

**Syntax Variants:**

- **Semicolon-separated form:** The command and parameters may be sent as separate arguments (PRINT# with semicolons).
- **Colon/comma form:** Parameters can be supplied inside the quoted command string after a colon, separated by commas.

(Alternate quoting/parameter separators are implementation variations commonly used in BASIC listings for 1541 commands.)

**Example Semantics:**

- Typical use: Send U1 with the command channel and track/sector you want; then use GET# to read the buffer contents back into BASIC.

**Sector Counts Per Track:**

The 1541 disk drive uses a variable number of sectors per track, organized as follows:

- **Tracks 1–17:** 21 sectors per track
- **Tracks 18–24:** 19 sectors per track
- **Tracks 25–30:** 18 sectors per track
- **Tracks 31–35:** 17 sectors per track

This results in a total of 683 sectors across 35 tracks. ([c64os.com](https://c64os.com/post/howdoes1541work?utm_source=openai))

## Source Code

```basic
REM Semicolon-separated parameters (common)
PRINT#15, "U1";2;0;18;0

REM Colon/comma-separated parameters (alternate format)
PRINT#15, "U1:2,0,18,0"

REM Another equivalent with commas outside quotes (some BASIC variants)
PRINT#15, "U1",2,0,18,0
```

## References

- "block_read_get_and_null_handling" — Handling GET# reads and null bytes after U1
- "block_read_example_program" — Sample BASIC program that reads the BAM using U1 and prints the block