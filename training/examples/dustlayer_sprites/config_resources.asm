# Example: Sprite Demo Resource Loading
#
# Loads three binary resources: 16 sprite animation frames (64 bytes each)
# at $2000, SID music at $1001, and custom character font at $3800. Each
# resource uses KickAssembler binary inclusion with appropriate header
# skipping.
#
# Key Registers:
#   $2000 - Sprite data location (16 frames)
#   $1001 - SID music data
#   $3800 - Custom character set
#
# Techniques: binary resource loading, header offset skipping
# Hardware: VIC-II, SID
# Project: dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening
#

; load external binaries

address_sprites = $2000	  ;loading address for ship sprite
address_chars = $3800     ; loading address for charset ($3800: last possible location for the 512bytes in Bank 3)
address_sid = $1001 	  ; loading address for sid tune

* = address_sprites                  
!bin "resources/sprites.spr",1024,3  	 ; skip first three bytes which is encoded Color Information
										 ; then load 16x64 Bytes from file
* = address_sid                         
!bin "resources/empty_1000.sid",, $7c+2  ; remove header from sid and cut off original loading address 

* = address_chars                     
!bin "resources/rambo_font.ctm",384,24   ; skip first 24 bytes which is CharPad format information 

