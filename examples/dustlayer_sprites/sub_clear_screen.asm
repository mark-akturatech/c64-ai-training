# Example: Sprite Demo Screen Clear
#
# Fills screen RAM with spaces ($20) and Color RAM with dark grey ($0C)
# across four 256-byte pages. Sets border and background to black via VIC-II
# registers.
#
# Key Registers:
#   $D020 - VIC-II border color - black
#   $D021 - VIC-II background color - black
#   $0400-$07E7 - VIC-II Screen RAM - filled with spaces
#   $D800-$DBE7 - VIC-II Color RAM - set to dark grey
#
# Techniques: loop-based fill, page-aligned memory clear
# Hardware: VIC-II
# Project: dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening
#

;============================================================
; clear screen and turn black
;============================================================

clear_screen     ldx #$00     ; start of loop
                 stx $d020    ; write to border color register
                 stx $d021    ; write to screen color register
clear_loop       lda #$20     ; #$20 is the spacebar screencode
                 sta $0400,x  ; fill four areas with 256 spacebar characters
                 sta $0500,x 
                 sta $0600,x 
                 sta $06e8,x 
                 lda #$0c     ; puts into the associated color ram dark grey ($0c)...
                 sta $d800,x  ; and this will become color of the scroll text
                 sta $d900,x
                 sta $da00,x
                 sta $dae8,x
                 inx         
                 bne clear_loop   
                 rts