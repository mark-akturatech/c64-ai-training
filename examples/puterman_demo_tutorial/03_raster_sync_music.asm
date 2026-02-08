# Example: Raster-Synced Music Playback
#
# Demonstrates frame-synchronized music playback by polling $D012 raster
# line register until the beam reaches line $80 (middle of screen), then
# calling a music play routine exactly once per frame. Border color $D020
# is toggled to visualize CPU cycles consumed by the music player.
#
# Key Registers:
#   $D012 - VIC-II raster line counter - polled until equals $80
#   $D020 - VIC-II border color - toggled to show music player timing
#
# Techniques: raster polling, frame synchronization, CPU load visualization
# Hardware: VIC-II, SID
#

; ============================================================================
; Raster-Synchronized Music Player
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Raster line polling ($D012), SID music playback timing
; Waits for the raster beam to reach line $80 (middle of screen),
; then calls the music play routine exactly once per frame.
; The border color change shows how many cycles the music player uses.
; ============================================================================

           * = $0801

           lda #$00
           tax
           tay
           jsr $1000       ; initialize music (A=0 selects tune 0)

mainloop:  lda $d012       ; read current raster line
           cmp #$80        ; has beam reached line 128?
           bne mainloop    ; no - keep polling

           inc $d020       ; border color shows music player timing
           jsr $1003       ; call music play routine (once per frame)
           dec $d020       ; restore border color
           jmp mainloop    ; loop forever
