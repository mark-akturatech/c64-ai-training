# BASIC/DOS OPEN error messages

**Summary:** Describes Commodore 64 BASIC/DOS error messages related to OPEN: ?FILE NOT OPEN, ?FILE NOT FOUND, FILE EXISTS (DOS), and FILE OPEN; notes disk vs tape behavior and risk of overwriting tape files.

## Error Conditions
- ?FILE NOT OPEN (BASIC)
  - Cause: A program attempts to access (READ, WRITE, PRINT, etc.) a file or device before issuing a valid OPEN for that channel.
- ?FILE NOT FOUND (BASIC)
  - Cause: An OPEN for reading is attempted on a filename that does not exist (typically disk).
- FILE EXISTS (DOS)
  - Cause: DOS returns this message when an OPEN to disk is attempted for writing (or similar create operation) and a file with the same name already exists on the disk.
  - Note: This is a DOS message (disk device), not a BASIC runtime message.
- Tape behavior (VIC-1541/Datassette)
  - There is no automatic existence check for tape files; opening/creating a file on tape can overwrite previously saved data if the tape is not positioned correctly.
  - Action: ensure tape position is verified before writing (no automatic safeguard).
- FILE OPEN (BASIC)
  - Cause: Attempting to OPEN a file/channel that is already OPEN on that channel will produce this BASIC error.
- Printer-specific details
  - Some printer-related OPEN/DEVICE behaviors are documented in the Printer Manual (see that manual for device-specific nuances).

## References
- "file_name_type_and_modes" — expands on causes related to mode/type selection
- "open_examples" — expands on examples that may trigger or avoid these errors