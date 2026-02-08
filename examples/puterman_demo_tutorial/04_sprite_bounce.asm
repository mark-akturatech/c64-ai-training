# Example: Sprite Diagonal Bounce
#
# Displays and animates sprite 0 bouncing diagonally between Y coordinates
# $40 and $E0. Sprite is enabled via $D015, colored white via $D027, and
# data pointed to $2000 via pointer at $07F8. Position registers $D000/$D001
# are updated each frame with raster polling at line $FF for synchronization.
# Direction state is stored in zero-page RAM.
#
# Key Registers:
#   $D015 - VIC-II sprite enable - bit 0 enables sprite 0
#   $D027 - VIC-II sprite 0 color - set to white (1)
#   $D000/$D001 - VIC-II sprite 0 X/Y position - updated each frame
#   $07F8 - Sprite 0 data pointer - set to $80 (data at $2000)
#   $D012 - VIC-II raster counter - polled at line $FF for sync
#
# Techniques: sprite positioning, directional animation, raster frame sync, state variables
# Hardware: VIC-II
#

; ============================================================================
; Sprite Bounce - Basic Sprite Animation
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Sprite enable, positioning, color, pointer, animation
; Enables sprite 0, sets it to white, positions it at (64,64),
; points sprite data to $2000 (pointer value $80 = $2000/64).
; Bounces the sprite diagonally between Y=$40 and Y=$E0.
; Uses raster polling at line $FF for frame sync.
; ============================================================================

           * = $0801

           lda #$01
           sta $d015       ; enable sprite 0 (bit 0)
           sta $d027       ; sprite 0 color = white (1)
           lda #$40
           sta $d000       ; sprite 0 X position = 64
           sta $d001       ; sprite 0 Y position = 64
           lda #$80
           sta $07f8       ; sprite 0 data pointer ($80 * 64 = $2000)

mainloop:
           lda $d012
           cmp #$ff        ; wait for raster line 255 (bottom of screen)
           bne mainloop

           lda dir         ; check movement direction
           beq down        ; if 0, move down/right

           ; --- moving up/left ---
           ldx coord
           dex             ; decrement position
           stx coord
           stx $d000       ; update sprite X
           stx $d001       ; update sprite Y
           cpx #$40        ; reached upper bound?
           bne mainloop    ; no - continue
           lda #$00        ; yes - reverse direction to down
           sta dir
           jmp mainloop

down:      ; --- moving down/right ---
           ldx coord
           inx             ; increment position
           stx coord
           stx $d000       ; update sprite X
           stx $d001       ; update sprite Y
           cpx #$e0        ; reached lower bound?
           bne mainloop    ; no - continue
           lda #$01        ; yes - reverse direction to up
           sta dir
           jmp mainloop

coord:     .byte $40       ; current coordinate (shared for X and Y)
dir:       .byte 0         ; direction flag: 0=down/right, 1=up/left
