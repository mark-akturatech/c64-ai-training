# KERNAL $FFBA — SETLFS (Set logical file, device and secondary address)

**Summary:** KERNAL entry $FFBA (SETLFS) sets the logical file number, device address, and secondary (command) address for subsequent KERNAL I/O routines (OPEN, CLOSE, CHKIN/CHKOUT, READ/WRITE, LISTEN/TALK). Device numbers 0–30 map to built-in and serial-bus devices; set Y=$FF when no secondary address is required.

**Description**
SETLFS prepares the KERNAL file-table entry used by OPEN and other I/O routines by storing three parameters:
- **Logical file number**: An index into the system file table used by OPEN/CLOSE and other I/O.
- **Device number**: Identifies the peripheral device; values 0–30. Device numbers ≥ 4 refer to devices on the CBM serial bus.
- **Secondary address**: The command or sub-address sent on the serial bus after the device number during handshaking; if unused, set Y = $FF.

**Calling convention (register usage):**
- A = logical file number
- X = device number (0–30)
- Y = secondary address (or $FF if none)

**Behavioral notes:**
- After SETLFS returns, subsequent KERNAL I/O calls (OPEN, CLOSE, CHKIN, CHKOUT, etc.) use the logical/device/secondary values just set.
- Device numbers are used both for built-in handlers (keyboard, screen, cassette, RS‑232, printer) and for addressing remote serial-bus devices (disk drives, printers, etc.).
- Setting Y = $FF indicates "no secondary address" (no command byte sent on the serial bus).

## Source Code
```text
Device address table (for SETLFS / LISTEN/TALK use):

ADDRESS  DEVICE
0        Keyboard
1        Cassette #1
2        RS-232C device
3        CRT display
4        Serial bus printer
8        CBM Serial bus disk drive

Device numbers of 4 or greater automatically refer to devices on the serial bus.
A command to the device is sent as a secondary address on the serial bus after
the device number is sent during the serial attention handshaking sequence.
If no secondary address is to be sent Y should be set to $FF.
```

## Key Registers
- $FFBA - KERNAL ROM - SETLFS: set logical file number (A), device number (X), secondary address (Y)

## References
- "ffbd_set_the_filename" — expands on filename used by OPEN/SAVE/LOAD
- "ffc0_open_a_logical_file" — expands on OPEN usage of SETLFS settings
- "ffb1_command_listen" — expands on LISTEN/TALK use of device addresses

## Labels
- SETLFS
