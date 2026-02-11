# OPEN: <file-name>, <type>, <mode> (C64 BASIC)

**Summary:** Rules for OPEN's <file-name> (1–16 chars), <type> (defaults to Program when omitted), and <mode> (sequential files default to read R unless W specified). Notes on REL (Relative) files and disk-only restrictions.

## File-name rules
- <file-name> is a string of 1–16 characters.
- The <file-name> is optional only for cassette or printer devices.

## Default file type when <type> omitted
- If <type> is omitted, the file type automatically defaults to Program, unless a <mode> is given (see Modes).

## Modes and defaults
- Sequential files opened without an explicit <mode> default to read: <mode>=R.
- To open a sequential file for writing, specify <mode>=W.

## Relative files and disk-only restriction
- Use <type>=REL to OPEN an existing Relative file.
- Relative (REL) and Sequential file types are supported for disk devices only (not for cassette/printer).

## References
- "cassette_and_disk_secondary_addresses" — expands on disk-specific secondary-address and file-type notes
- "errors_when_opening_files" — expands on error conditions when opening files with types/modes
- "open_examples" — examples demonstrating file-name, type, and mode usage