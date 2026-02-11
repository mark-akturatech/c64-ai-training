# 1541TEST/DEMO disk — display directory using LOAD "*0",8 then LIST

**Summary:** Exact keystrokes to display the 1541TEST/DEMO disk directory on a Commodore 64: LOAD "*0",8 followed by LIST. The immediate brief output shown before the directory appears is the single line "35".

## The Directory You See
Insert the 1541TEST/DEMO disk into the drive and type the following at the BASIC prompt (LOAD "*0",8 loads the directory into memory):

Type:
LOAD "*0",8

then:
LIST

After entering LIST the machine prints a single line containing:
35

immediately before the full directory text appears.

## Source Code
```basic
LOAD "*0",8
LIST

35
```

## References
- "example_directory_listing_output" — expands on the directory text that appears after these commands
- "directory_header_and_entry_fields" — explains the fields shown in the displayed directory