# Disk housekeeping chores handled by DOS (NEW, ERASE, INITIALIZE, RENAME, SCRATCH, COPY)

**Summary:** Describes 1541/CBM DOS disk-housekeeping commands (NEW, ERASE, INITIALIZE, RENAME, SCRATCH, COPY), their use via the command channel, and the drive-local asynchronous execution model where the 1541 carries out tasks independently until the next disk operation (including closing the command channel) is attempted.

**Disk housekeeping overview**
Disk housekeeping operations are DOS commands sent to the disk drive over the command channel. Typical chores are:
- Preparing a blank diskette for first use (NEW / format).
- Erasing the contents of a diskette currently in use (ERASE).
- Initializing a diskette (INITIALIZE).
- Renaming a file (RENAME).
- Scratching (deleting) a file (SCRATCH).
- Copying a file (COPY).

These commands are executed by the disk drive's onboard DOS (e.g., 1541) once issued; the drive performs the work autonomously. Because the 1541 is an intelligent peripheral, the host computer (C64) does not have to wait idly while the drive completes the task — the CPU and RAM remain usable (you can edit or RUN programs in memory) until you attempt any further disk operation. The only time the host will block waiting for the drive is when it attempts another disk operation (this includes operations such as closing the command channel), at which point the DOS will have to finish the pending housekeeping task.

Note: This behavior is not a host-side spooling mechanism; it is simply the drive's autonomous execution of its own DOS commands.

**Command Syntax and Parameters**

**NEW (Format Disk):**
- **Syntax:** `PRINT#15, "N0:<diskname>,<id>"`
- **Parameters:**
  - `<diskname>`: Up to 16 characters; avoid commas, colons, semicolons, and wildcards.
  - `<id>`: Two-character identifier; any letters, numbers, or graphics characters.
- **Notes:** Formats the disk, erasing all data. Omitting `<id>` clears the directory of an already-formatted disk without reformatting. ([scribd.com](https://www.scribd.com/document/40438/The-Commodore-1541-Disk-Drive-User-s-Guide?utm_source=openai))

**ERASE (Clear Directory):**
- **Syntax:** `PRINT#15, "N0:<diskname>"`
- **Parameters:**
  - `<diskname>`: Up to 16 characters; avoid commas, colons, semicolons, and wildcards.
- **Notes:** Clears the directory of an already-formatted disk without reformatting. ([scribd.com](https://www.scribd.com/document/40438/The-Commodore-1541-Disk-Drive-User-s-Guide?utm_source=openai))

**INITIALIZE:**
- **Syntax:** `PRINT#15, "I0"`
- **Notes:** Resets the drive and reads the disk BAM into its internal memory. Rarely needed as the drive usually does this on its own, except if a disk is exchanged for another one with the same ID. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_DOS?utm_source=openai))

**RENAME:**
- **Syntax:** `PRINT#15, "R0:<newname>=<oldname>"`
- **Parameters:**
  - `<newname>`: Up to 16 characters; avoid commas, colons, semicolons, and wildcards.
  - `<oldname>`: Must match exactly as it appears in the directory; wildcards not allowed.
- **Notes:** Cannot rename a file that is currently open for read or write. ([scribd.com](https://www.scribd.com/document/209854469/Inside-Commodore-DOS?utm_source=openai))

**SCRATCH (Delete File):**
- **Syntax:** `PRINT#15, "S0:<filename>"`
- **Parameters:**
  - `<filename>`: Supports wildcards `*` (matches all remaining characters) and `?` (matches one character).
- **Notes:** Be cautious when using wildcards, as multiple files may be deleted. ([scribd.com](https://www.scribd.com/document/40438/The-Commodore-1541-Disk-Drive-User-s-Guide?utm_source=openai))

**COPY:**
- **Syntax:** `PRINT#15, "C0:<newfile>=<oldfile>"`
- **Parameters:**
  - `<newfile>`: Up to 16 characters; avoid commas, colons, semicolons, and wildcards.
  - `<oldfile>`: Must match exactly as it appears in the directory; wildcards not allowed.
- **Notes:** Cannot copy to a different drive; both files must reside on the same disk. ([scribd.com](https://www.scribd.com/document/40438/The-Commodore-1541-Disk-Drive-User-s-Guide?utm_source=openai))

**Error Codes**

- **20:** Block header not found on disk.
- **21:** Sync character not found.
- **22:** Data block not present.
- **23:** Checksum error in data.
- **24:** Byte decoding error in data.
- **25:** Write-verify error.
- **26:** Attempt to write with write protect on.
- **27:** Read error (checksum error in header).
- **28:** Write error (long data block).
- **29:** Disk ID mismatch.
- **30:** Syntax error (general syntax).
- **31:** Syntax error (invalid command).
- **32:** Syntax error (invalid command length).
- **33:** Syntax error (invalid file name).
- **34:** Syntax error (no file given).
- **39:** Syntax error (invalid command).
- **50:** Record not present.
- **65:** No block.
- **66:** Illegal track and sector.
- **67:** Illegal system track or sector.
- **70:** No channel available.
- **71:** Directory error.
- **72:** Disk full.
- **73:** DOS mismatch.
- **74:** Drive not ready. ([commodore.blog](https://www.commodore.blog/CBM/1541AppendixB?utm_source=openai))

## References
- "new_command_syntax_and_parameters" — expands on NEW (format) command details  
- "initialize_command_purpose_and_syntax" — expands on INITIALIZE command details  
- "rename_command_syntax_and_restrictions" — expands on RENAME command details  
- "copy_command_syntax_and_restrictions" — expands on COPY command details  
- "scratch_command_wildcards_unclosed_files_and_consequences" — expands on SCRATCH command and unclosed-file risks  
- "validate_command_syntax" — expands on VALIDATE command