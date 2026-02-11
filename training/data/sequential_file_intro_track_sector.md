# Sequential file hex dump — TRACK 17 / SECTOR 03 intro

**Summary:** Human-readable header that precedes a sequential file hex/ASCII dump, identifying TRACK 17 and SECTOR 03 and pointing to the related raw-dump chunk ("dump_offset_00_ascii_magfile") where the raw bytes start at offset 00.

## Context
This chunk contains the introductory lines that appear immediately before the raw hex/ASCII dump of a sequential file. It labels the disk location as Track 17, Sector 03 and references a separate dump chunk that contains the raw data (starts at offset 00 — first data bytes / ASCII fragments). The text is a short human-readable header used to give context to the following raw dump.

## References
- "dump_offset_00_ascii_magfile" — raw hex/ASCII dump starting at offset 00 (first data bytes / ASCII fragments)
