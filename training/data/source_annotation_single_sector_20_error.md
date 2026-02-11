# Single-sector 20-error — annotated routine

**Summary:** This routine manipulates the Commodore 1541 disk drive to intentionally corrupt a sector header, creating a "20" read error. It synchronizes with the preceding sector, calculates the next sector number, constructs a header image in RAM, repositions to the target header, switches the drive to write mode, and writes the header slowly to induce corruption. Techniques include header synchronization, sector computation, intentional timing manipulation during write initiation, and managing tail-gap timing limitations.

**Operation**

- **Preconditions:** The preceding sector (header and data block) must be intact, as the routine uses it for synchronization.

- **Initial Synchronization (lines 200–210):** Align with the prior track's header and data block to establish timing and bit alignment relative to the data stream.

- **Sector Computation (lines 230–400):** Calculate the next sector number within the current zone using zone addressing arithmetic.

- **Header Image Creation:** Assemble the header block bytes in RAM at addresses $0024–$002C. The header format is as follows:

  - **$0024:** Sync mark ($FF)
  - **$0025:** Track number (1–35)
  - **$0026:** Sector number (0–20, depending on track)
  - **$0027:** Disk ID byte 1
  - **$0028:** Disk ID byte 2
  - **$0029:** Header checksum
  - **$002A–$002C:** Gap bytes (typically $55)

  This structure aligns with the standard 1541 sector header format.

- **Final Positioning:** Perform an additional synchronization to position the read/write head at the start of the target header block.

- **Flip to Write Mode and Rewrite Header:** Switch the drive/controller into write mode and output the prepared header image. The write timing is intentionally slowed to ensure the trailing noise at the end of the sync mark corrupts the header block identifier.

- **Observation:** Adjusting the internal clock during testing shows the header was entirely rewritten; under normal operation, the goal is to corrupt the header identifier by introducing timing noise at the end of the sync.

- **Tail-Gap Limitation:** Due to the unpredictable length of the tail gap, precise byte-counting to the exact flip point is impractical. The chosen approach of destroying the header ID by slow writing at the header start avoids the need for precise tail-gap measurement and achieves the intended corruption.

## Source Code

The following assembly code illustrates the process of switching the 1541 drive to write mode and writing the header image:

```assembly
; Set the drive to write mode
LDA #$08        ; Command to set write mode
STA $1C00       ; Write to the control register

; Write the header image from $0024–$002C
LDX #$00
WriteLoop:
    LDA $0024,X
    STA $1C01   ; Write to the data register
    INX
    CPX #$09    ; 9 bytes in the header
    BNE WriteLoop

; Restore the drive to read mode
LDA #$00        ; Command to set read mode
STA $1C00       ; Write to the control register
```

In this code:

- $1C00 is the control register for the 1541 drive.
- $1C01 is the data register for writing data.
- The header image is stored in memory locations $0024–$002C.

This sequence sets the drive to write mode, writes the header bytes, and then returns the drive to read mode.

## Key Registers

- **$0024–$002C:** RAM locations used as the header image buffer, storing the prepared header bytes before writing.

## References

- "basic_driver_listing_single_sector_20_error" — BASIC driver that invokes this machine routine
- "asm_source_listing_single_sector_20_error" — Assembly listing and timing/action details for the implementation
- "overview_and_parameters_single_sector_20_error" — Context, limits, and overview parameters for the routine

## Labels
- $0024
- $1C00
- $1C01
