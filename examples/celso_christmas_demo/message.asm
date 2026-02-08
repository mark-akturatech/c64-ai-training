# Example: Scrolling Message Data
#
# Defines scrolling message text string with metadata for horizontal scroll
# display. Stores message as ASCII text, message length, horizontal raster
# offset (starting at 7 for pixel-level scroll), and current message offset for
# tracking scroll position. Values are updated dynamically by the main demo's
# interrupt routines.
#
# Key Registers:
#   $D016 bits 0-2 - VIC-II horizontal scroll offset (updated by main program)
#
# Techniques: text data storage, scroll offset tracking
# Hardware: VIC-II
# Project: celso_christmas_demo - Christmas demo with falling snow sprites, dual bitmap screens, scrolling text, and SID music
#

.const msg = "this c64 demo uses vic-ii graphics, sprites, raster interrupts, a random generator and sid music - more at https://github.com/brpx/c64 "
msg_text:.text msg
msg_length: .byte msg.size()
raster_h_offset: .byte 7
msg_offset: .byte 0

