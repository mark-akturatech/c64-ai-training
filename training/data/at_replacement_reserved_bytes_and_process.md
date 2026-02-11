# DOS reserved bytes during @-replacement (SAVE "@0:...",8)

**Summary:** During a DOS @-replacement (SAVE "@0:filename",8) the directory entry file-type byte ($02) is temporarily ORed with $20, bytes $1C-$1D hold the new copy's track/sector pointer while the copy is written, then that pointer is moved into $03-$04 and $1C-$1D zeroed; the old file's sectors are freed in the BAM and the original file type restored. These bytes can be observed by interrupting the drive during the SAVE routine (not recommended).

## Operation
- At the start of an @-replacement the file-type byte at directory-entry offset $02 is ORed with $20.
- A new copy of the file is written to disk. While the new copy is being written, the directory-entry offsets $1C (byte 28) and $1D (byte 29) contain the track and sector pointer to the start of the new replacement file.
- After the new copy is complete, the sectors that held the old file are marked free in the BAM.
- The track/sector pointer is moved from $1C/$1D to the canonical file-entry start pointer at $03/$04 (bytes 3 and 4). Bytes $1C and $1D are then cleared (zeroed).
- The proper file type is restored at byte $02.
- The only practical way to view these intermediate bytes is to interrupt the drive during a SAVE "@0:filename",8 operation; doing so is not recommended.

## Key Registers
- $02 - Directory entry offset - file-type byte (temporarily ORed with $20 during @ replacement)
- $03-$04 - Directory entry offsets - canonical track/sector pointer to first sector of file (start pointer)
- $1C-$1D - Directory entry offsets - temporary track/sector pointer used while new replacement copy is written

## References
- "file_entry_start_pointer_to_first_sector" — expands on how the track/sector pointer is used  
- "Chapter 9" — discusses a bug in the @ replacement command
