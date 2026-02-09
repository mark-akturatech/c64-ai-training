# Secondary Address Meanings (cassette and disk)

**Summary:** Secondary address values control file-open semantics for cassette and disk devices on the C64: cassette secondaries 1 and 2 affect write/EOT behavior and disk drives require a secondary (data-file secondaries 2–14; other numbers have DOS meanings).

## Description
- Cassette:
  - Secondary = 1 opens a cassette tape file for writing.
  - Secondary = 2 causes an end-of-tape (EOT) marker to be written when the file is closed. The EOT marker prevents accidentally reading past the end of stored data, which would otherwise produce the BASIC error message "?DEVICE NOT PRESENT".
- Disk drives:
  - Secondary addresses 2 through 14 are available for data files.
  - Other secondary numbers are reserved for special meanings used by DOS commands.
  - A secondary address must be supplied when opening files on disk drives; consult the disk drive/DOS manual for the specific meanings and usage of non-data secondaries and DOS command semantics.

## References
- "device_number_and_defaults" — introduces secondary addresses and default cassette secondary address  
- "file_name_type_and_modes" — explains how file type/mode interact with disk usage