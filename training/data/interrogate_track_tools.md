# Disk Interrogation Utilities (INTERROGATE FORMATTING ID'S / INTERROGATE A TRACK / SHAKE, RATTLE, AND ROLL / INTERROGATE A DISKETTE)

**Summary:** Utilities for scanning 1541-format tracks/disks using SEEK/READ and UI commands, reporting IP/FDC error codes (20,21,22,23,27,29), job-queue vs UI differences, and failure modes (BUMP, FDC hang, DISK ID MISMATCH). Mentions zero page ID bytes at $0016-$0017.

**INTERROGATE FORMATTING ID'S**

Uses a SEEK to read a track header and prints the ID HI/LO bytes from zero page $0016-$0017. The routine may hang if the FDC gets "stuck" on a track; a fail-safe mechanism is discussed elsewhere (not included here). Intended to expose track ID information from header fields.

**INTERROGATE A TRACK**

Scans a single track via the job queue: perform a SEEK to position the head, then issue a READ for each sector on the track. IP/FDC error codes from READ operations are returned to the screen. Notes and behaviors:

- No BUMP is invoked by the routine.
- Occasionally returns erroneous results: repeated scans of the same track can yield different error patterns.
- Some error codes return cleanly (22, 23, 27).
- Partial-format tracks (e.g., mid-track 21 errors) or scattered 20 errors can confuse the FDC and produce unstable/erroneous reporting.
- Errors tend to accumulate if a BUMP is overridden.
- Repeated runs are recommended to verify inconsistent patterns (see follow-ups).

**SHAKE, RATTLE, AND ROLL**

Scans a single track using a UI command (UI) instead of direct READs from the job queue. Differences and reasons:

- The track is still located with a prior SEEK to avoid 29 errors on multiple-formatted diskettes.
- A 29 indication is not an absolute error; it's a stumbling block (DISK ID MISMATCH).
- Running a UI without a preceding SEEK on a multiple-formatted diskette can report DISK ID MISMATCH because information may be stored on a track with a different ID.
- This method can force a BUMP on errors — use with discretion.
- Full-track runs of 21, 23, or 27 errors do not necessarily require this UI-based routine.
- After analysis, record error patterns for archival/diagnostic use.

**INTERROGATE A DISKETTE**

An automated loop of INTERROGATE A TRACK across all tracks of a diskette; reports only bad sectors to the display. Notes:

- Essentially a track-scan loop (SEEK then READ per sector).
- May require patching around a single problematic track to map the entire diskette (example patch referenced in source but not included here).

## Source Code

```assembly
; INTERROGATE FORMATTING ID'S
; Reads track header and prints ID HI/LO bytes from zero page $0016-$0017

    LDA #TRACK_NUMBER    ; Load desired track number
    STA $00F9            ; Set track number for SEEK
    LDA #0
    STA $00FA            ; Set sector number to 0
    JSR SEEK             ; Perform SEEK operation

    ; Check for SEEK error
    LDA $00FB            ; Load error status
    BNE SEEK_ERROR       ; Branch if error occurred

    ; Read header to retrieve ID bytes
    JSR READ_HEADER      ; Read header routine
    LDA $0016            ; Load ID HI byte
    STA $0400            ; Store at screen memory location
    LDA $0017            ; Load ID LO byte
    STA $0401            ; Store at next screen memory location
    RTS                  ; Return from subroutine

SEEK_ERROR:
    ; Handle SEEK error
    ; (Error handling code here)
    RTS                  ; Return from subroutine
```

```assembly
; INTERROGATE A TRACK
; Scans a single track via job queue, performing SEEK and READ operations

    LDA #TRACK_NUMBER    ; Load desired track number
    STA $00F9            ; Set track number for SEEK
    LDA #0
    STA $00FA            ; Set sector number to 0
    JSR SEEK             ; Perform SEEK operation

    ; Check for SEEK error
    LDA $00FB            ; Load error status
    BNE SEEK_ERROR       ; Branch if error occurred

    ; Loop through all sectors on the track
    LDX #0               ; Initialize sector counter
SECTOR_LOOP:
    STX $00FA            ; Set current sector number
    JSR READ_SECTOR      ; Perform READ operation

    ; Check for READ error
    LDA $00FB            ; Load error status
    BNE READ_ERROR       ; Branch if error occurred

    INX                  ; Increment sector counter
    CPX #SECTORS_PER_TRACK ; Compare with total sectors per track
    BNE SECTOR_LOOP      ; Loop if more sectors to read

    RTS                  ; Return from subroutine

SEEK_ERROR:
    ; Handle SEEK error
    ; (Error handling code here)
    RTS                  ; Return from subroutine

READ_ERROR:
    ; Handle READ error
    ; (Error handling code here)
    RTS                  ; Return from subroutine
```

```assembly
; SHAKE, RATTLE, AND ROLL
; Scans a single track using UI command instead of direct READs

    LDA #TRACK_NUMBER    ; Load desired track number
    STA $00F9            ; Set track number for SEEK
    LDA #0
    STA $00FA            ; Set sector number to 0
    JSR SEEK             ; Perform SEEK operation

    ; Check for SEEK error
    LDA $00FB            ; Load error status
    BNE SEEK_ERROR       ; Branch if error occurred

    ; Issue UI command to scan track
    LDA #$55             ; 'U' character
    STA $0400            ; Store at command buffer
    LDA #$49             ; 'I' character
    STA $0401            ; Store at next command buffer location
    LDA #$00             ; Null terminator
    STA $0402            ; Store at next command buffer location
    JSR SEND_COMMAND     ; Send command to disk drive

    ; Check for UI command error
    LDA $00FB            ; Load error status
    BNE UI_ERROR         ; Branch if error occurred

    RTS                  ; Return from subroutine

SEEK_ERROR:
    ; Handle SEEK error
    ; (Error handling code here)
    RTS                  ; Return from subroutine

UI_ERROR:
    ; Handle UI command error
    ; (Error handling code here)
    RTS                  ; Return from subroutine
```

```assembly
; INTERROGATE A DISKETTE
; Loops INTERROGATE A TRACK across all tracks of a diskette

    LDX #0               ; Initialize track counter
TRACK_LOOP:
    TXA                  ; Transfer track number to A
    STA $00F9            ; Set track number for SEEK
    LDA #0
    STA $00FA            ; Set sector number to 0
    JSR SEEK             ; Perform SEEK operation

    ; Check for SEEK error
    LDA $00FB            ; Load error status
    BNE SEEK_ERROR       ; Branch if error occurred

    ; Call INTERROGATE A TRACK routine
    JSR INTERROGATE_A_TRACK

    INX                  ; Increment track counter
    CPX #TOTAL_TRACKS    ; Compare with total number of tracks
    BNE TRACK_LOOP       ; Loop if more tracks to scan

    RTS                  ; Return from subroutine

SEEK_ERROR:
    ; Handle SEEK error
    ; (Error handling code here)
    RTS                  ; Return from subroutine
```

## Key Registers

- $0016-$0017 - Zero page - ID HI/LO bytes printed by INTERROGATE FORMATTING ID'S

## References

- "analyzing_protected_diskette_intro" — expands on context and why these utilities are useful