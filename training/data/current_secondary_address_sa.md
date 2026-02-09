# SA ($B9) — Current Secondary Address

**Summary:** SA at $00B9 holds the current secondary address for the open device (secondary address, device-dependent behavior, disk/datasette/printer conventions). Covers valid ranges ($00–$1F for serial devices, $00–$7F for other devices), disk special numbers (0,1,15–31), LOAD/SAVE behaviors, Datasette EOT flag, and 1515/1525 printer character-set choices.

## Description
SA is a KERNAL workspace byte that contains the secondary address of the device currently being used. Valid ranges:
- 0–31 (decimal) for serial devices
- 0–127 (decimal) for other devices

Secondary addresses are interpreted by each device and are ignored by devices that do not use them (for example, keyboard and screen). Devices that can have multiple files open (notably disk drives) use the secondary address to distinguish channels.

Disk-specific behavior and conventions:
- Use secondary addresses 2–14 for ordinary disk file channels. Secondary addresses 0, 1, and 15–31 have special meanings to the disk drive and should generally be avoided for normal files.
- OPEN with secondary address 15 opens a channel to the Disk Operating System (DOS) itself (the DOS command channel).
- LOAD ... ,n,0 (secondary 0) loads the file to the address pointed to by the start-of-BASIC pointer (decimal 43, $2B) rather than the file’s recorded start address.
- LOAD ... ,n,1 (secondary 1) loads the file to the address recorded in the file; SAVE ... ,n,1 writes the file with its load address so this behavior can be round-tripped.
- LOAD and SAVE operations that omit the secondary address default to secondary 0.

Datasette conventions:
- Secondary 0 = read
- Secondary 1 = write
- Adding 2 writes an End-of-Tape (EOT) marker as well (so 2 = read+EOT? — source: "value of 2 can be added" meaning write+EOT when writing with 1+2). The EOT marker prevents searching past the marked file but does not prevent writing additional files after it.

1515 / 1525 printer conventions:
- Secondary 7 selects the uppercase/lowercase character set.
- Secondary 0, or omitting the secondary address, selects the uppercase/graphics character set.

## Source Code
(omitted — no assembly/BASIC listings or register tables included in this chunk)

## Key Registers
- $00B9 - KERNAL (system variable) - Current secondary address for the open device (SA); valid ranges: 0–31 for serial devices, 0–127 for other devices

## References
- "current_logical_file_number_la" — expands on logical file numbers used together with secondary addresses in OPEN statements  
- "pointer_current_filename_fnadr" — expands on filename pointer used when opening files (relevant to LOAD/SAVE and tape/disk behavior)  
- "current_device_number_fa" — expands on device number and device-type context for secondary-address meanings