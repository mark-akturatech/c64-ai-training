# Commodore IEC Serial Bus — Drive Status Reporting

**Summary:** IEC serial-bus drive status is returned as a CR-delimited ASCII string in the format: code,string,a,b[,c]. Contains numeric status code (decimal ASCII), human text, and one or more numeric fields (often track/sector or file-related). Common codes: 00 OK, 01 scratched count, 20-23 read errors, 25-26 write errors, 30-33 syntax/filename errors, 60-63 file open/existence, 72 disk full, 73 DOS version, 74 drive not ready.

## Status format and meanings
Status replies from a Commodore drive (via the IEC serial bus) are ASCII text terminated by CR and formatted as:
code,string,a,b[,c]
- code: two-digit decimal ASCII status code (e.g. "00", "72")
- string: human-readable status text (drive-supplied)
- a,b[,c]: numeric fields whose meaning depends on the status code (commonly track/sector, counts, or file descriptors). Example: for 01 (files scratched) the number of scratched files is returned in the track/sector fields.

Error-code category grouping:
- 0-1: Success / informational
- 2: Physical/hardware errors
- 3: Parsing / syntax errors
- 5: Relative file issues
- 6: File errors (not found, exists, open state)
- 7: Generic errors

Notes:
- 73 (DOS version) is commonly returned on drive power-up or reset.
- Codes and the interpretation of a/b/c vary by code — consult the code table (below) for the expected meaning per code.

## Source Code
```text
Status return format:
  code,string,a,b[,c]

Error code categories:
  0-1: Success / informational
  2:   Physical/hardware errors
  3:   Parsing errors
  5:   Relative file issues
  6:   File errors (not found, exists, etc.)
  7:   Generic errors

Common status codes:
  00 - OK
  01 - Files scratched (number in track/sector fields)
  20 - Read error (block header not found)
  21 - Read error (sync mark not found)
  22 - Read error (data block not present)
  23 - Read error (checksum error)
  25 - Write error (verify failed)
  26 - Write protect on
  30 - Syntax error (general)
  33 - Syntax error (invalid filename)
  60 - Write file open
  61 - File not open
  62 - File not found
  63 - File exists
  72 - Disk full
  73 - DOS version (returned on power-up/reset)
  74 - Drive not ready
```

## References
- "command_channel_15" — expands on status returned on the command/status channel 15
- "basic_examples" — BASIC example showing reading the error channel