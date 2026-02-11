# LOAD (BASIC command)

**Summary:** LOAD reads a program file from tape or disk into memory (BASIC LOAD["name"][,device][,address]); defaults to cassette device 1, disk typically device 8. In direct mode LOAD performs CLR before reading; if used inside a program it chains (RUNs) the new program without clearing variables; default load address is 2048 unless a secondary address of 1 is used to restore the original save location.

## Usage
FORMAT: LOAD["<file-name>"][,<device>][,<address>]

Action: Reads a program file from tape or disk into memory. Device is optional (default = 1, cassette). Disk drive is normally device 8. LOAD closes all open files before reading.

Direct vs in-program:
- Direct mode (entered at READY): LOAD performs a CLR (clears variables and program) before reading the file.
- When LOAD is executed from within a program, the current program is replaced (the new program is RUN), but variables are not cleared — this implements chaining.

File-name matching and patterns:
- If a filename pattern is used, the first matching filename is loaded.
- LOAD"*",8 loads the first filename in the disk directory.
- If the filename does not exist or is not a program file, BASIC reports ?FILE NOT FOUND.

Tape-specific behavior:
- When loading from tape you may omit <file-name> to read the next program on tape.
- After pressing PLAY, the screen is blanked to the current border color; when the file header is found the screen clears to the background color and the message FOUND is displayed.
- Pressing the C= key, CTRL, the left arrow key, or SPACE BAR will start loading when the file is found.

Load address behavior:
- Programs LOAD starting at memory location 2048 by default.
- If a secondary <address> of 1 is supplied (e.g. ,1 as the third argument), the program will be loaded into the memory location from which it was originally saved (restores original save location).

## Source Code
```basic
LOAD                         (Reads the next program on tape)

LOAD A$                      (Uses the name in A$ to search)

LOAD"*",8                    (LOADs first program from disk)

LOAD"",1,1                   (Looks for the first program on
                              tape, and LOADs it into the same
                              part of memory that it came from)

LOAD"STAR TREK"              (LOAD a file from tape)
PRESS PLAY ON TAPE
FOUND STAR TREK
LOADING
READY.

LOAD"FUN",8                  (LOAD a file from disk)
SEARCHING FOR FUN
LOADING
READY.

LOAD"GAME ONE",8,1           (LOAD a file to the specific
SEARCHING FOR GAME ONE        memory location from which the
LOADING                       program was saved on the disk)
READY.
```

## References
- "save_command" — covers SAVE options including storing programs with an optional address
- "verify_command" — covers VERIFY to compare a saved program with memory
