# Logical file number vs 1541 channel number; 1541 track/sector layout

**Summary:** Explains the distinction between the C64 logical file number (BASIC file handle) and the 1541 drive channel number used for direct-access commands (GET#/PRINT# routing), and lists the 1541 diskette track/sector layout and the DOS error 66 condition.

## Direct-access file vs channel mapping
- The C64 logical file number (the BASIC file handle you supply to OPEN) is the identifier the BASIC program uses for subsequent PRINT# / GET# operations.
- PRINT# / GET# send their data to the 1541 channel number associated with that logical file; the logical file number (BASIC side) and the 1541 channel number (drive side) need not be the same.
- The 1541 channel number is used only in direct-access commands (the drive-level commands that reference channels explicitly). Using mnemonic file/channel numbers (e.g., remembering that channel 14 is the directory) is optional — BASIC logical file handles can be mapped arbitrarily to drive channels.
- Example noted in source: opening logical file 1 and mapping it to drive channel 14 (i.e., logical file 1 routes PRINT#/GET# to the drive channel 14). (OPEN syntax shown elsewhere; see reference.)

## 1541 diskette track/sector layout
- The 1541 disk is organized into four radial zones; each zone has a different number of sectors per track.
- Zone boundaries and sector counts are fixed; attempting to access an invalid track or a sector outside the per-track range triggers a DOS error.

## Source Code
```text
Zone   Track Range   Sector Range   Number of Sectors
1      1 - 17        0 - 20         21
2      18 - 24       0 - 18         19
3      25 - 30       0 - 17         18
4      31 - 35       0 - 16         17

NOTE: If you attempt to access a track less than 1, a track greater than 35,
or a sector out of range for a given track, you will get a DOS error message
number 66, ILLEGAL TRACK OR SECTOR.
```

## References
- "direct_access_open_syntax" — expands on examples of OPEN syntax and parameter meanings