# LA ($B8) — Current Logical File Number

**Summary:** Zero-page location $00B8 (decimal 184) holds the current logical file number (LA) used by the KERNAL device I/O routines; valid file numbers 1–255 (0 = system defaults), BASIC OPEN sets this value, and values >127 cause an ASCII linefeed to be sent after each carriage return.

## Description
This zero-page byte contains the logical file number for the device currently in use. Key behaviors and limits:
- Address: $00B8 (decimal 184), symbol: LA.
- Valid file-number range: 1–255. A value of 0 indicates system defaults.
- Limits on open files: a maximum of five disk files, and ten files total, may be open simultaneously.
- Special behavior for values >127: after each carriage return the system will send an ASCII linefeed (LF) character as well — useful for printers/terminals that require LF after CR (LF = $0A).
- How it's set: the BASIC OPEN command calls the KERNAL OPEN routine, which stores the logical file number here. In BASIC statement OPEN 4,8,15 the logical file number corresponds to the first parameter (4).

## Key Registers
- $00B8 - RAM - Current Logical File Number (LA); holds logical file number 1–255 (0 = defaults); >127 enables automatic LF after CR

## References
- "current_secondary_address_sa" — expands on secondary address used alongside logical file numbers when opening devices
- "current_device_number_fa" — expands on device number assignments that work together with logical file numbers

## Labels
- LA
