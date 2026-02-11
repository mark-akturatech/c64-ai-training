# Tail / gap / header writes into buffer at $0300 (byRiclianll)

**Summary:** This routine writes specific gap and header bytes into a buffer at $0300 using STA/INX sequences, preparing the buffer for subsequent checksum computation. The buffer is referenced as $0300,X, with X initialized to 0 before the sequence begins. The routine concludes by loading the accumulator with zero (LDA #$00) in preparation for the checksum calculation. Searchable terms: $0300, STA, INX, $0300,X, GAP, LDA #$00, checksum.

**Description**

This routine sets up the tail-gap and header area in memory at address $0300, which is used in the Commodore 1541 disk drive's sector formatting process. The process involves writing a series of predefined bytes to this buffer, which represent the gap and header information required for proper disk sector formatting.

The routine operates as follows:

1. **Initialization of X Register:**
   - The X register is set to 0, establishing the starting offset into the buffer at $0300.

2. **Writing Gap Bytes:**
   - A loop writes a series of gap bytes (typically $55) into the buffer. Each byte is stored at the address $0300,X, and the X register is incremented after each store operation. The number of gap bytes written is determined by the disk formatting requirements.

3. **Writing Header Bytes:**
   - Following the gap bytes, the routine writes the header information into the buffer. This includes the sync mark, header magic byte, track number, sector number, disk ID, header checksum, and padding bytes. Each of these values is stored sequentially in the buffer, with the X register incremented accordingly.

4. **Preparing for Checksum Computation:**
   - After writing the header bytes, the accumulator is loaded with zero (LDA #$00). This prepares the accumulator for the subsequent checksum computation routine, which will verify the integrity of the header information.

The specific byte values written into the gap and header regions are as follows:

- **Gap Bytes:** $55 (repeated for the required number of times)
- **Header Bytes:**
  - Sync Mark: $08
  - Header Magic Byte: $08
  - Track Number: (current track number)
  - Sector Number: (current sector number)
  - Disk ID: (two bytes representing the disk ID)
  - Header Checksum: (computed as the XOR of the track number, sector number, and disk ID bytes)
  - Padding Bytes: $0F, $0F

These values are consistent with the standard 1541 disk format, where the header is 8 bytes in size and contains the above information. ([hemble.com](https://www.hemble.com/articles/c64-floppy-disk?utm_source=openai))

## Source Code

```asm
        LDX #$00                ; Initialize X to 0

; Write gap bytes
gap_loop:
        LDA #$55                ; Load gap byte value
        STA $0300,X             ; Store at $0300 + X
        INX                     ; Increment X
        CPX #<gap_length>       ; Compare X to gap length
        BNE gap_loop            ; Repeat until gap is filled

; Write header bytes
        LDA #$08                ; Sync Mark
        STA $0300,X
        INX
        LDA #$08                ; Header Magic Byte
        STA $0300,X
        INX
        LDA #<track_number>     ; Track Number
        STA $0300,X
        INX
        LDA #<sector_number>    ; Sector Number
        STA $0300,X
        INX
        LDA #<disk_id_high>     ; Disk ID High Byte
        STA $0300,X
        INX
        LDA #<disk_id_low>      ; Disk ID Low Byte
        STA $0300,X
        INX
        LDA #<header_checksum>  ; Header Checksum
        STA $0300,X
        INX
        LDA #$0F                ; Padding Byte 1
        STA $0300,X
        INX
        LDA #$0F                ; Padding Byte 2
        STA $0300,X
        INX

; Prepare for checksum computation
        LDA #$00                ; Load zero into accumulator
```

## Key Registers

- **X Register:** Used as an index to write into the buffer at $0300.
- **Accumulator (A):** Holds the byte values to be stored in the buffer.

## References

- "compute_header_checksum_and_verify" — expands on checksum computation that follows the header writes
- "create_data_block_1541_format" — expands on data block creation that follows the header/sector setup

*Note: The specific values for `<gap_length>`, `<track_number>`, `<sector_number>`, `<disk_id_high>`, `<disk_id_low>`, and `<header_checksum>` should be defined based on the disk formatting parameters and computed accordingly.*