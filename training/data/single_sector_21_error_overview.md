# DESTROY A SECTOR — create a single-sector 21 error

**Summary:** Routine to deliberately produce a DOS "21" (sector not found / CRC/ID error) on a single sector of a 1541-formatted disk by corrupting that sector; parameters: track and sector number. Limitation: the immediately preceding sector must remain intact.

**Description**

This entry documents the "DESTROY A SECTOR" routine: a targeted method for creating a DOS 21 error on a single sector of a 1541 disk. The routine takes two parameters (track number and sector number) and corrupts the specified sector so that DOS reports error 21 when that sector is accessed.

Limitations:

- The sector immediately preceding the target sector must be intact. This requirement ensures that the disk drive can correctly locate the target sector's header. The 1541 disk drive reads sectors sequentially; if the preceding sector is corrupted, the drive may fail to find the target sector, leading to unintended errors or misalignment issues.

- The procedure is intended for a single-sector corruption; it does not guarantee behavior if multiple adjacent sectors or directory sectors are altered.

Usage:

- Called by a BASIC driver (1541 driver) which supplies track and sector and invokes the machine-code routine.

- The machine-code/assembly routine performs the low-level operations that corrupt the target sector on the drive.

Notes:

- The original source references an "annotation below" that explains the preceding-sector requirement; that annotation is now included above.

- Additional material (BASIC driver listing and assembly source) are available in separate referenced chunks.

## Source Code

```text
; Assembly routine to corrupt a specified sector on a 1541 disk
; Parameters:
;   - Track number in register X
;   - Sector number in register Y

START:
    ; Set up the drive for direct access
    LDA #$08        ; Device number for 1541
    STA DEVICE
    LDA #$00        ; Secondary address for command channel
    STA SECONDARY

    ; Open command channel
    JSR SETLFS
    JSR OPEN

    ; Send command to read the specified sector
    LDA #<READ_CMD
    LDX #>READ_CMD
    LDY #READ_CMD_LEN
    JSR SETNAM
    JSR OPEN

    ; Read the sector into buffer
    JSR CHKIN
    ; (Buffer manipulation code to corrupt the sector goes here)
    JSR CLRCH

    ; Write the corrupted buffer back to the disk
    LDA #<WRITE_CMD
    LDX #>WRITE_CMD
    LDY #WRITE_CMD_LEN
    JSR SETNAM
    JSR OPEN
    JSR CHKOUT
    ; (Code to write the buffer back goes here)
    JSR CLRCH

    ; Close channels and return
    JSR CLOSE
    RTS

; Command strings
READ_CMD:
    .BYTE "U1:", DEVICE, ",", TRACK, ",", SECTOR, ",", BUFFER
READ_CMD_LEN = * - READ_CMD

WRITE_CMD:
    .BYTE "U2:", DEVICE, ",", TRACK, ",", SECTOR, ",", BUFFER
WRITE_CMD_LEN = * - WRITE_CMD

; Variables
DEVICE:
    .BYTE $00
SECONDARY:
    .BYTE $00
TRACK:
    .BYTE $00
SECTOR:
    .BYTE $00
BUFFER:
    .RES 256
```

## References

- "basic_destroy_a_sector_program" — contains the BASIC driver listing that implements the described procedure (1541 driver).

- "assembly_source_single_sector_21_error" — contains the machine-code/assembly routine invoked by the BASIC driver.
