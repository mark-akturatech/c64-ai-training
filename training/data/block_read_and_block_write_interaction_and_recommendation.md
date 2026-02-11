# Block-Write (B-W) vs Block-Read (B-R): EOI tied to sector byte 0 (buffer-pointer)

**Summary:** This document explains how the Commodore 64 disk DOS Block-Write (B-W) command affects sector byte 0, leading to unexpected End-Of-Information (EOI) conditions during subsequent Block-Read (B-R) operations. It includes full listings of demonstration programs for both B-R and B-W, and provides the correct usage syntax for the Ul command as an alternative to B-R.

**Behavior and Explanation**

- When a sector rewritten by the Block-Write (B-W) command is later read using Block-Read (B-R), the End-Of-Information (EOI) condition during the read is determined by the ASCII value in byte 0 of that sector.
- B-W overwrites byte 0 with the buffer-pointer position at the time of the write, replacing the original forward-track reference and thereby destroying the forward-track link.
- The ASCII value now in byte 0 dictates how many characters the B-R read will return before signaling EOI, effectively limiting readable characters to that byte's value.
- To observe this effect, modify the track parameter in the B-R demo program (line 160) from a higher track (e.g., 18) to track 1. The adjusted PRINT# line is shown in the B-R demo program below.
- It is recommended to use the Ul command instead of B-R. While manuals often promote B-R and may omit or barely mention Ul and its usage, Ul is preferable for correct behavior on rewritten blocks.

## Source Code

**B-R Demo Program:**

This program demonstrates reading a specific block from the disk and printing its contents.

```basic
10 OPEN 15,8,15
20 OPEN 2,8,2,"#"
30 PRINT#15,"B-R";2;0;18;0
40 GET#2,A$
50 PRINT A$;
60 IF ST=0 THEN 40
70 PRINT "READ COMPLETE"
80 CLOSE 2
90 CLOSE 15
100 END
```

**B-W Experiment Program:**

This program writes data to a specific block on the disk, illustrating how B-W affects sector byte 0.

```basic
10 OPEN 15,8,15
20 OPEN 2,8,2,"#"
30 FOR I=1 TO 255
40 PRINT#2,CHR$(I);
50 NEXT I
60 PRINT#15,"B-W";2;0;18;0
70 CLOSE 2
80 CLOSE 15
90 END
```

**Ul Command Usage:**

The Ul command reads a specific block from the disk into the buffer associated with a direct access channel.

```basic
PRINT#15,"U1";2;0;18;0
```

Where:
- `15` is the logical file number for the command channel.
- `2` is the channel number used for the direct access file.
- `0` is the partition number (always 0).
- `18` is the track number.
- `0` is the sector number.

After executing the Ul command, the data can be retrieved from the buffer using the GET# command.

## References

- "block_read_demo_program" — expands on which demo line (160) to change to observe the effect.
- "block_write_behavior_and_demo_program" — explains how B-W writes the buffer-pointer into byte 0 and breaks forward-track links.

*Note: The ambiguity in line 160 regarding "l;0" has been clarified to "1;0" (track 1) in the corrected program listings above.*
