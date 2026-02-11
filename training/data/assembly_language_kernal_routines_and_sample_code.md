# Kernal file I/O entry points and sample: SETLFS, SETNAM, OPEN, CLOSE, CHKIN, CLRCH, BASIN, BSOUT

**Summary:** Kernal subroutine entry addresses for disk file operations ($FFBA, $FFBD, $FFC0, $FFC3, $FFC6, $FFCC, $FFCF, $FFD2), calling conventions (A/X/Y use), and a compact assembly example that opens and reads a sequential file one byte at a time using JSR to Kernal routines.

## Overview
This chunk lists the Kernal entry points used for basic 1541 disk file handling from assembly, shows the register usage implied by the example, and provides a minimal working assembly pattern to open, read sequentially, print, and close a file.

Calling conventions shown in the example:
- SETNAM — A = filename length; X = low byte of filename address; Y = high byte of filename address.
- SETLFS — A = logical file number; X = device number; Y = secondary address (0 = read sequential).
- OPEN — opens the previously specified logical/device/secondary.
- CHKIN — X = logical file number to open a channel for input.
- BASIN — reads one byte into A; sets Z flag (BEQ) when returned value is zero (EOF or error).
- BSOUT — outputs the character in A to the current output device (typically the screen).
- CLOSE — A = logical file number to close.
- CLRCH — clears all channels and resets channel defaults.

For complete parameter lists, error codes, and additional behaviors consult the Commodore 64 Programmer's Reference Guide.

**[Note: Source may contain an error — the OPEN address in the original text is shown as "SFFC0" but should be "$FFC0".]**

## Source Code
```asm
; Kernal subroutine entry points (for reference)
; SETLFS = $FFBA       ; set logical, physical & secondary addresses
; SETNAM = $FFBD       ; save length & address of filename
; OPEN   = $FFC0       ; open a logical file
; CLOSE  = $FFC3       ; close a logical file
; CHKIN  = $FFC6       ; open a channel for input
; CLRCH  = $FFCC       ; clear all channels
; BASIN  = $FFCF       ; get a byte from a file
; BSOUT  = $FFD2       ; output a character to the screen

; Sample: open and read a sequential file named "TEST" stored at $C000
; Filename at $C000: first byte is 'T', then 'E', 'S', 'T' (no zero terminator);
; filename length = 4

        ; INIT - set up filename pointer and length
        LDA #$04         ; A = filename length
        LDX #$00         ; X = low byte of filename address ($C000)
        LDY #$C0         ; Y = high byte of filename address
        JSR $FFBD        ; JSR SETNAM

        LDA #$03         ; A = logical file number (3)
        LDX #$08         ; X = device number (8 = disk drive 1541)
        LDY #$00         ; Y = secondary address (0 = read sequential)
        JSR $FFBA        ; JSR SETLFS

        JSR $FFC0        ; JSR OPEN

        LDX #$03         ; X = logical file number for CHKIN
        JSR $FFC6        ; JSR CHKIN

; read loop: read one byte, exit on zero, output to screen, repeat
READ_LOOP:
        JSR $FFCF        ; JSR BASIN   ; byte returned in A, Z set if zero
        BEQ READ_END     ; if A==0 then EOF or error
        JSR $FFD2        ; JSR BSOUT   ; output character in A
        JMP READ_LOOP

READ_END:
        LDA #$03         ; A = logical file number to close
        JSR $FFC3        ; JSR CLOSE
        JSR $FFCC        ; JSR CLRCH    ; clear channels/reset defaults
        RTS
```

## Key Registers
- $FFBA - KERNAL (ROM) - SETLFS: set logical file, device number, secondary address
- $FFBD - KERNAL (ROM) - SETNAM: set filename address and length
- $FFC0 - KERNAL (ROM) - OPEN: open logical file (note: source typo corrected to $FFC0)
- $FFC3 - KERNAL (ROM) - CLOSE: close logical file
- $FFC6 - KERNAL (ROM) - CHKIN: open input channel (X holds logical file number)
- $FFCC - KERNAL (ROM) - CLRCH: clear channels and reset defaults
- $FFCF - KERNAL (ROM) - BASIN: read one byte from input channel (A = byte; Z=1 if zero)
- $FFD2 - KERNAL (ROM) - BSOUT: output character in A to current output device

## References
- "memory_read_command_and_sample_program" — related low-level memory read and execution examples

## Labels
- SETLFS
- SETNAM
- OPEN
- CLOSE
- CHKIN
- CLRCH
- BASIN
- BSOUT
