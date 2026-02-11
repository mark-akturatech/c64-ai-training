# Random Files — Overview (direct block access, disk geometry)

**Summary:** Explains Commodore disk random-access (direct block) files vs sequential scans, 256‑byte physical blocks, disk geometry (35 tracks, varying blocks per track), total 683 blocks (664 free on a blank disk), and where the directory is located (track 18).

**Explanation**
Sequential files provide a continuous stream; random (direct block) files allow addressing individual 256‑byte disk blocks so you can retrieve a record without scanning an entire file. The Commodore disk system supports two random-access methods: the direct-block random files described here (work with 256‑byte physical blocks) and relative files (covered in the next chapter), which are generally more convenient for data handling. Direct random files remain useful for low-level and machine‑language tasks where exact block control is required.

Disk geometry and allocation behavior relevant to random access:
- The diskette is organized into 35 concentric tracks (track 1 = outermost, track 35 = innermost).
- The DOS stores the disk directory on track 18 and fills free space from the center outward.
- Physical blocks are 256 bytes each; random files address these blocks directly.
- Total blocks per disk: 683; free blocks on a fresh (blank) diskette: 664.
- Blocks per track vary by radial position (outer tracks contain more blocks than inner ones). See the table in Source Code for the per‑track-range block counts.

To perform direct block access, you need to open two channels to the disk drive: one for commands and another for data. The command channel is typically opened as follows:

For the data channel, you open a direct access file using the pound sign (`#`) as the filename:

Here, `5` is the logical file number and secondary address, `8` is the device number, and `"#"` indicates a direct access file. Optionally, you can specify a buffer number:

In this case, `2` specifies the drive buffer to be used. If omitted, the drive will automatically assign the next available buffer. ([retro-bobbel.de](https://retro-bobbel.de/zimmers/cbm/manuals/drives/1571_Users_Guide_252095-01_%281985_Jun%29.pdf?utm_source=openai))

To read a specific block from the disk, use the `U1` command:

This command reads the block located at the specified `track` and `sector` into the buffer associated with the data channel (logical file number `5` in this example). After issuing this command, you can read the data from the buffer using `INPUT#` or `GET#` statements. ([retro-bobbel.de](https://retro-bobbel.de/zimmers/cbm/manuals/drives/1571_Users_Guide_252095-01_%281985_Jun%29.pdf?utm_source=openai))

To write data to a specific block, use the `U2` command:

Before issuing this command, ensure that the buffer associated with the data channel contains the data you want to write. ([retro-bobbel.de](https://retro-bobbel.de/zimmers/cbm/manuals/drives/1571_Users_Guide_252095-01_%281985_Jun%29.pdf?utm_source=openai))

Calculating the physical location (track and sector) for a given logical block index requires understanding the disk's geometry. The number of sectors per track varies:

- Tracks 1–17: 21 sectors per track
- Tracks 18–24: 19 sectors per track
- Tracks 25–30: 18 sectors per track
- Tracks 31–35: 17 sectors per track

To determine the track and sector for a given logical block number:

1. Start with the logical block number (0-based).
2. Subtract the number of sectors in each track, starting from track 1, until the remaining number is less than the sectors in the current track.
3. The current track number is the track you're on.
4. The remaining number is the sector number (0-based) within that track.

For example, to find the track and sector for logical block number 100:

1. Logical block number: 100
2. Subtract sectors in tracks 1–17: 100 - (17 * 21) = 100 - 357 = -257 (since the result is negative, the block is within tracks 1–17)
3. Calculate the track: 100 ÷ 21 = 4 remainder 16
4. Track number: 1 + 4 = 5
5. Sector number: 16

So, logical block number 100 corresponds to track 5, sector 16.

Note: This section outlines the geometric layout and motivation for random/direct block access. Examples of channel OPEN syntax, buffer preparation, or the specific CBM DOS commands to read/write blocks are not included here — see referenced chunks for those details.

## Source Code

```basic
OPEN 15,8,15
```

```basic
OPEN 5,8,5,"#"
```

```basic
OPEN 5,8,5,"#2"
```

```basic
PRINT#15,"U1";5;0;track;sector
```

```basic
PRINT#15,"U2";5;0;track;sector
```

```text
Table 6.1: Track and Block Format
+--------------+-------------+-------------+
| TRACK NUMBER | BLOCK RANGE | TOTAL BLOCK |
+--------------+-------------+-------------+
|    1 to 17   |   0 to 20   |      21     |
|   18 to 24   |   0 to 18   |      19     |
|   25 to 30   |   0 to 17   |      18     |
|   31 to 35   |   0 to 16   |      17     |
+--------------+-------------+-------------+
```

## References
- "track_and_block_format_table" — expands on table 6.1 with additional per-track block detail
- "opening_random_access_channel_and_buffers" — expands on how to prepare channels and buffers for random access (OPEN syntax and buffer management)
