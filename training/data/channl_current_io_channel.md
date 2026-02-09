# CHANNL ($13) — Current I/O Channel (CMD logical file) number

**Summary:** $0013 (CHANNL) is the BASIC zero-page variable holding the current CMD/logical-file number used to select the active input/output device (default: 0 = keyboard input, 3 = screen output). BASIC and the CMD/OPEN routines set this value; many BASIC I/O routines reset it back to the screen. See also keyboard buffer at $0200.

## Description
CHANNL at $0013 holds the logical-file (CMD channel) number that BASIC uses to determine which device to treat as the active input or output device for prompting and output formatting.

- Default values:
  - 0 = keyboard (default input device)
  - 3 = screen (default output device)
- When CHANNL is zero, BASIC uses normal screen-format prompting and output (e.g., TAB with PRINT uses cursor-right control characters).
- When CHANNL is nonzero (another device opened/listening), BASIC alters I/O behavior for that device:
  - TAB in PRINT outputs spaces instead of screen cursor controls (assumes non-screen device cannot cursor).
  - The "?" prompt for INPUT is suppressed.
  - The "EXTRA IGNORED" message is suppressed.
  - An input that is a carriage return by itself is ignored (not treated as a null string "").
- CMD places the new output file number into CHANNL and calls the KERNAL to open the device for output and put it in LISTEN state (so system messages such as READY are diverted to that device).
- Many BASIC routines will reset CHANNL and UNLISTEN the device after their I/O, restoring output to the screen. In particular, GET, GET#, INPUT, INPUT#, and PRINT# reset CHANNL after completion; PRINT and LIST do not reset CHANNL.
- Because BASIC checks CHANNL for device selection, it is possible to trick BASIC into treating tape (or other devices) as keyboard input by manipulating CHANNL and related buffers. An alternative technique uses the keyboard buffer at $0200.

## Source Code
(omitted — no code or register maps in source)

## Key Registers
- $0013 - Zero Page (BASIC) - CHANNL: current logical-file (CMD) number used by BASIC to select active I/O device and adjust prompting/output behavior
- $00B8 - Zero Page (BASIC) - Secondary BASIC device-location used when deciding which device to actually perform input/output with (location 184 decimal)

## References
- "tansgn_trig_and_comparison_flag" — expands on previous flag usage
- "linnum_target_line_integer" — expands on storage of target line numbers used by control-flow commands
- "txttab_basic_text_pointer_and_relocation" — expands on BASIC text relocation and buffer techniques (alternate I/O redirection methods)