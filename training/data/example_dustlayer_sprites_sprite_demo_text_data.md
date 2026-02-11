# Example: Sprite Demo Text Data

**Project:** dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening

## Summary
Contains three 40-character text lines in screen code format: title with heart symbols (']' mapped to heart via custom charset), author attribution, and keyboard control instructions.

## Techniques
- screen code encoding
- custom character mapping

## Hardware
VIC-II

## Source Code
```asm
;============================================================
; Three Lines of Text - our custom character set translates
; the ']' char to a heart symbol in the actual intro
;============================================================

line1    !scr "     ]]] dustlayer.com presents ]]]          "
line2    !scr " ]]] spritro tutorial by actraiser ]]]       " 
line3    !scr "    press u and d to control sprite!         "
```
