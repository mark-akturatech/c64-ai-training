# KERNAL: Keyboard Decode Table 4 (Control)

**Summary:** Fourth keyboard decode table for Commodore 64 KERNAL (data at .:EC78–.:ECB8). Use $DC00 (write row) and $DC01 (read column) to lookup ASCII/matrix values; contains special control functions (Ctrl-H/I/S/T) and trailing free bytes ($FF).

## Description
This is the final keyboard decode table used by the KERNAL. The ASCII (or matrix) code for a pressed key is found at the intersection of the row written to $DC00 and the column read from $DC01 (CIA1 ports). The table contains control-function entries (examples mentioned in the source):

- <Ctrl-H> — disables the upper/lower case switch
- <Ctrl-I> — enables the upper/lower case switch
- <Ctrl-S> — homes the cursor
- <Ctrl-T> — deletes character

Notes:
- Matrix values use $FF as a filler/free byte (trailing $FF at the end of rows and a final free byte).
- The source remarks that italic keys represent an ASCII code only, not a Commodore (CBM) PETSCII/graphic character.

## Source Code
```asm
.:EC78 FF FF FF FF FF FF FF FF
.:EC80 1C 17 01 9F 1A 13 05 FF
.:EC88 9C 12 04 1E 03 06 14 18
.:EC90 1F 19 07 9E 02 08 15 16
.:EC98 12 09 0A 92 0D 0B 0F 0E
.:ECA0 FF 10 0C FF FF 1B 00 FF
.:ECA8 1C FF 1D FF FF 1F 1E FF
.:ECB0 90 06 FF 05 FF FF 11 FF
.:ECB8 FF                       free byte
```

## Key Registers
- $DC00-$DC01 - CIA 1 - keyboard row select (write $DC00) / column read (read $DC01) for lookup in this decode table

## References
- "keyboard_select_vectors" — expands on vectors pointing to this table
- "graphics_text_control" — expands on uses of the control-table functions to enable/disable upper/lower case

## Labels
- DC00
- DC01
