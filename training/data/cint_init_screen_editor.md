# CINT: INIT SCREEN EDITOR (KERNAL patch at $FF5B)

**Summary:** KERNAL init patch (vectored from $FF81) at $FF5B calls original I/O init ($E518), polls VIC-II raster ($D012) for top-of-screen, checks VIC-II IRQ flag ($D019) to detect PAL vs NTSC, stores result in $02A6, then jumps to ENABLE TIMER ($FDDD).

**Description**
This patched CINT entry (started via the vector at $FF81) performs these steps:

- Calls the original I/O init routine at $E518 to keep standard initialization.
- Waits for the top of the screen by polling the VIC-II raster register ($D012) until it reads zero.
- Reads the VIC-II IRQ flag register ($D019) and ANDs with #$01 (raster IRQ bit). The result indicates whether a raster interrupt occurred at the compare line.
- Stores that single-bit result into RAM location $02A6 (used here as the PAL/NTSC flag: nonzero = IRQ seen/presumed PAL).
- Jumps to ENABLE TIMER at $FDDD which uses the stored PAL/NTSC flag to set CIA timer values appropriately.

Operational intent: elsewhere (not shown in this listing) the code sets the VIC-II raster-compare to line 311 (the PAL vertical total). If an IRQ fires at that line, the raster IRQ bit in $D019 will be set; the absence of that IRQ implies a shorter NTSC frame. The stored flag ($02A6) is used by ENABLE TIMER to choose PAL vs NTSC timer constants.

**[Note: Source may contain an error — the write that sets the raster-compare to 311 is not present in the listed bytes; the detection relies on that write having occurred before this sequence.]**

## Source Code
```asm
.; CINT: INIT SCREEN EDITOR (patched)
.; vectored from $FF81

.,FF5B 20 18 E5    JSR $E518       ; original I/O init
.,FF5E AD 12 D0    LDA $D012       ; wait for top of screen
.,FF61 D0 FB       BNE $FF5E       ; loop until raster = 0
.,FF63 AD 19 D0    LDA $D019       ; check IRQ flag register
.,FF66 29 01       AND #$01        ; mask raster IRQ bit
.,FF68 8D A6 02    STA $02A6       ; store PAL/NTSC flag (0 = NTSC, 1 = PAL)
.,FF6B 4C DD FD    JMP $FDDD       ; jump to ENABLE TIMER
```

## Key Registers
- $D012 - VIC-II - Raster counter / raster-compare register (polled for top-of-screen)
- $D019 - VIC-II - IRQ status register (bit 0 = raster IRQ flag)
- $02A6 - RAM - KERNAL/patch PAL vs NTSC flag (stored 0/1 by this routine)

## References
- "enable_timer" — determines and sets CIA timer values according to PAL/NTSC