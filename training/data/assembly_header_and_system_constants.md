# 1541 BACKUP SOURCE LISTING — BASIC bootstrap and assembler constants (origin $C000)

**Summary:** BASIC bootstrap (OPEN 2,8,2 / SYS 40960), assembler directives (.OPT P,02) and assembler constants with origin *= $C000; defines RAM pointer POINT = $00FB and KERNAL routine vectors CHKOUT $FFC9, CHROUT $FFD2, CLRCHN $FFCC, CHKIN $FFC6, CHRIN $FFCF used by M-R/M-W disk routines.

## M-R / M-W routines and constants
This chunk is the header portion of a 1541 backup assembly source listing. It sets the code origin to $C000, reserves a RAM pointer (POINT = $00FB) for read/write operations, and declares KERNAL entry vectors used by the read/modify (M-R) and read/write (M-W) disk routines (open/close channels and character I/O). The assembler option .OPT P,02 appears in the prologue; a BASIC bootstrap opens device 8 and calls into the assembled code at $A000 (via SYS 40960).

The KERNAL vectors declared are the standard ROM entry addresses used for channel handling and byte I/O:
- CHKOUT — open channel for output (used before PUT/OUT)
- CHROUT — output a character
- CLRCHN — clear all channels
- CHKIN — open channel for input (used before GET/IN)
- CHRIN — input a character

**[Note: Source may contain an OCR/corruption error for the CHRIN line; it has been corrected to CHRIN = $FFCF (standard KERNAL vector).]**

## Source Code
```basic
100 REM BACKUP. PAL
110 REM
120 OPEN 2,8,2,"(10:M.B,P,W"
130 REM
140 SYS40960
150 ;
```

```asm
; assembly prologue from backup source listing
.OPT P,02
;
;   M-R  /  M-W  ROUTINES
;
* = $C000

; RAM LOCATIONS USED
POINT = $00FB   ; POINTER TO READ/WRITE

; RDM ROUTINES USED
CHKOUT = $FFC9  ; OPEN CHANNEL FOR OUTPUT
CHROUT = $FFD2  ; OUTPUT A CHARACTER
CLRCHN = $FFCC  ; CLEAR ALL CHANNELS
CHKIN  = $FFC6  ; OPEN CHANNEL FOR INPUT
CHRIN  = $FFCF  ; INPUT CHARACTER  ; corrected from corrupted source line
```

## Key Registers
- $C000 - Code origin (assembler *= $C000)
- $00FB - RAM - POINT pointer for read/write
- $FFC9 - KERNAL ROM - CHKOUT (open channel for output)
- $FFD2 - KERNAL ROM - CHROUT (output a character)
- $FFCC - KERNAL ROM - CLRCHN (clear all channels)
- $FFC6 - KERNAL ROM - CHKIN (open channel for input)
- $FFCF - KERNAL ROM - CHRIN (input a character)

## References
- "machine_code_data_and_track_skip_table" — binary DATA bytes for assembler routines at $C000
- "disk_commands_and_mr_entry" — defines constants, M-R/M-W command definitions, and M-R entry point