# KERNAL: Zero-page & Low-memory Declarations (continuation)

**Summary:** Zero-page and low-memory layout for KERNAL: BASIC/monitor buffer at $0200 (BUF), file tables LAT/FAT/SAT, keyboard queue (KEYD), editor variables (COLOR, HIBASE, XMAX, KEYLOG), RS-232/6551 storage (M51CTR/M51CDR/M51AJB/BAUDOF/RSSTAT/BITNUM), receive/transmit buffer indices (RIDBS/RIDBE/RODBS/RODBE), KERNAL indirect vectors at $0314-$0333 (IOPEN..ISAVE), cassette buffer TBUFFR at $033C (192 bytes), and VICSCN at $0400 (1024 bytes).

**Zero-page and low-memory layout**

This chunk continues the KERNAL declarations that reserve RAM areas and indirect vectors used by the OS:

- **Origin switch:** Code sets the location counter to $0200, then defines a BASIC/monitor buffer (BUF) and a series of fixed-size system tables and variables by assigning labels to the current location and advancing the location by the declared sizes.
- **File tables:** LAT, FAT, and SAT are allocated as 10-byte tables each (logical file numbers, primary device numbers, secondary addresses respectively). These are the per-open-file tables used by the KERNAL.
- **System storage & editor state:** Keyboard queue (KEYD), memory start/top words (MEMSTR/MEMSIZ), timeout flag (TIMOUT), screen-editor variables (COLOR, GDCOL, HIBASE, XMAX, RPTFLG, KOUNT, DELAY, SHFLAG, LSTSHF), keyboard table pointer (KEYLOG), and display/mode flags (MODE, AUTODN).
- **RS-232 / 6551 storage:** Single-byte zero-page storage is reserved for 6551 control and command bytes (M51CTR, M51CDR), an auxiliary 16-bit timing word (M51AJB), a status byte (RSSTAT), bit-count (BITNUM), and BAUDOF (16-bit full-bit-time value created by OPEN).
- **Receiver/transmitter indices:** RIDBE/RIDBS hold input buffer indices; RODBS/RODBE hold output buffer indices. These are single-byte indices/pointers used by the serial routines.
- **Temporary & cassette state:** IRQTMP holds IRQ state during tape operations; ENABL/CASTON/KIKA26/STUPID/LINTMP are temporary flags used by cassette/RS-232 routines.
- **Program indirects:** At $0300..$0309, 10 bytes are reserved for program indirects.
- **KERNAL indirects:** At $0314..$0333 (20 vector entries), the KERNAL stores 2-byte indirect vectors for system entry points (CINV, CBINV, NMINV, and IOPEN..ISAVE). Each indirect is two bytes (pointer to code).
- **Cassette buffer:** TBUFFR at $033C is the cassette data buffer (192 bytes).
- **VIC area:** VICSCN at $0400 reserves 1024 bytes (commonly used for screen or VIC data). RAMLOC follows (no size assigned in this fragment).

This chunk uses the assembler idiom "LABEL *= * + n" meaning "assign LABEL to current location, then advance the location by n bytes".

## Source Code

```asm
                                BAD    *=*+1
                                *=$200
                                BUF    *=*+89          ;BASIC/MONITOR BUFFER
                                ; TABLES FOR OPEN FILES
                                ;
                                LAT    *=*+10          ;LOGICAL FILE NUMBERS
                                FAT    *=*+10          ;PRIMARY DEVICE NUMBERS
                                SAT    *=*+10          ;SECONDARY ADDRESSES
                                ; SYSTEM STORAGE
                                ;
                                KEYD   *=*+10          ;IRQ KEYBOARD BUFFER
                                MEMSTR *=*+2           ;START OF MEMORY
                                MEMSIZ *=*+2           ;TOP OF MEMORY
                                TIMOUT *=*+1           ;IEEE TIMEOUT FLAG
                                ; SCREEN EDITOR STORAGE
                                ;
                                COLOR  *=*+1           ;ACTIVE COLOR NYBBLE
                                GDCOL  *=*+1           ;ORIGINAL COLOR BEFORE CURSOR
                                HIBASE *=*+1           ;BASE LOCATION OF SCREEN (TOP)
                                XMAX   *=*+1
                                RPTFLG *=*+1           ;KEY REPEAT FLAG
                                KOUNT  *=*+1
                                DELAY  *=*+1
                                SHFLAG *=*+1           ;SHIFT FLAG BYTE
                                LSTSHF *=*+1           ;LAST SHIFT PATTERN
                                KEYLOG *=*+2           ;INDIRECT FOR KEYBOARD TABLE SETUP
                                MODE   *=*+1           ;0-PET MODE, 1-CATTACANNA
                                AUTODN *=*+1           ;AUTO SCROLL DOWN FLAG(=0 ON,<>0 OFF)
                                ; RS-232 STORAGE
                                ;
                                M51CTR *=*+1           ;6551 CONTROL REGISTER
                                M51CDR *=*+1           ;6551 COMMAND REGISTER
                                M51AJB *=*+2           ;NON STANDARD (BITTIME/2-100)
                                RSSTAT *=*+1           ; RS-232 STATUS REGISTER
                                BITNUM *=*+1           ;NUMBER OF BITS TO SEND (FAST RESPONSE)
                                BAUDOF *=*+2           ;BAUD RATE FULL BIT TIME (CREATED BY OPEN)
                                ;
                                ; RECEIVER STORAGE
                                ;
                                RIDBE  *=*+1           ;INPUT BUFFER INDEX TO END
                                RIDBS  *=*+1           ;INPUT BUFFER POINTER TO START
                                ;
                                ; TRANSMITTER STORAGE
                                ;
                                RODBS  *=*+1           ;OUTPUT BUFFER INDEX TO START
                                RODBE  *=*+1           ;OUTPUT BUFFER INDEX TO END
                                ;
                                IRQTMP *=*+2           ;HOLDS IRQ DURING TAPE OPS
                                ;
                                ; TEMP SPACE FOR VIC-40 VARIABLES ****
                                ;
                                ENABL  *=*+1           ;RS-232 ENABLES (REPLACES IER)
                                CASTON *=*+1           ;TOD SENSE DURING CASSETTES
                                KIKA26 *=*+1           ;TEMP STORAGE FOR CASSETTE READ ROUTINE
                                STUPID *=*+1           ;TEMP D1IRQ INDICATOR FOR CASSETTE READ
                                LINTMP *=*+1           ;TEMPORARY FOR LINE INDEX
                                *=$0300                ;PROGRAM INDIRECTS (10 bytes)
                                *=*+10
                                *=$0314                ;KERNAL/OS INDIRECTS (20 entries)
                                CINV   *=*+2           ;IRQ RAM VECTOR
                                CBINV  *=*+2           ;BRK INSTR RAM VECTOR
                                NMINV  *=*+2           ;NMI RAM VECTOR
                                IOPEN  *=*+2           ;INDIRECTS FOR CODE
                                ICLOSE *=*+2           ; CONFORMS TO KERNAL SPEC 8/19/80
                                ICHKIN *=*+2
                                ICKOUT *=*+2
                                ICLRCH *=*+2
                                IBASIN *=*+2
                                IBSOUT *=*+2
                                ISTOP  *=*+2
                                IGETIN *=*+2
                                ICLALL *=*+2
                                USRCMD *=*+2
                                ILOAD  *=*+2
                                ISAVE  *=*+2           ;SAVESP
                                *=$033C
                                TBUFFR *=*+192         ;CASSETTE DATA BUFFER
                                *=$0400
                                VICSCN *=*+1024
                                RAMLOC
                                ; I/O DEVICES
```

Derived address table (for retrieval/reference)

```text
BUF    = $0200     ; 89 bytes (0x59)
LAT    = $0259     ; 10 bytes
FAT    = $0263     ; 10 bytes
SAT    = $026D     ; 10 bytes
KEYD   = $0277     ; 10 bytes (IRQ keyboard buffer)
MEMSTR = $0281     ; 2 bytes
MEMSIZ = $0283     ; 2 bytes
TIMOUT = $0285     ; 1 byte
COLOR  = $0286
GDCOL  = $0287
HIBASE = $0288
XMAX   = $0289
RPTFLG = $028A
KOUNT  = $028B
DELAY  = $028C
SHFLAG = $028D
LSTSHF = $028E
KEYLOG = $028F     ; 2 bytes
MODE   = $0291
AUTODN = $0292
M51CTR = $0293     ; 6551 control (zero-page storage)
M51CDR = $0294     ; 6551 command
M51AJB = $0295     ; 2 bytes (bit-time adjust)
RSSTAT = $0297
BITNUM = $0298
BAUDOF = $0299     ; 2 bytes
RIDBE  = $029B
RIDBS  = $029C
RODBS  = $029D
RODBE  = $029E
IRQTMP = $029F     ; 2 bytes
ENABL  = $02A1
CASTON = $02A2
KIKA26 = $02A3
STUPID = $02A4
LINTMP = $02A5

CINV   = $0314     ; IRQ RAM vector (2 bytes)
CBINV  = $0316     ; BRK vector (2 bytes)
NMINV  = $0318     ; NMI vector (2 bytes)
IOPEN  = $031A     ; I/O vectors (2 bytes each)
ICLOSE = $031C
ICHKIN = $031E
ICKOUT = $0320
ICLRCH = $0322
IBASIN = $0324
IBSOUT = $0326
ISTOP  = $0328
IGETIN = $032A
ICLALL = $032C
USRCMD = $032E
ILOAD  = $0330
ISAVE  = $0332

TBUFFR = $033C     ; cassette buffer, 192 bytes (0xC0)
VICSCN = $0400     ; 1024 bytes (0x400)
RAMLOC               ; label present, size/position not defined here
```

## Key Registers

- $0200 - RAM - BUF: BASIC/MON

## Labels
- IOPEN
- ICLOSE
- ICHKIN
- ICKOUT
- ISAVE
