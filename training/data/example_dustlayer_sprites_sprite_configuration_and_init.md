# Example: Sprite Configuration and Init

**Project:** dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening

## Summary
Configures VIC-II sprite 0 with multicolor mode, color palette, priority, and initial position. Sets sprite enable ($D015), multicolor mode ($D01C), priority ($D01B), multicolor palette colors ($D025/$D026), individual color ($D027), and positions sprite at X=$A0 Y=$FF with 9th X-bit enabled via $D010.

## Key Registers
- $D015 - VIC-II sprite enable - enables sprite 0
- $D01C - VIC-II sprite multicolor - enables multicolor for sprite 0
- $D01B - VIC-II sprite priority - sprite over background
- $D025/$D026 - VIC-II sprite multicolors - palette colors
- $D027 - VIC-II sprite 0 color
- $D010 - VIC-II sprite X MSB - 9th X coordinate bit
- $D000/$D001 - VIC-II sprite 0 position
- $07F8 - Sprite 0 data pointer

## Techniques
- sprite mode configuration
- multicolor setup
- pointer calculation

## Hardware
VIC-II

## Source Code
```asm
;============================================================
; configuration of the sprite used in the intro
;============================================================


; two locations will be used to at the one hand store the 
; current shown frame of the sprite animation and on the other
; hand to keep track of delay to slow down animation

sprite_ship_current_frame	= $fb
delay_animation_pointer     = $fc

; the toal number of frames (shapes) which make up the animation 
sprite_frames_ship		= 16

; the sprite pointer for Sprite#0
sprite_pointer_ship		= address_sprites / $40

; those are the shared sprite colors
; we could have parsed that information from the sprites.spr file
; but for this simple single-sprite demo we can just write it down
; manually
sprite_background_color = $00
sprite_multicolor_1  	= $0b
sprite_multicolor_2  	= $01

; individual sprite color for Sprite#0. This is also stored in Byte 64
; of each Sprite (low nibble) when we use SpritePad. We did not bother
; to parse this information in this case either.
sprite_ship_color		= $02

;============================================================
; Initialize Memory Locations not related to VIC-II registers
;============================================================

; initialize counters with frame numbers
lda #sprite_frames_ship
sta sprite_ship_current_frame


; store the pointer in the sprite pointer register for Sprite#0
; Sprite Pointers are the last 8 bytes of Screen RAM, e.g. $07f8-$07ff
lda #sprite_pointer_ship
sta screen_ram + $3f8 		

;============================================================
; Initialize involved VIC-II registers
;============================================================

lda #$01     ; enable Sprite#0
sta $d015 

lda #$01     ; set multicolor mode for Sprite#0
sta $d01c

lda #$00     ; Sprite#0 has priority over background
sta $d01b

lda #sprite_background_color ; shared background color
sta $d021

lda #sprite_multicolor_1 	 ; shared multicolor 1
sta $d025

lda #sprite_multicolor_2 	 ; shared multicolor 2
sta $d026

lda #sprite_ship_color 	 	 ; individual Sprite#0 color
sta $d027

lda #$01     ; set X-Coord high bit (9th Bit) for Sprite#0
sta $d010

lda #$a0 	; set Sprite#0 positions with X/Y coords to
sta $d000   ; lower right of the screen
lda #$ff    ; $d000 corresponds to X-Coord (0-504 incl 9th Bit on PAL systems)
sta $d001   ; $d001 corresponds to Y-Coord (0-255 on PAL systems)
```
