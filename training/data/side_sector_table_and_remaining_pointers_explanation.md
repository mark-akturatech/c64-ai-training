# Side sector 0 — sequential file track/sector pointer list (bytes 16–255)

**Summary:** Describes the layout of side sector 0 for a sequential file: bytes 16–255 contain 120 track/sector pointer pairs (240 bytes) to the first 120 data blocks; bytes 16–17 point to track 17 ($11), sector 03 ($03). Also notes that side sectors 4 and 5 are not yet allocated and will be used once the file exceeds 480 and 600 sectors, respectively.

**Description**

- Side sectors 4 and 5 are currently unallocated in this example. They will be allocated when the sequential data file grows beyond the indicated thresholds (more than 480 and 600 sectors, respectively), subject to disk free space.

- Bytes 16–255 of side sector 0 contain 240 bytes interpreted as 120 consecutive track/sector pointer pairs (two bytes per data block). Each pair points to a data block in the sequential file (first byte = track, second byte = sector).

- In this example, bytes 16–17 (the first pointer pair) contain track 17 ($11) and sector 03 ($03). This matches the track/sector listed in the directory for the start of the sequential portion.

- The data chain from that starting block proceeds as recorded: track 17, sector 03 ($11,$03) → track 17, sector 14 ($11,$0E) → track 17, sector 04 ($11,$04) → … (continues following the pointer chain recorded in subsequent block headers).
