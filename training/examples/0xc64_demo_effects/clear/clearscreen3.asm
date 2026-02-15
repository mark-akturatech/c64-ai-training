# Example: Screen Clear with Unrolled Loop
#
# Fast manual screen clear writing four pages per loop iteration to screen RAM at $0400. Uses X
# register as counter with four offset write addresses per cycle, filling screen with spaces.
# Demonstrates unrolled loop optimization for speed.
#
# Key Registers:
#   $0400-$07E7 - Screen RAM - filled with spaces across four page offsets
#
# Techniques: unrolled loops, direct RAM writes, page-aligned memory fill
# Hardware: VIC-II
#

; Program: Screen clear example v3
; Author: andrew burch
; Assembler: win2c64
; Notes: Write 4 bytes per loop to clear
;		screen quickly
;

        .org $c000      ; begin (49152)

        lda #$20        ; space character
        ldx #00
loop    sta $0400, x    ; write 4 bytes per loop
        sta $04fa, x
        sta $05f4, x
        sta $06ee, x
        inx
        cpx #$fa
        bne loop
        rts             ; return to BASIC