# Example: Sprite Demo Symbol Definitions
#
# Defines symbolic constants for Screen RAM ($0400), SID init/play addresses
# ($11ED/$1004), animation delay counter ($90), and CIA port addresses
# ($DC00-$DC03) for keyboard scanning.
#
# Key Registers:
#   $DC00-$DC03 - CIA port and DDR addresses
#
# Techniques: symbolic constant definition
# Hardware: CIA
# Project: dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening
#

;===============================================================
; setting up some general symbols we use in our code
;================================================================

;============================================================
; symbols
;============================================================

screen_ram      = $0400     ; location of screen ram
init_sid        = $11ed     ; init routine for music
play_sid        = $1004     ; play music routine
delay_counter   = $90       ; used to time color switch in the border
pra             = $dc00     ; CIA#1 (Port Register A)
prb             = $dc01     ; CIA#1 (Port Register B)
ddra            = $dc02     ; CIA#1 (Data Direction Register A)
ddrb            = $dc03     ; CIA#1 (Data Direction Register B)