# 1541 DOS Memory-Write Command (M-W)

**Summary:** Defines the 1541 DOS memory-write command (M-W) used over a command channel via PRINT# and CHR$ to write up to 34 bytes into 1541 RAM; mentions typical block sizes (8/16/32), DOS buffer size (256 bytes), and use for poking machine code into 1541 RAM ($8000-$BFFF example range).

**Memory-Write Command (M-W)**
The memory-write command writes data into a DOS buffer inside the 1541 via the command channel. It is the counterpart to the memory-read command and is sent with the BASIC PRINT# statement plus CHR$-encoded address and length bytes.

- **Purpose:** Write arbitrary bytes (data or string) into 1541 RAM via the command channel.
- **Limits:** 1 to 34 data bytes per M-W command.
- **Buffer context:** The 1541 DOS buffer is 256 bytes; typical M-W transfers use 8, 16, or 32 bytes so transfers align/divide evenly.
- **Use cases:** Routine transfers of blocks, and (at an advanced level) poking machine-language programs into 1541 RAM for later execution (see memory_execute_command reference).

**Parameters:**
- `file#` — Logical file number of the command channel.
- `lo-byte` — Low byte of the 16-bit target memory address (in CHR$ form).
- `hi-byte` — High byte of the 16-bit target memory address (in CHR$ form).
- `# of bytes` — Number of data bytes to follow (1–34), encoded as CHR$.
- `data` — Either a string variable (e.g., D$) or explicit CHR$ iterations (CHR$(value)).

**Alternate syntax:**
- The command may appear with a colon after the command name: "M-W:" — functionally the same format.

**Caveats:**
- Each M-W call can send at most 34 bytes; larger data must be split into multiple M-W commands.
- The following example demonstrates changing a program file's load address using M-W.

**Example: Changing a Program File's Load Address**

This example demonstrates how to change the load address of a program file using the M-W command. This technique is useful when you need to relocate a program that normally loads into high memory (e.g., $8000-$BFFF) to a different address, such as when the high memory is occupied by other programs or ROM.

In this example:
- Line 10 opens the command channel to the disk drive.
- Line 20 sends the M-W command to write two bytes (`$01` and `$08`) to memory location `$0502` in the disk drive. These bytes represent the new load address `$0801` (in little-endian format).
- Line 30 closes the command channel.

By writing the new load address to the appropriate location in the disk drive's memory, you can modify where the program will load into the computer's memory.

## Source Code

```basic
10 OPEN 15,8,15
20 PRINT#15, "M-W" CHR$(2) CHR$(5) CHR$(2) CHR$(1) CHR$(8)
30 CLOSE 15
```

```basic
; Syntax (cleaned):
PRINT# file#, "M-W" CHR$(lo-byte) CHR$(hi-byte) CHR$(# of bytes) data
; Alternate:
PRINT# file#, "M-W:" CHR$(lo-byte) CHR$(hi-byte) CHR$(# of bytes) data

; Examples (demonstrating CHR$ iteration vs string variable data):

; Example 1: explicit CHR$ bytes as data (writes 2 data bytes: $01, $08)
PRINT#15, "M-W";CHR$(2);CHR$(5);CHR$(2);CHR$(1);CHR$(8)

; Example 2: using a string variable D$ as the data payload
D$ = CHR$(1) + CHR$(8)    ; D$ contains two bytes: $01,$08
PRINT#15, "M-W";CHR$(2);CHR$(5);CHR$(2);D$
```

## References
- "memory_execute_command" — Expands on using M-W together with an execute command (M-E) to run code written into 1541 RAM.
- "edit_load_address_program" — The example program that uses M-W to change a file's load address in the directory/block.
