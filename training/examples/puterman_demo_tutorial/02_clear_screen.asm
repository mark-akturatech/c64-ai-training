# Example: Screen Clear to Black
#
# Fills the entire screen with space characters and sets colors to black.
# Uses VIC-II registers $D020 and $D021 for border/background, then fills
# screen RAM ($0400-$07FF) with spaces ($20) using an indexed loop that
# wraps at 256 iterations per page.
#
# Key Registers:
#   $D020 - VIC-II border color - set to black ($00)
#   $D021 - VIC-II background color - set to black ($00)
#   $0400-$07FF - Screen RAM - filled with space characters
#
# Techniques: indexed addressing, page-filling loop, counter wrap-around
# Hardware: VIC-II
#

; ============================================================================
; Screen Clearing Routine
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Indexed addressing, filling screen RAM
; Sets border and background to black, then fills all 4 pages of
; screen RAM ($0400-$07FF) with the space character ($20).
; Uses X register as a counter that wraps from $00 through $FF.
; ============================================================================

           * = $1000

           lda #$00        ; load 0 into accumulator
           sta $d020       ; set border color to black
           sta $d021       ; set background color to black
           tax             ; X = 0 (will count $00..$FF = 256 iterations)
           lda #$20        ; space character screen code
clrloop:   sta $0400,x     ; fill screen RAM page 1
           sta $0500,x     ; fill screen RAM page 2
           sta $0600,x     ; fill screen RAM page 3
           sta $0700,x     ; fill screen RAM page 4
           dex             ; decrement counter
           bne clrloop     ; loop until X wraps to 0
