# 256-Byte Autostart Fast Loader — VIC-II Badline Avoidance

**Summary:** Checks VIC-II raster ($D012) to avoid starting timing-sensitive CPU transfers on VIC badlines (VIC-II DMA every 8th raster line in 50-249). Uses 6502 instructions (LDA/CMP/AND/CMP/BEQ/BCC) to delay transfers until a safe raster line.

## Badline avoidance description
The VIC-II performs memory DMA every 8th raster line within the visible area (raster lines 50–249), stealing 40 CPU cycles and disrupting precise timing. A fast loader must avoid initiating receive/transfer operations that require uninterrupted CPU time at or immediately before those badlines.

This check does:
- Read raster: LDA $D012
- If raster < 50 (outside the visible area), branch to the safe label (BCC wait_raster_end).
- Otherwise mask low 3 bits (AND #$07) to compute raster mod 8 and compare with #$02.
- If equal (BEQ wait_raster), treat the line as dangerous and wait (loop) until a safe raster is reached.

(The code thus prevents starting a transfer on or immediately before a VIC badline.)

## Source Code
```asm
; Badline avoidance raster check
    lda $D012           ; raster position
    cmp #50             ; outside visible area?
    bcc wait_raster_end ; yes, safe
    and #$07            ; check if before badline
    cmp #$02
    beq wait_raster     ; wait if dangerous
```

## Key Registers
- $D000-$D02E - VIC-II - VIC registers (including raster counter $D012)

## References
- "receiving_code_c64" — ensuring receive routine runs during safe raster lines
- "handshake_protocol" — timing coordination with the drive's check loop