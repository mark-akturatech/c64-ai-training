# OPEN (Commodore 64 BASIC)

**Summary:** Defines the OPEN statement for I/O channels in Commodore 64 BASIC. Documents the FORMAT (OPEN <file-num>,[<device>][,<address>][,"<File-name> [,<type>] [,<mode>]"]) and the required components (logical file number, device number, optional address/filename/type/mode).

## Description
The OPEN statement opens a channel for input and/or output to a peripheral device. Not all fields are required for every OPEN; some OPENs require only two codes:
- Logical file number (<file-num>)
- Device number (<device>)

The optional <address> (secondary address) and the quoted file specification ( "<File-name> [,<type>] [,<mode>]") are used when the device or operation requires them.

## References
- "logical_file_number" — expands on details about <file-num> range and use
- "device_number_and_defaults" — expands on details about <device>, secondary addresses and defaults
