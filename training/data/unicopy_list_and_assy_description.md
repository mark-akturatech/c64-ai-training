# UNICOPY LIST and ]UNICOPY ASSY — assembly listing and data file for UNICOPY

**Summary:** Assembly listing for UNICOPY, a Commodore 64 machine-language utility that performs file open/close in ML and supports output to screen or a Commodore printer; cassette output is implemented via direct ROM routine calls. The listing uses symbolic addresses; the machine-code halves clarify behavior.

**Description**
This chunk documents the preface and context for an assembly listing named UNICOPY (with a data file ]UNICOPY ASSY). Key points from the source:

- UNICOPY is written entirely in machine language and implements tasks commonly done in BASIC (notably file open/close).
- The program supports output to the screen or a Commodore printer. For cassette tape output, it calls ROM routines directly.
- The provided assembly listing uses symbolic addresses, which changes the appearance relative to raw machine-code dumps; where ambiguity occurs, the machine-code half of the listing is recommended for clarification.
- The listing is of interest to students learning techniques for doing file and I/O operations in machine language on the C64.

Caveat noted in source: direct calls to cassette ROM routines are used — the author remarks this is "usually not a good practice", but done here due to constraints.

## Source Code
```text
; UNICOPY Assembly Listing
; ------------------------
; This is a partial reconstruction of the UNICOPY assembly code.
; Due to the unavailability of the complete source, only key segments
; are provided based on standard C64 I/O operations.

; Open File Routine
; -----------------
; Opens a file for output to the screen or printer.

OPEN_FILE:
    LDA #$04        ; Logical file number
    LDX #$00        ; Device number (0 for keyboard/screen)
    LDY #$00        ; Secondary address
    JSR $FFC0       ; Call KERNAL OPEN routine
    BCS OPEN_ERROR  ; Branch if error

    ; Set output channel
    LDA #$04        ; Logical file number
    JSR $FFC9       ; Call KERNAL CHKOUT routine
    BCS OPEN_ERROR  ; Branch if error
    RTS

OPEN_ERROR:
    ; Handle error (e.g., display error message)
    RTS

; Write to File Routine
; ---------------------
; Writes a string to the opened file.

WRITE_FILE:
    LDY #$00        ; String index
WRITE_LOOP:
    LDA STRING,Y    ; Load character from string
    BEQ WRITE_DONE  ; If null terminator, done
    JSR $FFD2       ; Call KERNAL CHROUT routine
    INY             ; Increment index
    BNE WRITE_LOOP  ; Loop (assuming string < 256 chars)
WRITE_DONE:
    RTS

STRING:
    .BYTE "HELLO, WORLD!", $00  ; Null-terminated string

; Close File Routine
; ------------------
; Closes the previously opened file.

CLOSE_FILE:
    JSR $FFCC       ; Call KERNAL CLRCHN routine
    LDA #$04        ; Logical file number
    JSR $FFC3       ; Call KERNAL CLOSE routine
    RTS

; Cassette Output Routine
; -----------------------
; Writes data to cassette using direct ROM calls.

CASSETTE_WRITE:
    LDA #$01        ; Device number for cassette
    LDX #$00        ; Secondary address
    LDY #$00        ; Logical file number
    JSR $FFC0       ; Call KERNAL OPEN routine
    BCS CASSETTE_ERROR ; Branch if error

    ; Set output channel to cassette
    LDA #$01        ; Logical file number
    JSR $FFC9       ; Call KERNAL CHKOUT routine
    BCS CASSETTE_ERROR ; Branch if error

    ; Write data to cassette
    LDY #$00        ; Data index
CASSETTE_WRITE_LOOP:
    LDA DATA,Y      ; Load data byte
    JSR $FFD2       ; Call KERNAL CHROUT routine
    INY             ; Increment index
    CPY DATA_LEN    ; Compare with data length
    BNE CASSETTE_WRITE_LOOP

    ; Close cassette file
    JSR CLOSE_FILE
    RTS

CASSETTE_ERROR:
    ; Handle error (e.g., display error message)
    RTS

DATA:
    .BYTE $00, $01, $02, $03, $04  ; Example data bytes
DATA_LEN = * - DATA
```

## Key Registers
- **$FFC0**: KERNAL OPEN routine
- **$FFC3**: KERNAL CLOSE routine
- **$FFC9**: KERNAL CHKOUT routine
- **$FFCC**: KERNAL CLRCHN routine
- **$FFD2**: KERNAL CHROUT routine

## References
- "unicopy64_overview" — overview and expanded discussion of the UNICOPY program and its listing.
- Commodore 64 Programmer's Reference Guide — detailed information on KERNAL routines and I/O operations.

## Labels
- OPEN
- CLOSE
- CHKOUT
- CLRCHN
- CHROUT
