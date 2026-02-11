# Moving Sprite 0 — raster-poll example (VIC-II, $D012, $D015, $D027, $D000/$D001, $07F8)

**Summary:** Example assembly that enables and colors sprite 0 via VIC-II registers ($D015, $D027), sets sprite 0 coordinates ($D000/$D001), and sets the sprite pointer at $07F8 to $80 (sprite data at $2000). Main loop polls the raster register $D012 for line $FF to synchronize updates; demonstrates jerky movement caused by not disabling interrupts (timer/CIA).

## Description
This program initializes sprite 0 and moves it by updating its X/Y coordinates each frame. Key operations:
- Enable sprite 0 by setting its enable bit through $D015 (VIC-II sprite enable register).
- Set sprite 0 color using $D027 (sprite 0 color register).
- Place the sprite pointer at memory $07F8 with value $80. The VIC-II sprite pointer value is an index into 64-byte blocks; pointer * $40 (64) = actual sprite data address, so $80 * $40 = $2000.
- Set sprite 0 X and Y via $D000/$D001.
- Main loop polls the raster register $D012 and waits until it reads $FF (raster line $FF) before updating coordinates and direction logic to move the sprite.
- The program demonstrates a common timing problem: if interrupts (e.g., kernel/CIA timer interrupts) are enabled, the CPU may service an interrupt handler while the raster passes $FF and miss the exact raster line read. That causes a missed frame (no update) and results in jerky movement. Disabling interrupts or using the raster interrupt properly is necessary for smooth per-frame updates.

Minimal data layout:
- coord: current X and Y (single byte used for both X and Y here)
- dir: direction flag (0 or 1)

## Source Code
```asm
* = $0801

        lda #$01
        sta $d015    ; Turn sprite 0 on
        sta $d027    ; Make it white
        lda #$40
        sta $d000    ; set x coordinate to 40
        sta $d001    ; set y coordinate to 40
        lda #$80
        sta $07f8    ; set pointer: sprite data at $2000

mainloop
        lda $d012
        cmp #$ff     ; raster beam at line $ff?
        bne mainloop ; no: go to mainloop

        lda dir      ; in which direction are we moving?
        beq down     ; if 0, down

                        ; moving up
        ldx coord    ; get coord
        dex          ; decrement it
        stx coord    ; store it
        stx $d000    ; set sprite coords
        stx $d001
        cpx #$40     ; if it's not equal to $40...
        bne mainloop ; just go back to the mainloop

        lda #$00     ; otherwise, change direction
        sta dir
        jmp mainloop

down
        ldx coord    ; this should be familiar
        inx
        stx coord
        stx $d000
        stx $d001
        cpx #$e0
        bne mainloop

        lda #$01
        sta dir
        jmp mainloop

coord
        .byte $40   ; current x and y coordinate
dir
        .byte 0     ; direction: 0 = down-right, 1 = up-left
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (used here: $D000/$D001 sprite 0 X/Y; $D012 raster register; $D015 sprite enable; $D027 sprite 0 color)
- $07F8-$07FF - RAM (sprite pointer table) - sprite pointers (value * $40 = sprite data address in RAM)

## References
- "d012_raster_register" — polling $D012 for frame sync and raster details
- "interrupts_overview" — how timer/CIA interrupts can cause missed frames and jerky movement