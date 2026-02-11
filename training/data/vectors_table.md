# KERNAL Vectors and Jump Table ($FF5B..$FFFE)

**Summary:** KERNAL ROM jump table and public API entrypoints mapping ROM addresses ($FF5B..$FFFE) to service routines (CINT, IOINIT, OPEN/CLOSE/CHKIN/CKOUT, STOP/GETIN, etc.), plus the system interrupt vectors at $FFFA/$FFFC/$FFFE (NMI, RESET, IRQ) and indirect I/O pointers referenced via $031A-$0328.

## Description
This ROM block provides the public KERNAL API by installing JMP/JSR entrypoints at fixed ROM addresses. Basic and machine-language programs call these public entrypoints; each entrypoint either jumps directly to a routine implemented elsewhere in the KERNAL or performs an indirect JMP through a RAM vector (for device-specific handlers). Important behaviors contained in this area:

- High-level KERNAL services are exposed as fixed JMPs/JSRs (examples: CINT, IOINIT, RAMTAS, RESTOR, VECTOR, SETMSG, MEMTOP/MEMBOT, SCNKEY).
- IEEE-488 / IEC bus handshake and device command primitives are provided (ACPTR, CIOUT, UNTLK, UNLSN, LISTN, TALK), each mapped to a ROM JMP.
- File I/O entrypoints OPEN, CLOSE, CHKIN, CKOUT, CLRCH, BASIN, BSOUT are implemented as indirect JMPs through a table of RAM-stored pointers (JMP ($031A), JMP ($031C), ...). These addresses ($031A-$0328) hold the current device/file handler vectors (IOPEN, ICLOSE, ICHKIN, ICKOUT, ICLRCH, IBASIN, IBSOUT, ISTOP, IGETIN, ICLALL, etc.) and thus can be repointed at runtime to change device behavior.
  - Note: JMP ($031A) etc. are indirect calls — the target is taken from the two-byte word stored at the given RAM address.
- Utility and system services (LOAD/SAVE, SETTIM/RDTIM, STOP/GETIN/CLALL, UDTIM, screen/plot/I/O base routines) are mapped here as JMPs to KERNAL routines elsewhere.
- The fixed interrupt vector locations are at $FFFA (NMI), $FFFC (RESET), and $FFFE (IRQ). These vectors contain the low/high bytes of the respective service entrypoints.
- The listing also references a cassette/interrupt entry table ("BSIT") and several patchable jump entries; those tables and actual handler code live elsewhere in the ROM.

This block is the public-facing wiring: it does not contain the full implementations, only the stable addresses that programs call. The I/O indirection through $031A-$0328 is the mechanism KERNAL and BASIC use to route logical file operations to device-specific code.

## Source Code
```asm
.,FF5B 20 18 E5 JSR $E518       *=$FF8A-9
.,FF81 4C 5B FF JMP $FF5B       JMP    CINT
.,FF84 4C A3 FD JMP $FDA3       JMP    IOINIT
.,FF87 4C 50 FD JMP $FD50       JMP    RAMTAS
                                *=$FF8A                ;NEW VECTORS FOR BASIC
.,FF8A 4C 15 FD JMP $FD15       JMP    RESTOR          ;RESTORE VECTORS TO INITIAL SYSTEM
.,FF8D 4C 1A FD JMP $FD1A       JMP    VECTOR          ;CHANGE VECTORS FOR USER
                                *      =$FF90
.,FF90 4C 18 FE JMP $FE18       JMP    SETMSG          ;CONTROL O.S. MESSAGES
.,FF93 4C B9 ED JMP $EDB9       JMP    SECND           ;SEND SA AFTER LISTEN
.,FF96 4C C7 ED JMP $EDC7       JMP    TKSA            ;SEND SA AFTER TALK
.,FF99 4C 25 FE JMP $FE25       JMP    MEMTOP          ;SET/READ TOP OF MEMORY
.,FF9C 4C 34 FE JMP $FE34       JMP    MEMBOT          ;SET/READ BOTTOM OF MEMORY
.,FF9F 4C 87 EA JMP $EA87       JMP    SCNKEY          ;SCAN KEYBOARD
.,FFA2 4C 21 FE JMP $FE21       JMP    SETTMO          ;SET TIMEOUT IN IEEE
.,FFA5 4C 13 EE JMP $EE13       JMP    ACPTR           ;HANDSHAKE IEEE BYTE IN
.,FFA8 4C DD ED JMP $EDDD       JMP    CIOUT           ;HANDSHAKE IEEE BYTE OUT
.,FFAB 4C EF ED JMP $EDEF       JMP    UNTLK           ;SEND UNTALK OUT IEEE
.,FFAE 4C FE ED JMP $EDFE       JMP    UNLSN           ;SEND UNLISTEN OUT IEEE
.,FFB1 4C 0C ED JMP $ED0C       JMP    LISTN           ;SEND LISTEN OUT IEEE
.,FFB4 4C 09 ED JMP $ED09       JMP    TALK            ;SEND TALK OUT IEEE
.,FFB7 4C 07 FE JMP $FE07       JMP    READSS          ;RETURN I/O STATUS BYTE
.,FFBA 4C 00 FE JMP $FE00       JMP    SETLFS          ;SET LA, FA, SA
.,FFBD 4C F9 FD JMP $FDF9       JMP    SETNAM          ;SET LENGTH AND FN ADR
.,FFC0 6C 1A 03 JMP ($031A)     OPEN   JMP (IOPEN)     ;OPEN LOGICAL FILE
.,FFC3 6C 1C 03 JMP ($031C)     CLOSE  JMP (ICLOSE)    ;CLOSE LOGICAL FILE
.,FFC6 6C 1E 03 JMP ($031E)     CHKIN  JMP (ICHKIN)    ;OPEN CHANNEL IN
.,FFC9 6C 20 03 JMP ($0320)     CKOUT  JMP (ICKOUT)    ;OPEN CHANNEL OUT
.,FFCC 6C 22 03 JMP ($0322)     CLRCH  JMP (ICLRCH)    ;CLOSE I/O CHANNEL
.,FFCF 6C 24 03 JMP ($0324)     BASIN  JMP (IBASIN)    ;INPUT FROM CHANNEL
.,FFD2 6C 26 03 JMP ($0326)     BSOUT  JMP (IBSOUT)    ;OUTPUT TO CHANNEL
.,FFD5 4C 9E F4 JMP $F49E       JMP    LOADSP          ;LOAD FROM FILE
.,FFD8 4C DD F5 JMP $F5DD       JMP    SAVESP          ;SAVE TO FILE
.,FFDB 4C E4 F6 JMP $F6E4       JMP    SETTIM          ;SET INTERNAL CLOCK
.,FFDE 4C DD F6 JMP $F6DD       JMP    RDTIM           ;READ INTERNAL CLOCK
.,FFE1 6C 28 03 JMP ($0328)     STOP   JMP (ISTOP)     ;SCAN STOP KEY
.,FFE4 6C 2A 03 JMP ($032A)     GETIN  JMP (IGETIN)    ;GET CHAR FROM Q
.,FFE7 6C 2C 03 JMP ($032C)     CLALL  JMP (ICLALL)    ;CLOSE ALL FILES
.,FFEA 4C 9B F6 JMP $F69B       JMP    UDTIM           ;INCREMENT CLOCK
.,FFED 4C 05 E5 JMP $E505       JSCROG JMP SCRORG      ;SCREEN ORG
.,FFF0 4C 0A E5 JMP $E50A       JPLOT  JMP PLOT        ;READ/SET X,Y COORD
.,FFF3 4C 00 E5 JMP $E500       JIOBAS JMP IOBASE      ;RETURN I/O BASE
.:FFF6 52 52 42 59              *=$FFFA
.:FFFA 43 FE                    .WOR   NMI             ;PROGRAM DEFINEABLE
.:FFFC E2 FC                    .WOR   START           ;INITIALIZATION CODE
.:FFFE 48 FF                    .WOR   PULS            ;INTERRUPT HANDLER
```

## Key Registers
- $FF5B-$FFF3 - KERNAL ROM - Public KERNAL service entrypoints and jump table (CINT, IOINIT, RAMTAS, RESTOR, VECTOR, SETMSG, MEMTOP/MEMBOT, SCNKEY, SETTMO, ACPTR, CIOUT, UNTLK, UNLSN, LISTN, TALK, READSS, SETLFS, SETNAM, LOADSP, SAVESP, SETTIM, RDTIM, UDTIM, JSCROG, JPLOT, JIOBAS, etc.)
- $FFC0-$FFD2 - KERNAL ROM - Indirect file I/O JMPs via RAM vectors (JMP ($031A) .. JMP ($0326)) for OPEN/CLOSE/CHKIN/CKOUT/CLRCH/BASIN/BSOUT
- $FFE1-$FFE7 - KERNAL ROM - Indirect control JMPs via RAM vectors (JMP ($0328) .. JMP ($032C)) for STOP/GETIN/CLALL
- $FFFA - ROM Vector - NMI vector (low byte at $FFFA, high byte at $FFFB)
- $FFFC - ROM Vector - RESET/START vector (low byte at $FFFC, high byte at $FFFD)
- $FFFE - ROM Vector - IRQ vector (low byte at $FFFE, high byte at $FFFF)
- $031A-$032C - RAM (page $03) - I/O handler pointer table (IOPEN at $031A, ICLOSE at $031C, ICHKIN at $031E, ICKOUT at $0320, ICLRCH at $0322, IBASIN at $0324, IBSOUT at $0326, ISTOP at $0328, IGETIN at $032A, ICLALL at $032C)

## References
- "init_library" — expands on VECTOR/RESTOR use to initialize KERNAL indirects
- "load_library" — expands on LOAD/SAVE routines exposed via KERNAL vectors (OPEN/LOAD/SAVE)

## Labels
- OPEN
- CLOSE
- CHKIN
- CKOUT
- SETLFS
