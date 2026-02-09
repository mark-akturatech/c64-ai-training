# Block-Write Command (U2)

**Summary:** The U2 command writes the entire 256-byte DOS buffer to a specified disk track and sector using a `PRINT#` command (e.g., `PRINT# file#, "U2"; channel; drive; track; sector`). Parameters: `channel` = secondary address, `drive` = 0, `track` = 1–35, `sector` = 0–(track-dependent).

**Block-Write Command (U2)**

The block-write (U2) command writes the full 256-byte DOS buffer to any specified track and sector on the diskette. Its syntax and parameter roles mirror the block-read command (U1); unlike ordinary file writes, the current position of the buffer pointer is irrelevant — U2 always writes the entire 256-byte buffer.

Behavior and parameter meanings:
- `file#` — logical file number of the command channel (the channel opened to the device).
- `channel` — the secondary address used when the channel was opened (the DOS command channel secondary).
- `drive` — device number; typically 0.
- `track` — track number to write to; valid range is 1 to 35.
- `sector` — sector number within the specified track; valid range depends on the track (sector counts vary by track).

The number of sectors per track varies as follows:

| Tracks | Sectors per Track | Sector Numbers |
|--------|-------------------|----------------|
| 1–17   | 21                | 0–20           |
| 18–24  | 19                | 0–18           |
| 25–30  | 18                | 0–17           |
| 31–35  | 17                | 0–16           |

This variation is due to the physical layout of the disk, where outer tracks are longer and can accommodate more sectors. ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

Notes:
- The command writes exactly 256 bytes (the entire DOS buffer).
- Syntax separators may be semicolon or comma (the usual BASIC separators for `PRINT#`).
- The format parallels U1 (block-read), so command-channel semantics and error/status behavior follow the same conventions as other DOS command-channel operations.

## Source Code

```basic
REM Example (semicolons):
PRINT#15,"U2";2;0;18;0

REM Example (commas):
PRINT#15,"U2",2,0,18,0
```

## Key Registers

- `channel` — the secondary address used when the channel was opened.

## References

- "edit_disk_name_program" — expands on an example that modifies the disk name in the DOS buffer and writes it with U2.