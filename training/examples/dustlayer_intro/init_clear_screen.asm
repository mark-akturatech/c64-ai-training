# Example: Screen Clear Initialization
#
# Clears all 1024 bytes of screen RAM ($0400-$07E7) with space characters
# ($20) and sets Color RAM ($D800-$DBE7) to black ($00) across four memory
# pages. Border and background colors are set to black via VIC-II registers
# $D020 and $D021.
#
# Key Registers:
#   $D020 - VIC-II border color - set to black
#   $D021 - VIC-II background color - set to black
#   $0400-$07E7 - VIC-II Screen RAM - filled with spaces
#   $D800-$DBE7 - VIC-II Color RAM - set to black
#
# Techniques: loop-based screen fill, page-aligned memory clear
# Hardware: VIC-II
# Project: dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text
#

;============================================================
; clear screen
; a loop instead of kernal routine to save cycles
;============================================================

init_screen      ldx #$00     ; set X to zero (black color code)
                 stx $d021    ; set background color
                 stx $d020    ; set border color

clear            lda #$20     ; #$20 is the spacebar Screen Code
                 sta $0400,x  ; fill four areas with 256 spacebar characters
                 sta $0500,x 
                 sta $0600,x 
                 sta $06e8,x 
                 lda #$00     ; set foreground to black in Color Ram 
                 sta $d800,x  
                 sta $d900,x
                 sta $da00,x
                 sta $dae8,x
                 inx           ; increment X
                 bne clear     ; did X turn to zero yet?
                               ; if not, continue with the loop
                 rts           ; return from this subroutine