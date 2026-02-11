# KERNAL IEC Serial I/O patterns (OPEN/SETLFS/SETNAM/LOAD/LISTEN/CIOUT)

**Summary:** KERNAL vectors for Commodore 64 IEC serial bus I/O: SETLFS $FFBA, SETNAM $FFBD, OPEN $FFC0, CLOSE $FFC3, CHKIN $FFC6, CLRCHN $FFCC, CHRIN $FFCF, LOAD $FFD5, LISTEN $FFB1, SECOND $FF93, CIOUT $FFA8, UNLISTEN $FFAE. Assembly patterns show parameter register usage (A/X/Y) and example sequences for opening the error channel, reading status, loading files, and sending a byte to a device.

## Overview
This chunk contains concise 6502 assembly usage patterns for the C64 KERNAL IEC serial routines. It documents the register conventions (A/X/Y) used to pass logical file, device, secondary address and filename pointers, and shows the typical call order for:
- opening a channel (SETLFS, SETNAM, OPEN)
- reading a character/status from the error (command) channel (CHKIN, CHRIN, CLRCHN, CLOSE)
- loading a file using KERNAL LOAD (SETNAM, SETLFS, LOAD)
- sending a single byte to a device (LISTEN, SECOND, CIOUT, UNLISTEN)

Parameter conventions shown (from examples):
- SETLFS (JSR $FFBA): A = logical file number, X = device number, Y = secondary address
- SETNAM (JSR $FFBD): A = length of filename, X = low byte of filename address, Y = high byte of filename address
- LOAD (JSR $FFD5): A = 0 for LOAD (not verify) in examples
- CHKIN (JSR $FFC6): X = logical file number to set as input; CHRIN (JSR $FFCF) returns character in A
- LISTEN (JSR $FFB1): A = device number; SECOND (JSR $FF93): A = secondary address byte; CIOUT (JSR $FFA8): sends byte in A; UNLISTEN (JSR $FFAE) ends conversation

No code or register bit-level tables are duplicated here — see the Source Code section for full assembly examples.

## Source Code
```asm
; Reading the error channel:
; OPEN 15,8,15
LDA #15          ; Logical file number
LDX #8           ; Device number
LDY #15          ; Secondary address (command channel)
JSR $FFBA        ; SETLFS
LDA #0           ; No filename
JSR $FFBD        ; SETNAM
JSR $FFC0        ; OPEN

; Read status
LDX #15          ; Logical file number
JSR $FFC6        ; CHKIN - set as input
JSR $FFCF        ; CHRIN - read character (returned in A)
JSR $FFCC        ; CLRCHN - restore default channels

; CLOSE 15
LDA #15
JSR $FFC3        ; CLOSE

; Loading a file:
LDA #namelen     ; Length of filename
LDX #<name       ; Low byte of filename address
LDY #>name       ; High byte of filename address
JSR $FFBD        ; SETNAM

LDA #1           ; Logical file number
LDX #8           ; Device number
LDY #1           ; Secondary address (1 = load to address in file)
JSR $FFBA        ; SETLFS

LDA #0           ; 0 = LOAD (not verify)
JSR $FFD5        ; LOAD

; Sending a byte to device:
LDA #device      ; Device number
JSR $FFB1        ; LISTEN
LDA #$6F         ; Secondary address 15 ($60 + $0F)
JSR $FF93        ; SECOND
LDA #data_byte   ; Byte to send
JSR $FFA8        ; CIOUT
JSR $FFAE        ; UNLISTEN
```

## Key Registers
- $FFBA - KERNAL - SETLFS (A=logical file, X=device, Y=secondary)
- $FFBD - KERNAL - SETNAM (A=filename length, X=addr low, Y=addr high)
- $FFC0 - KERNAL - OPEN
- $FFC3 - KERNAL - CLOSE
- $FFC6 - KERNAL - CHKIN (set logical file as input; X=logical file)
- $FFCC - KERNAL - CLRCHN (restore channels)
- $FFCF - KERNAL - CHRIN (read character; returned in A)
- $FFD5 - KERNAL - LOAD
- $FFB1 - KERNAL - LISTEN
- $FF93 - KERNAL - SECOND (send secondary address)
- $FFA8 - KERNAL - CIOUT (send character in A)
- $FFAE - KERNAL - UNLISTEN

## References
- "kernal_low_level_calls" — expands on low-level vectors used by assembly routines
- "high_level_channel_io" — expands on how assembly maps to high-level channel operations

## Labels
- SETLFS
- SETNAM
- OPEN
- CHKIN
- CHRIN
- LOAD
- LISTEN
- CIOUT
