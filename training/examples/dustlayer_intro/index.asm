# Example: Intro Demo Build Index
#
# Main project file defining CPU type (6510), output filename, and BASIC SYS
# loader at $0801 with code assembly starting at $C000. Organizes and includes
# all sub-modules (main loop, setup, data tables, init routines, subroutines,
# and resources) in proper assembly order.
#
# Key Registers:
#   No runtime registers (build configuration only)
#
# Techniques: modular project organization, BASIC SYS loader
# Hardware: MOS 6510
# Project: dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text
#

;============================================================
; Example Project for C64 Tutorials
; Code by actraiser/Dustlayer
; Music: Ikari Intro by Laxity
;
; Simple Colorwash effect with a SID playing
;
; Tutorial: http://dustlayer.com/c64-coding-tutorials/2013/2/17/a-simple-c64-intro
; Dustlayer WHQ: http://dustlayer.com
;============================================================

;============================================================
; index file which loads all source code and resource files
;============================================================

;============================================================
;    specify output file
;============================================================

!cpu 6502
!to "build/hello_world.prg",cbm    ; output file

;============================================================
; BASIC loader with start address $c000
;============================================================

* = $0801                               ; BASIC start address (#2049)
!byte $0d,$08,$dc,$07,$9e,$20,$34,$39   ; BASIC loader to start at $c000...
!byte $31,$35,$32,$00,$00,$00           ; puts BASIC line 2012 SYS 49152
* = $c000     				            ; start address for 6502 code

;============================================================
;  Main routine with IRQ setup and custom IRQ routine
;============================================================

!source "code/main.asm"

;============================================================
;    setup and init symbols we use in the code
;============================================================

!source "code/setup_symbols.asm"

;============================================================
; tables and strings of data 
;============================================================

!source "code/data_static_text.asm"
!source "code/data_colorwash.asm"

;============================================================
; one-time initialization routines
;============================================================

!source "code/init_clear_screen.asm"
!source "code/init_static_text.asm"

;============================================================
;    subroutines called during custom IRQ
;============================================================

!source "code/sub_colorwash.asm"
!source "code/sub_music.asm"

;============================================================
; load resource files (for this small intro its just the sid)
;============================================================

!source "code/load_resources.asm"