# USER CALLABLE KERNAL ROUTINES — Table (Part 1)

**Summary:** First part of the Commodore 64 KERNAL routines table listing routine names and entry addresses (hex and decimal) such as ACPTR $FFA5, CHKIN $FFC6, CHKOUT $FFC9, CHRIN $FFCF, CHROUT $FFD2, and others; contains brief one-line functions (I/O, memory limits, open/close).

## Description
This chunk is the first portion of the "User Callable KERNAL Routines" table: a concise index of KERNAL entry points in ROM with their hexadecimal and decimal addresses and brief functional descriptions (primarily serial/device I/O and memory boundary routines). It is an index only — detailed calling conventions and parameter descriptions are available in the referenced routine-specific documentation.

This part covers common I/O and file-management entry points (ACPTR, CIOUT, LISTEN, OPEN, CLOSE, LOAD, etc.) plus memory-limit accessors (MEMBOT, MEMTOP) and I/O initializer/locator routines (IOINIT, IOBASE). See the References section for continuation and detailed routine entries.

## Source Code
```text
                       USER CALLABLE KERNAL ROUTINES
  +--------+-------------------+------------------------------------------+
  |        |      ADDRESS      |                                          |
  |  NAME  +---------+---------+                 FUNCTION                 |
  |        |   HEX   | DECIMAL |                                          |
  +--------+---------+---------+------------------------------------------+
  | ACPTR  |  $FFA5  |  65445  |  Input byte from serial port             |
  | CHKIN  |  $FFC6  |  65478  |  Open channel for input                  |
  | CHKOUT |  $FFC9  |  65481  |  Open channel for output                 |
  | CHRIN  |  $FFCF  |  65487  |  Input character from channel            |
  | CHROUT |  $FFD2  |  65490  |  Output character to channel             |
  | CIOUT  |  $FFA8  |  65448  |  Output byte to serial port              |
  | CINT   |  $FF81  |  65409  |  Initialize screen editor                |
  | CLALL  |  $FFE7  |  65511  |  Close all channels and files            |
  | CLOSE  |  $FFC3  |  65475  |  Close a specified logical file          |
  | CLRCHN |  $FFCC  |  65484  |  Close input and output channels         |
  | GETIN  |  $FFE4  |  65508  |  Get character from keyboard queue       |
  |        |         |         |  (keyboard buffer)                       |
  | IOBASE |  $FFF3  |  65523  |  Returns base address of I/O devices     |
  | IOINIT |  $FF84  |  65412  |  Initialize input/output                 |
  | LISTEN |  $FFB1  |  65457  |  Command devices on the serial bus to    |
  |        |         |         |  LISTEN                                  |
  | LOAD   |  $FFD5  |  65493  |  Load RAM from a device                  |
  | MEMBOT |  $FF9C  |  65436  |  Read/set the bottom of memory           |
  | MEMTOP |  $FF99  |  65433  |  Read/set the top of memory              |
  | OPEN   |  $FFC0  |  65472  |  Open a logical file                     |
  +--------+---------+---------+------------------------------------------+
```

## Key Registers
- $FFA5 - KERNAL - ACPTR: Input byte from serial port
- $FFA8 - KERNAL - CIOUT: Output byte to serial port
- $FF81 - KERNAL - CINT: Initialize screen editor
- $FF84 - KERNAL - IOINIT: Initialize input/output
- $FF99 - KERNAL - MEMTOP: Read/set the top of memory
- $FF9C - KERNAL - MEMBOT: Read/set the bottom of memory
- $FFB1 - KERNAL - LISTEN: Command devices on the serial bus to LISTEN
- $FFC0 - KERNAL - OPEN: Open a logical file
- $FFC3 - KERNAL - CLOSE: Close a specified logical file
- $FFC6 - KERNAL - CHKIN: Open channel for input
- $FFC9 - KERNAL - CHKOUT: Open channel for output
- $FFCC - KERNAL - CLRCHN: Close input and output channels
- $FFCF - KERNAL - CHRIN: Input character from channel
- $FFD2 - KERNAL - CHROUT: Output character to channel
- $FFD5 - KERNAL - LOAD: Load RAM from a device
- $FFE4 - KERNAL - GETIN: Get character from keyboard queue (keyboard buffer)
- $FFE7 - KERNAL - CLALL: Close all channels and files
- $FFF3 - KERNAL - IOBASE: Returns base address of I/O devices

## References
- "kernal_routine_documentation_conventions_and_routine_list_intro" — Conventions and how each routine entry is documented
- "user_callable_kernal_routines_table_part2" — Continuation of the routine table with additional KERNAL functions
- "kernal_routine_acptr_entry" — Detailed entry for the ACPTR routine listed here

## Labels
- CHROUT
- CHRIN
- OPEN
- CLOSE
- GETIN
- LOAD
- MEMTOP
- MEMBOT
