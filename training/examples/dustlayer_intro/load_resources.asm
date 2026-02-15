# Example: SID Music Resource Loading
#
# Loads external SID music file into memory starting at $1000 using
# KickAssembler binary inclusion directive. Skips the SID file header
# (7C+2 bytes) containing metadata and load address information to extract
# raw music data.
#
# Key Registers:
#   $1000 - SID music data location
#
# Techniques: binary resource inclusion, header skipping
# Hardware: SID
# Project: dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text
#

; load sid music

* = address_music                         ; address to load the music data
!bin "resources/jeff_donald.sid",, $7c+2  ; remove header from sid and cut off original loading address 
