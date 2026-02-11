# Commodore 64 Memory Map (part 2): Zero Page — Tape, RS-232, Keyboard, BASIC/KERNAL Tables & Vectors

**Summary:** Zero page variable and pointer map for tape I/O, RS-232, keyboard buffering, BASIC temporary areas and pointers (e.g., $0098, $00A0-$00A2, $00AC-$00AF), system INPUT buffer ($0200-$0258), KERNAL file tables (LAT/FAT/SAT at $0259-$0276), and BASIC vectors/USR/interrupt vector notes (page $0300 area referenced).

**Overview**

This chunk is a cleaned excerpt of the C64 memory map listing many zero-page variables used by BASIC and the KERNAL for cassette (tape) I/O, RS-232 I/O, keyboard buffering and editor state, BASIC temporary storage and system tables, plus higher-page tables for open files and the system INPUT buffer.

Do not invent or expand addresses beyond the source; the full detailed address list is provided in the Source Code section below for exact lookup. Note that the source lists overlapping descriptions for $0100-$01FF (used as both processor stack and floating-point/tape work areas, which share the same physical memory).

## Source Code

```text
             HEX        DECIMAL
   LABEL   ADDRESS      LOCATION               DESCRIPTION
  -------------------------------------------------------------------------

          0097          151        Temp Data Area
  LDTND   0098          152        No. of Open Files / Index to File Table
  DFLTN   0099          153        Default Input Device (0)
  DFLTO   009A          154        Default Output (CMD) Device (3)
  PRTY    009B          155        Tape Character Parity
  DPSW    009C          156        Flag: Tape Byte-Received
  MSGFLG  009D          157        Flag: $80 = Direct Mode, $00 = Program
  PTR1    009E          158        Tape Pass 1 Error Log
  PTR2    009F          159        Tape Pass 2 Error Log
  TIME    00A0-00A2     160-162    Real-Time Jiffy Clock (approx) 1/60 Sec
          00A3-00A4     163-164    Temp Data Area
  CNTDN   00A5          165        Cassette Sync Countdown
  BUFPNT  00A6          166        Pointer: Tape I/O Buffer
  INBIT   00A7          167        RS-232 Input Bits / Cassette Temp
  BITCI   00A8          168        RS-232 Input Bit Count / Cassette Temp
  RINONE  00A9          169        RS-232 Flag: Check for Start Bit
  RIDATA  00AA          170        RS-232 Input Byte Buffer/Cassette Temp
  RIPRTY  00AB          171        RS-232 Input Parity / Cassette Short Cnt
  SAL     00AC-00AD     172-173    Pointer: Tape Buffer/ Screen Scrolling
  EAL     00AE-00AF     174-175    Tape End Addresses/End of Program
  CMP0    00B0-00B1     176-177    Tape Timing Constants
  TAPE1   00B2-00B3     178-179    Pointer: Start of Tape Buffer
  BITTS   00B4          180        RS-232 Out Bit Count / Cassette Temp
  NXTBIT  00B5          181        RS-232 Next Bit to Send/ Tape EOT Flag
  RODATA  00B6          182        RS-232 Out Byte Buffer
  FNLEN   00B7          183        Length of Current File Name
  LA      00B8          184        Current Logical File Number
  SA      00B9          185        Current Secondary Address
  FA      00BA          186        Current Device Number
  FNADR   00BB-00BC     187-188    Pointer: Current File Name
  ROPRTY  00BD          189        RS-232 Out Parity / Cassette Temp
  FSBLK   00BE          190        Cassette Read / Write Block Count
  MYCH    00BF          191        Serial Word Buffer
  CAS1    00C0          192        Tape Motor Interlock
  STAL    00C1-00C2     193-194    I/O Start Address
  MEMUSS  00C3-00C4     195-196    Tape Load Temps
  LSTX    00C5          197        Current Key Pressed: CHR$(n) 0 = No Key
  NDX     00C6          198        No. of Chars. in Keyboard Buffer (Queue)

             HEX        DECIMAL
   LABEL   ADDRESS      LOCATION               DESCRIPTION
  -------------------------------------------------------------------------

  RVS     00C7          199        Flag: Reverse Chars. - 1=Yes, 0=No Used
  INDX    00C8          200        Pointer: End of Logical Line for INPUT
  LXSP    00C9-00CA     201-202    Cursor X-Y Pos. at Start of INPUT
  SFDX    00CB          203        Flag: Print Shifted Chars.
  BLNSW   00CC          204        Cursor Blink enable: 0 = Flash Cursor
  BLNCT   00CD          205        Timer: Countdown to Toggle Cursor
  GDBLN   00CE          206        Character Under Cursor
  BLNON   00CF          207        Flag: Last Cursor Blink On/Off
  CRSW    00D0          208        Flag: INPUT or GET from Keyboard
  PNT     00D1-00D2     209-210    Pointer: Current Screen Line Address
  PNTR    00D3          211        Cursor Column on Current Line
  QTSW    00D4          212        Flag: Editor in Quote Mode, $00 = NO
  LNMX    00D5          213        Physical Screen Line Length
  TBLX    00D6          214        Current Cursor Physical Line Number
          00D7          215        Temp Data Area
  INSRT   00D8          216        Flag: Insert Mode, >0 = # INSTs
  LDTB1   00D9-00F2     217-242    Screen Line Link Table / Editor Temps
  USER    00F3-00F4     243-244    Pointer: Current Screen Color RAM loc.
  KEYTAB  00F5-00F6     245-246    Vector Keyboard Decode Table
  RIBUF   00F7-00F8     247-248    RS-232 Input Buffer Pointer
  ROBUF   00F9-00FA     249-250    RS-232 Output Buffer Pointer
  FREKZP  00FB-00FE     251-254    Free 0-Page Space for User Programs
  BASZPT  00FF          255        BASIC Temp Data Area
          0100-01FF     256-511    Micro-Processor System Stack Area

          0100-010A     256-266    Floating to String Work Area
  BAD     0100-013E     256-318    Tape Input Error Log

  BUF     0200-0258     512-600    System INPUT Buffer
  LAT     0259-0262     601-610    KERNAL Table: Active Logical File No's.
  FAT     0263-026C     611-620    KERNAL Table: Device No. for Each File
  SAT     026D-0276     621-630    KERNAL Table: Second Address Each File
  KEYD    0277-0280     631-640    Keyboard Buffer Queue (FIFO)
  MEMSTR  0281-0282     641-642    Pointer: Bottom of Memory for O.S.
  MEMSIZ  0283-0284     643-644    Pointer: Top of Memory for O.S.
  TIMOUT  0285          645        Flag: Kernal Variable for IEEE Timeout
  COLOR   0286          646        Current Character Color Code
  GDCOL   0287          647        Background Color Under Cursor

             HEX        DECIMAL
   LABEL   ADDRESS      LOCATION               DESCRIPTION
  -------------------------------------------------------------------------

  HIBASE  0288          648        Top of Screen Memory (Page)
  XMAX    0289          649        Size of Keyboard Buffer
  RPTFLG  028A          650        Flag: REPEAT Key Used, $80 = Repeat
  KOUNT   028B          651        Repeat Speed Counter
  DELAY   028C          652        Repeat Delay Counter
  SHFLAG  028D          653        Flag: Keyboard SHIFT Key/CTRL Key/C= Key
  LSTSHF  028E          654        Last Keyboard Shift Pattern
```

## Key Registers

- $0097 - Zero Page - Temp Data Area
- $0098-$009A - Zero Page - LDTND (No. of Open Files / File Table index), DFLTN (Default Input), DFLTO (Default Output)
- $009B-$009F - Zero Page - Tape parity/flags and tape error logs (PRTY, DPSW, MSGFLG, PTR1, PTR2)
- $00A0-$00A2 - Zero Page - TIME (Real-Time Jiffy Clock, ~1/60s)
- $00A5-$00AF - Zero Page - Cassette sync/countdown, Tape I/O buffer pointer (CNTDN, BUFPNT, RS-232 input bits, SAL, EAL)
- $00B0-$00B7 - Zero Page - Tape timing, tape buffer pointers, RS-232 out buffer and file name length
- $00B8-$00BC - Zero Page - Current file/device addressing (LA, SA, FA, FNADR)
- $00BD-$00BF - Zero Page - RS-232 out parity / cassette counters / serial buffer
- $00C0-$00C4 - Zero Page - Tape motor interlock / I/O start address / tape temps
- $00C5-$00CA - Zero Page - Keyboard current key

## Labels
- LDTND
- DFLTN
- BUFPNT
- INDX
- LAT
- FAT
- SAT
