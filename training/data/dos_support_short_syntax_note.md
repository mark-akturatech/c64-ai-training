# DOS SUPPORT short syntax for 1541 disk commands (1541TEST/DEMO)

**Summary:** DOS SUPPORT (1541TEST/DEMO) provides a short immediate-mode syntax for 1541 disk commands using the > or @ keys instead of PRINT#, automatically handling the command channel open/close and quoting; this DOS 5.1 syntax works only in immediate mode and will cause a SYNTAX ERROR if used inside a program.

**Description**
The DOS SUPPORT program included on the 1541TEST/DEMO disk accepts a shortened input method for sending commands to the 1541 drive. In immediate mode, you may press > or @ followed by the disk command; the DOS SUPPORT routine:

- Substitutes for a PRINT# statement (so you do not explicitly use PRINT# n,).
- Automatically opens and closes the command channel for you.
- Automatically places the required quotation marks around the command text.

This reduced syntax is a convenience for interactive (immediate-mode) use only. Attempting to use the > or @ shortcut inside a BASIC program (i.e., not immediate mode) will produce a SYNTAX ERROR.

**Examples:**

To display the disk directory:
To format a new disk:
To rename a file:
([scribd.com](https://www.scribd.com/doc/24664640/1541-Users-Guide?utm_source=openai))

## References
- "using_command_channel_steps" — expands on alternative immediate-mode shortcut for command entry
