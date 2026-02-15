# Example: SID Music Playback Wrapper
#
# Simple wrapper subroutine that calls the SID music play routine at $1006.
# Called once per frame from the raster IRQ handler to maintain consistent
# playback timing.
#
# Key Registers:
#   $1006 - SID play routine (JSR target)
#
# Techniques: subroutine delegation, frame-synchronized playback
# Hardware: SID
# Project: dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text
#

;============================================================
; play music directive
;============================================================

play_music jsr sid_play
		   rts