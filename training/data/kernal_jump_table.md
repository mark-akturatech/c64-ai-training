# KERNAL Jump Table ($FF81-$FFF3)

**Summary:** KERNAL jump table at $FF81-$FFF3 — JMP/JMP (vector) entries to standard KERNAL I/O routines (CINT, IOINIT, RAMTAS, RESTOR, VECTOR, SETMSG, ACPTR, CIOUT, UNLSN, UNTALK, LISTEN, TALK, SETLFS, SETNAM, OPEN/CLOSE/CHKIN/CHKOUT/CHRIN/CHROUT/CLRCHN, etc.). These vectors are a Commodore standard (VIC-20/C64/C128/Plus4) for consistent I/O entry points.

## KERNAL jump table overview
This table (addresses $FF81–$FFF3) contains JMP and indirect JMP entries that forward to the KERNAL I/O routines. Programs and system ROMs use these fixed vectors so different Commodore models can share the same vector table and be interoperable with system-level I/O code.

Key points:
- Location: $FF81–$FFF3 in the KERNAL ROM.
- Contents: a mixture of absolute JMPs (JMP $xxxx) to KERNAL routine entry points and indirect JMPs (JMP ($03xx)) that defer to a RAM-resident vector table for device/file stream operations.
- Purpose: Provide stable entry points for initializing I/O, keyboard scanning, serial bus byte in/out, device control (LISTEN/TALK/UNTALK/UNLSN), file operations (OPEN/CLOSE/CHKIN/CHKOUT/CHRIN/CHROUT/CLRCHN), memory top/bottom queries, and realtime clock access.
- Compatibility: The jump table is a cross-model standard so software and device drivers can rely on the same vector addresses across VIC-20, C64, C128, Plus4, etc.
- Notable: Several file/stream operations are vectored through RAM pointers at $031A–$0328 (indirect JMPs), allowing the device/file handling routines to be changed at runtime (RESTOR/REVector).

(See the Source Code section for the full listing of the table entries and target addresses.)

## Source Code
```asm
                                *** KERNAL JUMP TABLE
                                This table contains jump vectors to the I/O routines. This
                                is a Commodore standard, so no matter what system you are
                                using (VIC20, C64, C128, Plus4 etc) the jump vectors are
                                always located at this position.
.,FF81 4C 5B FF JMP $FF5B       CINT, init screen editor
.,FF84 4C A3 FD JMP $FDA3       IOINT, init input/output
.,FF87 4C 50 FD JMP $FD50       RAMTAS, init RAM, tape screen
.,FF8A 4C 15 FD JMP $FD15       RESTOR, restore default I/O vector
.,FF8D 4C 1A FD JMP $FD1A       VECTOR, read/set I/O vector
.,FF90 4C 18 FE JMP $FE18       SETMSG, control KERNAL messages
.,FF93 4C B9 ED JMP $EDB9       SECOND, send SA after LISTEN
.,FF96 4C C7 ED JMP $EDC7       TKSA, send SA after TALK
.,FF99 4C 25 FE JMP $FE25       MEMTOP, read/set top of memory
.,FF9C 4C 34 FE JMP $FE34       MEMBOT, read/set bottom of memory
.,FF9F 4C 87 EA JMP $EA87       SCNKEY, scan keyboard
.,FFA2 4C 21 FE JMP $FE21       SETTMO, set IEEE timeout
.,FFA5 4C 13 EE JMP $EE13       ACPTR, input byte from serial bus
.,FFA8 4C DD ED JMP $EDDD       CIOUT, output byte to serial bus
.,FFAB 4C EF ED JMP $EDEF       UNTALK, command serial bus UNTALK
.,FFAE 4C FE ED JMP $EDFE       UNLSN, command serial bus UNLSN
.,FFB1 4C 0C ED JMP $ED0C       LISTEN, command serial bus LISTEN
.,FFB4 4C 09 ED JMP $ED09       TALK, command serial bus TALK
.,FFB7 4C 07 FE JMP $FE07       READST, read I/O status word
.,FFBA 4C 00 FE JMP $FE00       SETLFS, set logical file parameters
.,FFBD 4C F9 FD JMP $FDF9       SETNAM, set filename
.,FFC0 6C 1A 03 JMP ($031A)     OPEN, open file
.,FFC3 6C 1C 03 JMP ($031C)     CLOSE, close file
.,FFC6 6C 1E 03 JMP ($031E)     CHKIN, prepare channel for input
.,FFC9 6C 20 03 JMP ($0320)     CHKOUT, prepare channel for output
.,FFCC 6C 22 03 JMP ($0322)     CLRCHN, close all I/O
.,FFCF 6C 24 03 JMP ($0324)     CHRIN, input byte from channel
.,FFD2 6C 26 03 JMP ($0326)     CHROUT, output byte to channel
.,FFD5 4C 9E F4 JMP $F49E       LOAD, load from serial device
.,FFD8 4C DD F5 JMP $F5DD       SAVE, save to serial device
.,FFDB 4C E4 F6 JMP $F6E4       SETTIM, set realtime clock
.,FFDE 4C DD F6 JMP $F6DD       RDTIM, read realtime clock
.,FFE1 6C 28 03 JMP ($0328)     STOP, check <STOP> key
```

## Key Registers
- $FF81-$FFF3 - KERNAL ROM - Jump table vectors to KERNAL I/O and system routines (CINT, IOINIT, RESTOR, VECTOR, SETMSG, ACPTR, CIOUT, serial bus commands, SETLFS/SETNAM, LOAD/SAVE, SETTIM/RDTIM, etc.)
- $031A-$0328 - RAM vectors - Indirect vectors used by OPEN/CLOSE/CHKIN/CHKOUT/CHRIN/CHROUT/CLRCHN/STOP (JMP ($03xx) targets in $FFC0-$FFE1 entries)

## References
- "kernal_reset_vectors" — expands on jump vectors restored by RESTOR
- "system_hardware_vectors" — expands on interrupt/reset vectors located at $FFFA-$FFFE

## Labels
- OPEN
- CLOSE
- CHRIN
- CHROUT
- SETLFS
- SETNAM
- LISTEN
- TALK
