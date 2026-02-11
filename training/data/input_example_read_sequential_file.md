# MACHINE: Read a sequential file to the screen (machine-code example)

**Summary:** Demonstrates using KERNAL calls CHKIN ($FFC6), GETIN ($FFE4), CHROUT ($FFD2) and CLRCHN ($FFCC) to read a sequential file one character at a time and echo it to the screen; checks ST system variable at $0090 (C64/VIC) or $0096 (PET/CBM) to detect EOF/error.

## Program description
This example switches the default input to logical channel 1, reads characters one-by-one from that channel using the KERNAL GETIN routine, echoes each character to the screen with CHROUT, and loops until the system status variable ST signals end-of-file or an error. Finally it calls CLRCHN to disconnect the logical file and returns.

- Initialize X with the logical channel number (LDX #$01) and call CHKIN ($FFC6) to make that channel the input source.
- Read a character with GETIN ($FFE4). GETIN delivers the character to the KERNAL output register/state expected by CHROUT (see source code sequence).
- Echo the character with CHROUT ($FFD2).
- Test ST (system I/O status). On C64/VIC systems ST is at $0090; on PET/CBM systems it is at $0096. ST == 0 means more data is available; nonzero means EOF or I/O error.
- If ST == 0 branch back to GETIN; otherwise call CLRCHN ($FFCC) to restore default input and finish with RTS.

This mirrors BASIC flow: OPEN channel, INPUT/GET/PRINT loop, check ST, then CLOSE.

## Source Code
```basic
Disk:      OPEN 1,8,3,"0:DEMO,S,W"
Cassette:  OPEN 1,1,1

PRINT #1,"HELLO THIS IS A TEST"
PRINT #1,"THIS IS THE LAST LINE"
CLOSE 1
```

```basic
Disk:      100 OPEN 1,8,3,"DEMO"   : (or cassette OPEN 1,1,1)
          110 INPUT #1,X$
          120 PRINT X$
          130 IF ST=0 GOTO 110
          140 CLOSE 1
```

```basic
Disk:      100 OPEN 1,8,3,"DEMO"
Cassette:  100 OPEN 1,1,1
          110 SYS 828
          120 CLOSE 1
```

```asm
; Machine-language reader starting at $033C
.A 033C  LDX #$01         ; logical channel 1
.A 033E  JSR $FFC6        ; CHKIN - switch input to channel in X

.A 0341  JSR $FFE4        ; GETIN - get one character from current input
.A 0344  JSR $FFD2        ; CHROUT - echo character to screen

; Check ST (system I/O status)
; C64/VIC: ST at $0090     PET/CBM: ST at $0096
.A 0347  LDA $90          ; read ST (or LDA $96 on PET/CBM)
.A 0349  BEQ $0341        ; if zero (more data) loop back to GETIN

.A 034B  JSR $FFCC        ; CLRCHN - disconnect logical file / restore default input
.A 034E  RTS              ; return to caller
```

## Key Registers
- $0090 - KERNAL / zero page - ST (I/O status) on VIC/Commodore 64: 0 = more data, nonzero = EOF or error
- $0096 - KERNAL / zero page - ST (I/O status) on PET/CBM systems: 0 = more data, nonzero = EOF or error

## References
- "switching_input_chkin_and_clrchn" — expands on how CHKIN and CLRCHN are used in this example

## Labels
- CHKIN
- GETIN
- CHROUT
- CLRCHN
- ST
