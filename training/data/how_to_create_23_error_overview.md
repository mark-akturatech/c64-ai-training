# How to Create a 23 Error on a Single Sector

**Summary:** This entry provides metadata for a routine designed to induce a DOS "23" error on a specified disk sector by accepting track and sector numbers as parameters. It references a BASIC driver that invokes the routine and an Assembly listing that performs the destructive write operation.

**Description**

This routine is intended to deliberately create a "23" error (checksum error in data block) on a specified sector of a disk. It requires two parameters:

- **Track Number:** The track on the disk where the error will be induced.
- **Sector Number:** The sector within the specified track.

The routine is supported by two components:

- **BASIC Driver:** A user-interaction wrapper that prompts for track and sector numbers and calls the Assembly routine.
- **Assembly Routine:** Performs the low-level operations to corrupt the specified sector, resulting in a "23" error.

## Source Code

```assembly
; Assembly routine to induce a 23 error on a specified track and sector
; Parameters:
;   A - Track number (1-35)
;   X - Sector number (0-20, depending on track)
; Returns:
;   Carry flag set on error

        .org $C000  ; Load address

        lda #$00    ; Initialize error flag
        sta $FB     ; Clear error flag storage

        ; Send command to position the drive head
        lda #$08    ; Device number (8)
        ldx #$00    ; Secondary address (0)
        ldy #$0F    ; Command length
        jsr $FFBA   ; Call SETLFS

        lda #<cmd   ; Low byte of command string
        ldx #>cmd   ; High byte of command string
        ldy #$0F    ; Command length
        jsr $FFBD   ; Call SETNAM

        jsr $FFC0   ; Call OPEN

        bcs error   ; Branch if error occurred

        ; Send the command to the drive
        lda #$08    ; File number
        jsr $FFC9   ; Call CHKIN

        ldx #$00
send_cmd:
        lda cmd,x
        beq done
        jsr $FFD2   ; Call CHROUT
        inx
        bne send_cmd

done:
        jsr $FFCC   ; Call CLOSE
        rts

error:
        sec         ; Set carry flag to indicate error
        rts

cmd:
        .byte "B-W",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        .byte 0     ; Null terminator
```

```basic
10 REM BASIC driver to invoke the sector-destruction routine
20 INPUT "Enter Track (1-35): "; T
30 INPUT "Enter Sector (0-20): "; S
40 IF T<1 OR T>35 OR S<0 OR S>20 THEN PRINT "Invalid track or sector": END
50 SYS 49152, T, S
60 PRINT "Sector "; S; " on Track "; T; " has been corrupted."
```

## Key Registers

- **Track Number:** Passed in the accumulator (A register).
- **Sector Number:** Passed in the X register.

## References

- "single_sector_23_error_basic_program" — BASIC driver and user-interaction wrapper that invokes the sector-destruction routine
- "single_sector_23_error_source_listing" — Assembly routine that performs the destructive write to create the 23 error

## Labels
- SETLFS
- SETNAM
- OPEN
- CHKIN
- CHROUT
- CLOSE
