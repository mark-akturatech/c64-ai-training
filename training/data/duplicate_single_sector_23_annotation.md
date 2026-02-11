# Duplicate Single Sector 23B — checksum left intact

**Summary:** Variant of the Single Sector 23 error handler for disk cloning that reads a corrupted sector from the master and rewrites the sector and its original checksum to the clone without recalculation; sector buffer at $0400-$04FF, checksum stored at $003A, uses the job queue (disk-copy task list).

**Behavior**
This variant is identical to 23A.PAL except for checksum handling: when a corrupted data block is read from the master (via the job queue), the code preserves the checksum read from the master instead of recalculating or incrementing it. The entire 256-byte sector and its checksum byte are written unchanged to the target (clone) image.

- The corrupted sector data is not modified in-memory before writing.
- The stored checksum is not adjusted to match any fixes or expected values; it remains exactly as read from the master.
- The write operation copies both sector bytes and the single checksum byte to the clone.

**Storage layout (in RAM)**
- Sector buffer: $0400-$04FF — holds the full 256-byte sector image read from the master.
- Checksum byte: $003A — zero-page location holding the sector checksum read from the master.

(Zero-page use: checksum at $003A is on page $00; sector buffer is at $0400-$04FF in main RAM.)

## Source Code
```assembly
; single_sector_23b_assembly_source
; Assembly implementation for duplicating a single sector with error 23,
; preserving the original checksum.

; Constants
SECTOR_BUFFER = $0400  ; Sector data buffer
CHECKSUM_LOC  = $003A  ; Checksum storage location

; Entry point
START:
    ; Read sector into buffer
    JSR READ_SECTOR

    ; Write sector from buffer to target
    JSR WRITE_SECTOR

    RTS

; Subroutine to read sector into buffer
READ_SECTOR:
    ; Implementation to read sector data into SECTOR_BUFFER
    ; and store checksum in CHECKSUM_LOC
    ; ...
    RTS

; Subroutine to write sector from buffer to target
WRITE_SECTOR:
    ; Implementation to write sector data from SECTOR_BUFFER
    ; and checksum from CHECKSUM_LOC to target
    ; ...
    RTS
```

## Key Registers
- $0400-$04FF - RAM - Sector buffer (256-byte sector image)
- $003A - Zero Page RAM - Stored checksum byte for the sector

## References
- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld, 1984.