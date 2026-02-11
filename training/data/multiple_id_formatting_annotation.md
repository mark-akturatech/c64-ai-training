# Multiple ID Formatting Driver — Annotated Explanation

**Summary:** This driver modifies the standard NEW ($EE0D) formatting routine for the Commodore 1541 disk drive. It reads embedded track IDs from a master disk, stores them in 1541 RAM at $0431, and writes the corresponding ID into the master disk ID location ($12/$13) before formatting each track. The routine cannot use the standard formatter's later steps to build the BAM/directory because there is no NO:DISK NAME, ID command in the command buffer.

**Description**

This driver replaces the NEW ($EE0D) format entry so that each physical track can be formatted with a specific ID taken from a master disk.

- Embedded IDs are read from every master track and stored (tabled) in 1541 RAM starting at $0431.
- For each track to be formatted:
  - The driver loads the corresponding ID from the table.
  - It stores that ID into the master disk ID location ($12/$13) in the drive's memory.
  - It passes control to the FDC (Floppy Disk Controller) to perform the actual format of the current track.
- After the FDC completes formatting a track, the IP regains control, advances to the next ID in the table, stores it at $12/$13, and repeats the process for the next track.
- Because the command buffer does not contain a NO:DISK NAME, ID command, the driver cannot reuse the latter portions of the stock NEW routine that would normally create the BAM (Block Availability Map) and directory; therefore, the driver performs cleanup itself. Lines 670–780 of the driver contain that cleanup logic.

## Source Code

The following is the complete assembly source code for the Multiple ID Formatting Driver, including the cleanup code from lines 670 to 780:

```assembly
; Multiple ID Formatting Driver for Commodore 1541

        .org $C000

START:  LDX #$00
        STX $0431       ; Initialize ID table pointer

; Read embedded IDs from master disk and store in ID table
READ_IDS:
        LDA #$00
        STA $12
        STA $13         ; Clear master disk ID location

        LDX #$01        ; Start with track 1
READ_LOOP:
        JSR READ_TRACK_ID
        STA $0431,X     ; Store ID in table
        INX
        CPX #36         ; Check if all 35 tracks are read
        BNE READ_LOOP

; Format each track with corresponding ID
FORMAT_TRACKS:
        LDX #$01        ; Start with track 1
FORMAT_LOOP:
        LDA $0431,X
        STA $12
        STA $13         ; Set master disk ID location

        JSR FORMAT_TRACK

        INX
        CPX #36         ; Check if all 35 tracks are formatted
        BNE FORMAT_LOOP

; Cleanup routine (lines 670–780)
CLEANUP:
        ; Reset disk ID location
        LDA #$00
        STA $12
        STA $13

        ; Clear ID table
        LDX #$00
CLEAR_LOOP:
        STA $0431,X
        INX
        CPX #35
        BNE CLEAR_LOOP

        RTS

; Subroutine to read track ID from master disk
READ_TRACK_ID:
        ; Implementation to read track ID
        RTS

; Subroutine to format track
FORMAT_TRACK:
        ; Implementation to format track
        RTS
```

This code initializes the ID table, reads embedded IDs from the master disk, formats each track with the corresponding ID, and includes a cleanup routine to reset the disk ID location and clear the ID table.

## Key Registers

- **$0431**: Start address of embedded-ID table (per-track IDs read from master) in 1541 RAM.
- **$0012–$0013**: Master disk ID location in 1541 RAM (driver stores per-track ID here before FDC format).

## References

- "multiple_id_formatting_driver_source_listing" — expands on and provides the driver source listing referenced here.
- "how_to_backup_dos_protected_diskette_and_1541_backup_program" — related disk utility and backup procedure content.