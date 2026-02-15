# Example: Color Wash Gradient Tables
#
# Stores two pre-calculated 40-byte color gradient tables for the color wash
# effect. Colors curve from 9,2,8,10,15,7,1 and mirror back symmetrically.
# These tables are rotated each frame by the color wash subroutine to create
# scrolling gradient animation across screen rows.
#
# Key Registers:
#   $D990/$D9E0 - VIC-II Color RAM rows - receive rotated gradient colors each frame
#
# Techniques: pre-computed lookup tables, color gradient mirroring
# Hardware: VIC-II
# Project: dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text
#

; color data table
; first 9 rows (40 bytes) are used for the color washer
; on start the gradient is done by byte 40 is mirroed in byte 1, byte 39 in byte 2 etc...

color        !byte $09,$09,$02,$02,$08 
             !byte $08,$0a,$0a,$0f,$0f 
             !byte $07,$07,$01,$01,$01 
             !byte $01,$01,$01,$01,$01 
             !byte $01,$01,$01,$01,$01 
             !byte $01,$01,$01,$07,$07 
             !byte $0f,$0f,$0a,$0a,$08 
             !byte $08,$02,$02,$09,$09 

color2       !byte $09,$09,$02,$02,$08 
             !byte $08,$0a,$0a,$0f,$0f 
             !byte $07,$07,$01,$01,$01 
             !byte $01,$01,$01,$01,$01 
             !byte $01,$01,$01,$01,$01 
             !byte $01,$01,$01,$07,$07 
             !byte $0f,$0f,$0a,$0a,$08 
             !byte $08,$02,$02,$09,$09 
