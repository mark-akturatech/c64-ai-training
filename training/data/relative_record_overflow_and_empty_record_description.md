# Relative-file record spanning Track 23, Sector 2 and Sector 12 (overflow, empty record, padding)

**Summary:** This document details how a relative-file record spans multiple sectors on a Commodore 1541 disk. Specifically, it examines the overflow from a previous record into Track 23, Sector 2, the formation of an empty record across Track 23, Sector 2 and Sector 12, and the padding beyond the last valid data byte in Sector 12.

**Record Layout**

- **Track 23, Sector 2:**
  - **Bytes 2–131:** Continuation (overflow) of the previous relative-file record.
  - **Bytes 132–255:** Beginning of the next record, which continues into the following sector.

- **Track 23, Sector 12:**
  - **Bytes 2–27:** Continuation of the record started in Sector 2. This record is empty, indicated by:
    - **Byte 2:** $FF (255) — empty record marker.
    - **Bytes 3–27:** $00 (null bytes).
  - **No forward chain pointer:** This sector does not link to another sector for this file.
  - **Byte count:** $B1 (177 decimal) — indicates the length of valid data in this sector.

- **Last Record Termination:**
  - The last record in the relative file ends at byte 177 of the sector (bytes 28–177).
  - Bytes beyond 177 are padding.

**Notes**

- An empty record is signaled by a leading $FF byte followed by null bytes ($00).
- The absence of a forward chain pointer and a byte count of $B1 indicate that file data terminates at offset 177 in the sector; bytes beyond this point are padding.

## Source Code

```text
Hex dump of Track 23, Sector 12:

Offset  | Data (Hex)                                      | Description
--------|-------------------------------------------------|------------------------------
00      | 00 00                                           | Track/Sector link to next block (not used)
02      | FF                                              | Empty record marker
03      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (part of empty record)
13      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
1F      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
2F      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
3B      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
4B      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
57      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
67      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
73      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
83      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
8F      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
9F      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
AB      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
BB      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
C7      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
D7      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
E3      | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 | Null bytes (continuation)
F3      | 00 00 00 00 00 00 00 00 00 00 00 00             | Null bytes (continuation)
FF      | 00                                              | Padding beyond valid data
```