# Recovering a Hard Error (1541 disk recovery procedure)

**Summary:** Procedure for recovering from a 1541 hard error using disk utilities: VALIDATE A DISKETTE, FIND A FILE, DISPLAY A CHAIN, and EDIT TRACK & SECTOR; steps for severing the forward link (write 00,FF at sector offset 00), restoring PRG internal links by locating the last 00 byte and adjusting bytes/pointer, and reading/writing recovered SEQ data. Mentions distinguishing soft vs. hard errors and drive misalignment troubleshooting.

## Procedure
This procedure attempts to salvage the intact front portion of a file after a hard read error on a 1541-formatted diskette. It does not apply to relative (REL) files (see section 8.4). If multiple diskettes fail, suspect drive misalignment before attempting disk surgery.

Preliminary check
- If you see errors on other diskettes in your library, the 1541 drive may be misaligned; service is recommended. If the problem is limited to one diskette, proceed.

Step 1 — Validate files
- Run VALIDATE A DISKETTE (Appendix C). It emulates BASIC's VALIDATE and will chain through directory entries, highlighting bad files without aborting.

Step 2 — Find starting block
- Run FIND A FILE. Note the file's starting track and sector (ignore the directory track/sector for this purpose).

Step 3 — Trace the chain
- Run DISPLAY A CHAIN and enter the starting track/sector from step 2. The program will follow the file's forward track/sector chain until it encounters an error.
- If the error is a soft error, stop and follow the soft-error recovery procedure (see section 8.2).
- Ignore the sector where the error occurred; the file is considered lost from that point onward. Record the last successful track and sector displayed — this is the last intact block you can safely manipulate.

Step 4 — Sever the forward link
- Run EDIT TRACK & SECTOR and load the last successful track/sector noted in step 3.
- The starting byte within the sector is always 00. Change the first two bytes (offset 0 and 1) to 00 and FF, respectively, and rewrite the sector when prompted. (This severs the forward track/sector link.)
- Severing the forward link lets you safely manipulate the intact front end of the file on disk.

Handling BASIC PRG files
- A hard error typically destroys internal BASIC line links in a PRG. You must restore those links or the C64 will crash when editing the last line.
- You can restore links with a machine-language monitor on the C64 or by using EDIT TRACK & SECTOR on the disk:
  - Call up the sector you rewrote (the last successful block).
  - Inspect both half-pages of the block and locate the last 00 byte in the page. Change the two bytes immediately following that 00 to 00 00 as well.
  - Note the hexadecimal position (offset) of the last 00 byte you changed.
  - If you were editing the second half of the block, rewrite the sector and then recall the first half to finish edits.
  - Change the forward sector pointer (the block’s link bytes at offset 0) to the hexadecimal position of the last 00 byte you changed. Rewrite the sector a final time.
  - After these changes you should be able to LOAD, LIST, and EDIT the program; save it to a different disk immediately.

Handling SEQ files
- For sequential (SEQ) files the recovered data in the intact portion is usable. Read the recovered data into C64 RAM and rewrite it to another disk/file using normal sequential-file I/O. If unsure how to manipulate SEQ files, seek help from someone experienced.

Warnings and troubleshooting
- If the error occurs on multiple diskettes, suspect drive alignment/misalignment—do not proceed further with disk edits.
- If DISPLAY A CHAIN detects a soft error, do not attempt this hard-error procedure; follow soft-error recovery instead (section 8.2).
- This technique is a last resort and carries risk; it is not guaranteed.

## References
- "soft_vs_hard_errors_definition" — distinguishes hard vs. soft errors and when to use this hard-error procedure
- "recovering_relative_file" — recovering relative (REL) files (see section 8.4)