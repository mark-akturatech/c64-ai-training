# 23M.PAL — Full-Track 23 Write Routine (Assembly Listing)

**Summary:** Assembly listing for a full-track 23 write routine. This routine enables write mode by writing specific values to registers $1C03 and $1C0C, sets up zero-page locations ($0031, $003A), optionally increments a checksum, performs GCR conversion (JSR $F7AF), locates the header (JSR $F510), utilizes wait loops with the V (overflow) flag (BVC/CLV loops), streams data from the overflow buffer ($0100,Y) and sector buffer ($0400,Y) to $1C01, re-enables read mode (JSR $FE00), and returns to DOS (JMP $F975). It initializes the overflow buffer index with LDY #$BB.

**Description**

This assembly routine corresponds to the machine-code DATA block used by a BASIC driver for the full-track 23 error, which writes an entire track. The sequence includes:

- **Initial Setup:** Stores a driver/flag value into zero page (LDA #$04; STA $0031).
- **Optional Checksum Increment:** Increments the checksum in zero page ($003A).
- **GCR Conversion:** Calls the GCR conversion routine (JSR $F7AF).
- **Header Locate:** Calls the header-locate routine (JSR $F510) and waits out the header gap.
- **Enable Write Mode:** Writes specific values to I/O addresses $1C03 and $1C0C to enable write mode.
- **WRITESYNC/WAIT Loops:** Uses the V (overflow) flag with BVC/CLV loops to synchronize writes to the drive interface.
- **Data Streaming:** Streams bytes from:
  - Overflow buffer at $0100,Y (starting near the end of page 1 with LDY #$BB),
  - Sector buffer at $0400,Y,
  writing each byte to $1C01 while checking the V flag.
- **Re-enable Read Mode:** Calls the routine at $FE00 to re-enable read mode.
- **Final DOS Return:** Jumps to $F975 to return to DOS.

## Source Code

```asm
; 23M.PAL - Full-Track 23 Write Routine (Reconstructed Listing)
; Assembly equivalent of BASIC DATA block used by driver

        ; Initial Setup
        LDA #$04
        STA $0031             ; Store setup flag/value in zero page

        ; Optional Checksum Increment (if used)
        LDA $003A
        TAX
        INX
        TXA
        STA $003A             ; Store incremented checksum back

        ; Convert to GCR (DOS Routine)
        JSR $F7AF             ; GCR conversion

        ; Find Header/Gap for Write (DOS Routine)
        JSR $F510             ; Locate header / position to write

        ; Enable WRITE Mode (Writes to Device Control Registers)
        LDA #$FF
        STA $1C03             ; Set Port A Data Direction Register to output
        LDA #$20
        STA $1C0C             ; Set Auxiliary Control Register to enable write mode

WRITESYNC
        BVC WRITESYNC         ; Wait on V flag (overflow) — loop until branch condition
        CLV                   ; Clear V
        DEX
        BNE WRITESYNC

        ; Prepare Overflow Buffer Index
        LDY #$BB              ; Start index into overflow buffer ($0100 + Y)

OVERFLOW
WAIT1   BVC WAIT1             ; Wait loop checking V
        CLV
        STA $1C01             ; Write current byte to device data register
        INY
        BNE OVERFLOW

BUFFER
        LDA $0400,Y           ; Load byte from sector buffer ($0400 + Y)
WAIT2   BVC WAIT2             ; Wait loop checking V
        CLV
        STA $1C01             ; Write byte to device data register
        INY
        BNE BUFFER

WAIT3   BVC WAIT3             ; Final wait loop (synchronization)
        ; (Falls through to re-enable READ)

        ; Re-enable READ Mode (DOS Routine)
        JSR $FE00

        ; Final Zero-Page/State Updates and DOS Return
        LDA #$05
        STA $0031
        LDA #$01
        STA $0002             ; Zero page $0002 set to 1 (driver/DOS state)
        JMP $F975             ; Final DOS return

; End of Listing
```

## Key Registers

- **$0002**: Zero page - driver/DOS state flag (set to #$01 before returning)
- **$0031**: Zero page - driver state/parameter (initialized with #$04)
- **$003A**: Zero page - checksum byte (optionally incremented)
- **$0100-$01FF**: RAM page 1 - overflow buffer (indexed with Y; LDY #$BB to start)
- **$0400-$04FF**: RAM page 4 - sector buffer (streamed via LDA $0400,Y)
- **$1C01**: I/O - device data write register (bytes are STA $1C01)
- **$1C03**: I/O - Port A Data Direction Register (set to #$FF to enable write mode)
- **$1C0C**: I/O - Auxiliary Control Register (set to #$20 to enable write mode)
- **$F7AF**: ROM (KERNAL/DOS) - GCR conversion routine (JSR target)
- **$F510**: ROM (KERNAL/DOS) - header-locate routine (JSR target)
- **$FE00**: ROM (KERNAL/DOS) - enable READ routine (JSR target)
- **$F975**: ROM (KERNAL/DOS) - DOS return (JMP target)

## References

- "full_track_23_error_basic_job_queue_and_data" — expands on the DATA bytes in the BASIC listing corresponding to this assembly
- "duplicate_single_sector_23_annotation" — related note on checksum behavior for the single-sector duplicate variant