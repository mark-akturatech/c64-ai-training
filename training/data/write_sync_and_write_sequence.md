# Drive write sequence (JSR $FDA3 / JSR $FDC9, STA $1C01, LDA #$55, LDX #$FF, LDY #$48)

**Summary:** Assembly sequence calling JSR $FDA3 (write sync marks), enabling disk-controller write mode, outputting a non-sync byte via STA $1C01, setting X = #$FF and Y = #$48, then calling JSR $FDC9 (WRTNUM) to perform the block write; contains mnemonics (JSR/LDA/STA/LDX/LDY) and I/O address $1C01.

**Description**
This is a compact drive-side 6502 code sequence that prepares the disk controller for a block write and invokes a ROM write routine. Steps, in order:

- **JSR $FDA3** — Calls the routine that emits write sync marks and enables write mode on the drive controller (comment: ENABLE WRITE).
- **LDA #$55** — Loads the accumulator with the non-sync filler byte (comment: NON-SYNC BYTE).
- **STA $1C01** — Stores the non-sync byte to the disk data register at $1C01 (device I/O write).
- **LDX #$FF** — Sets X to #$FF (index parameter used by the following write routine).
- **LDY #$48** — Sets Y to #$48 (index/parameter used by the following write routine).
- **JSR $FDC9** — Calls the ROM write routine labeled WRTNUM to perform the block write (comment: WRITE 18432 NON SYNC BYTES).

These instructions are presented as a contiguous machine-code routine intended to be invoked from an assembler origin or a BASIC wrapper (see referenced chunks). The sequence ends by transferring control into the disk ROM write routine; follow-up code to re-enable read mode and exit/handler jump are not included here (see referenced "restore_read_and_exit").

## Source Code
```asm
; Drive write sequence (original had numeric prefixes 200..250)
        JSR $FDA3        ; ENABLE WRITE - write sync marks / enable write mode
        LDA #$55         ; NON-SYNC BYTE (filler/data)
        STA $1C01        ; write byte to disk data register
        LDX #$FF         ; parameter X = #$FF
        LDY #$48         ; parameter Y = #$48
        JSR $FDC9        ; WRTNUM - perform block write (ROM routine)
```

## References
- "basic_listing_and_assembler_origin" — expands on assembler origin and BASIC wrapper that invoke this machine-code routine  
- "restore_read_and_exit" — expands on re‑enabling read mode and the exit/handler jump after the write routine

## Labels
- WRTNUM
