# DOS SUPPORT (Wedge) — Section 3.8

**Summary:** Describes the DOS SUPPORT wedge program for VIC‑20 / Commodore 64 that remaps keys ("/", "@" and ">") to disk operations, how to list the directory and read the disk error channel, and the runtime memory impact (a few hundred bytes less free RAM).

## Description and usage
The DOS SUPPORT program (wedge) is a small runtime utility you LOAD and RUN from the demonstration disk. It installs key shortcuts for common disk operations, then erases itself when finished. Different wedge binaries exist for the VIC‑20 and the C64.

Behavior:
- Installation: LOAD and RUN the wedge. It auto‑sets itself up and removes its installer when done.
- Memory: while installed you will have "a few hundred" fewer bytes of user RAM available (the wedge occupies runtime memory).
- Filename loading shortcut: the "/" key is hooked to perform a LOAD. Press "/" followed immediately by the filename; the wedge performs the equivalent of the BASIC LOAD command (you do not need to type LOAD or include ,8).
- Drive command shortcuts: the "@" and ">" keys are hooked to send commands directly to the disk drive (they replace use of PRINT# to the drive). For example, typing "@$" (or ">$") sends the directory request to the drive and prints the disk directory to the screen without loading it into memory.
- Reading the disk error channel: when the disk drive's red error light is blinking, press "@" or ">" and then RETURN. The wedge reads and displays the complete error channel response: error number, error text, and track/block numbers.

Notes:
- The wedge provides a convenience interface; it does not change DOS semantics — it simply sends the same command strings you would otherwise send with PRINT# or typed LOAD commands.
- The directory display invoked with "@$" / ">$" is shown on the screen but does not load any program into memory.

## References
- "reading_error_channel_example_and_error_fields" — expands on how DOS SUPPORT displays the disk error channel versus a BASIC routine.
