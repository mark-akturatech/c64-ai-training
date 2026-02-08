# Example: Memory Address Symbol Definitions
#
# Defines symbolic constants for SID music init routine ($1000), play routine
# ($1006), and data load address ($1000). Centralizes memory location
# references for clean code organization.
#
# Key Registers:
#   $1000 - SID init/data address
#   $1006 - SID play routine address
#
# Techniques: symbolic constant definition
# Hardware: SID
# Project: dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text
#

address_music = $1000 ; loading address for sid tune
sid_init = $1000      ; init routine for music
sid_play = $1006      ; play music routine