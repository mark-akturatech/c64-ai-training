# KERNAL Zero-Page and Low-Memory Declarations (.LIB DECLARE)

**Summary:** Zero-page variable and low-memory layout for the Commodore 64 KERNAL: defines 6510 I/O ports (D6510/R6510), virtual monitor registers (PCH/PCL/FLGS/ACC/XR/YR/SP), user-modifiable IRQ vectors (INVH/INVL), many cassette/serial/editor zero-page variables, and switches origin to *=$0100. Contains multi-byte allocations (e.g. TIME *=*+3, TAPE1 *=*+2) and BASZPT at $00FF (BASIC usage).

## Zero-page and low-memory declarations
This DECLARE library allocates the KERNAL's zero-page symbols beginning at $0000 (via *= $0000). It uses the assembler idiom "label *=*+N" to assign sequential zero-page addresses and reserves multi-byte fields with *=*+2, *=*+3, etc.

Key categories and notable entries:
- 6510 I/O ports: D6510 and R6510 are placed at the start of zero page (DDR and data register for the 6510 CPU port).
- Virtual registers for the machine language monitor: PCH, PCL, FLGS, ACC, XR, YR, SP (monitor state saved in zero page).
- User-modifiable IRQ vectors: INVH, INVL (user can patch IRQ handler addresses stored here).
- I/O and status bytes: STATUS, STKEY (stop-key flag), VERCK (load/verify flag), MSGFLG (OS message flag), and device flags (DFLTN/DFLTO).
- Cassette and serial handling: numerous temporary and buffer variables for cassette routines (e.g. SYNO, PRTY, DPSW, CNTDN, BUFPT, FSBLK) and RS-232/IEEE serial buffers and bit state (RIDATA, ROPRTY, RIBUF/ROBUF pointers).
- Screen editor variables: keyboard queue/index, cursor/blink flags, insert mode, line buffers (LDTB1), color/user pointer, keyscan table pointer (KEYTAB).
- Reserved/free space markers: FREKZP (free KERNAL zero page), BASZPT (location $00FF used by BASIC), and the assembler reset to *= $0100 at the end (low-memory origin change).

Multi-byte allocations are used where required (e.g. TIME *=*+3 for a 3-byte 24-hour clock, FREKZP *=*+4 for four bytes of free space). Several labels are commented as unused in the source.

The listing ends with "*=$100" to set the subsequent origin to $0100.

## Source Code
```asm
                                .LIB   DECLARE
                                *=$0000                ;DECLARE 6510 PORTS
                                D6510  *=*+1           ;6510 DATA DIRECTION REGISTER
                                R6510  *=*+1           ;6510 DATA REGISTER
                                *=$0002                ;MISS 6510 REGS
                                ;VIRTUAL REGS FOR MACHINE LANGUAGE MONITOR
                                PCH    *=*+1
                                PCL    *=*+1
                                FLGS   *=*+1
                                ACC    *=*+1
                                XR     *=*+1
                                YR     *=*+1
                                SP     *=*+1
                                INVH   *=*+1           ;USER MODIFIABLE IRQ
                                INVL   *=*+1
                                *      =$90
                                STATUS *=*+1           ;I/O OPERATION STATUS BYTE
                                ; CRFAC *=*+2 ;CORRECTION FACTOR (UNUSED)
                                STKEY  *=*+1           ;STOP KEY FLAG
                                SVXT   *=*+1           ;TEMPORARY
                                VERCK  *=*+1           ;LOAD OR VERIFY FLAG
                                C3P0   *=*+1           ;IEEE BUFFERED CHAR FLAG
                                BSOUR  *=*+1           ;CHAR BUFFER FOR IEEE
                                SYNO   *=*+1           ;CASSETTE SYNC #
                                XSAV   *=*+1           ;TEMP FOR BASIN
                                LDTND  *=*+1           ;INDEX TO LOGICAL FILE
                                DFLTN  *=*+1           ;DEFAULT INPUT DEVICE #
                                DFLTO  *=*+1           ;DEFAULT OUTPUT DEVICE #
                                PRTY   *=*+1           ;CASSETTE PARITY
                                DPSW   *=*+1           ;CASSETTE DIPOLE SWITCH
                                MSGFLG *=*+1           ;OS MESSAGE FLAG
                                PTR1                   ;CASSETTE ERROR PASS1
                                T1     *=*+1           ;TEMPORARY 1
                                TMPC
                                PTR2                   ;CASSETTE ERROR PASS2
                                T2     *=*+1           ;TEMPORARY 2
                                TIME   *=*+3           ;24 HOUR CLOCK IN 1/60TH SECONDS
                                R2D2                   ;SERIAL BUS USAGE
                                PCNTR  *=*+1           ;CASSETTE STUFF
                                ; PTCH *=*+1  (UNUSED)
                                BSOUR1                 ;TEMP USED BY SERIAL ROUTINE
                                FIRT   *=*+1
                                COUNT                  ;TEMP USED BY SERIAL ROUTINE
                                CNTDN  *=*+1           ;CASSETTE SYNC COUNTDOWN
                                BUFPT  *=*+1           ;CASSETTE BUFFER POINTER
                                INBIT                  ;RS-232 RCVR INPUT BIT STORAGE
                                SHCNL  *=*+1           ;CASSETTE SHORT COUNT
                                BITCI                  ;RS-232 RCVR BIT COUNT IN
                                RER    *=*+1           ;CASSETTE READ ERROR
                                RINONE                 ;RS-232 RCVR FLAG FOR START BIT CHECK
                                REZ    *=*+1           ;CASSETE READING ZEROES
                                RIDATA                 ;RS-232 RCVR BYTE BUFFER
                                RDFLG  *=*+1           ;CASSETTE READ MODE
                                RIPRTY                 ;RS-232 RCVR PARITY STORAGE
                                SHCNH  *=*+1           ;CASSETTE SHORT CNT
                                SAL    *=*+1
                                SAH    *=*+1
                                EAL    *=*+1
                                EAH    *=*+1
                                CMP0   *=*+1
                                TEMP   *=*+1
                                TAPE1  *=*+2           ;ADDRESS OF TAPE BUFFER #1Y.
                                BITTS                  ;RS-232 TRNS BIT COUNT
                                SNSW1  *=*+1
                                NXTBIT                 ;RS-232 TRNS NEXT BIT TO BE SENT
                                DIFF   *=*+1
                                RODATA                 ;RS-232 TRNS BYTE BUFFER
                                PRP    *=*+1
                                FNLEN  *=*+1           ;LENGTH CURRENT FILE N STR
                                LA     *=*+1           ;CURRENT FILE LOGICAL ADDR
                                SA     *=*+1           ;CURRENT FILE 2ND ADDR
                                FA     *=*+1           ;CURRENT FILE PRIMARY ADDR
                                FNADR  *=*+2           ;ADDR CURRENT FILE NAME STR
                                ROPRTY                 ;RS-232 TRNS PARITY BUFFER
                                OCHAR  *=*+1
                                FSBLK  *=*+1           ;CASSETTE READ BLOCK COUNT
                                MYCH   *=*+1
                                CAS1   *=*+1           ;CASSETTE MANUAL/CONTROLLED SWITCH
                                TMP0
                                STAL   *=*+1
                                STAH   *=*+1
                                MEMUSS                 ;CASSETTE LOAD TEMPS (2 BYTES)
                                TMP2   *=*+2
                                ;
                                ;VARIABLES FOR SCREEN EDITOR
                                ;
                                LSTX   *=*+1           ;KEY SCAN INDEX
                                ; SFST *=*+1 ;KEYBOARD SHIFT FLAG (UNUSED)
                                NDX    *=*+1           ;INDEX TO KEYBOARD Q
                                RVS    *=*+1           ;RVS FIELD ON FLAG
                                INDX   *=*+1
                                LSXP   *=*+1           ;X POS AT START
                                LSTP   *=*+1
                                SFDX   *=*+1           ;SHIFT MODE ON PRINT
                                BLNSW  *=*+1           ;CURSOR BLINK ENAB
                                BLNCT  *=*+1           ;COUNT TO TOGGLE CUR
                                GDBLN  *=*+1           ;CHAR BEFORE CURSOR
                                BLNON  *=*+1           ;ON/OFF BLINK FLAG
                                CRSW   *=*+1           ;INPUT VS GET FLAG
                                PNT    *=*+2           ;POINTER TO ROW
                                ; POINT *=*+1   (UNUSED)
                                PNTR   *=*+1           ;POINTER TO COLUMN
                                QTSW   *=*+1           ;QUOTE SWITCH
                                LNMX   *=*+1           ;40/80 MAX POSITON
                                TBLX   *=*+1
                                DATA   *=*+1
                                INSRT  *=*+1           ;INSERT MODE FLAG
                                LDTB1  *=*+26          ;LINE FLAGS+ENDSPACE
                                USER   *=*+2           ;SCREEN EDITOR COLOR IP
                                KEYTAB *=*+2           ;KEYSCAN TABLE INDIRECT
                                ;RS-232 Z-PAGE
                                RIBUF  *=*+2           ;RS-232 INPUT BUFFER POINTER
                                ROBUF  *=*+2           ;RS-232 OUTPUT BUFFER POINTER
                                FREKZP *=*+4           ;FREE KERNAL ZERO PAGE 9/24/80
                                BASZPT *=*+1           ;LOCATION ($00FF) USED BY BASIC
                                *=$100 
```

## Key Registers
- $0000-$00FF - Zero Page - KERNAL zero-page variables and low-memory allocations (D6510/R6510 at start, monitor regs PCH/PCL/FLGS/ACC/XR/YR/SP, INVH/INVL IRQ vectors, STATUS/STKEY/VERCK, cassette and RS-232 buffers and flags, screen editor variables, FREKZP free area, BASZPT at $00FF).
- $0100 - Low-memory origin marker set after these declarations (next code/data origin).

## References
- "declare_zero_page_part2" — continuation of zero-page variable definitions
- "io_devices_and_constants" — expands on I/O device addresses referenced by these variables (VIC/SID/6526)

## Labels
- D6510
- R6510
- PCH
- PCL
- INVH
- INVL
- BASZPT
