# Pattern matching and wildcards for disk files (LOAD, "*", "?")

**Summary:** Pattern matching on the 1541/disk drive uses '*' to match any trailing characters and '?' as a single-character wildcard; these are used with LOAD (and directory listing via "$0:") and also with SCRATCH to affect groups of files.

## Pattern matching and wild cards
- '*' after a name matches any trailing characters. Example intent: LOAD "T*",8 finds the first file on the disk whose name begins with T.
- '?' matches exactly one character in the name. Example: LOAD "T?NT",8 will match names like TINT, TENT, etc.
- If the name in the LOAD is just "*", the drive will LOAD the last-accessed program on that disk. If no program has yet been LOADed from that disk, the first file listed in the directory is used.
- Directory filtering uses the same patterns when loading the disk directory: e.g. LOAD "$0:TEST",8 requests only TEST (if present); LOAD "$0:T*",8 lists all names beginning with T; LOAD "$0:T?ST",8 lists 4-character names with T _ S T in positions 1,3,4; LOAD "$0:T?ST*",8 lists names of any length that match those fixed positions.
- These pattern rules are applicable to the Commodore 1541 disk drive file operations; the same pattern matching is also available to SCRATCH for removing groups of files (see References).

## Source Code
```text
; Examples of LOAD and directory pattern usage (device number ,8 for disk):
LOAD "T*",8        ; load first file starting with "T"
LOAD "HELLO*",8    ; load first file starting with "HELLO"
LOAD "T?NT",8      ; load a 4-letter name matching T?NT (TINT, TENT, ...)
LOAD "*",8         ; load last-accessed program on disk (or first in directory if none accessed)

; Directory filtering examples:
LOAD "$0:TEST",8       ; show only TEST in directory (if present)
LOAD "$0:T*",8         ; list all files beginning with T
LOAD "$0:T?ST",8       ; list 4-letter names with pattern T?ST
LOAD "$0:T?ST*",8      ; list names of any length matching T?ST...
```

## References
- "scratch_command_erasing_files_and_pattern_matching" — pattern matching used with SCRATCH to remove groups of files
