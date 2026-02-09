# Create 1541 Data Block at $0500

**Summary:** This routine initializes a 1541-format disk sector data block in RAM at $0500, starting with the data identifier byte $4B at offset 0, and fills the remaining 255 bytes with sequential values from 1 to 255.

**Description**

The routine sets up a 256-byte buffer at memory location $0500, formatted for the Commodore 1541 disk drive. The first byte is set to $4B, a data identifier used in the 1541 sector format. The subsequent bytes are filled with values corresponding to their respective offsets, achieved through an indexed loop.

Behavioral details:

- The first byte at $0500 is set to $4B, serving as the data identifier.
- The X register is initialized to 1.
- A loop transfers the value of X to the accumulator (A) and stores it at the address $0500 + X.
- The loop increments X and continues until X wraps from $FF to $00, filling bytes $0501 to $05FF with values from 1 to 255.

This buffer is prepared for subsequent conversion to Group Coded Recording (GCR) format, a process handled by the 1541's ROM routines. GCR encoding is essential for writing data to the disk, as it translates the binary data into a format suitable for the disk's magnetic medium. The conversion process involves translating four 8-bit data bytes into five 8-bit GCR bytes, ensuring data integrity and synchronization during read/write operations. ([lyonlabs.org](https://www.lyonlabs.org/commodore/onrequest/Inside_Commodore_Dos.pdf?utm_source=openai))

## Source Code

```asm
; CREATE DATA - prepare 1541 data block at $0500
        LDA #$4B        ; 1541 data identifier
        STA $0500       ; store ID at offset 0
        LDX #$01        ; start X at 1 (fill remaining bytes)
        TXA             ; A := X

data_loop:
        STA $0500,X     ; store A into $0500 + X
        INX
        BNE data_loop   ; loop until X wraps to 0 (256 bytes total)

        ; done - buffer $0500-$05FF initialized
```

## Key Registers

- **$0500-$05FF**: RAM buffer for sector data (byte 0 = $4B identifier; bytes 1–255 filled by X-indexed loop).

## References

- "compute_header_checksum_and_verify" — uses header validation result before creating the data block.
- "convert_data_to_gcr_with_rom_routines" — details the conversion of the data block to GCR encoding in the next stage.