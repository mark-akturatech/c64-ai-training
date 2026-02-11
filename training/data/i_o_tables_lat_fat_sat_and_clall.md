# Tables for File Numbers, Device Numbers, and Secondary Addresses (601-630 / $259-$276)

**Summary:** Kernal I/O tables LAT ($259-$262), FAT ($263-$26C) and SAT ($26D-$276) each hold up to ten one-byte entries for active logical file numbers, device numbers, and secondary addresses; entries are appended on OPEN and compacted on CLOSE, and the active-file count is stored at location 152 ($98). CLALL ($F32F) zeros $98 to empty the tables.

## Layout and behavior
All three tables are 10-byte arrays in zero-page/RAM used by the C64 Kernal to track active I/O files:
- LAT (Logical Address Table) at $0259-$0262 — kernel table of active logical file numbers (10 bytes).
- FAT (File/Device Address Table) at $0263-$026C — device numbers corresponding to each logical file (10 bytes).
- SAT (Secondary Address Table) at $026D-$0276 — secondary addresses for each logical file (10 bytes).

Rules and behavior:
- Each active I/O file occupies one slot in each table; the slot index is the same across LAT/FAT/SAT for that file.
- On OPEN:
  - The logical file number is appended to the end of LAT.
  - The device number is appended to FAT at the same index.
  - The secondary address is appended to SAT at the same index.
  - The byte at location 152 (decimal) / $0098 is incremented (it holds the count of active I/O files).
- On CLOSE:
  - The byte at $0098 is decremented.
  - Table entries with indexes higher than the closed file are shifted down one slot (tables are compacted), eliminating the closed file’s entry.
- Kernal CLALL routine (JSR $F32F / 62255 decimal) zeros location $0098, which has the effect of emptying the three tables (since $0098=0 indicates zero active files).
- Each table holds exactly ten 1-byte entries; no implicit expansion occurs beyond these slots.

Notes preserved from source:
- Table entries are positional: if logical file number 2 is stored as the third entry in LAT, its corresponding device and secondary address occupy the third entries in FAT and SAT respectively.
- Table ranges are given both in decimal (601–630) and hex ($259–$276).

## Source Code
```text
Kernal I/O table map (decimal / hex):

 601-610    $0259-$0262    LAT  - Kernel Table of Active Logical File Numbers (10 bytes)
 611-620    $0263-$026C    FAT  - Kernel Table of Device Numbers for Each Logical File (10 bytes)
 621-630    $026D-$0276    SAT  - Kernel Table of Secondary Addresses for Each Logical File (10 bytes)

Other relevant locations/routines:

 152        $0098          Active I/O file count (incremented on OPEN, decremented on CLOSE)
 62255      $F32F          Kernal CLALL routine (zeros $0098 to clear tables)
```

## Key Registers
- $0259-$0262 - Kernal/RAM - LAT: Kernel Table of Active Logical File Numbers (10 bytes)
- $0263-$026C - Kernal/RAM - FAT: Kernel Table of Device Numbers for Each Logical File (10 bytes)
- $026D-$0276 - Kernal/RAM - SAT: Kernel Table of Secondary Addresses for Each Logical File (10 bytes)
- $0098       - Kernal/RAM - Count of active I/O files (increment/decrement on OPEN/CLOSE)

## References
- "basic_kernal_working_storage_and_buf_input_buffer" — expands on working storage area and BUF
- "keyboard_buffer_dynamic_keyboard_and_program_merge_techniques" — expands on keyboard buffer and dynamic keyboard techniques

## Labels
- LAT
- FAT
- SAT
- CLALL
