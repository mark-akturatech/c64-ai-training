# Example: Real-Time Character Set Animation
#
# Creates animated patterns by redirecting VIC-II to a custom charset at
# $2000 via $D018, filling the screen with character code 0, then inverting
# (EOR #$FF) individual charset bytes each frame in a 40-byte rotating cycle.
# The character data modification is instantly visible on screen since all
# characters reference the same charset data. This technique is foundational
# for DYCP effects.
#
# Key Registers:
#   $D018 - VIC-II memory pointer - set to $18 for charset at $2000
#   $D020/$D021 - VIC-II border/background - set to black
#   $D012 - VIC-II raster counter - polled at $FF for frame sync
#   $2000 - Custom charset data - bytes inverted each frame
#
# Techniques: custom charset redirection, real-time charset modification, bit inversion animation, raster sync
# Hardware: VIC-II
#

; ============================================================================
; Real-Time Character Set Animation
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Custom character sets, real-time charset modification
; Points the VIC-II to a custom charset at $2000 via $D018.
; Fills the screen with character code 0 and clears the charset data.
; Each frame, inverts one byte of the charset data (EOR #$FF),
; cycling through 40 bytes ($28) to create an animated pattern.
; This is the basis for DYCP (Different Y Character Position) effects.
; ============================================================================

           * = $0801

           lda #$00
           sta $d020       ; border = black
           sta $d021       ; background = black
           tax             ; X = 0

clrscreen:
           sta $0400,x     ; fill screen with character code 0
           sta $0500,x
           sta $0600,x
           sta $0700,x
           sta $2000,x     ; clear charset data at $2000
           dex
           bne clrscreen

           lda #$18        ; $D018: screen at $0400, chars at $2000
           sta $d018       ; bits 4-7=0001 (screen $0400), bits 1-3=100 ($2000)

mainloop:
           lda $d012
           cmp #$ff        ; wait for raster line $FF
           bne mainloop

           ldx counter     ; get current byte offset
           inx
           cpx #$28        ; wrapped past 40 bytes?
           bne juststx
           ldx #$00        ; reset to 0
juststx:
           stx counter

           lda $2000,x     ; read charset byte
           eor #$ff        ; invert all bits
           sta $2000,x     ; write back - instantly visible on screen

           jmp mainloop

counter:   .byte 8         ; starting offset into charset data
