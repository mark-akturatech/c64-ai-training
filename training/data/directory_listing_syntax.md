# Commodore IEC Serial Bus Directory Commands (Dollar-sign "$" Syntax)

**Summary:** IEC serial bus directory command syntax using "$" retrieves a disk directory from a drive; supports drive specifier, wildcards, and file-type filtering (e.g. .PRG). See also command channel 15 for how directory commands are sent to the drive.

## Directory Listing
The dollar-sign syntax "$" requests a directory listing from a Commodore IEC device (disk drive). It supports an optional drive specifier and filename pattern with wildcards; some drives may also support additional filtering (file-type, timestamp) when available.

Syntax (compact):
- $[drive:][pattern]  (drive = device number, pattern = filename/wildcard)

Behavior:
- "$" — retrieves the full directory from the currently selected/default device.
- "$0:*" — retrieves all files from drive 0.
- "$0:*.PRG" — retrieves only files matching the .PRG extension on drive 0.
- Wildcards are supported in the pattern (e.g., "*" and "?" as implemented by the drive firmware).
- Additional filters (file type, timestamp) may be supported on some drive firmware revisions; use drive-specific documentation for extended filters.

Notes:
- Directory requests are sent over the IEC command channel (see "command_channel_15" for details on channel 15 usage).
- The exact listing format returned (name, type, size, date) depends on the drive firmware and is not standardized by the dollar-sign syntax alone.

## References
- "command_channel_15" — expands on how directory commands are sent to the drive
