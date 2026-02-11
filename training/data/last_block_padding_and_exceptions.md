# DOS block padding and "garbage" bytes

**Summary:** On Commodore DOS sequential files, unused bytes in a data block are not zeroed and may contain leftover buffer data; directory blocks are the exception (padded with $00 and with bytes 0/1 of the final directory block set to $00/$FF). Relative-file blocks are handled differently (see referenced chunk).

## Details
- The DOS file-buffer is not cleared before being filled. Unwritten bytes in the last block of a file therefore contain whatever remained in the buffer from previous read/write operations ("garbage").
- The last data block of a sequential file is commonly only partially overwritten; do not assume unused bytes are zero.
- Exceptions:
  - Directory blocks: a partial directory block is always padded with $00 (nulls) and always appears as a full block on disk.
  - Final directory block: bytes 0 and 1 of the last directory block contain $00 and $FF respectively.
- Relative files: use a different block/record format; consult the relative-file overview for their padding/format rules.

## References
- "sequential_file_sector_format" — expands on standard sequential sector layout
- "relative_file_overview_and_block_format_intro" — expands on relative file differences