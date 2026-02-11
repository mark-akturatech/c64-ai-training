# KERNAL OPEN (F34A) — create logical file-table entry and perform device-specific open (serial/tape)

**Summary:** KERNAL OPEN creates a logical-file table entry (stores LAT, SAT, FAT at $0259/$026D/$0263 indexed by open-slot), enforces max 10 open files via LDTND ($0098), and dispatches device-specific open tasks (keyboard/screen no-op, serial via OPENI to initialize 6551 (M51CTR/M51CDR), and tape/cassette via OPN232). OPENI is responsible for computing BITNUM (BITCNT), selecting BAUD using PAL/NTSC BAUD tables and BAUDOP, initializing RID*/ROD* buffer pointers, and allocating buffers with GETTOP.

**Function overview**
This KERNAL routine implements the OPEN function:

- **Input (in zero page):**
  - LA at $00B8
  - SA at $00B9
  - FA at $00BA
  - A file-name descriptor (FNADR & FNLEN) is passed to the routine (not shown here).

- **Process:**
  - Checks whether the logical file number (LA) is already in the logical-files table via JSR LOOKUP; if found, returns ERROR2 (file already open).
  - Uses LDTND ($0098) as the current count/index of open files; enforces a maximum of 10 open files (CPX #$0A).
  - On success, increments LDTND and stores the new table entry:
    - LAT,X := LA stored at $0259 + X
    - SAT,X := SA (with ORA #$60 to mark serial command) stored at $026D + X
    - FAT,X := FA stored at $0263 + X
  - After table entry creation, dispatches device-specific open tasks:
    - If device is keyboard or screen (checks for LA==0 and FA==3 per comments), no further action; OPEN returns.
    - If device is a serial device, calls OPENI (JSR $F3D5). OPENI performs serial initialization (6551 registers, baud calculation, buffer pointers, buffer allocation). The present chunk only invokes OPENI; OPENI code is not included here.
    - If device is a cassette/tape (the conditional branches lead to OPN232), control jumps to OPN232 (JMP $F409) to perform RS-232 / tape-specific setup.
    - For other tape handling, there's a call to a routine labelled ZZZ (JSR $F7D0) to "see if tape buffer" — details are outside this chunk.

**Device-specific (serial/tape) responsibilities (summary taken from continuation notes)**
- **Serial open (OPENI) tasks (described but not listed here):**
  - Set up 6551 ACIA registers (M51CTR, M51CDR).
  - Compute BITNUM using BITCNT.
  - Choose BAUD rates using PAL/NTSC BAUD tables and BAUDOP (start/test rates).
  - Initialize buffer pointers RIDBE / RIDBS / RODBS / RODBE.
  - Allocate I/O buffers via GETTOP if necessary.
- **Tape/cassette open delegates to OPN232**, which sets up M51 registers, BAUDOF, BITNUM used by the RS232 transmitter (details not present in this chunk).

## Source Code
```asm
                                .LIB   OPEN
                                ;***********************************
                                ;*                                 *
                                ;* OPEN FUNCTION                   *
                                ;*                                 *
                                ;* CREATES AN ENTRY IN THE LOGICAL *
                                ;* FILES TABLES CONSISTING OF      *
                                ;* LOGICAL FILE NUMBER--LA, DEVICE *
                                ;* NUMBER--FA, AND SECONDARY CMD-- *
                                ;* SA.                             *
                                ;*                                 *
                                ;* A FILE NAME DESCRIPTOR, FNADR & *
                                ;* FNLEN ARE PASSED TO THIS ROUTINE*
                                ;*                                 *
                                ;***********************************
                                ;
.,F34A A6 B8    LDX $B8         NOPEN  LDX LA          ;CHECK FILE #
.,F34C D0 03    BNE $F351       BNE    OP98            ;IS NOT THE KEYBOARD
                                ;
.,F34E 4C 0A F7 JMP $F70A       JMP    ERROR6          ;NOT INPUT FILE...
                                ;
.,F351 20 0F F3 JSR $F30F       OP98   JSR LOOKUP      ;SEE IF IN TABLE
.,F354 D0 03    BNE $F359       BNE    OP100           ;NOT FOUND...O.K.
                                ;
.,F356 4C FE F6 JMP $F6FE       JMP    ERROR2          ;FILE OPEN
                                ;
.,F359 A6 98    LDX $98         OP100  LDX LDTND       ;LOGICAL DEVICE TABLE END
.,F35B E0 0A    CPX #$0A        CPX    #10             ;MAXIMUM # OF OPEN FILES
.,F35D 90 03    BCC $F362       BCC    OP110           ;LESS THAN 10...O.K.
                                ;
.,F35F 4C FB F6 JMP $F6FB       JMP    ERROR1          ;TOO MANY FILES
                                ;
.,F362 E6 98    INC $98         OP110  INC LDTND       ;NEW FILE
.,F364 A5 B8    LDA $B8         LDA    LA
.,F366 9D 59 02 STA $0259,X     STA    LAT,X           ;STORE LOGICAL FILE #
.,F369 A5 B9    LDA $B9         LDA    SA
.,F36B 09 60    ORA #$60        ORA    #$60            ;MAKE SA AN SERIAL COMMAND
.,F36D 85 B9    STA $B9         STA    SA
.,F36F 9D 6D 02 STA $026D,X     STA    SAT,X           ;STORE COMMAND #
.,F372 A5 BA    LDA $BA         LDA    FA
.,F374 9D 63 02 STA $0263,X     STA    FAT,X           ;STORE DEVICE #
                                ;
                                ;PERFORM DEVICE SPECIFIC OPEN TASKS
                                ;
.,F377 F0 5A    BEQ $F3D3       BEQ    OP175           ;IS KEYBOARD...DONE.
.,F379 C9 03    CMP #$03        CMP    #3
.,F37B F0 56    BEQ $F3D3       BEQ    OP175           ;IS SCREEN...DONE.
.,F37D 90 05    BCC $F384       BCC    OP150           ;ARE CASSETTES 1 & 2
                                ;
.,F37F 20 D5 F3 JSR $F3D5       JSR    OPENI           ;IS ON SERIAL...OPEN IT
.,F382 90 4F    BCC $F3D3       BCC    OP175           ;BRANCH ALWAYS...DONE
                                ;
                                ;PERFORM TAPE OPEN STUFF
                                ;
.,F384 C9 02    CMP #$02        OP150  CMP #2
.,F386 D0 03    BNE $F38B       BNE    OP152
                                ;
.,F388 4C 09 F4 JMP $F409       JMP    OPN232
                                ;
.,F38B 20 D0 F7 JSR $F7D0       OP152  JSR ZZZ         ;SEE IF TAPE BUFFER
```

## Key Registers
- $0098 - KERNAL - LDTND (logical device table end / count of open files)
- $00B8 - KERNAL - LA (input logical file number)
- $00B9 - KERNAL - SA (input secondary command; ORA #$60 used to mark serial command)
- $00BA - KERNAL - FA (input device number)
- $0259 - KERNAL - LAT,X (Logical files table: stored logical file number for entry X)
- $0263 - KERNAL - FAT,X (Logical files table: stored device number for entry X)
- $026D - KERNAL - SAT,X (Logical files table: stored secondary command for entry X)

## References
- "rs232trans_overview_and_variables" — expands on OPN232 setup of M51 registers, BAUDOF, BITNUM and RS232 transmitter variables.

## Labels
- OPEN
