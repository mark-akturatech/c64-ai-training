# Commodore 64 ROM: Control-key decode table ($EC78-$ECB8)

**Summary:** Control-key decode table bytes located at $EC78-$ECB8 in the C64 ROM; used by the keyboard routine to map control-key combinations. Table length 65 bytes, with FF used as "no mapping" markers and one 00 entry.

## Table description
This data block is the control-key decode table consulted by the keyboard handling routine (used when resolving Control+key combinations). It spans $EC78–$ECB8 (65 bytes). FF bytes mark combinations that have no mapping; any other byte is the value returned by the decode (e.g. a PETSCII/handler code). The table is laid out sequentially in ROM (addresses shown in the Source Code section).

Notes and observable facts from the data:
- Table length: $ECB8 - $EC78 + 1 = $41 (65) bytes.
- The block begins with eight FF bytes at $EC78-$EC7F (no mappings for that initial index range).
- A single 00 byte appears at $ECA6 (maps a specific control combination to $00).
- Several entries use high-bit values ($90, $9C, $9E, $9F, $92, etc.), indicating definitions that set bit 7 (as stored in ROM).
- Multiple FF markers are scattered; any Control combination indexing an FF entry resolves to "no mapping" (handled by the calling routine).
- This table is referenced or invoked by routines documented elsewhere (see References).

(No attempt has been made here to expand the table into the key-to-value index mapping used by the decode code; consult the keyboard routine disassembly for the exact indexing formula.)

## Source Code
```text
.:EC78 FF FF FF FF FF FF FF FF
.:EC80 1C 17 01 9F 1A 13 05 FF
.:EC88 9C 12 04 1E 03 06 14 18
.:EC90 1F 19 07 9E 02 08 15 16
.:EC98 12 09 0A 92 0D 0B 0F 0E
.:ECA0 FF 10 0C FF FF 1B 00 FF
.:ECA8 1C FF 1D FF FF 1F 1E FF
.:ECB0 90 06 FF 05 FF FF 11 FF
.:ECB8 FF
```

## References
- "shift_c_lock_handling" — expands on invoked or consulted code when Control+key sequences (e.g. SHIFT+C) are processed
- "auto_load_run_keyboard_buffer" — expands on keyboard buffer format and sample entries for auto load/run
