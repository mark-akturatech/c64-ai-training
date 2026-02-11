# Raster-synchronized playback via VIC-II IRQ ($0314/$0315, $D012)

**Summary:** Example to tie a SID music player to the VIC-II raster interrupt by installing an IRQ vector at $0314/$0315 and programming VIC-II registers ($D012/$D011 raster compare, $D01A IRQ enable, $D019 IRQ acknowledge). Typical play rate: once per frame (50 Hz PAL / 60 Hz NTSC). Use specific rasterlines or CIA timers for higher resolution.

## Raster-synchronized playback
Tie the music player to the VIC-II raster interrupt so playback timing is locked to the video frame. Procedure shown:

- Disable interrupts (SEI), install IRQ vector low/high at $0314/$0315 to point to your IRQ handler.
- Set the raster compare low byte in $D012 and clear the MSB (bit 8) in $D011 as required (VIC-II stores the 9th bit in $D011 bit 7).
- Enable VIC-II raster interrupts by writing the raster-enable bit to $D01A.
- Re-enable interrupts (CLI). From then on the IRQ handler will run once per chosen raster (commonly once-per-frame).
- The IRQ handler must acknowledge the raster IRQ by writing $01 to $D019, call the music play routine (JSR play), and then chain/jump to the standard KERNAL IRQ handler at $EA31 so normal OS IRQ handling continues.

Notes and behavior specifics:
- Writing #$01 to $D019 clears the raster IRQ flag (acknowledge).
- $D011 bit 7 holds the high bit of the raster compare; clear or set it to select rasterlines >=256.
- Typical playback triggered once per frame: 50 Hz (PAL) or 60 Hz (NTSC).
- For higher temporal resolution than one frame, program a specific rasterline (set $D012/$D011 accordingly) or use CIA timers ($DC00/$DD00) which offer finer timing control.

## Source Code
```asm
; Setup raster IRQ
sei
    lda #<irq_handler
    sta $0314
    lda #>irq_handler
    sta $0315
    lda #$00
    sta $D012         ; Rasterline low byte = 0
    lda $D011
    and #$7F
    sta $D011         ; Clear bit 8 (MSB) of rasterline
    lda #$01
    sta $D01A         ; Enable raster IRQ
    cli
    rts

irq_handler:
    ; Acknowledge IRQ
    lda #$01
    sta $D019

    ; Call music player
    jsr play

    ; Return from IRQ (chain to KERNAL IRQ handler)
    jmp $EA31
```

## Key Registers
- $0314-$0315 - CPU - IRQ vector low/high (install handler address)
- $D000-$D02E - VIC-II - VIC-II registers (raster compare: $D012 low, $D011 MSB/control; interrupt enable: $D01A; interrupt flags/ack: $D019)
- $DC00-$DC0F - CIA 1 - alternative timers for higher-resolution timing
- $DD00-$DD0F - CIA 2 - alternative timers for higher-resolution timing

## References
- "music_engine_structure" — structure/details of the play routine called from IRQ
- "pwm_technique" — synchronizing PWM updates to raster (higher-resolution timing techniques)