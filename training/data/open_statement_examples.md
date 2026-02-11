# OPEN examples: disk, cassette, RS-232, printer (C64 BASIC)

**Summary:** Concrete C64 BASIC `OPEN` statement examples demonstrating file numbers (channels), device numbers (IEC/serial or cassette/printer), secondary addresses, file-name/type/mode strings, and the use of `CHR$(10)` for RS‑232 newline. Covers sequential disk files, tape (cassette) read/write, keyboard/screen I/O, printer modes, RS‑232 channel, and disk command channel.

**Notes and explanation**

- General `OPEN` format: `OPEN <file#>,<device#>,<secondary#>[,"name[,type[,mode]]"]` (file number = BASIC channel; device number = IEC/serial or cassette/printer device; secondary = logical subchannel on the device). The secondary address is a logical channel number; 15 is commonly used as the disk command channel.

- Examples illustrate common device usages and variations:

  - **Disk sequential file:** Includes filename, type (`SEQ`), and mode (`W` for write).

  - **Tape/cassette:** Examples for write-with-EOF and standard read/write use the cassette device with a name string.

  - **Keyboard and screen:** `OPEN` without a name string to attach BASIC channel to keyboard (device 0) or screen (device 3).

  - **Printer:** Different device numbers and secondary addresses control which printer device and translation mode (upper/graphics vs upper/lower case).

  - **RS‑232:** `OPEN` with `CHR$(10)` used to send a newline (ASCII LF) to the serial device.

  - **Disk commands:** Opening device 8 with secondary 15 sends a command channel string to the disk drive.

## Source Code

```basic
10 OPEN 2,8,4,"DISK-OUTPUT,SEQ,W"  : REM Opens sequential file on disk

10 OPEN 1,1,2,"TAPE-WRITE"         : REM Write End-of-File on Close

10 OPEN 50,0                       : REM Keyboard input

10 OPEN 12,3                       : REM Screen output

10 OPEN 130,4                      : REM Printer output

10 OPEN 1,1,0,"NAME"               : REM Read from cassette

10 OPEN 1,1,1,"NAME"               : REM Write to cassette

10 OPEN 1,2,0,CHR$(10)             : REM Open channel to RS-232 device

10 OPEN 1,4,0,"STRING"             : REM Send upper case/graphics to the printer

10 OPEN 1,4,7,"STRING"             : REM Send upper/lower case to printer

10 OPEN 1,5,7,"STRING"             : REM Send upper/lower case to printer with device # 5

10 OPEN 1,8,15,"COMMAND"           : REM Send a command to disk
```

## References

- "open_statement_overview_and_format" — expands on `OPEN` statement syntax and parameter meanings

- "cassette_and_disk_secondary_addresses" — expands on cassette and disk secondary address usage

- "file_name_type_and_modes" — expands on filename, file type, and mode string formats