# TRACK 17 - SECTOR 01 (final portion) — sequential data block (disk name, ID, filenames)

**Summary:** This section provides a complete 256-byte dump of Track 17, Sector 01 from a Commodore 64 disk, detailing the structure and content of a sequential data block. It includes the forward pointer bytes, disk name, disk ID, and filenames, with $0D (carriage return) used as a record delimiter.

**Sector Layout and Interpretation**

In a Commodore 64 disk data sector, bytes $00 and $01 serve as a forward pointer indicating the track and sector of the next data block in a sequential file. In this case, the forward pointer points to Track 17, Sector 11. The remaining 254 bytes (bytes $02–$FF) constitute the data area, containing the disk name, disk ID, and a list of filenames. The carriage return character ($0D) acts as a delimiter between records or entries.

Below is the complete 256-byte sector dump, with hexadecimal values on the left and their ASCII equivalents on the right. Non-printable characters are represented by their hexadecimal values in angle brackets.
