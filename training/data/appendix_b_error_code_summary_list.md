# CBM Floppy Error Message Summary (Appendix B)

**Summary:** Index of Commodore (CBM) floppy (CBM DOS / drive ROM) error message numbers 0–74 with short captions; these codes are reported by the drive error channel (INPUT# 15) and by DOS/drive routines.

## Error code index
This is a compact reference list of CBM floppy error numbers and their short captions. These are the brief status/error codes returned by Commodore disk drives (CBM DOS) and reported through the drive error channel (INPUT# 15). Codes 2–19 are unused and should be ignored. Use the detailed descriptions in the referenced chunks for full explanations and example error-channel reads.

## Source Code
```text
 0         OK, no error exists.
 1         Files scratched response. Not an error condition.
 2-19      Unused error messages: should be ignored.
 20        Block header not found on disk.
 21        Sync character not found.
 22        Data block not present.
 23        Checksum error in data.
 24        Byte decoding error.
 25        Write-verify error.
 26        Attempt to write with write protect on.
 27        Checksum error in header.
 28        Data extends into next block.
 29        Disk id mismatch.
 30        General syntax error
 31        Invalid command.
 32        Long line.
 33        Invalid filename.
 34        No file given.
 39        Command file not found.
 50        Record not present.
 51        Overflow in record.
 52        File too large.
 60        File open for write.
 61        File not open.
 62        File not found.
 63        File exists.
 64        File type mismatch.
 65        No block.
 66        Illegal track or sector.
 67        Illegal system track or sector.
 70        No channels available.
 71        Directory error.
 72        Disk full or directory full.
 73        Power up message, or write attempt with DOS Mismatch.
 74        Drive not ready.
```

## References
- "appendix_b_detailed_error_descriptions_part1" — detailed explanations of the listed error numbers
- "reading_error_channel_example_and_error_fields" — how to read these error numbers from the error channel (INPUT# 15) and interpret error fields